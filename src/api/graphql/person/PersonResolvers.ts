import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { DTO } from '@domain/kernel/DTO'
import { PersonEntity } from '@domain/person/PersonEntity'
import { MutationCreatePersonArgs, MutationUpdateDriversLicenseInfoArgs } from '../app.schema.gen'
import { PersonService } from '@service/PersonService'

@injectable()
export class PersonResolvers {
  build() {
    return {
      Mutation: {
        createPerson: this.createPerson,
        updateDriversLicenseInfo: this.updateDriversLicenseInfo,
      },
    }
  }

  createPerson = async (
    _parent: unknown,
    {
      name,
      maidenname,
      lastname,
      businessname,
      rfc,
      curp,
      gender,
      email,
      mobile,
      phone,
      street,
      noext,
      noint,
      zipCode,
      district,
      city,
      state,
      country,
      birthdate,
      cfdiuse,
      taxReg,
      userId,
    }: MutationCreatePersonArgs,
  ): Promise<DTO<PersonEntity | null>> => {
    const personservice = container.get<PersonService>(DI.PersonService)
    const reg = await personservice.createPerson(
      name ?? '',
      maidenname ?? '',
      lastname ?? '',
      businessname ?? '',
      rfc ?? '',
      curp ?? '',
      gender ?? '',
      email,
      mobile,
      phone ?? '',
      street ?? '',
      noext,
      noint ?? '',
      zipCode,
      district,
      city,
      state,
      country,
      birthdate,
      cfdiuse,
      taxReg ?? '',
      userId,
    )

    return reg
  }

  updateDriversLicenseInfo = async (
    _parent: unknown,
    { idsmartIt, personId, licenseNumber, expirationDate }: MutationUpdateDriversLicenseInfoArgs,
  ): Promise<Boolean> => {
    const personservice = container.get<PersonService>(DI.PersonService)
    return await personservice.updateDriversLicense(idsmartIt, personId, licenseNumber, expirationDate)
  }
}
