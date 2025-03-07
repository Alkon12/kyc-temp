import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { LeasingEntity } from '@domain/leasing/LeasingEntity'
import AbstractLeasingService from '@domain/leasing/LeasingService'
import { UUID } from '@domain/shared/UUID'
import {
  LeasingAlarmsResponse,
  LeasingDailySummary,
  LeasingFinancialDebtVoucher,
  LeasingFinancialWeekSummary,
  LeasingSummary,
  LeasingWeeklySummary,
  QueryCurrentVehicleStatusArgs,
  QueryLeasingAlarmsArgs,
  QueryLeasingByIdArgs,
  QueryLeasingDailySummaryArgs,
  QueryLeasingFinancialDebtVoucherArgs,
  QueryLeasingFinancialWeeklySummaryArgs,
  QueryLeasingSummaryArgs,
  QueryLeasingWeeklySummaryArgs,
  QueryTrackerTripsArgs,
  QueryTripsByDateArgs,
  TrackerTrip,
  TrackerTripScore,
  VehicleStatusResponse,
  QueryLeasingPendingPaymentsArgs,
  LeasingPendingPayment,
  BankReferDeatil,
  LeasingAccountSummary,
  QueryLeasingAccountSummaryArgs,
  LeasingPendingBankReference,
  QueryLeasingPendingBankReferencesArgs,
  MutationCreateBankReferenceArgs,
  QueryWeeklyVehicleUsageArgs,
  VehicleUsage,
  QueryVehicleUsageSummaryArgs,
} from '../app.schema.gen'
import AbstractTripService from '@domain/trip/TripService'
import { TripEntity } from '@domain/trip/TripEntity'
import { DateTimeValue } from '@domain/shared/DateTime'
import { NotFoundError } from '@domain/error'
import { TrackerService } from '@/application/service/TrackerService'
import { AlarmService } from '@/application/service/AlarmService'
import { StringValue } from '@domain/shared/StringValue'
import { AnalyticsService } from '@/application/service/AnalyticsService'
import { NumberValue } from '@domain/shared/NumberValue'
import { FinancialService } from '@/application/service/FinancialService'
import { getMondayOfWeek } from '@/utils/date'

@injectable()
export class LeasingResolvers {
  build() {
    return {
      Query: {
        activeLeasings: this.activeLeasings,
        leasingById: this.leasingById,
        tripsByDate: this.tripsByDate,
        currentVehicleStatus: this.currentVehicleStatus,
        trackerTrips: this.trackerTrips,
        leasingAlarms: this.leasingAlarms,
        leasingDailySummary: this.leasingDailySummary,
        leasingWeeklySummary: this.leasingWeeklySummary,
        leasingFinancialWeeklySummary: this.leasingFinancialWeeklySummary,
        leasingFinancialDebtVoucher: this.leasingFinancialDebtVoucher,
        leasingPendingPayments: this.leasingPendingPayments,
        leasingSummary: this.leasingSummary,
        leasingAccountSummary: this.leasingAccountSummary,
        leasingPendingBankReferences: this.leasingPendingBankReferences,
        banksWithReferDeatils: this.banksWithReferDeatils,
        weeklyVehicleUsage: this.weeklyVehicleUsage,
        vehicleUsageSummary: this.vehicleUsageSummary,
      },
      Mutation: {
        createBankReference: this.createBankReference,
      },
    }
  }

  activeLeasings = async (_parent: unknown): Promise<DTO<LeasingEntity[]>> => {
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
    const leasings = await leasingService.getActive()

    return leasings.map((a) => a.toDTO())
  }

  leasingById = async (_parent: unknown, { leasingId }: QueryLeasingByIdArgs): Promise<DTO<LeasingEntity>> => {
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
    const leasing = await leasingService.getById(new UUID(leasingId))

    return leasing.toDTO()
  }

