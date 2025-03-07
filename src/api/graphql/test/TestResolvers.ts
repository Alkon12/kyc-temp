import { injectable } from 'inversify'
import container from '@infrastructure/inversify.config'
import { DI } from '@infrastructure'
import { ApiContext } from '@api/shared/Api'
import { MutationSendNotificationArgs } from '../app.schema.gen'

@injectable()
export class TestResolvers {
  build() {
    return {
      Query: {},
      Mutation: {
        sendNotification: this.sendNotification,
      },
    }
  }

  sendNotification = async (
    _parent: unknown,
    { userId, input }: MutationSendNotificationArgs,
    context: ApiContext,
  ): Promise<boolean> => {
    // const kycService = container.get<AbstractTestService>(DI.TestService)
    console.log('sendNotification', userId, input)

    return true
  }
}
