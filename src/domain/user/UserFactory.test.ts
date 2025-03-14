/**
 * UserFactory Unit Tests
 */
import { UserFactory } from './UserFactory';
import { UserEntity } from './models/UserEntity';
import { StringValue } from '@domain/shared/StringValue';
import { Email } from '@domain/shared/Email';
import { DateTimeValue } from '@domain/shared/DateTime';
import { UserId } from './models/UserId';
import { PhoneNumber } from '@domain/shared/PhoneNumber';

describe('UserFactory', () => {
  describe('create method', () => {
    test('should create a new UserEntity with minimum required fields', () => {
      // Act
      const result = UserFactory.create({});

      // Assert
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.getId()).toBeInstanceOf(UserId);
      expect(result.getGroups()).toEqual([]);
      expect(result.getAccounts()).toEqual([]);
      expect(result.getFirstName()).toBeUndefined();
      expect(result.getLastName()).toBeUndefined();
      expect(result.getEmail()).toBeUndefined();
    });

    test('should create a new UserEntity with all provided fields', () => {
      // Arrange
      // Cannot directly pass UserId to id param as it expects UUID type
      // Will rely on the auto-generation instead
      const mockFirstName = new StringValue('John');
      const mockLastName = new StringValue('Doe');
      const mockEmail = new Email('john.doe@example.com');
      const mockPhoneNumber = new PhoneNumber('+1234567890');
      const mockPicture = new StringValue('https://example.com/profile.jpg');
      const mockPassword = new StringValue('hashedPassword123');
      const mockDate = new DateTimeValue(new Date());

      // Act
      const result = UserFactory.create({
        // Removing id parameter as it's not type-compatible 
        firstName: mockFirstName,
        lastName: mockLastName,
        email: mockEmail,
        phoneNumber: mockPhoneNumber,
        picture: mockPicture,
        hashedPassword: mockPassword,
        createdAt: mockDate
      });

      // Assert
      expect(result).toBeInstanceOf(UserEntity);
      // Now we check against instance types instead of direct value equality
      expect(result.getId()).toBeInstanceOf(UserId);
      expect(result.getFirstName()).toBe(mockFirstName);
      expect(result.getLastName()).toBe(mockLastName);
      expect(result.getEmail()).toBe(mockEmail);
      expect(result.getPhoneNumber()).toBe(mockPhoneNumber);
      expect(result.getPicture()).toBe(mockPicture);
      expect(result.getHashedPassword()).toBe(mockPassword);
      // No getCreatedAt method in UserEntity class, access through props instead
      // Need to verify the date using toDTO() since these are different objects
      // We know createdAt is defined because we create it in UserFactory.create
      expect(result.props.createdAt!.toDTO()).toEqual(mockDate.toDTO());
      expect(result.getGroups()).toEqual([]);
      expect(result.getAccounts()).toEqual([]);
    });
  });

  describe('fromDTO method', () => {
    test('should convert DTO to UserEntity with all fields', () => {
      // Arrange
      // Use toDTO() instead of accessing .value directly
      const userId = new UserId().toDTO();
      const now = new Date().toISOString();
      const dto = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        picture: 'https://example.com/profile.jpg',
        hashedPassword: 'hashedPassword123',
        createdAt: now,
        updatedAt: now,
        emailVerified: now,
        groups: [],
        accounts: []
      };

      // Act
      const result = UserFactory.fromDTO(dto);

      // Assert
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.getId().toDTO()).toBe(userId);
      expect(result.getFirstName()?.toDTO()).toBe('John');
      expect(result.getLastName()?.toDTO()).toBe('Doe');
      expect(result.getEmail()?.toDTO()).toBe('john.doe@example.com');
      // PhoneNumber reformats the number, so we need to expect the formatted version
      expect(result.getPhoneNumber()?.toDTO()).toEqual('+1 234567890');
      expect(result.getPicture()?.toDTO()).toBe('https://example.com/profile.jpg');
      expect(result.getHashedPassword()?.toDTO()).toBe('hashedPassword123');
      // Check date properties through props since there are no getter methods
      // Using toDTO() to get the ISO string representation of the date
      expect(result.props.createdAt?.toDTO()).toEqual(now);
      expect(result.props.updatedAt?.toDTO()).toEqual(now);
      expect(result.props.emailVerified?.toDTO()).toEqual(now);
      expect(result.getGroups()).toEqual([]);
      expect(result.getAccounts()).toEqual([]);
    });

    test('should handle undefined optional fields in DTO', () => {
      // Arrange
      const userId = new UserId().toDTO(); // Use toDTO() instead of direct value access
      const dto = {
        id: userId,
        groups: [],
        accounts: []
      };

      // Act
      const result = UserFactory.fromDTO(dto);

      // Assert
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.getId().toDTO()).toBe(userId); // Use toDTO() for comparison
      expect(result.getFirstName()).toBeUndefined();
      expect(result.getLastName()).toBeUndefined();
      expect(result.getEmail()).toBeUndefined();
      expect(result.getPhoneNumber()).toBeUndefined();
      expect(result.getPicture()).toBeUndefined();
      expect(result.getHashedPassword()).toBeUndefined();
      expect(result.getGroups()).toEqual([]);
      expect(result.getAccounts()).toEqual([]);
    });
  });
});
