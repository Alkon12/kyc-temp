import { AggregateRoot } from '@domain/kernel/AggregateRoot'
import { StringValue } from '@domain/shared/StringValue'
import { DateTimeValue } from '@domain/shared/DateTime'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { DocusealTemplateId } from './DocusealTemplateId'
import { CompanyEntity } from '@domain/company/models/CompanyEntity'
import { CompanyId } from '@domain/company/models/CompanyId'
import { SignedDocumentEntity } from '@domain/signedDocument/models/SignedDocumentEntity'
import { JsonValue } from '@domain/shared/JsonValue'

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
  documents?: JsonValue
  externalId?: StringValue
  fields?: JsonValue
  folderName?: StringValue
  schema?: JsonValue
  submitters?: JsonValue

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

  getDocuments() {
    return this._props.documents
  }

  getExternalId() {
    return this._props.externalId
  }

  getFields() {
    return this._props.fields
  }

  getFolderName() {
    return this._props.folderName
  }

  getSchema() {
    return this._props.schema
  }

  getSubmitters() {
    return this._props.submitters
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

  setDocuments(documents: JsonValue) {
    this._props.documents = documents
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setExternalId(externalId: StringValue) {
    this._props.externalId = externalId
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setFields(fields: JsonValue) {
    this._props.fields = fields
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setFolderName(folderName: StringValue) {
    this._props.folderName = folderName
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setSchema(schema: JsonValue) {
    this._props.schema = schema
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }

  setSubmitters(submitters: JsonValue) {
    this._props.submitters = submitters
    this._props.updatedAt = new DateTimeValue(new Date())
    return this
  }
} 