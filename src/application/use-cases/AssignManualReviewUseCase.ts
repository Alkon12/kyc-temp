import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { KycVerificationService } from '@service/KycVerificationService'
import { UserService } from '@service/UserService'
import { KycVerificationId } from '@domain/kycVerification/models/KycVerificationId'
import { UserId } from '@domain/user/models/UserId'
import { StringValue } from '@domain/shared/StringValue'
import { ValidationError } from '@domain/error/ValidationError'
import { NotFoundError } from '@domain/error'
import prisma from '@client/providers/PrismaClient'

export interface AssignManualReviewDto {
  verificationId: string
  assignToUserId: string
  notes?: string
}

@injectable()
export class AssignManualReviewUseCase {
  constructor(
    @inject(DI.KycVerificationService) private kycVerificationService: KycVerificationService,
    @inject(DI.UserService) private userService: UserService
  ) {}

  async execute(dto: AssignManualReviewDto) {
    if (!dto.verificationId || !dto.assignToUserId) {
      throw new ValidationError('verificationId and assignToUserId are required')
    }

    const verificationId = new KycVerificationId(dto.verificationId)
    const userId = new UserId(dto.assignToUserId)
    
    // Verificar que el usuario existe y tiene el rol de revisor
    const user = await this.userService.getById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    
    // Verificar que el usuario tiene el rol de revisor (implementación opcional)
    const hasReviewerRole = await this.userHasReviewerRole(dto.assignToUserId)
    if (!hasReviewerRole) {
      throw new ValidationError('User does not have reviewer role')
    }
    
    // Obtener la verificación KYC
    const verification = await this.kycVerificationService.getById(verificationId)
    
    // Verificar que la verificación requiere revisión manual
    if (verification.getStatus().toDTO() !== 'requires-review') {
      throw new ValidationError('Verification is not in requires-review status')
    }
    
    // Asignar la verificación al usuario
    verification.assign(userId)
    
    // Agregar notas si se proporcionan
    if (dto.notes) {
      verification.updateNotes(new StringValue(dto.notes))
    }
    
    // Registrar la actividad
    await prisma.activityLog.create({
      data: {
        userId: dto.assignToUserId,
        verificationId: dto.verificationId,
        action: 'assign_manual_review',
        description: `Verification assigned to reviewer ${user.props.firstName?.value} ${user.props.lastName?.value}`,
      }
    })
    
    // Guardar los cambios
    return this.kycVerificationService.save(verification)
  }

  private async userHasReviewerRole(userId: string): Promise<boolean> {
    // Verificar si el usuario tiene el rol de revisor
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId: userId,
      },
      include: {
        role: true,
      },
    })
    
    return userRoles.some(ur => ur.role.roleName === 'reviewer')
  }
}
