import { ValidationError } from '@domain/error/ValidationError'
import { ValueObject } from '@domain/kernel/ValueObject'
import { isPossiblePhoneNumber, CountryCode as LibCountryCode, parsePhoneNumber } from 'libphonenumber-js'
import { CountryCode } from './CountryCode'

export class PhoneNumber extends ValueObject<'PhoneNumber', string> {
  constructor(value: string) {
    // if (!PhoneNumber.isValid(value)) {
    //     throw new ValidationError(`Invalid phone number [${value}]`)
    // }

    super(PhoneNumber.resolveValue(value))
  }

  static isValid(phoneNumber: string, countryCode?: CountryCode): boolean {
    return isPossiblePhoneNumber(phoneNumber, PhoneNumber.defaultCountryCode(countryCode))
  }

  static resolveValue(value: string, countryCode?: CountryCode): string {
    const phoneNumber = parsePhoneNumber(value, PhoneNumber.defaultCountryCode(countryCode))
    if (phoneNumber) {
      // console.log('1111 phoneNumber.country', phoneNumber.country)
      // console.log('1111 phoneNumber.number', phoneNumber.number)
      // console.log('1111 phoneNumber.isPossible', phoneNumber.isPossible())
      // console.log('1111 phoneNumber.isValid', phoneNumber.isValid())
      // console.log('1111 phoneNumber.getType', phoneNumber.getType())
      // console.log('1111 phoneNumber.number', phoneNumber.number)
      // console.log('1111 phoneNumber.formatInternational', phoneNumber.formatInternational({}))
      // console.log('1111 phoneNumber.countryCallingCode', phoneNumber.countryCallingCode)
      return phoneNumber.formatInternational({})
    }

    return value
  }

  static defaultCountryCode(countryCode?: CountryCode): LibCountryCode {
    if (!countryCode) {
      return 'MX' // TODO move to env
    }

    return countryCode.toDTO() as LibCountryCode
  }

  getCountryCodeNumber(countryCode?: CountryCode) {
    const phoneNumber = parsePhoneNumber(this._value, PhoneNumber.defaultCountryCode(countryCode))
    if (phoneNumber) {
      // console.log('phoneNumber.country', phoneNumber.country)
      // console.log('phoneNumber.number', phoneNumber.number)
      // console.log('phoneNumber.isPossible', phoneNumber.isPossible())
      // console.log('phoneNumber.isValid', phoneNumber.isValid())
      // console.log('phoneNumber.getType', phoneNumber.getType())
      // console.log('phoneNumber.number', phoneNumber.number)
      // console.log('phoneNumber.formatInternational', phoneNumber.formatInternational({}))
      // console.log('phoneNumber.countryCallingCode', phoneNumber.countryCallingCode)
    }

    return phoneNumber
  }

  toUnformattedDTO() {
    const unformatted = this._value.replaceAll(' ', '')

    return unformatted
  }
}
