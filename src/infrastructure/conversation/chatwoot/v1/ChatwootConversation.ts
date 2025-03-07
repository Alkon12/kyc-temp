import {
  Conversation,
  ConversationContact,
  ConversationSendMessage,
  ConversationService,
} from '@/application/service/ConversationService'
import { NotFoundError, UnauthorizedError, UnexpectedError } from '@domain/error'
import { BooleanValue } from '@domain/shared/BooleanValue'
import { ConversationChannel } from '@domain/shared/ConversationChannel'
import { DateTimeValue } from '@domain/shared/DateTime'
import { Email } from '@domain/shared/Email'
import { NumberValue } from '@domain/shared/NumberValue'
import { StringValue } from '@domain/shared/StringValue'
import type UserRepository from '@domain/user/UserRepository'
import { UserId } from '@domain/user/models/UserId'
import { DI } from '@infrastructure/inversify.symbols'
import { inject, injectable } from 'inversify'

const CHATWOOT_ACCOUNT_ID = '1'

type GetContactResponse = {
  meta: {
    count: number
    current_page: number // TODO be aware of this
  }
  payload: [
    {
      additional_attributes: object
      availability_status: string //"offline",
      email: string //"rbutta@gmail.com",
      id: number
      name: string // "Rodri Driver Gmail",
      phone_number: string // "+911234567890",
      identifier: string // THE USER ID "dd8b5b17-a4df-41a5-94e5-36460eb65f71",
      thumbnail: string
      custom_attributes: object
      created_at: number
      contact_inboxes: [
        {
          source_id: string // "rbutta+test3@gmail.com" "+543525652298",
          inbox: Inbox
        },
      ]
    },
  ]
}

type Inbox = {
  id: number
  channel_id: number
  name: string // "UBER Whatsapp Business"
  channel_type: string // "Channel::Email" "Channel::Api"
  email?: string // "uber_soporte@grupoautofin.com",
  provider: string | null // "microsoft" null
}

type Sender = {
  id: number
  name: string // "Andres Petrillo",
  email?: string // "rbutta@gmail.com",
  phone_number?: string // "+911234567890",
  thumbnail?: string
  type?: string // "user"
  additional_attributes?: {
    template_params?: {
      name?: string // "uber_plain",
      channel?: string // "email",
      category?: string // "UTILITY",
      language?: string // "es"
    }
  }
  availability_status?: string // "offline",
}

type Message = {
  id: number // 537,
  sender: Sender
  content: string // "Hola desde BO",
  account_id: number // 1,
  inbox_id: number // 4,
  conversation_id: number // 95,
  message_type: number // 1,
  created_at: number // 1719405851,
  updated_at: string // "2024-06-26T12:44:11.506Z",
  private: boolean
  status: string // "sent",
  source_id: string | null
  content_type: string // "text",
  processed_message_content: string // "Hola desde BO",
  conversation: {
    assignee_id: number | null
    unread_count: number
    last_activity_at: number
  }
}

type GetConversationsResponse = {
  payload: [
    {
      id: number
      account_id: number // 1
      uuid?: string // "09336ef5-1fa8-483d-8ca5-ad770e549d75",
      can_reply: boolean
      unread_count: number
      last_activity_at: number
      inbox_id: number
      meta: {
        sender: Sender
        channel: string // "Channel::Api", "Channel::Email",
      }
      messages: Message[]
    },
  ]
}

@injectable()
export class ChatwootConversation implements ConversationService {
  @inject(DI.UserRepository) private _userRepository!: UserRepository

  private _buildHeaders() {
    return {
      'Content-Type': 'application/json',
      api_access_token: process.env.NEXT_PUBLIC_CHATBOT_API_KEY as string,
    }
  }

