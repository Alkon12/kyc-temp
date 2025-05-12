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
  JSON: { input: any; output: any; }
};

export type ActivityLog = {
  __typename?: 'ActivityLog';
  actionType: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kycVerification?: Maybe<KycVerification>;
  performedBy?: Maybe<Scalars['ID']['output']>;
  performer?: Maybe<User>;
  verificationId: Scalars['ID']['output'];
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

export type CompanyStats = {
  __typename?: 'CompanyStats';
  approved: Scalars['Int']['output'];
  companyId: Scalars['ID']['output'];
  companyName: Scalars['String']['output'];
  pending: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type CreateCompanyInput = {
  apiKey?: InputMaybe<Scalars['String']['input']>;
  callbackUrl?: InputMaybe<Scalars['String']['input']>;
  companyName: Scalars['String']['input'];
};

export type CreateExternalVerificationInput = {
  provider: Scalars['String']['input'];
  requestData?: InputMaybe<Scalars['JSON']['input']>;
  responseData?: InputMaybe<Scalars['JSON']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  verificationId: Scalars['ID']['input'];
  verificationType: ExternalVerificationType;
};

export type CreateFacetecResultInput = {
  enrollmentStatus: Scalars['String']['input'];
  fullResponse?: InputMaybe<Scalars['JSON']['input']>;
  livenessStatus: Scalars['String']['input'];
  manualReviewRequired: Scalars['Boolean']['input'];
  matchLevel?: InputMaybe<Scalars['Float']['input']>;
  sessionId: Scalars['String']['input'];
  verificationId: Scalars['String']['input'];
};

export type CreateKycPersonInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  documentNumber?: InputMaybe<Scalars['String']['input']>;
  documentType?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  verificationId: Scalars['ID']['input'];
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

export type Document = {
  __typename?: 'Document';
  createdAt: Scalars['DateTime']['output'];
  documentType: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  filePath: Scalars['String']['output'];
  fileSize?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  kycVerification?: Maybe<KycVerification>;
  mimeType?: Maybe<Scalars['String']['output']>;
  ocrData?: Maybe<Scalars['JSON']['output']>;
  reviewNotes?: Maybe<Scalars['String']['output']>;
  reviewer?: Maybe<User>;
  reviewerId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  verificationId: Scalars['String']['output'];
  verificationStatus: Scalars['String']['output'];
};

export type ExternalVerification = {
  __typename?: 'ExternalVerification';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kycVerification?: Maybe<KycVerification>;
  provider: Scalars['String']['output'];
  requestData?: Maybe<Scalars['JSON']['output']>;
  responseData?: Maybe<Scalars['JSON']['output']>;
  status: Scalars['String']['output'];
  verificationId: Scalars['ID']['output'];
  verificationType: Scalars['String']['output'];
};

export enum ExternalVerificationType {
  Address = 'ADDRESS',
  Aml = 'AML',
  Biometric = 'BIOMETRIC',
  Document = 'DOCUMENT',
  Identity = 'IDENTITY'
}

export type FacetecResult = {
  __typename?: 'FacetecResult';
  createdAt: Scalars['DateTime']['output'];
  enrollmentStatus: Scalars['String']['output'];
  fullResponse?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  kycVerification?: Maybe<KycVerification>;
  livenessStatus: Scalars['String']['output'];
  manualReviewRequired: Scalars['Boolean']['output'];
  matchLevel?: Maybe<Scalars['Float']['output']>;
  sessionId: Scalars['String']['output'];
  verificationId: Scalars['String']['output'];
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

export type KycVerificationStats = {
  __typename?: 'KycVerificationStats';
  approved: Scalars['Int']['output'];
  byCompany?: Maybe<Array<CompanyStats>>;
  byType?: Maybe<Array<TypeStats>>;
  inProgress: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  recentActivity?: Maybe<Array<KycVerification>>;
  rejected: Scalars['Int']['output'];
  requiresReview: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum KycVerificationStatus {
  Approved = 'APPROVED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  RequiresReview = 'REQUIRES_REVIEW'
}

export enum KycVerificationType {
  Bronze = 'BRONZE',
  Gold = 'GOLD',
  Silver = 'SILVER'
}

export type KycVerificationWithRelations = {
  __typename?: 'KycVerificationWithRelations';
  activityLogs?: Maybe<Array<ActivityLog>>;
  assignedTo?: Maybe<Scalars['ID']['output']>;
  assignedUser?: Maybe<User>;
  company?: Maybe<Company>;
  companyId: Scalars['ID']['output'];
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Array<Document>>;
  externalReferenceId?: Maybe<Scalars['String']['output']>;
  externalVerifications?: Maybe<Array<ExternalVerification>>;
  facetecResults?: Maybe<Array<FacetecResult>>;
  id: Scalars['ID']['output'];
  kycPersons?: Maybe<Array<KycPerson>>;
  notes?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  riskLevel?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  verificationLinks?: Maybe<Array<VerificationLink>>;
  verificationType: Scalars['String']['output'];
  verificationWorkflows?: Maybe<Array<VerificationWorkflow>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignDocumentReviewer: Document;
  assignKycVerification: Scalars['Boolean']['output'];
  createCompany: Company;
  createExternalVerification: ExternalVerification;
  createFacetecResult: FacetecResult;
  createKycPerson: KycPerson;
  createKycVerification: KycVerification;
  createUser?: Maybe<User>;
  createVerificationLink: VerificationLink;
  deleteCompany: Scalars['Boolean']['output'];
  deleteDocument: Scalars['Boolean']['output'];
  deleteExternalVerification: Scalars['Boolean']['output'];
  generateCompanyApiKey: Company;
  invalidateVerificationLink: Scalars['Boolean']['output'];
  recordVerificationLinkAccess: VerificationLink;
  updateCompany: Company;
  updateCompanyStatus: Company;
  updateDocumentOcrData: Document;
  updateDocumentStatus: Document;
  updateExternalVerificationRequest: Scalars['Boolean']['output'];
  updateExternalVerificationResponse: Scalars['Boolean']['output'];
  updateExternalVerificationStatus: Scalars['Boolean']['output'];
  updateFacetecResult: FacetecResult;
  updateKycPerson: KycPerson;
  updateKycPersonContactByToken: KycPerson;
  updateKycVerificationStatus: Scalars['Boolean']['output'];
  updateUserPersonalInfo?: Maybe<Scalars['Boolean']['output']>;
  updateVerificationLinkStatus: VerificationLink;
  validateVerificationLink: Scalars['Boolean']['output'];
};


export type MutationAssignDocumentReviewerArgs = {
  documentId: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  reviewerId: Scalars['String']['input'];
};


export type MutationAssignKycVerificationArgs = {
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateExternalVerificationArgs = {
  input: CreateExternalVerificationInput;
};


export type MutationCreateFacetecResultArgs = {
  input: CreateFacetecResultInput;
};


export type MutationCreateKycPersonArgs = {
  input: CreateKycPersonInput;
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


export type MutationDeleteCompanyArgs = {
  companyId: Scalars['ID']['input'];
};


export type MutationDeleteDocumentArgs = {
  documentId: Scalars['String']['input'];
};


export type MutationDeleteExternalVerificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGenerateCompanyApiKeyArgs = {
  companyId: Scalars['ID']['input'];
};


export type MutationInvalidateVerificationLinkArgs = {
  token: Scalars['String']['input'];
};


export type MutationRecordVerificationLinkAccessArgs = {
  token: Scalars['String']['input'];
};


export type MutationUpdateCompanyArgs = {
  companyId: Scalars['ID']['input'];
  input: UpdateCompanyInput;
};


export type MutationUpdateCompanyStatusArgs = {
  companyId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateDocumentOcrDataArgs = {
  documentId: Scalars['String']['input'];
  ocrData: Scalars['JSON']['input'];
};


export type MutationUpdateDocumentStatusArgs = {
  documentId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateExternalVerificationRequestArgs = {
  id: Scalars['ID']['input'];
  requestData: Scalars['JSON']['input'];
};


export type MutationUpdateExternalVerificationResponseArgs = {
  id: Scalars['ID']['input'];
  responseData: Scalars['JSON']['input'];
};


export type MutationUpdateExternalVerificationStatusArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateFacetecResultArgs = {
  input: UpdateFacetecResultInput;
};


export type MutationUpdateKycPersonArgs = {
  id: Scalars['ID']['input'];
  input: UpdateKycPersonInput;
};


export type MutationUpdateKycPersonContactByTokenArgs = {
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
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
  externalVerification?: Maybe<ExternalVerification>;
  externalVerificationsByKycId?: Maybe<Array<ExternalVerification>>;
  getAllCompanies: Array<Company>;
  getCompanyById: Company;
  getDocumentById: Document;
  getDocumentsByReviewer: Array<Document>;
  getDocumentsByStatus: Array<Document>;
  getDocumentsByType: Array<Document>;
  getDocumentsByVerificationId: Array<Document>;
  getFacetecResultById: FacetecResult;
  getFacetecResultsByVerificationId: Array<FacetecResult>;
  getKycPersonById?: Maybe<KycPerson>;
  getVerificationLinkById: VerificationLink;
  getVerificationLinkByToken: VerificationLink;
  getVerificationLinksByVerificationId: Array<VerificationLink>;
  kycVerification?: Maybe<KycVerification>;
  kycVerificationByExternalId?: Maybe<KycVerification>;
  kycVerificationStats: KycVerificationStats;
  kycVerificationWithRelations?: Maybe<KycVerificationWithRelations>;
  kycVerificationWithRelationsById?: Maybe<KycVerificationWithRelations>;
  kycVerifications?: Maybe<Array<KycVerification>>;
  kycVerificationsByDate?: Maybe<Array<KycVerification>>;
  kycVerificationsByPriority?: Maybe<Array<KycVerification>>;
  kycVerificationsByStatus?: Maybe<Array<KycVerification>>;
  kycVerificationsWithRelations?: Maybe<Array<KycVerificationWithRelations>>;
  kycVerificationsWithRelationsByAssignee?: Maybe<Array<KycVerificationWithRelations>>;
  kycVerificationsWithRelationsByPriority?: Maybe<Array<KycVerificationWithRelations>>;
  kycVerificationsWithRelationsByStatus?: Maybe<Array<KycVerificationWithRelations>>;
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


export type QueryExternalVerificationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExternalVerificationsByKycIdArgs = {
  kycVerificationId: Scalars['ID']['input'];
};


export type QueryGetCompanyByIdArgs = {
  companyId: Scalars['ID']['input'];
};


export type QueryGetDocumentByIdArgs = {
  documentId: Scalars['String']['input'];
};


export type QueryGetDocumentsByReviewerArgs = {
  reviewerId: Scalars['String']['input'];
};


export type QueryGetDocumentsByStatusArgs = {
  status: Scalars['String']['input'];
};


export type QueryGetDocumentsByTypeArgs = {
  documentType: Scalars['String']['input'];
};


export type QueryGetDocumentsByVerificationIdArgs = {
  verificationId: Scalars['String']['input'];
};


export type QueryGetFacetecResultByIdArgs = {
  facetecResultId: Scalars['String']['input'];
};


export type QueryGetFacetecResultsByVerificationIdArgs = {
  verificationId: Scalars['String']['input'];
};


export type QueryGetKycPersonByIdArgs = {
  id: Scalars['ID']['input'];
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


export type QueryKycVerificationStatsArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryKycVerificationWithRelationsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryKycVerificationWithRelationsByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryKycVerificationsArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryKycVerificationsByDateArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};


export type QueryKycVerificationsByPriorityArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  priority: Scalars['Int']['input'];
};


export type QueryKycVerificationsByStatusArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  status: KycVerificationStatus;
};


export type QueryKycVerificationsWithRelationsArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryKycVerificationsWithRelationsByAssigneeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryKycVerificationsWithRelationsByPriorityArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  priority: Scalars['Int']['input'];
};


export type QueryKycVerificationsWithRelationsByStatusArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status: KycVerificationStatus;
};


export type QueryUsersByGroupArgs = {
  groupId: Scalars['String']['input'];
};

export type TypeStats = {
  __typename?: 'TypeStats';
  count: Scalars['Int']['output'];
  verificationType: Scalars['String']['output'];
};

export type UpdateCompanyInput = {
  apiKey?: InputMaybe<Scalars['String']['input']>;
  callbackUrl?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFacetecResultInput = {
  enrollmentStatus?: InputMaybe<Scalars['String']['input']>;
  fullResponse?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['String']['input'];
  livenessStatus?: InputMaybe<Scalars['String']['input']>;
  manualReviewRequired?: InputMaybe<Scalars['Boolean']['input']>;
  matchLevel?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateKycPersonInput = {
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

export type VerificationWorkflow = {
  __typename?: 'VerificationWorkflow';
  completedAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  kycVerification?: Maybe<KycVerification>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  startedAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  step: Scalars['String']['output'];
  verificationId: Scalars['ID']['output'];
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
  ActivityLog: ResolverTypeWrapper<ActivityLog>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ClientApiAuthResponse: ResolverTypeWrapper<ClientApiAuthResponse>;
  Company: ResolverTypeWrapper<Company>;
  CompanyStats: ResolverTypeWrapper<CompanyStats>;
  CreateCompanyInput: CreateCompanyInput;
  CreateExternalVerificationInput: CreateExternalVerificationInput;
  CreateFacetecResultInput: CreateFacetecResultInput;
  CreateKycPersonInput: CreateKycPersonInput;
  CreateKycVerificationInput: CreateKycVerificationInput;
  CreateUserInput: CreateUserInput;
  CreateVerificationLinkInput: CreateVerificationLinkInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Document: ResolverTypeWrapper<Document>;
  ExternalVerification: ResolverTypeWrapper<ExternalVerification>;
  ExternalVerificationType: ExternalVerificationType;
  FacetecResult: ResolverTypeWrapper<FacetecResult>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Group: ResolverTypeWrapper<Group>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  KycPerson: ResolverTypeWrapper<KycPerson>;
  KycPersonInput: KycPersonInput;
  KycVerification: ResolverTypeWrapper<KycVerification>;
  KycVerificationStats: ResolverTypeWrapper<KycVerificationStats>;
  KycVerificationStatus: KycVerificationStatus;
  KycVerificationType: KycVerificationType;
  KycVerificationWithRelations: ResolverTypeWrapper<KycVerificationWithRelations>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TypeStats: ResolverTypeWrapper<TypeStats>;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateFacetecResultInput: UpdateFacetecResultInput;
  UpdateKycPersonInput: UpdateKycPersonInput;
  UpdateUserPersonalInfoInput: UpdateUserPersonalInfoInput;
  User: ResolverTypeWrapper<User>;
  VerificationLink: ResolverTypeWrapper<VerificationLink>;
  VerificationWorkflow: ResolverTypeWrapper<VerificationWorkflow>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActivityLog: ActivityLog;
  Boolean: Scalars['Boolean']['output'];
  ClientApiAuthResponse: ClientApiAuthResponse;
  Company: Company;
  CompanyStats: CompanyStats;
  CreateCompanyInput: CreateCompanyInput;
  CreateExternalVerificationInput: CreateExternalVerificationInput;
  CreateFacetecResultInput: CreateFacetecResultInput;
  CreateKycPersonInput: CreateKycPersonInput;
  CreateKycVerificationInput: CreateKycVerificationInput;
  CreateUserInput: CreateUserInput;
  CreateVerificationLinkInput: CreateVerificationLinkInput;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  Document: Document;
  ExternalVerification: ExternalVerification;
  FacetecResult: FacetecResult;
  Float: Scalars['Float']['output'];
  Group: Group;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  KycPerson: KycPerson;
  KycPersonInput: KycPersonInput;
  KycVerification: KycVerification;
  KycVerificationStats: KycVerificationStats;
  KycVerificationWithRelations: KycVerificationWithRelations;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  TypeStats: TypeStats;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateFacetecResultInput: UpdateFacetecResultInput;
  UpdateKycPersonInput: UpdateKycPersonInput;
  UpdateUserPersonalInfoInput: UpdateUserPersonalInfoInput;
  User: User;
  VerificationLink: VerificationLink;
  VerificationWorkflow: VerificationWorkflow;
};

export type ActivityLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivityLog'] = ResolversParentTypes['ActivityLog']> = {
  actionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kycVerification?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType>;
  performedBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  performer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  verificationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type CompanyStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CompanyStats'] = ResolversParentTypes['CompanyStats']> = {
  approved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  companyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rejected?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  documentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kycVerification?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType>;
  mimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ocrData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  reviewNotes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviewer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  reviewerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verificationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verificationStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExternalVerificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExternalVerification'] = ResolversParentTypes['ExternalVerification']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kycVerification?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  responseData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verificationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  verificationType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacetecResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetecResult'] = ResolversParentTypes['FacetecResult']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  enrollmentStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fullResponse?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kycVerification?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType>;
  livenessStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  manualReviewRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  matchLevel?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verificationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

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

export type KycVerificationStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycVerificationStats'] = ResolversParentTypes['KycVerificationStats']> = {
  approved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  byCompany?: Resolver<Maybe<Array<ResolversTypes['CompanyStats']>>, ParentType, ContextType>;
  byType?: Resolver<Maybe<Array<ResolversTypes['TypeStats']>>, ParentType, ContextType>;
  inProgress?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recentActivity?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType>;
  rejected?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  requiresReview?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KycVerificationWithRelationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycVerificationWithRelations'] = ResolversParentTypes['KycVerificationWithRelations']> = {
  activityLogs?: Resolver<Maybe<Array<ResolversTypes['ActivityLog']>>, ParentType, ContextType>;
  assignedTo?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  assignedUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documents?: Resolver<Maybe<Array<ResolversTypes['Document']>>, ParentType, ContextType>;
  externalReferenceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalVerifications?: Resolver<Maybe<Array<ResolversTypes['ExternalVerification']>>, ParentType, ContextType>;
  facetecResults?: Resolver<Maybe<Array<ResolversTypes['FacetecResult']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kycPersons?: Resolver<Maybe<Array<ResolversTypes['KycPerson']>>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  riskLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verificationLinks?: Resolver<Maybe<Array<ResolversTypes['VerificationLink']>>, ParentType, ContextType>;
  verificationType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verificationWorkflows?: Resolver<Maybe<Array<ResolversTypes['VerificationWorkflow']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assignDocumentReviewer?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationAssignDocumentReviewerArgs, 'documentId' | 'reviewerId'>>;
  assignKycVerification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAssignKycVerificationArgs, 'id' | 'userId'>>;
  createCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationCreateCompanyArgs, 'input'>>;
  createExternalVerification?: Resolver<ResolversTypes['ExternalVerification'], ParentType, ContextType, RequireFields<MutationCreateExternalVerificationArgs, 'input'>>;
  createFacetecResult?: Resolver<ResolversTypes['FacetecResult'], ParentType, ContextType, RequireFields<MutationCreateFacetecResultArgs, 'input'>>;
  createKycPerson?: Resolver<ResolversTypes['KycPerson'], ParentType, ContextType, RequireFields<MutationCreateKycPersonArgs, 'input'>>;
  createKycVerification?: Resolver<ResolversTypes['KycVerification'], ParentType, ContextType, RequireFields<MutationCreateKycVerificationArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createVerificationLink?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<MutationCreateVerificationLinkArgs, 'input'>>;
  deleteCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCompanyArgs, 'companyId'>>;
  deleteDocument?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDocumentArgs, 'documentId'>>;
  deleteExternalVerification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteExternalVerificationArgs, 'id'>>;
  generateCompanyApiKey?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationGenerateCompanyApiKeyArgs, 'companyId'>>;
  invalidateVerificationLink?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationInvalidateVerificationLinkArgs, 'token'>>;
  recordVerificationLinkAccess?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<MutationRecordVerificationLinkAccessArgs, 'token'>>;
  updateCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationUpdateCompanyArgs, 'companyId' | 'input'>>;
  updateCompanyStatus?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationUpdateCompanyStatusArgs, 'companyId' | 'status'>>;
  updateDocumentOcrData?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationUpdateDocumentOcrDataArgs, 'documentId' | 'ocrData'>>;
  updateDocumentStatus?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<MutationUpdateDocumentStatusArgs, 'documentId' | 'status'>>;
  updateExternalVerificationRequest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateExternalVerificationRequestArgs, 'id' | 'requestData'>>;
  updateExternalVerificationResponse?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateExternalVerificationResponseArgs, 'id' | 'responseData'>>;
  updateExternalVerificationStatus?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateExternalVerificationStatusArgs, 'id' | 'status'>>;
  updateFacetecResult?: Resolver<ResolversTypes['FacetecResult'], ParentType, ContextType, RequireFields<MutationUpdateFacetecResultArgs, 'input'>>;
  updateKycPerson?: Resolver<ResolversTypes['KycPerson'], ParentType, ContextType, RequireFields<MutationUpdateKycPersonArgs, 'id' | 'input'>>;
  updateKycPersonContactByToken?: Resolver<ResolversTypes['KycPerson'], ParentType, ContextType, RequireFields<MutationUpdateKycPersonContactByTokenArgs, 'email' | 'phone' | 'token'>>;
  updateKycVerificationStatus?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateKycVerificationStatusArgs, 'id' | 'status'>>;
  updateUserPersonalInfo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserPersonalInfoArgs, 'input'>>;
  updateVerificationLinkStatus?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<MutationUpdateVerificationLinkStatusArgs, 'status' | 'token'>>;
  validateVerificationLink?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationValidateVerificationLinkArgs, 'token'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  assignedKycVerifications?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType, RequireFields<QueryAssignedKycVerificationsArgs, 'userId'>>;
  authWithCredentials?: Resolver<ResolversTypes['ClientApiAuthResponse'], ParentType, ContextType, RequireFields<QueryAuthWithCredentialsArgs, 'email'>>;
  externalVerification?: Resolver<Maybe<ResolversTypes['ExternalVerification']>, ParentType, ContextType, RequireFields<QueryExternalVerificationArgs, 'id'>>;
  externalVerificationsByKycId?: Resolver<Maybe<Array<ResolversTypes['ExternalVerification']>>, ParentType, ContextType, RequireFields<QueryExternalVerificationsByKycIdArgs, 'kycVerificationId'>>;
  getAllCompanies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  getCompanyById?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<QueryGetCompanyByIdArgs, 'companyId'>>;
  getDocumentById?: Resolver<ResolversTypes['Document'], ParentType, ContextType, RequireFields<QueryGetDocumentByIdArgs, 'documentId'>>;
  getDocumentsByReviewer?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryGetDocumentsByReviewerArgs, 'reviewerId'>>;
  getDocumentsByStatus?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryGetDocumentsByStatusArgs, 'status'>>;
  getDocumentsByType?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryGetDocumentsByTypeArgs, 'documentType'>>;
  getDocumentsByVerificationId?: Resolver<Array<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryGetDocumentsByVerificationIdArgs, 'verificationId'>>;
  getFacetecResultById?: Resolver<ResolversTypes['FacetecResult'], ParentType, ContextType, RequireFields<QueryGetFacetecResultByIdArgs, 'facetecResultId'>>;
  getFacetecResultsByVerificationId?: Resolver<Array<ResolversTypes['FacetecResult']>, ParentType, ContextType, RequireFields<QueryGetFacetecResultsByVerificationIdArgs, 'verificationId'>>;
  getKycPersonById?: Resolver<Maybe<ResolversTypes['KycPerson']>, ParentType, ContextType, RequireFields<QueryGetKycPersonByIdArgs, 'id'>>;
  getVerificationLinkById?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<QueryGetVerificationLinkByIdArgs, 'verificationLinkId'>>;
  getVerificationLinkByToken?: Resolver<ResolversTypes['VerificationLink'], ParentType, ContextType, RequireFields<QueryGetVerificationLinkByTokenArgs, 'token'>>;
  getVerificationLinksByVerificationId?: Resolver<Array<ResolversTypes['VerificationLink']>, ParentType, ContextType, RequireFields<QueryGetVerificationLinksByVerificationIdArgs, 'verificationId'>>;
  kycVerification?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType, RequireFields<QueryKycVerificationArgs, 'id'>>;
  kycVerificationByExternalId?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType, RequireFields<QueryKycVerificationByExternalIdArgs, 'companyId' | 'externalReferenceId'>>;
  kycVerificationStats?: Resolver<ResolversTypes['KycVerificationStats'], ParentType, ContextType, Partial<QueryKycVerificationStatsArgs>>;
  kycVerificationWithRelations?: Resolver<Maybe<ResolversTypes['KycVerificationWithRelations']>, ParentType, ContextType, RequireFields<QueryKycVerificationWithRelationsArgs, 'id'>>;
  kycVerificationWithRelationsById?: Resolver<Maybe<ResolversTypes['KycVerificationWithRelations']>, ParentType, ContextType, RequireFields<QueryKycVerificationWithRelationsByIdArgs, 'id'>>;
  kycVerifications?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType, Partial<QueryKycVerificationsArgs>>;
  kycVerificationsByDate?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType, RequireFields<QueryKycVerificationsByDateArgs, 'endDate' | 'startDate'>>;
  kycVerificationsByPriority?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType, RequireFields<QueryKycVerificationsByPriorityArgs, 'priority'>>;
  kycVerificationsByStatus?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType, RequireFields<QueryKycVerificationsByStatusArgs, 'status'>>;
  kycVerificationsWithRelations?: Resolver<Maybe<Array<ResolversTypes['KycVerificationWithRelations']>>, ParentType, ContextType, Partial<QueryKycVerificationsWithRelationsArgs>>;
  kycVerificationsWithRelationsByAssignee?: Resolver<Maybe<Array<ResolversTypes['KycVerificationWithRelations']>>, ParentType, ContextType, RequireFields<QueryKycVerificationsWithRelationsByAssigneeArgs, 'userId'>>;
  kycVerificationsWithRelationsByPriority?: Resolver<Maybe<Array<ResolversTypes['KycVerificationWithRelations']>>, ParentType, ContextType, RequireFields<QueryKycVerificationsWithRelationsByPriorityArgs, 'priority'>>;
  kycVerificationsWithRelationsByStatus?: Resolver<Maybe<Array<ResolversTypes['KycVerificationWithRelations']>>, ParentType, ContextType, RequireFields<QueryKycVerificationsWithRelationsByStatusArgs, 'status'>>;
  pendingKycVerifications?: Resolver<Maybe<Array<ResolversTypes['KycVerification']>>, ParentType, ContextType>;
  test?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  usersByGroup?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryUsersByGroupArgs, 'groupId'>>;
};

export type TypeStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TypeStats'] = ResolversParentTypes['TypeStats']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  verificationType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type VerificationWorkflowResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerificationWorkflow'] = ResolversParentTypes['VerificationWorkflow']> = {
  completedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kycVerification?: Resolver<Maybe<ResolversTypes['KycVerification']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  step?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verificationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ActivityLog?: ActivityLogResolvers<ContextType>;
  ClientApiAuthResponse?: ClientApiAuthResponseResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  CompanyStats?: CompanyStatsResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  ExternalVerification?: ExternalVerificationResolvers<ContextType>;
  FacetecResult?: FacetecResultResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  KycPerson?: KycPersonResolvers<ContextType>;
  KycVerification?: KycVerificationResolvers<ContextType>;
  KycVerificationStats?: KycVerificationStatsResolvers<ContextType>;
  KycVerificationWithRelations?: KycVerificationWithRelationsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  TypeStats?: TypeStatsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VerificationLink?: VerificationLinkResolvers<ContextType>;
  VerificationWorkflow?: VerificationWorkflowResolvers<ContextType>;
};

