import { StringValue } from '@domain/shared/StringValue'

export type CreateMeetingLinksResponse = {
  guestLink: StringValue
  hostLink: StringValue
}
export interface MeetingService {
  generateMeetingLinks(): Promise<CreateMeetingLinksResponse>
}