  async getConversations(userId: UserId, channel?: ConversationChannel): Promise<Conversation[]> {
    const contact = await this.getContact(userId)
    const userIdDTO = contact?.id.toDTO()
    if (!contact) {
      console.error(`ChatwootConversation getConversations [USERID ${userIdDTO}] > ERROR`, 'Contact not found')
      throw new NotFoundError('ChatwootConversation getConversations: contact not found')
    }

    const url = `${process.env.NEXT_PUBLIC_CHATWOOT_API_URL}/accounts/${CHATWOOT_ACCOUNT_ID}/contacts/${userIdDTO}/conversations`
    console.log(`ChatwootConversation getConversations [USERID ${userIdDTO}] > URL`, url)

    const res = await fetch(url, {
      method: 'GET',
      headers: this._buildHeaders(),
    })

    console.log(`ChatwootConversation getConversations [USERID ${userIdDTO}] > RESPONSE`, res.statusText, res)

    if (res.status === 404) {
      console.error(`ChatwootConversation getConversations [USERID ${userIdDTO}] > ERROR 404`, res.statusText)
      throw new NotFoundError(
        `ChatwootConversation getConversations: resource not found for ${url}, ${res.status} ${res.statusText}`,
      )
    }
    if (res.status === 400) {
      console.error(`ChatwootConversation getConversations [USERID ${userIdDTO}] > ERROR 400`, res.statusText)
      throw new UnauthorizedError(
        `ChatwootConversation getConversations: Unauthorized ${url}, ${res.status} ${res.statusText}`,
      )
    }
    if (res.status === 500) {
      console.error(`ChatwootConversation getConversations [USERID ${userIdDTO}] > ERROR 500`, res.statusText)
      throw new UnexpectedError(
        `ChatwootConversation getConversations: resource error ${url}, ${res.status} ${res.statusText}`,
      )
    }

    const jsonResponse = (await res.json()) as GetConversationsResponse

    console.log(`ChatwootConversation getConversations [USERID ${userIdDTO}] > COUNT`, jsonResponse.payload?.length)

    if (jsonResponse && jsonResponse.payload?.length > 0) {
      const conversations: Conversation[] = jsonResponse.payload.map((conversation) => ({
        id: new StringValue(conversation.id.toString()),
        channel: this._conversationChannelParse(conversation.meta.channel),
        userId,
        unreadCount: new NumberValue(conversation.unread_count ?? 0),
        canReply: new BooleanValue(conversation.can_reply ?? true),
        lastActivityAt: new DateTimeValue(new Date(conversation.last_activity_at * 1000)),
        externalLink: new StringValue(
          `${process.env.NEXT_PUBLIC_CHATWOOT_URL}/app/accounts/${CHATWOOT_ACCOUNT_ID}/inbox/${conversation.inbox_id}/conversations/${conversation.id}`,
        ),
        messages: conversation.messages.map((message) => ({
          id: new StringValue(message.id.toString()),
          sender: {
            id: new StringValue(message.sender.id.toString()),
            // userId: UserId
            name: new StringValue(message.sender.name),
            type: message.sender.type ? new StringValue(message.sender.type) : undefined, // TODO type
            thumbnail: message.sender.thumbnail ? new StringValue(message.sender.thumbnail) : undefined, // TODO type
            phoneNumber: message.sender.phone_number ? new StringValue(message.sender.phone_number) : undefined, // TODO type
            email: message.sender.email ? new Email(message.sender.email) : undefined,
          },
          content: new StringValue(message.content),
          createdAt: new DateTimeValue(new Date(message.created_at * 1000)),
          status: new StringValue(message.status),
          contentType: new StringValue(message.content_type),
        })),
      }))

      return conversations
    } else {
      return []
    }
  }

  private _conversationChannelParse(channel: string): ConversationChannel {
    switch (channel) {
      case 'Channel::Email':
        return ConversationChannel.EMAIL
      case 'Channel::Api':
        return ConversationChannel.API
      default:
        return ConversationChannel.API
    }
  }

