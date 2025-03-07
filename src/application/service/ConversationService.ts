import { BooleanValue } from '@domain/shared/BooleanValue'
import { ConversationChannel } from '@domain/shared/ConversationChannel'
import { DateTimeValue } from '@domain/shared/DateTime'
import { Email } from '@domain/shared/Email'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import { UserId } from '@domain/user/models/UserId'

export interface Conversation {
  id: StringValue
  channel: ConversationChannel
  userId: UserId
  messages: ConversationMessage[]
  unreadCount: NumberValue
  canReply: BooleanValue
  lastActivityAt: DateTimeValue
  externalLink: StringValue
}

export interface ConversationMessage {
  id: StringValue
  sender: ConversationContact
  content: StringValue
  createdAt: DateTimeValue
  status: StringValue // TODO type
  contentType: StringValue // TODO type
}

export interface ConversationContact {
  id: StringValue
  userId?: UserId
  name: StringValue
  type?: StringValue // TODO type
  thumbnail?: StringValue // TODO type
  phoneNumber?: StringValue // TODO type
  email?: Email
}

export interface ConversationSendMessage {
  userId: UserId
  conversationChannel: ConversationChannel
  content: StringValue
  title?: StringValue
}

export interface ConversationService {
  getConversations(userId: UserId, channel?: ConversationChannel): Promise<Conversation[]>
  getContact(userId: UserId): Promise<ConversationContact | null>
  sendMessage(props: ConversationSendMessage): Promise<Conversation[]>
}
