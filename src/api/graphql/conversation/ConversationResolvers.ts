import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'

import { UserId } from '@domain/user/models/UserId'
import { DTO } from '@domain/kernel/DTO'
import { Conversation, ConversationService } from '@/application/service/ConversationService'
import { MutationConversationSendMessageArgs, QueryGetConversationsArgs } from '../app.schema.gen'
import { ConversationChannel } from '@domain/shared/ConversationChannel'
import { StringValue } from '@domain/shared/StringValue'

@injectable()
export class ConversationResolvers {
  build() {
    return {
      Query: {
        getConversations: this.getConversations,
      },
      Mutation: {
        conversationSendMessage: this.sendMessage,
      },
    }
  }

  getConversations = async (_parent: unknown, { userId }: QueryGetConversationsArgs): Promise<DTO<Conversation[]>> => {
    const conversationService = container.get<ConversationService>(DI.ConversationService)
    const conversations = await conversationService.getConversations(new UserId(userId))

    return this.resolveConversations(conversations)
  }

  sendMessage = async (
    _parent: unknown,
    { input }: MutationConversationSendMessageArgs,
  ): Promise<DTO<Conversation[]>> => {
    const conversationService = container.get<ConversationService>(DI.ConversationService)

    const conversations = await conversationService.sendMessage({
      userId: new UserId(input.userId),
      conversationChannel: new ConversationChannel(input.conversationChannel),
      content: new StringValue(input.content),
      title: input.title ? new StringValue(input.title) : undefined,
    })

    return this.resolveConversations(conversations)
  }

  private resolveConversations(conversations: Conversation[]): DTO<Conversation[]> {
    return conversations.map((p) => {
      return {
        id: p.id.toDTO(),
        channel: p.channel.toDTO(),
        userId: p.userId.toDTO(),
        unreadCount: p.unreadCount.toDTO(),
        canReply: p.canReply.toDTO(),
        lastActivityAt: p.lastActivityAt.toDTO(),
        externalLink: p.externalLink.toDTO(),
        messages: p.messages.map((m) => {
          return {
            id: m.id.toDTO(),
            sender: {
              id: m.sender.id.toDTO(),
              // userId: ID
              name: m.sender.name.toDTO(),
              type: m.sender.type?.toDTO(),
              thumbnail: m.sender.thumbnail?.toDTO(),
              phoneNumber: m.sender.phoneNumber?.toDTO(),
              email: m.sender.email?.toDTO(),
            },
            content: m.content.toDTO(),
            status: m.status.toDTO(),
            createdAt: m.createdAt.toDTO(),
            contentType: m.contentType.toDTO(),
          }
        }),
      }
    })
  }
}