  tripsByDate = async (_parent: unknown, { leasingId, from, to }: QueryTripsByDateArgs): Promise<DTO<TripEntity[]>> => {
    const tripService = container.get<AbstractTripService>(DI.TripService)
    const trips = await tripService.getByDateRange(new UUID(leasingId), new DateTimeValue(from), new DateTimeValue(to))

    return trips.map((a) => a.toDTO())
  }

  currentVehicleStatus = async (
    _parent: unknown,
    { leasingId }: QueryCurrentVehicleStatusArgs,
  ): Promise<VehicleStatusResponse> => {
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
    const trackerService = container.get<TrackerService>(DI.TrackerService)

    const leasing = await leasingService.getById(new UUID(leasingId))

    const deviceId = leasing.getVehicle()?.getTrackerDeviceId()
    if (!deviceId) {
      console.error('Device not found')
      throw new NotFoundError('Device not found')
    }

    const device = await trackerService.currentVehicleStatus(deviceId)

    return {
      tracker: {
        currentOdometer: device.currentOdometer?.toDTO(),
        status: device.status?.toDTO(),
        motion: device.motion?.toDTO(),
        ignition: device.ignition?.toDTO(),
        speed: device.speed?.toDTO(),
        lastLat: device.lastLat?.toDTO(),
        lastLon: device.lastLon?.toDTO(),
        lastUpdate: device.lastUpdate?.toDTO(),
        lastConnection: device.lastConnection?.toDTO(),

        weeksSumDistance: device.weeksSumDistance?.toDTO(),
        drivingScore: device.drivingScore?.toDTO(),
        totalEvents: device.totalEvents?.toDTO(),
        totalTrips: device.totalTrips?.toDTO(),
        uberWeeksUsage: device.uberWeeksUsage?.toDTO(),
        uberWeeksSumDistance: device.uberWeeksSumDistance?.toDTO(),
      },
    }
  }

  trackerTrips = async (_parent: unknown, { leasingId, date }: QueryTrackerTripsArgs): Promise<TrackerTrip[]> => {
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
    const trackerService = container.get<TrackerService>(DI.TrackerService)

    const leasing = await leasingService.getById(new UUID(leasingId))

    const deviceId = leasing.getVehicle()?.getTrackerDeviceId()
    if (!deviceId) {
      console.error('Device not found')
      throw new NotFoundError('Device not found')
    }

    const trips = await trackerService.trips(deviceId, new DateTimeValue(date))

    return trips.map((trip) => {
      const score: TrackerTripScore = {
        contextScore: trip.score?.contextScore?.toDTO(),
        distance: trip.score?.distance?.toDTO(),
        drivingScore: trip.score?.drivingScore?.toDTO(),
        drivingScoreContextualized: trip.score?.drivingScoreContextualized?.toDTO(),
        totalEvents: trip.score?.totalEvents?.toDTO(),
        validPositions: trip.score?.validPositions?.toDTO(),
        events: trip.score?.events?.toDTO(),
      }

      return {
        tripId: trip.tripId?.toDTO(),
        averageSpeed: trip.averageSpeed?.toDTO(),
        date: trip.date?.toDTO(),
        deviceId: trip.deviceId?.toDTO(),
        deviceName: trip.deviceName?.toDTO(),
        distance: trip.distance?.toDTO(),
        duration: trip.duration?.toDTO(),
        startAddress: trip.startAddress?.toDTO(),
        startLat: trip.startLat?.toDTO(),
        startLon: trip.startLon?.toDTO(),
        startOdometer: trip.startOdometer?.toDTO(),
        startTime: trip.startTime?.toDTO(),
        endAddress: trip.endAddress?.toDTO(),
        endLat: trip.endLat?.toDTO(),
        endLon: trip.endLon?.toDTO(),
        endOdometer: trip.endOdometer?.toDTO(),
        endTime: trip.endTime?.toDTO(),
        maxSpeed: trip.maxSpeed?.toDTO(),
        score,
      }
    })
  }

