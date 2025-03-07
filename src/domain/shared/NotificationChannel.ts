import { ValidationError } from '@domain/error'
import { ValueObject } from '@domain/kernel/ValueObject'

export const NOTIFICATION_CHANNELS = {
  DEFAULT: 'DEFAULT',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  APP: 'APP', // Not all the notifications shown in APPs will need a Push
  WHATSAPP: 'WHATSAPP',
  WEB: 'WEB',
  BACKOFFICE: 'BACKOFFICE',
}

export class NotificationChannel extends ValueObject<'NotificationChannel', string> {
  constructor(notificationChannel: string) {
    const valid = Object.values(NOTIFICATION_CHANNELS)
    if (!valid.includes(notificationChannel)) {
      throw new ValidationError(
        `Invalid Notification Channel [${notificationChannel}], must be one of "${valid.join()}"`,
      )
    }
    super(notificationChannel)
  }

  static get(notificationChannel: NotificationChannel | string): NotificationChannel {
    return typeof notificationChannel === 'string' ? new NotificationChannel(notificationChannel) : notificationChannel
  }

  static DEFAULT = new NotificationChannel(NOTIFICATION_CHANNELS.DEFAULT)
  static EMAIL = new NotificationChannel(NOTIFICATION_CHANNELS.EMAIL)
  static PUSH = new NotificationChannel(NOTIFICATION_CHANNELS.PUSH)
  static APP = new NotificationChannel(NOTIFICATION_CHANNELS.APP)
  static WHATSAPP = new NotificationChannel(NOTIFICATION_CHANNELS.WHATSAPP)
  static WEB = new NotificationChannel(NOTIFICATION_CHANNELS.WEB)
  static BACKOFFICE = new NotificationChannel(NOTIFICATION_CHANNELS.BACKOFFICE)
}
