import { injectable } from 'inversify'
import { UserEntity } from '@domain/user/models/UserEntity'
import { DTO } from '@domain/kernel/DTO'
import { ApiContext, ApiExternalContext } from '@api/shared/Api'

@injectable()
export class TestResolvers {
  build() {
    return {
      Query: {
        test: this.test,
      },
    }
  }

 
  test = async (
    _parent: DTO<UserEntity>,
    _: unknown,
    _context: ApiContext | ApiExternalContext,
  ): Promise<string> => {
    return 'Hello Autofin!'
  }

}
