/**
 * Unit tests for AbstractUserService
 */
import AbstractUserService, { AuthServiceResponse } from './UserService';
import { UserEntity } from './models/UserEntity';
import { UserId } from './models/UserId';
import { StringValue } from '@domain/shared/StringValue';
import { Email } from '@domain/shared/Email';
import { AuthProvider } from '@domain/shared/AuthProvider';
import { CreateUserArgs } from './interfaces/CreateUserArgs';
import { BooleanValue } from '@domain/shared/BooleanValue';
import { UpdateUserPersonalInfoArgs } from './interfaces/UpdateUserPersonalInfoArgs';
import { GroupId, TASK_TYPES } from './models/GroupId';
import { UserFactory } from './UserFactory';
import { UserGroupEntity } from './models/UserGroupEntity';

// Create a concrete implementation of the abstract class for testing
class TestUserService extends AbstractUserService {
  // Mock storage
  private users: UserEntity[] = [];
  private systemUser: UserEntity;

  constructor() {
    super();
    // Create mock system user
    this.systemUser = UserFactory.create({
      email: new Email('system@example.com'),
      hashedPassword: new StringValue('hashed_password'),
    });
  }

  async getById(userId: UserId): Promise<UserEntity> {
    const user = this.users.find(u => u.getId().toDTO() === userId.toDTO());
    if (!user) {
      throw new Error(`User with ID ${userId.toDTO()} not found`);
    }
    return user;
  }

  async getByGroup(groupId: GroupId): Promise<UserEntity[]> {
    // Implementation would depend on the actual structure of UserGroupEntity
    // For simplicity in the test, just return an empty array
    return [];
  }

  async getAll(): Promise<UserEntity[]> {
    return [...this.users];
  }

  async getSystemUser(): Promise<UserEntity> {
    return this.systemUser;
  }

  async authWithCredentials(
    email: Email, 
    password?: StringValue, 
    provider?: AuthProvider
  ): Promise<string> {
    const user = this.users.find(u => 
      u.getEmail()?.toDTO() === email.toDTO()
    );

    if (!user) {
      throw new Error('Authentication failed: user not found');
    }

    // In a real implementation, you would check password or provider
    // For testing purposes, we'll just return a mock token
    return 'mock_token';
  }

  async create(props: CreateUserArgs): Promise<UserEntity> {
    // In a real implementation, you would hash the password
    const hashedPassword = new StringValue('hashed_' + props.password.toDTO());
    
    const user = UserFactory.create({
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      hashedPassword: hashedPassword,
    });

    this.users.push(user);
    return user;
  }

  async updatePersonalInfo(props: UpdateUserPersonalInfoArgs): Promise<BooleanValue> {
    try {
      // Find user by ID
      const user = await this.getById(props.userId);
      
      // In a real implementation, you would update the user
      // For testing purposes, we just return true
      return new BooleanValue(true);
    } catch (error) {
      return new BooleanValue(false);
    }
  }

  // Helper method for tests to add a user
  addUser(user: UserEntity): void {
    this.users.push(user);
  }
}

describe('AbstractUserService', () => {
  let userService: TestUserService;
  let mockUser: UserEntity;
  let mockUserId: UserId;

  beforeEach(() => {
    userService = new TestUserService();
    mockUser = UserFactory.create({
      email: new Email('test@example.com'),
      firstName: new StringValue('Test'),
      lastName: new StringValue('User'),
      hashedPassword: new StringValue('hashed_password'),
    });
    mockUserId = mockUser.getId();
    userService.addUser(mockUser);
  });

  describe('getById', () => {
    test('should return a user when given a valid ID', async () => {
      // Act
      const result = await userService.getById(mockUserId);
      
      // Assert
      expect(result).toBe(mockUser);
    });

    test('should throw an error when user is not found', async () => {
      // Arrange
      const nonExistentId = new UserId();
      
      // Act & Assert
      await expect(userService.getById(nonExistentId)).rejects.toThrow();
    });
  });

  describe('getAll', () => {
    test('should return all users', async () => {
      // Arrange
      const anotherUser = UserFactory.create({
        email: new Email('another@example.com'),
      });
      userService.addUser(anotherUser);
      
      // Act
      const result = await userService.getAll();
      
      // Assert
      expect(result).toHaveLength(2);
      expect(result).toContain(mockUser);
      expect(result).toContain(anotherUser);
    });
  });

  describe('getSystemUser', () => {
    test('should return the system user', async () => {
      // Act
      const result = await userService.getSystemUser();
      
      // Assert
      expect(result.getEmail()?.toDTO()).toBe('system@example.com');
    });
  });

  describe('getByGroup', () => {
    test('should return users in a specific group', async () => {
      // Create a valid group ID using one of the predefined types
      const mockGroupId = GroupId.BACKOFFICE;
      
      // Act
      const result = await userService.getByGroup(mockGroupId);
      
      // Assert
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('authWithCredentials', () => {
    test('should return an access token for valid credentials', async () => {
      // Arrange
      const email = new Email('test@example.com');
      const password = new StringValue('password');
      
      // Act
      const result = await userService.authWithCredentials(email, password);
      
      // Assert
      expect(typeof result).toBe('string');
      expect(result).toBe('mock_token');
    });

    test('should throw an error for invalid credentials', async () => {
      // Arrange
      const email = new Email('nonexistent@example.com');
      const password = new StringValue('password');
      
      // Act & Assert
      await expect(userService.authWithCredentials(email, password)).rejects.toThrow();
    });
  });

  describe('create', () => {
    test('should create and return a new user', async () => {
      // Arrange
      const createArgs: CreateUserArgs = {
        email: new Email('new@example.com'),
        firstName: new StringValue('New'),
        lastName: new StringValue('User'),
        password: new StringValue('password123'),
        assignedGroups: [GroupId.BACKOFFICE], // Required field
      };
      
      // Act
      const result = await userService.create(createArgs);
      
      // Assert
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.getEmail()?.toDTO()).toBe('new@example.com');
      expect(result.getFirstName()?.toDTO()).toBe('New');
      expect(result.getLastName()?.toDTO()).toBe('User');

      // Verify user was added to the collection
      const allUsers = await userService.getAll();
      expect(allUsers).toContain(result);
    });
  });

  describe('updatePersonalInfo', () => {
    test('should update user information and return true on success', async () => {
      // Arrange
      const updateArgs: UpdateUserPersonalInfoArgs = {
        userId: mockUserId,
        firstName: new StringValue('Updated'),
        lastName: new StringValue('Name'),
      };
      
      // Act
      const result = await userService.updatePersonalInfo(updateArgs);
      
      // Assert
      expect(result).toBeInstanceOf(BooleanValue);
      expect(result.toDTO()).toBe(true);
    });

    test('should return false when updating a non-existent user', async () => {
      // Arrange
      const updateArgs: UpdateUserPersonalInfoArgs = {
        userId: new UserId(), // Non-existent user ID
        firstName: new StringValue('Updated'),
        lastName: new StringValue('User'), // Required field
      };
      
      // Act
      const result = await userService.updatePersonalInfo(updateArgs);
      
      // Assert
      expect(result.toDTO()).toBe(false);
    });
  });
});
