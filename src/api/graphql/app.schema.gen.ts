import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

export type ClientApiAuthResponse = {
  __typename?: 'ClientApiAuthResponse';
  accessToken: Scalars['String']['output'];
};

export type Company = {
  __typename?: 'Company';
  apiKey?: Maybe<Scalars['String']['output']>;
  callbackUrl?: Maybe<Scalars['String']['output']>;
  companyName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
};

export type CreateKycVerificationInput = {
  assignToUserId?: InputMaybe<Scalars['ID']['input']>;
  companyId: Scalars['ID']['input'];
  externalReferenceId?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  personInfo?: InputMaybe<KycPersonInput>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  riskLevel?: InputMaybe<Scalars['String']['input']>;
  verificationType: KycVerificationType;
};

export type CreateUserInput = {
  assignedGroups: Array<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type CreateVerificationLinkInput = {
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  verificationId: Scalars['String']['input'];
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  users?: Maybe<Array<Maybe<User>>>;
};

export type KycPerson = {
  __typename?: 'KycPerson';
  address?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  documentNumber?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  nationality?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  verificationId: Scalars['ID']['output'];
};

export type KycPersonInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  documentNumber?: InputMaybe<Scalars['String']['input']>;
  documentType?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type KycVerification = {
  __typename?: 'KycVerification';
  assignedTo?: Maybe<Scalars['ID']['output']>;
  assignedUser?: Maybe<User>;
  company?: Maybe<Company>;
  companyId: Scalars['ID']['output'];
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  externalReferenceId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kycPerson?: Maybe<KycPerson>;
  notes?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  riskLevel?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  verificationType: Scalars['String']['output'];
};

export enum KycVerificationStatus {
  Approved = 'APPROVED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  RequiresReview = 'REQUIRES_REVIEW'
}

export enum KycVerificationType {
  Address = 'ADDRESS',
  Aml = 'AML',
  Complete = 'COMPLETE',
  Document = 'DOCUMENT',
  Face = 'FACE',
  Identity = 'IDENTITY'
}

export type Mutation = {
  __typename?: 'Mutation';
  assignKycVerification: Scalars['Boolean']['output'];
  createKycVerification: KycVerification;
  createUser?: Maybe<User>;
  createVerificationLink: VerificationLink;
  invalidateVerificationLink: Scalars['Boolean']['output'];
  recordVerificationLinkAccess: VerificationLink;
  updateKycVerificationStatus: Scalars['Boolean']['output'];
  updateUserPersonalInfo?: Maybe<Scalars['Boolean']['output']>;
  updateVerificationLinkStatus: VerificationLink;
  validateVerificationLink: Scalars['Boolean']['output'];
};


export type MutationAssignKycVerificationArgs = {
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateKycVerificationArgs = {
  input: CreateKycVerificationInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateVerificationLinkArgs = {
  input: CreateVerificationLinkInput;
};


export type MutationInvalidateVerificationLinkArgs = {
  token: Scalars['String']['input'];
};


export type MutationRecordVerificationLinkAccessArgs = {
  token: Scalars['String']['input'];
};


export type MutationUpdateKycVerificationStatusArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status: KycVerificationStatus;
};


export type MutationUpdateUserPersonalInfoArgs = {
  input: UpdateUserPersonalInfoInput;
};


export type MutationUpdateVerificationLinkStatusArgs = {
  status: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationValidateVerificationLinkArgs = {
  token: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  assignedKycVerifications?: Maybe<Array<KycVerification>>;
  authWithCredentials: ClientApiAuthResponse;
  getVerificationLinkById: VerificationLink;
  getVerificationLinkByToken: VerificationLink;
  getVerificationLinksByVerificationId: Array<VerificationLink>;
  kycVerification?: Maybe<KycVerification>;
  kycVerificationByExternalId?: Maybe<KycVerification>;
  kycVerifications?: Maybe<Array<KycVerification>>;
  pendingKycVerifications?: Maybe<Array<KycVerification>>;
  test: Scalars['String']['output'];
  user: User;
  usersByGroup?: Maybe<Array<User>>;
};


export type QueryAssignedKycVerificationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryAuthWithCredentialsArgs = {
  email: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetVerificationLinkByIdArgs = {
  verificationLinkId: Scalars['String']['input'];
};


export type QueryGetVerificationLinkByTokenArgs = {
  token: Scalars['String']['input'];
};


export type QueryGetVerificationLinksByVerificationIdArgs = {
  verificationId: Scalars['String']['input'];
};


export type QueryKycVerificationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryKycVerificationByExternalIdArgs = {
  companyId: Scalars['ID']['input'];
  externalReferenceId: Scalars['String']['input'];
};


export type QueryKycVerificationsArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersByGroupArgs = {
  groupId: Scalars['String']['input'];
};

export type UpdateUserPersonalInfoInput = {
  curp: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  rfc: Scalars['String']['input'];
  secondLastName?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  secondLastName?: Maybe<Scalars['String']['output']>;
};

export type VerificationLink = {
  __typename?: 'VerificationLink';
  accessCount: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  expiresAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kycVerification?: Maybe<KycVerification>;
  lastAccessedAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  token: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  verificationId: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ClientApiAuthResponse: ResolverTypeWrapper<ClientApiAuthResponse>;
  Company: ResolverTypeWrapper<Company>;
  CreateKycVerificationInput: CreateKycVerificationInput;
  CreateUserInput: CreateUserInput;
  CreateVerificationLinkInput: CreateVerificationLinkInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Group: ResolverTypeWrapper<Group>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  KycPerson: ResolverTypeWrapper<KycPerson>;
  KycPersonInput: KycPersonInput;
  KycVerification: ResolverTypeWrapper<KycVerification>;
  KycVerificationStatus: KycVerificationStatus;
  KycVerificationType: KycVerificationType;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateUserPersonalInfoInput: UpdateUserPersonalInfoInput;
  User: ResolverTypeWrapper<User>;
  VerificationLink: ResolverTypeWrapper<VerificationLink>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  ClientApiAuthResponse: ClientApiAuthResponse;
  Company: Company;
  CreateKycVerificationInput: CreateKycVerificationInput;
  CreateUserInput: CreateUserInput;
  CreateVerificationLinkInput: CreateVerificationLinkInput;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  Group: Group;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  KycPerson: KycPerson;
  KycPersonInput: KycPersonInput;
  KycVerification: KycVerification;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  UpdateUserPersonalInfoInput: UpdateUserPersonalInfoInput;
  User: User;
  VerificationLink: VerificationLink;
};

export type ClientApiAuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClientApiAuthResponse'] = ResolversParentTypes['ClientApiAuthResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  apiKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  callbackUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  companyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KycPersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycPerson'] = ResolversParentTypes['KycPerson']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateOfBirth?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documentNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documentType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nationality?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verificationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KycVerificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycVerification'] = ResolversParentTypes['KycVerification']> = {
  assignedTo?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  assignedUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalReferenceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kycPerson?: Resolver<Maybe<ResolversTypes['KycPerson']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  riskLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verificationType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assignKycVerification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAssignKycVerificationArgs, 'id' | 'userId'>>;
  createKycVerification?: Resolver<ResolversTypes['KycVerification'], ParentType, ContextType, RequireFields<MutationCreateKycVerificationArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createVerificationLink?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<MutationCreateVerificationLinkArgs, 'input'>>;
  invalidateVerificationLink?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationInvalidateVerificationLinkArgs, 'token'>>;
  recordVerificationLinkAccess?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<MutationRecordVerificationLinkAccessArgs, 'token'>>;
  updateKycVerificationStatus?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateKycVerificationStatusArgs, 'id' | 'status'>>;
  updateUserPersonalInfo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserPersonalInfoArgs, 'input'>>;
  updateVerificationLinkStatus?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<MutationUpdateVerificationLinkStatusArgs, 'status' | 'token'>>;
  validateVerificationLink?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationValidateVerificationLinkArgs, 'token'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  assignedKycVerifications?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType, RequireFields<QueryAssignedKycVerificationsArgs, 'userId'>>;
  authWithCredentials?: Resolver<ResolversTypes['ClientApiAuthResponse'], ParentType, ContextType, RequireFields<QueryAuthWithCredentialsArgs, 'email'>>;
  getVerificationLinkById?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<QueryGetVerificationLinkByIdArgs, 'verificationLinkId'>>;
  getVerificationLinkByToken?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<QueryGetVerificationLinkByTokenArgs, 'token'>>;
  getVerificationLinksByVerificationId?: Resolver<Array<ResolversTypes['VerificationLink']>, ParentType, ContextType, RequireFields<QueryGetVerificationLinksByVerificationIdArgs, 'verificationId'>>;
  kycVerification?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType, RequireFields<QueryKycVerificationArgs, 'id'>>;
  kycVerificationByExternalId?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType, RequireFields<QueryKycVerificationByExternalIdArgs, 'companyId' | 'externalReferenceId'>>;
  kycVerifications?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType, Partial<QueryKycVerificationsArgs>>;
  pendingKycVerifications?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType>;
  test?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  usersByGroup?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryUsersByGroupArgs, 'groupId'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  groups?: Resolver<Maybe<Array<Maybe<ResolversTypes['Group']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secondLastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerificationLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerificationLink'] = ResolversParentTypes['VerificationLink']> = {
  accessCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kycVerification?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType>;
  lastAccessedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verificationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ClientApiAuthResponse?: ClientApiAuthResponseResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Group?: GroupResolvers<ContextType>;
  KycPerson?: KycPersonResolvers<ContextType>;
  KycVerification?: KycVerificationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VerificationLink?: VerificationLinkResolvers<ContextType>;
};

