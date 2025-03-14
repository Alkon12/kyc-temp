/**
 * UserEntity Unit Tests
 */
import { UserEntity } from './UserEntity';
import { UserId } from './UserId';
import { StringValue } from '@domain/shared/StringValue';
import { Email } from '@domain/shared/Email';
import { PhoneNumber } from '@domain/shared/PhoneNumber';
import { DateTimeValue } from '@domain/shared/DateTime';
import { UserGroupEntity } from './UserGroupEntity';
import { AccountEntity } from './AccountEntity';

describe('UserEntity', () => {
  // Test data setup
  const mockId = new UserId(); // Without an argument, it will generate a valid UUID automatically
  const mockFirstName = new StringValue('John');
  const mockLastName = new StringValue('Doe');
  const mockEmail = new Email('john.doe@example.com');
  const mockPhoneNumber = new PhoneNumber('+1234567890');
  const mockPicture = new StringValue('https://example.com/profile.jpg');
  const mockHashedPassword = new StringValue('hashedPassword123');
  const mockCreatedAt = new DateTimeValue(new Date());
  const mockGroups: UserGroupEntity[] = [];
  const mockAccounts: AccountEntity[] = [];

  test('should create a user entity with all properties', () => {
    // Arrange & Act
    const user = new UserEntity({
      id: mockId,
      firstName: mockFirstName,
      lastName: mockLastName,
      email: mockEmail,
      phoneNumber: mockPhoneNumber,
      picture: mockPicture,
      hashedPassword: mockHashedPassword,
      createdAt: mockCreatedAt,
      groups: mockGroups,
      accounts: mockAccounts
    });

    // Assert
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.getId()).toBe(mockId);
    expect(user.getFirstName()).toBe(mockFirstName);
    expect(user.getLastName()).toBe(mockLastName);
    expect(user.getEmail()).toBe(mockEmail);
    expect(user.getPhoneNumber()).toBe(mockPhoneNumber);
    expect(user.getPicture()).toBe(mockPicture);
    expect(user.getHashedPassword()).toBe(mockHashedPassword);
    expect(user.getGroups()).toBe(mockGroups);
    expect(user.getAccounts()).toBe(mockAccounts);
  });

  test('should create a user entity with only required properties', () => {
    // Arrange & Act
    const user = new UserEntity({
      id: mockId,
      groups: mockGroups,
      accounts: mockAccounts
    });

    // Assert
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.getId()).toBe(mockId);
    expect(user.getGroups()).toBe(mockGroups);
    expect(user.getAccounts()).toBe(mockAccounts);
    expect(user.getFirstName()).toBeUndefined();
    expect(user.getLastName()).toBeUndefined();
    expect(user.getEmail()).toBeUndefined();
    expect(user.getPhoneNumber()).toBeUndefined();
    expect(user.getPicture()).toBeUndefined();
    expect(user.getHashedPassword()).toBeUndefined();
  });

  test('all getter methods return correct values', () => {
    // Arrange
    const user = new UserEntity({
      id: mockId,
      firstName: mockFirstName,
      lastName: mockLastName,
      email: mockEmail,
      phoneNumber: mockPhoneNumber,
      picture: mockPicture,
      hashedPassword: mockHashedPassword,
      groups: mockGroups,
      accounts: mockAccounts
    });

    // Act & Assert
    expect(user.getId()).toBe(mockId);
    expect(user.getFirstName()).toBe(mockFirstName);
    expect(user.getLastName()).toBe(mockLastName);
    expect(user.getEmail()).toBe(mockEmail);
    expect(user.getPhoneNumber()).toBe(mockPhoneNumber);
    expect(user.getPicture()).toBe(mockPicture);
    expect(user.getHashedPassword()).toBe(mockHashedPassword);
    expect(user.getGroups()).toBe(mockGroups);
    expect(user.getAccounts()).toBe(mockAccounts);
  });
});
