import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { CompanyId } from './CompanyId'

export type CompanyEntityProps = {
  id: CompanyId
  companyName: StringValue
  apiKey: StringValue
  status: StringValue
  callbackUrl?: StringValue
  createdAt?: DateTimeValue
  updatedAt?: DateTimeValue
}

export class CompanyEntity extends AggregateRoot<'CompanyEntity', CompanyEntityProps> {
  get props(): CompanyEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getCompanyName() {
    return this._props.companyName
  }

  getApiKey() {
    return this._props.apiKey
  }

  getStatus() {
    return this._props.status
  }

  getCallbackUrl() {
    return this._props.callbackUrl
  }

  getCreatedAt() {
    return this._props.createdAt
  }

  getUpdatedAt() {
    return this._props.updatedAt
  }
}