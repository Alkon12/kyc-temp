import { inject, injectable } from 'inversify'
import { DI } from '@infrastructure'
import { VerificationLinkEntity } from '@domain/verification-link/models/VerificationLinkEntity'
import type VerificationLinkRepository from '@domain/verification-link/VerificationLinkRepository'
import AbstractVerificationLinkService from '@domain/verification-link/VerificationLinkService'
import { VerificationLinkId } from '@domain/verification-link/models/VerificationLinkId'
import { CreateVerificationLinkArgs } from '@domain/verification-link/interfaces/CreateVerificationLinkArgs'
import { VerificationLinkFactory } from '@domain/verification-link/VerificationLinkFactory'
import { StringValue } from '@domain/shared/StringValue'
import { UUID } from '@domain/shared/UUID'
import { NotFoundError } from '@domain/error'
import * as crypto from 'crypto'

@injectable()
export class VerificationLinkService implements AbstractVerificationLinkService {
  @inject(DI.VerificationLinkRepository) private readonly _verificationLinkRepository!: VerificationLinkRepository

  async getById(verificationLinkId: VerificationLinkId): Promise<VerificationLinkEntity> {
    return this._verificationLinkRepository.getById(verificationLinkId)
  }

  async getByToken(token: StringValue): Promise<VerificationLinkEntity> {
    return this._verificationLinkRepository.getByToken(token)
  }

  async getByVerificationId(verificationId: UUID): Promise<VerificationLinkEntity[]> {
    return this._verificationLinkRepository.getByVerificationId(verificationId)
  }

  async create(props: CreateVerificationLinkArgs): Promise<VerificationLinkEntity> {
    // Generate a unique token if not provided
    const token = props.token || new StringValue(this.generateToken())
    
    // Calculate expiration date (default: 48 hours from now)
    const expiresIn = 48 * 60 * 60 * 1000 // 48 hours in milliseconds
    const expiryDate = props.expiresAt || new StringValue(new Date(Date.now() + expiresIn).toISOString())
    
    console.log('Verification link service create with props:', {
      verificationId: props.verificationId._value,
      token: token._value.substring(0, 10) + '...',
      expiresAt: expiryDate._value
    });
    
    const verificationLink = VerificationLinkFactory.create({
      verificationId: props.verificationId,
      token,
      expiresAt: expiryDate,
    })
    
    const dto = verificationLink.toDTO();
    console.log('Verification link entity created:', {
      id: dto.id,
      verificationId: dto.verificationId
    });

    return this._verificationLinkRepository.create(verificationLink)
  }

  async validateToken(token: StringValue): Promise<boolean> {
    try {
      const link = await this._verificationLinkRepository.getByToken(token)
      
      // Check if link is valid
      if (!link.isValid()) {
        return false
      }
      
      // Increment access count and save
      link.incrementAccessCount()
      await this._verificationLinkRepository.save(link)
      
      return true
    } catch (error) {
      if (error instanceof NotFoundError) {
        return false
      }
      throw error
    }
  }

  async invalidateToken(token: StringValue): Promise<boolean> {
    try {
      const link = await this._verificationLinkRepository.getByToken(token)
      
      link.invalidate()
      await this._verificationLinkRepository.save(link)
      
      return true
    } catch (error) {
      if (error instanceof NotFoundError) {
        return false
      }
      throw error
    }
  }
  
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }
} 