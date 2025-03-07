import { ValidationError } from '@domain/error'
import { ValueObject } from '@domain/kernel/ValueObject'

export const CONVERSATION_CHANNELS = {
  EMAIL: 'EMAIL',
  API: 'API',
  WHATSAPP: 'WHATSAPP',
}

export class ConversationChannel extends ValueObject<'ConversationChannel', string> {
  constructor(notificationChannel: string) {
    const valid = Object.values(CONVERSATION_CHANNELS)
    if (!valid.includes(notificationChannel)) {
      throw new ValidationError(
        `Invalid Conversation Channel [${notificationChannel}], must be one of "${valid.join()}"`,
      )
    }
    super(notificationChannel)
  }

  static get(notificationChannel: ConversationChannel | string): ConversationChannel {
    return typeof notificationChannel === 'string' ? new ConversationChannel(notificationChannel) : notificationChannel
  }

  static EMAIL = new ConversationChannel(CONVERSATION_CHANNELS.EMAIL)
  static WHATSAPP = new ConversationChannel(CONVERSATION_CHANNELS.WHATSAPP)
  static API = new ConversationChannel(CONVERSATION_CHANNELS.API)
}