  leasingAlarms = async (_parent: unknown, { leasingId }: QueryLeasingAlarmsArgs): Promise<LeasingAlarmsResponse> => {
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
    const alarmService = container.get<AlarmService>(DI.AlarmService)

    const leasing = await leasingService.getById(new UUID(leasingId))

    const deviceId = leasing.getVehicle()?.getTrackerDeviceId()
    if (!deviceId) {
      console.error('Device not found')
      throw new NotFoundError('Device not found')
    }

    const alarms = await alarmService.list(deviceId, new StringValue('ACTIVE'))

    return {
      alarms: alarms.map((alarm) => ({
        id: alarm.id?.toDTO(),
        alertLevel: alarm.alertLevel?.toDTO(),
        category: alarm.category?.toDTO(),
        date: alarm.date?.toDTO(),
        deviceId: alarm.deviceId?.toDTO(),
        lastUpdate: alarm.lastUpdate?.toDTO(),
        status: alarm.status?.toDTO(),
        subcategory: alarm.subcategory?.toDTO(),
      })),
    }
  }

  leasingDailySummary = async (
    _parent: unknown,
    { leasingId, date }: QueryLeasingDailySummaryArgs,
  ): Promise<LeasingDailySummary> => {
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
    const analyticsService = container.get<AnalyticsService>(DI.AnalyticsService)

    const leasing = await leasingService.getById(new UUID(leasingId))

    const deviceId = leasing.getVehicle()?.getTrackerDeviceId()
    if (!deviceId) {
      console.error('Device not found')
      throw new NotFoundError('Device not found')
    }

    const analytics = await analyticsService.dailySummary(deviceId, new DateTimeValue('2024-05-09'))

    return {
      trips: analytics.trips.toDTO(),
      tripsDailyDistance: analytics.tripsDailyDistance.toDTO(),
      tripsDailyScoring: analytics.tripsDailyScoring.toDTO(),
      tripsEndOdometer: analytics.tripsEndOdometer.toDTO(),
      uberDailyDistance: analytics.uberDailyDistance.toDTO(),
      uberFare: analytics.uberFare.toDTO(),
      uberTrips: analytics.uberTrips.toDTO(),
      uberUsage: analytics.uberUsage.toDTO(),
    }
  }

  leasingWeeklySummary = async (
    _parent: unknown,
    { leasingId, weekNumber }: QueryLeasingWeeklySummaryArgs,
  ): Promise<LeasingWeeklySummary> => {
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
    const analyticsService = container.get<AnalyticsService>(DI.AnalyticsService)

    const leasing = await leasingService.getById(new UUID(leasingId))

    const deviceId = leasing.getVehicle()?.getTrackerDeviceId()
    if (!deviceId) {
      console.error('Device not found')
      throw new NotFoundError('Device not found')
    }

    const analytics = await analyticsService.weeklySummary(deviceId, new NumberValue(weekNumber))

    return {
      trips: analytics.trips.toDTO(),
      tripsWeeklyDistance: analytics.tripsWeeklyDistance.toDTO(),
      tripsWeeklyScoring: analytics.tripsWeeklyScoring.toDTO(),
      tripsWeeklyEndOdometer: analytics.tripsWeeklyEndOdometer.toDTO(),
      uberWeeklyDistance: analytics.uberWeeklyDistance.toDTO(),
      uberFares: analytics.uberFares.toDTO(),
      uberTrips: analytics.uberTrips.toDTO(),
      uberUsage: analytics.uberUsage.toDTO(),
    }
  }

