import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { QuoteEntity, QuoteEntityProps } from '@domain/quote/QuoteEntity'
import { QuoteFactory } from '@domain/quote/QuoteFactory'
import type QuoteRepository from '@domain/quote/QuoteRepository'
import AbstractQuoteService from '@domain/quote/QuoteService'
import { UUID } from '@domain/shared/UUID'
import type OfferRepository from '@domain/offer/OfferRepository'
import type ProductRepository from '@domain/product/ProductRepository'
import { OfferEntity } from '@domain/offer/OfferEntity'
import { OfferFactory } from '@domain/offer/OfferFactory'
import { UnexpectedError } from '@domain/error'
import { DateTimeValue } from '@domain/shared/DateTime'
import { type UberService } from '../application/service/UberService'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { UserId } from '@domain/user/models/UserId'
import { type ScoringService } from '@/application/service/ScoringService'
import type UserRepository from '@domain/user/UserRepository'
import { AccountType } from '@domain/user/models/AccountType'
import { AccountProvider } from '@domain/user/models/AccountProvider'
import { UserEntity } from '@domain/user/models/UserEntity'
import { StringValue } from '@domain/shared/StringValue'
import { JsonValue } from '@domain/shared/JsonValue'
import type ApplicationChecklistRepository from '@domain/applicationChecklist/ApplicationChecklistRepository'
import { ProspectService } from './ProspectService'
import { ProspectActivityTypeId } from '@domain/prospect/models/ProspectActivityTypeId'
import { PersonRegisService } from './PersonRegisService'
import { type NotificationService } from '@/application/service/NotificationService'
import { NotificationChannel } from '@domain/shared/NotificationChannel'
import { ProductService } from './ProductService'
import { ScoringResolution } from '@domain/scoring/models/ScoringResolution'

@injectable()
export class QuoteService implements AbstractQuoteService {
  @inject(DI.QuoteRepository) private readonly _quoteRepository!: QuoteRepository
  @inject(DI.OfferRepository) private readonly _offerRepository!: OfferRepository
  @inject(DI.UberService) private readonly _uberService!: UberService
  @inject(DI.ScoringService) private readonly _scoringService!: ScoringService
  @inject(DI.UserRepository) private readonly _userRepository!: UserRepository
  @inject(DI.ApplicationChecklistRepository)
  private readonly _applicationChecklistRepository!: ApplicationChecklistRepository
  @inject(DI.ProspectService) private readonly _prospectService!: ProspectService
  @inject(DI.PersonRegisService) private readonly _smartItRegisterPersonService!: PersonRegisService
  @inject(DI.NotificationService) private _notificationService!: NotificationService
  @inject(DI.ProductService) private readonly _productService!: ProductService

  async getActive(): Promise<QuoteEntity[]> {
    const quotes = await this._quoteRepository.getAll(true)

    return quotes.filter((q) => q.isActive())
  }

  async getByUser(userId: UserId): Promise<QuoteEntity[]> {
    return this._quoteRepository.getByUser(userId)
  }

