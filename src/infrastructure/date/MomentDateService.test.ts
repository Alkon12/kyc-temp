import { MomentDateService } from './MomentDateService'
import moment from 'moment'

describe('MomentDateService', () => {
  let dateService: MomentDateService

  beforeEach(() => {
    dateService = new MomentDateService()
  })

  it('should return a single date when firstDate and lastDate are the same', () => {
    const result = dateService.getDateRange('2023-05-01', '2023-05-01')
    expect(result.length).toBe(1)
    expect(moment(result[0]).format('YYYY-MM-DD')).toBe('2023-05-01')
  })

  it('should return correct date range for consecutive dates', () => {
    const result = dateService.getDateRange('2023-05-01', '2023-05-03')
    expect(result.length).toBe(3)
    expect(moment(result[0]).format('YYYY-MM-DD')).toBe('2023-05-01')
    expect(moment(result[1]).format('YYYY-MM-DD')).toBe('2023-05-02')
    expect(moment(result[2]).format('YYYY-MM-DD')).toBe('2023-05-03')
  })

  it('should handle month boundaries correctly', () => {
    const result = dateService.getDateRange('2023-04-30', '2023-05-02')
    expect(result.length).toBe(3)
    expect(moment(result[0]).format('YYYY-MM-DD')).toBe('2023-04-30')
    expect(moment(result[1]).format('YYYY-MM-DD')).toBe('2023-05-01')
    expect(moment(result[2]).format('YYYY-MM-DD')).toBe('2023-05-02')
  })

  it('should handle year boundaries correctly', () => {
    const result = dateService.getDateRange('2023-12-31', '2024-01-02')
    expect(result.length).toBe(3)
    expect(moment(result[0]).format('YYYY-MM-DD')).toBe('2023-12-31')
    expect(moment(result[1]).format('YYYY-MM-DD')).toBe('2024-01-01')
    expect(moment(result[2]).format('YYYY-MM-DD')).toBe('2024-01-02')
  })

  it('should handle a large date range', () => {
    const result = dateService.getDateRange('2023-01-01', '2023-12-31')
    expect(result.length).toBe(365) // Non-leap year
    expect(moment(result[0]).format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(moment(result[364]).format('YYYY-MM-DD')).toBe('2023-12-31')
  })
})
