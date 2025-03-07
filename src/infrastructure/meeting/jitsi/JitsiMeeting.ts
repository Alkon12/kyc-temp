import { CreateMeetingLinksResponse, MeetingService } from '@/application/service/MeetingService'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { injectable } from 'inversify'

@injectable()
export class JitsiMeeting implements MeetingService {
  async generateMeetingLinks(): Promise<CreateMeetingLinksResponse> {
    const jitsyUrl = process.env.JITSI_URL as string
    const randomMeetingId = new UUID()

    const links: CreateMeetingLinksResponse = {
      hostLink: new StringValue(`${jitsyUrl}/${randomMeetingId.toDTO()}`),
      guestLink: new StringValue(`${jitsyUrl}/${randomMeetingId.toDTO()}`),
    }

    return links
  }
}
