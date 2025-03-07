import { DateTimeValue } from '@domain/shared/DateTime'
import { Email } from '@domain/shared/Email'
import { NotificationChannel } from '@domain/shared/NotificationChannel'
import { PhoneNumber } from '@domain/shared/PhoneNumber'
import { StringValue } from '@domain/shared/StringValue'
import { GroupId } from '@domain/user/models/GroupId'
import { UserId } from '@domain/user/models/UserId'

export type NotificationContactProps = {
  userId?: UserId
  phoneNumber?: PhoneNumber
  email?: Email
  firstName?: StringValue
  lastName?: StringValue
  picture?: StringValue
  dateOfBirth?: StringValue // we need a DateValue
  cityName?: StringValue
}

export type NotificationProps = {
  title: StringValue
  channel: NotificationChannel[]
  content: StringValue
  template?: {
    name: string
    fields: object
  }
  schedule?: {
    dateTimeUNIX: number
  }
}

export type SendNotificationJob = {
  id: string
}

export interface NotificationService {
  send(contactProps: NotificationContactProps, notificationProps: NotificationProps): Promise<SendNotificationJob>
  sendToUser(userId: UserId, notificationProps: NotificationProps): Promise<SendNotificationJob>
  sendToGroup(groupId: GroupId, notificationProps: NotificationProps): Promise<SendNotificationJob[]>
}
