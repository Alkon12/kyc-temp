import {
  NotificationContactProps,
  NotificationProps,
  NotificationService,
  SendNotificationJob,
} from '@/application/service/NotificationService'
import { NotificationChannel } from '@domain/shared/NotificationChannel'
import type UserRepository from '@domain/user/UserRepository'
import { GroupId } from '@domain/user/models/GroupId'
import { UserId } from '@domain/user/models/UserId'
import { DI } from '@infrastructure/inversify.symbols'
import { inject, injectable } from 'inversify'

@injectable()
export class ChatwootNotification implements NotificationService {
  @inject(DI.UserRepository) private _userRepository!: UserRepository

  async send(
    contactProps: NotificationContactProps,
    notificationProps: NotificationProps,
  ): Promise<SendNotificationJob> {
    const url = `${process.env.NEXT_PUBLIC_CHATBOT_URL}/notification`
    const userId = contactProps.userId?.toDTO()
    console.log(`ChatwootNotification send [USERID ${userId}] > URL:`, url)

    const jsonBody = {
      contact: {
        id: userId,
        first_name: contactProps.firstName?.toDTO() ?? '',
        last_name: contactProps.lastName?.toDTO() ?? '',
        phone_number: contactProps.phoneNumber?.toUnformattedDTO() ?? '',
        email: contactProps.email?.toDTO() ?? '',
        picture: contactProps.picture?.toDTO() ?? '',
        date_of_birth: contactProps.dateOfBirth ?? '',
        city_name: contactProps.cityName?.toDTO() ?? '',
      },
      notification: {
        // title: notificationProps.title.toDTO(),
        channel: notificationProps.channel[0].sameValueAs(NotificationChannel.EMAIL) ? 'email' : 'sms',
        // content: notificationProps.content.toDTO(),
        template: {
          name: 'uber_plain',
          parameters: [
            {
              type: 'text',
              text: contactProps.firstName?.toDTO(),
            },
            {
              type: 'text',
              text: notificationProps.content.toDTO(),
            },
          ],
        },
      },
    }

    try {
      console.log(`ChatwootNotification send [USERID ${userId}] > SENDING`, jsonBody)

      const notificationResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      })

      console.log(`ChatwootNotification send [USERID ${userId}] > RESPONSE`, notificationResponse)
    } catch (error) {
      console.error(`ChatwootNotification send [USERID ${userId}] > ERROR`, error)
    } finally {
      return {
        id: `${userId}`,
      }
    }
  }

  async sendToUser(userId: UserId, notificationProps: NotificationProps): Promise<SendNotificationJob> {
    const user = await this._userRepository.getById(userId)

    const contact: NotificationContactProps = {
      userId: user.getId(),
      email: user.getEmail(),
      phoneNumber: user.getPhoneNumber(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      picture: user.getPicture(),
    }

    return this.send(contact, notificationProps)
  }

  async sendToGroup(groupId: GroupId, notificationProps: NotificationProps): Promise<SendNotificationJob[]> {
    const jobs: SendNotificationJob[] = []

    const users = await this._userRepository.getByGroup(groupId)

    users.forEach(async (user) => {
      const contact: NotificationContactProps = {
        email: user.getEmail(),
        phoneNumber: user.getPhoneNumber(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        userId: user.getId(),
        picture: user.getPicture(),
      }
      const job = await this.send(contact, notificationProps)
      jobs.push(job)
    })

    return jobs
  }
}