  async getContact(userId: UserId): Promise<ConversationContact | null> {
    const userIdDTO = userId.toDTO()
    const url = `${process.env.NEXT_PUBLIC_CHATWOOT_API_URL}/accounts/${CHATWOOT_ACCOUNT_ID}/contacts/search?q=${userId.toDTO()}`
    console.log(`ChatwootConversation getContact [USERID ${userIdDTO}] > URL`, url)

    const res = await fetch(url, {
      method: 'GET',
      headers: this._buildHeaders(),
    })
    console.log(`ChatwootConversation getContact [USERID ${userIdDTO}] > RESPONSE`, res.status, res.statusText)

    if (res.status === 404) {
      console.error(`ChatwootConversation getContact [USERID ${userIdDTO}] > ERROR 404`, res.statusText)
      throw new NotFoundError(
        `ChatwootConversation getContact: resource not found for ${url}, ${res.status} ${res.statusText}`,
      )
    }
    if (res.status === 400) {
      console.error(`ChatwootConversation getContact [USERID ${userIdDTO}] > ERROR 400`, res.statusText)
      throw new UnauthorizedError(
        `ChatwootConversation getContact: Unauthorized ${url}, ${res.status} ${res.statusText}`,
      )
    }
    if (res.status === 500) {
      console.error(`ChatwootConversation getContact [USERID ${userIdDTO}] > ERROR 500`, res.statusText)
      throw new UnexpectedError(
        `ChatwootConversation getContact: resource error ${url}, ${res.status} ${res.statusText}`,
      )
    }

    const jsonResponse = (await res.json()) as GetContactResponse
    if (jsonResponse && jsonResponse.payload?.length > 0) {
      const contact = jsonResponse.payload[0]
      return {
        id: new StringValue(contact.id.toString()),
        userId: contact.identifier ? new UserId(contact.identifier) : undefined,
        name: new StringValue(contact.name),
        phoneNumber: contact.phone_number ? new StringValue(contact.phone_number) : undefined,
        email: contact.email ? new Email(contact.email) : undefined,
        thumbnail: contact.thumbnail ? new StringValue(contact.thumbnail) : undefined,
      }
    } else {
      return null
    }
  }

  async sendMessage(props: ConversationSendMessage): Promise<Conversation[]> {
    const url = `${process.env.NEXT_PUBLIC_CHATBOT_URL}/notification`
    console.log(`ChatwootConversation sendMessage [USERID ${props.userId.toDTO()}] > URL`, url)

    const toUser = await this._userRepository.getById(props.userId)
    const toUserId = toUser.getId().toDTO()

    const jsonBody = {
      contact: {
        id: toUserId,
        first_name: toUser.getFirstName()?.toDTO() ?? '',
        last_name: toUser.getLastName()?.toDTO() ?? '',
        phone_number: toUser.getPhoneNumber()?.toUnformattedDTO() ?? '',
        email: toUser.getEmail()?.toDTO() ?? '',
        picture: '', // TODO check if needed
        date_of_birth: '', // TODO check if needed
        city_name: '', // TODO check if needed
      },
      notification: {
        title: props.title ? props.title.toDTO() : undefined,
        channel: props.conversationChannel.sameValueAs(ConversationChannel.EMAIL) ? 'email' : 'sms', // TODO check APP/WAPP
        content: props.content.toDTO(),
        template: {
          name: 'uber_plain',
          parameters: [
            {
              type: 'text',
              text: toUser.getFirstName()?.toDTO(),
            },
            {
              type: 'text',
              text: props.content.toDTO(),
            },
          ],
        },
      },
    }

    console.log(`ChatwootConversation sendMessage [USERID ${toUserId}] > BODY`, jsonBody)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      })

      console.log(`ChatwootConversation sendMessage [USERID ${toUserId}] > RESPONSE`, res)

      return this.getConversations(props.userId)
    } catch (error) {
      console.error(`ChatwootConversation sendMessage [USERID ${toUserId}] > ERROR`, error)
    } finally {
      return []
    }
  }
}
