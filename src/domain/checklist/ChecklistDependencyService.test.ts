import { ChecklistDependencyService } from './ChecklistDependencyService'
import { ChecklistId } from './models/ChecklistId'

describe('ChecklistDependencyService', () => {
  it('should have dependencies for SELFIE_PICTURE', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('SELFIE_PICTURE'))).toEqual([
      ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
      ChecklistId.ONBOARD_MANAGER_APPROVAL,
    ])
  })

  it('should have dependencies for IDENTIFICATION_CARD', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('IDENTIFICATION_CARD'))).toEqual([
      ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
      ChecklistId.ONBOARD_MANAGER_APPROVAL,
    ])
  })

  it('should have dependencies for DRIVERS_LICENSE', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('DRIVERS_LICENSE'))).toEqual([
      ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
      ChecklistId.ONBOARD_MANAGER_APPROVAL,
    ])
  })

  it('should have dependencies for INCOME_STATEMENT', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('INCOME_STATEMENT'))).toEqual([
      ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
      ChecklistId.ONBOARD_MANAGER_APPROVAL,
    ])
  })

  it('should have dependencies for INACTIVITY_STATEMENT', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('INACTIVITY_STATEMENT'))).toEqual([
      ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
      ChecklistId.ONBOARD_MANAGER_APPROVAL,
    ])
  })

  it('should have dependencies for TAX_IDENTIFICATION', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('TAX_IDENTIFICATION'))).toEqual([
      ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
      ChecklistId.ONBOARD_MANAGER_APPROVAL,
    ])
  })

  it('should have dependencies for ADDRESS', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('ADDRESS'))).toEqual([
      ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
      ChecklistId.ONBOARD_MANAGER_APPROVAL,
    ])
  })

  it('should have dependencies for KYC_MEET_SCHEDULE', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('KYC_MEET_SCHEDULE'))).toEqual([
      ChecklistId.ONBOARD_BACKOFFICE_APPROVAL,
      ChecklistId.ONBOARD_MANAGER_APPROVAL,
    ])
  })

  it('should have dependencies for SELFIE_PICTURE_VERIFICATION', () => {
    expect(ChecklistDependencyService.dependencies(new ChecklistId('SELFIE_PICTURE_VERIFICATION'))).toEqual([
      ChecklistId.ADDRESS,
    ])
  })
})