  leasingFinancialWeeklySummary = async (
    _parent: unknown,
    { leasingId, weekNumber }: QueryLeasingFinancialWeeklySummaryArgs,
  ): Promise<LeasingFinancialWeekSummary[]> => {
    const financialService = container.get<FinancialService>(DI.FinancialService)

    const weeks = await financialService.weeklySummary(new UUID(leasingId))

    return weeks.map((week) => ({
      weekNumber: week.weekNumber.toDTO(),
      startDate: week.startDate.toDTO(),
      endDate: week.endDate.toDTO(),
      cutDate: week.cutDate.toDTO(),
      weeklyFeeAmount: week.weeklyFeeAmount.toDTO(),
      behaviorFineAmount: week.behaviorFineAmount.toDTO(),
      otherFinesAmount: week.otherFinesAmount.toDTO(),
      previousUnpaidAmount: week.previousUnpaidAmount.toDTO(),
      interestsAmount: week.interestsAmount.toDTO(),
    }))
  }

  leasingFinancialDebtVoucher = async (
    _parent: unknown,
    { leasingId, weekNumber }: QueryLeasingFinancialDebtVoucherArgs,
  ): Promise<LeasingFinancialDebtVoucher | null> => {
    const financialService = container.get<FinancialService>(DI.FinancialService)

    const voucher = await financialService.getDebtVoucher(new UUID(leasingId), new NumberValue(weekNumber))

    if (!voucher) {
      return null
    }

    return {
      code: voucher.code.toDTO(),
      amount: voucher.amount.toDTO(),
      validUntil: voucher.validUntil.toDTO(),
    }
  }

  leasingPendingPayments = async (
    _parent: unknown,
    { contractId }: QueryLeasingPendingPaymentsArgs,
  ): Promise<LeasingPendingPayment[] | null> => {
    const financialService = container.get<FinancialService>(DI.FinancialService)

    const payments = await financialService.getPendingPayments(new NumberValue(contractId))

    if (!payments) {
      return null
    }

    return payments.map((payment) => ({
      id: payment.id.toDTO(),
      bankReferer: payment.bankReferer.toDTO(),
      week: payment.week.toDTO(),
      cycleEndDate: payment.cycleEndDate.toDTO(),
      total: payment.total.toDTO(),
      date: payment.date.toDTO(),
      details: payment.details.map((detail) => ({
        code: detail.code.toDTO(),
        description: detail.description.toDTO(),
        amount: detail.amount.toDTO(),
        price: detail.price.toDTO(),
      })),
    }))
  }

  banksWithReferDeatils = async (_parent: unknown): Promise<BankReferDeatil[]> => {
    const financialService = container.get<FinancialService>(DI.FinancialService)

    const payments = await financialService.getBanksWithReferDeatils()

    if (!payments) {
      return []
    }

    return payments.map((payment) => ({
      ciaId: payment.ciaId.toDTO(),
      bankId: payment.bankId.toDTO(),
      bank: payment.bank.toDTO(),
      clabe: payment.clabe.toDTO(),
      agreement: payment.agreement.toDTO(),
      account: payment.account.toDTO(),
    }))
  }

  leasingSummary = async (
    _parent: unknown,
    { leasingId, weekNumber }: QueryLeasingSummaryArgs,
  ): Promise<LeasingSummary> => {
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)
    const financialService = container.get<FinancialService>(DI.FinancialService)

    const leasing = await leasingService.getById(new UUID(leasingId))
    const contractNumber = leasing.getVehicle()?.getContractId()

    const currentWeekNumber = leasingService.getCurrentWeekNumber(leasing, new DateTimeValue(new Date()))

    const financialWeeklySummary = await financialService.weekSummary(new UUID(leasingId), currentWeekNumber)