  async create(props: DTO<Partial<QuoteEntityProps>>): Promise<QuoteEntity> {
    const userId = new UserId(props.userId)

    const prospect = await this._prospectService.getOrCreate({
      userId,
    })

    const prepareQuote = QuoteFactory.create({
      userId,
      scoringComplete: new BooleanValue(false),
      scoringError: new BooleanValue(false),
      expiresAt: this._calcQuoteExpiration(),
      hasAttachedApplication: new BooleanValue(false),
      prospectId: prospect.getId(),
      friendlyId: new StringValue(this._generateFriendlyId()),
    })

    const quote = await this._quoteRepository.create(prepareQuote)

    const uberAccount = await this._userRepository.getAccount(
      new UserId(props.userId),
      AccountType.OAUTH,
      AccountProvider.UBER,
    )
    if (!uberAccount) {
      throw new UnexpectedError('No Uber Account found for this user')
    }

    let uberAccountAccessToken = uberAccount.getAccessToken()

    const refreshToken = uberAccount.getRefreshToken()
    if (!refreshToken) {
      throw new UnexpectedError('No refresh token for this User Uber Account')
    }

    // TODO move this from here
    const tokenRefresh = await this._uberService.refreshAccessToken(refreshToken.toDTO())
    if (tokenRefresh) {
      await this._userRepository.updateAccountTokens(
        new UserId(props.userId),
        AccountType.OAUTH,
        AccountProvider.UBER,
        tokenRefresh,
      )

      uberAccountAccessToken = tokenRefresh.accessToken
    }
    if (!uberAccountAccessToken) {
      throw new UnexpectedError('No Uber access token could be fetched or renewed for the User')
    }

    const products = await this._productService.getAvailableProducts()
    const productsPayload = products.map((p) => ({
      ref: p.getId().toDTO(),
      weeklyFare: p.getDefaultWeeklyPrice()?.toDTO() || 0,
    }))

    const { results, engineVersion, errors, raw } = await this._scoringService.scoreOnboard(
      uberAccountAccessToken.toDTO(),
      {
        products: productsPayload,
      },
    )

    quote.setEngine(engineVersion)
    quote.setScoringComplete(new BooleanValue(true), raw)

    if (errors && errors.length > 0) {
      console.error('Scoring Errors', errors)
      quote.setScoringError(true, errors.map((e) => e.error.toDTO()).join('; '))

      const updatedQuote = await this._quoteRepository.save(quote)
      if (!updatedQuote) {
        throw new UnexpectedError('Quote with errors')
      }

      console.log('updated quote with errors', updatedQuote)
      return updatedQuote
    }

    const defaultChecklist = await this._applicationChecklistRepository.getDefaultChecklist()
    const defaultChecklistIds = defaultChecklist.map((dc) => dc.getId())

    const offers = results.reduce((acc, result) => {
      const referredProduct = products.find((p) => p.getId().sameValueAs(result.ref.toDTO()))

      if (!referredProduct || !referredProduct.isActive()) {
        return acc
      }

      const offer = OfferFactory.create({
        productId: referredProduct.getId(),
        quoteId: quote.getId(),
        userId: quote.getUserId(),
        leasingPeriod: referredProduct.getDefaultLeasingPeriod(),
        weeklyPrice: referredProduct.getDefaultWeeklyPrice(),
        expiresAt: quote.getExpiresAt(),
        hasAttachedApplication: new BooleanValue(false),
      })

      offer.setScoringVerdict(result.verdict)
      offer.setScoringBrief(result.brief)
      offer.setScoringAnalysis(result.analysis)
      offer.setScoringDetails(result.details)
      offer.setScoringResolution(result.resolution)
      offer.setScoringMark(result.mark)

      const uniqueChecklist = result.checkList.reduce((acc, it) => {
        if (acc.some((f) => it.sameValueAs(f))) {
          return acc
        }
        return [...acc, it]
      }, defaultChecklistIds)

      offer.setRequestedChecklist(uniqueChecklist)

      return [...acc, offer]
    }, [] as OfferEntity[])

    await Promise.all(offers.map(async (offer) => this._offerRepository.create(offer)))

    const updatedQuote = await this._quoteRepository.save(quote)
    if (!updatedQuote) {
      throw new UnexpectedError('Quote should be created but no')
    }

    if (raw) {
      await this._updateUserWithQuoteData(new UserId(props.userId), raw)
    }

    await this._prospectService.logActivity({
      userId,
      prospectId: prospect.getId(),
      prospectActivityTypeId: ProspectActivityTypeId.QUOTE_CREATED,
    })

    const user = await this._userRepository.getById(userId)

    await this._notificationService.sendToUser(userId, {
      channel: [NotificationChannel.EMAIL],
      title: new StringValue('🚘 Le damos la bienvenida a Autofin Rent!'),
      content: new StringValue('Sigue los pasos que te indicaremos en www.autofinrent.com'),
    })

    try {
      await this._smartItRegisterPersonService.RegisPerson(
        user.getFirstName()?.toDTO() ?? '',
        user.getLastName()?.toDTO() ?? '',
        '',
        user.getPhoneNumber()?.toDTO() ?? '',
        user.getId().toDTO(),
        user.getEmail()?.toDTO() ?? '',
      )
    } catch (error) {
      console.error('Error al registrar la persona en SmartIT')
    } finally {
      return updatedQuote
    }
  }

  async getById(quoteId: UUID): Promise<QuoteEntity | null> {
    return this._quoteRepository.getById(quoteId)
  }

  async getActiveForUser(props: DTO<Partial<QuoteEntityProps>>): Promise<QuoteEntity> {
    const userQuotes = await this._quoteRepository.getByUser(new UserId(props.userId))

    return this._getActiveQuote(userQuotes) || this.create(props)
  }

  private _calcQuoteExpiration(): DateTimeValue {
    const today = new Date()
    // const expiration = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const expiration = new Date(today.getTime()) // Set quote expiration to 0 so everytime quote is requested, a new quote will be generated

    return new DateTimeValue(expiration)
  }

  private _getActiveQuote(quotes: QuoteEntity[]): QuoteEntity | undefined {
    quotes.sort((a: QuoteEntity, b: QuoteEntity) => (a.getCreatedAt().dayjs.isBefore(b.getCreatedAt()?.dayjs) ? 0 : 1))

    return quotes.find((quote) => quote.isActive())
  }

  private async _updateUserWithQuoteData(userId: UserId, raw: JsonValue): Promise<UserEntity> {
    const user = await this._userRepository.getById(userId)

    const json = raw.getJson()

    if (json?.driverInfo?.date_of_birth) {
      user.setDob(json.driverInfo.date_of_birth as string)
    }

    if (json?.driverInfo?.city_identifier && json?.driverInfo?.city_name) {
      user.setUberCity(json.driverInfo.city_name as string, json.driverInfo.city_name as string)
    }

    if (json?.scoringResults[0]?.analysis?.partnerProStatus) {
      user.setUberTier(json.scoringResults[0].analysis.partnerProStatus as string)
    }

    if (json?.scoringResults[0]?.analysis?.tripsFromLastMonth) {
      user.setUberLastMonthTripCount(parseInt(json.scoringResults[0].analysis.tripsFromLastMonth.length))
    }

    if (json?.scoringResults[0]?.analysis?.fareLastMonth) {
      user.setUberLastMonthEarnings(parseFloat(json.scoringResults[0].analysis.fareLastMonth))
    }

    if (json?.scoringResults[0]?.analysis?.uberTenureMonths) {
      user.setUberTenureMonths(parseInt(json.scoringResults[0].analysis.uberTenureMonths))
    }

    const updatedUser = await this._userRepository.save(user)

    return updatedUser
  }

  private _generateFriendlyId(): string {
    const millis = Date.now().toString()
    const reduced = millis.slice(millis.length - 8)
    const rand = Math.floor(Math.random() * 100)
    return `COT-${reduced}${rand}`
  }
}
