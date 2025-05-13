import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { DocusealTemplateId } from './DocusealTemplateId'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { CompanyId } from '@domain/company/models/CompanyId'
import { SignedDocumentEntity } from '@domain/signedDocument/models/SignedDocumentEntity'

export type DocusealTemplateEntityProps = {
  id: DocusealTemplateId
  companyId: CompanyId
  name: StringValue
  description?: StringValue
  docusealTemplateId: StringValue
  documentType: StringValue
  isActive: BooleanValue
  createdAt: DateTimeValue
  updatedAt: DateTimeValue

  company?: CompanyEntity
  signedDocuments?: SignedDocumentEntity[]
}

export class DocusealTemplateEntity extends AggregateRoot<'DocusealTemplateEntity', DocusealTemplateEntityProps> {
  get props(): DocusealTemplateEntityProps {
    return this._props
  }

  getId() {
    return this._props.id
  }

  getCompanyId() {
    return this._props.companyId
  }

  getName() {
    return this._props.name
  }

  getDescription() {
    return this._props.description
  }

  getDocusealTemplateId() {
    return this._props.docusealTemplateId
  }

  getDocumentType() {
    return this._props.documentType
  }

  getIsActive() {
    return this._props.isActive
  }

  getCreatedAt() {
    return this._props.createdAt
  }

  getUpdatedAt() {
    return this._props.updatedAt
  }

  getCompany() {
    return this._props.company
  }

  getSignedDocuments() {
    return this._props.signedDocuments
  }

  setName(name: StringValue) {
    this._props.name = name
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setDescription(description: StringValue) {
    this._props.description = description
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setIsActive(isActive: BooleanValue) {
    this._props.isActive = isActive
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }
} 