    return {
      contractNumber: contractNumber?.toDTO(),
      weekNumber: currentWeekNumber.toDTO(),
      startDate: leasing.getStartDate().toDTO(),
      endDate: leasing.getEndDate().toDTO(),
      baseServiceAmount: financialWeeklySummary.weeklyFeeAmount.toDTO(),
      usagePenaltyAmount: financialWeeklySummary.otherFinesAmount.toDTO(),
      expensesAmount: financialWeeklySummary.interestsAmount.toDTO(), //TODO expenses is the interest?
      totalAmount: financialWeeklySummary.totalAmount.toDTO(),
      lastUpdate: '2024-07-03T14:00:51.417+00:00',
      usage: 0,
      usagePenalty: 'none',
      uberEarningsGross: 0,
      earningsProgress: 0,
      previousExpensesAmount: 0,
      // previousExpensesDueDate: null,
    }
  }

  leasingAccountSummary = async (
    _parent: unknown,
    { quoteSmartItId }: QueryLeasingAccountSummaryArgs,
  ): Promise<LeasingAccountSummary | null> => {
    const financialService = container.get<FinancialService>(DI.FinancialService)

    const contractAccountSummary = await financialService.getContractAccountSummary(new NumberValue(quoteSmartItId))

    if (!contractAccountSummary) {
      return null
    }

    return {
      companyId: contractAccountSummary.companyId.toDTO(),
      contractId: contractAccountSummary.contractId.toDTO(),
      weekNumber: contractAccountSummary.weekNumber.toDTO(),
      startDate: contractAccountSummary.startDate.toDTO(),
      endDate: contractAccountSummary.endDate.toDTO(),
      cycleEndDate: contractAccountSummary.cycleEndDate.toDTO(),
      grandTotal: contractAccountSummary.grandTotal.toDTO(),
      accounts: contractAccountSummary.accounts
        ? contractAccountSummary.accounts.map((account) => {
            return {
              accountTypeId: account.accountTypeId.toDTO(),
              accountName: account.accountName.toDTO(),
              amount: account.amount.toDTO(),
              subAccounts: account.subAccounts
                ? account.subAccounts.map((subaccount) => {
                    return {
                      accountTypeId: subaccount.accountTypeId.toDTO(),
                      accountName: subaccount.accountName.toDTO(),
                      amount: subaccount.amount.toDTO(),
                      subaccounts: [],
                    }
                  })
                : [],
            }
          })
        : [],
    }
  }

  leasingPendingBankReferences = async (
    _parent: unknown,
    { quoteSmartItId }: QueryLeasingPendingBankReferencesArgs,
  ): Promise<LeasingPendingBankReference[] | null> => {
    const financialService = container.get<FinancialService>(DI.FinancialService)

    const bankReferences = await financialService.getPendingBankReferences(new NumberValue(quoteSmartItId))

    if (!bankReferences) {
      return null
    }

    var results: LeasingPendingBankReference[] = await Promise.all(
      bankReferences.map(async (item): Promise<LeasingPendingBankReference> => {
        if (item.reference.toDTO() === '') {
          return {
            reference: item.reference.toDTO(),
            amount: item.amount.toDTO(),
            endDate: item.endDate?.toDTO(),
            pendingPayments: [],
          }
        }

        const pendingPayments = await financialService.getPendingPaymentsByReference(
          new NumberValue(quoteSmartItId),
          item.reference,
        )

        return {
          reference: item.reference.toDTO(),
          amount: item.amount.toDTO(),
          endDate: item.endDate?.toDTO(),
          pendingPayments: pendingPayments
            ? pendingPayments.map((payment) => ({
                id: payment.id.toDTO(),
                bankReferer: payment.bankReferer.toDTO(),
                week: payment.week.toDTO(),
                cycleEndDate: payment.cycleEndDate.toDTO(),
                total: payment.total.toDTO(),
                details: payment.details.map((detail) => ({
                  code: detail.code.toDTO(),
                  description: detail.description.toDTO(),
                  amount: detail.amount.toDTO(),
                  price: detail.price.toDTO(),
                })),
              }))
            : [],
        }
      }),
    )

    return results
  }

  createBankReference = async (
    _parent: unknown,
    { quoteSmartItId, pendingPaymentsIds }: MutationCreateBankReferenceArgs,
  ): Promise<LeasingPendingBankReference | null> => {
    const financialService = container.get<FinancialService>(DI.FinancialService)

    const bankReference = await financialService.createBankReference(
      new NumberValue(quoteSmartItId),
      pendingPaymentsIds.map((p) => new NumberValue(p!)),
    )

    return {
      reference: bankReference.reference.toDTO(),
      amount: bankReference.amount.toDTO(),
      endDate: null,
      pendingPayments: bankReference.pendingPayments.map((payment) => ({
        id: payment.id.toDTO(),
        bankReferer: payment.bankReferer.toDTO(),
        week: payment.week.toDTO(),
        cycleEndDate: payment.cycleEndDate.toDTO(),
        total: payment.total.toDTO(),
        details: payment.details.map((detail) => ({
          code: detail.code.toDTO(),
          description: detail.description.toDTO(),
          amount: detail.amount.toDTO(),
          price: detail.price.toDTO(),
        })),
      })),
    }
  }

  weeklyVehicleUsage = async (_parent: unknown, { leasingId }: QueryWeeklyVehicleUsageArgs) => {
    //let currentDay = new Date("2025-01-12T06:00:00.0Z")
    let currentDay = new Date(Date.now())
    let weeklyUsage: VehicleUsage[] = []

    const analyticsService = container.get<AnalyticsService>(DI.AnalyticsService)
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)

    const leasing = await leasingService.getById(new UUID(leasingId))
    const deviceId = leasing.getVehicle()?.getTrackerDeviceId()
    if (!deviceId) {
      console.error('Device not found')
      throw new NotFoundError('Device not found')
    }

    let monday = getMondayOfWeek(currentDay)
    while (currentDay.getTime() >= monday.getTime() || currentDay.getDay() === 1) {
      const trips = await analyticsService.dailySummary(deviceId, new DateTimeValue(currentDay.toISOString()))
      const dailyUsage: VehicleUsage = {
        uber: trips.uberDailyDistance.toDTO(),
        tracker: trips.tripsDailyDistance.toDTO(),
        percentage:
          trips.uberDailyDistance.toDTO() === 0
            ? 0
            : trips.tripsDailyDistance.toDTO() / trips.uberDailyDistance.toDTO(),
        //percentage:  Math.floor(Math.random() * 100) / 100,
        dayOfWeek: currentDay.getDay(),
        date: new Date(currentDay),
      }
      weeklyUsage.push(dailyUsage)
      currentDay.setDate(currentDay.getDate() - 1)
    }

    return weeklyUsage
  }

  vehicleUsageSummary = async (_parent: unknown, { leasingId }: QueryVehicleUsageSummaryArgs) => {
    const analyticsService = container.get<AnalyticsService>(DI.AnalyticsService)
    const leasingService = container.get<AbstractLeasingService>(DI.LeasingService)

    const leasing = await leasingService.getById(new UUID(leasingId))
    const deviceId = leasing.getVehicle()?.getTrackerDeviceId()

    if (!deviceId) {
      console.error('Device not found')
      throw new NotFoundError('Device not found')
    }

    const summary = await analyticsService.vehicleUsageSummary(deviceId)

    return {
      currentOdometer: summary.currentOdometer.toDTO(),
      weeksSumDistance: Math.floor(summary.weeksSumDistance.toDTO() * 100) / 100,
      uberWeeksSumDistance: summary.uberWeeksSumDistance.toDTO(),
      uberWeeksUsage: summary.uberWeeksUsage.toDTO(),
      percentage:
        summary.uberWeeksSumDistance.toDTO() == 0
          ? 0
          : Math.floor((summary.weeksSumDistance.toDTO() / summary.uberWeeksSumDistance.toDTO()) * 100) / 100,
      //percentage: Math.floor(Math.random() * 100) / 100,
      drivingScore: Math.floor(summary.drivingScore.toDTO() * 100) / 100,
      totalEvents: summary.totalEvents.toDTO(),
      totalTrips: summary.totalTrips.toDTO(),
    }
  }
}
