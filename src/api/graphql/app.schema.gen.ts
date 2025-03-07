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

export type AccountSummary = {
  __typename?: 'AccountSummary';
  accountName?: Maybe<Scalars['String']['output']>;
  accountTypeId?: Maybe<Scalars['Int']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  subAccounts?: Maybe<Array<Maybe<AccountSummary>>>;
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  district: Scalars['String']['output'];
  extNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  intNumber: Scalars['String']['output'];
  latitude: Scalars['String']['output'];
  longitude: Scalars['String']['output'];
  real_time_latitude: Scalars['String']['output'];
  real_time_longitude: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
  zipCode: Scalars['String']['output'];
};

export type Alarm = {
  __typename?: 'Alarm';
  alertLevel?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  deviceId?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastUpdate?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subcategory?: Maybe<Scalars['String']['output']>;
};

export type Application = {
  __typename?: 'Application';
  address?: Maybe<Address>;
  addressProof?: Maybe<Content>;
  checklist?: Maybe<Array<Maybe<ApplicationChecklist>>>;
  contract?: Maybe<ContractEntity>;
  contractDate?: Maybe<Scalars['DateTime']['output']>;
  contractId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currentStep?: Maybe<Scalars['Int']['output']>;
  driversLicense?: Maybe<Content>;
  driversLicenseReverse?: Maybe<Content>;
  expiredAt?: Maybe<Scalars['DateTime']['output']>;
  finishedAt?: Maybe<Scalars['DateTime']['output']>;
  friendlyId?: Maybe<Scalars['String']['output']>;
  hasDriverEngaged?: Maybe<Scalars['Boolean']['output']>;
  hasKycFinished?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  identificationCard?: Maybe<Content>;
  identificationCardReverse?: Maybe<Content>;
  idpersona?: Maybe<Scalars['String']['output']>;
  inactivityStatement?: Maybe<Content>;
  inactivityStatementReason?: Maybe<Scalars['String']['output']>;
  incomeStatement?: Maybe<Content>;
  offer?: Maybe<Offer>;
  offerId?: Maybe<Scalars['ID']['output']>;
  product?: Maybe<Product>;
  quote?: Maybe<Quote>;
  quoteSmartItId?: Maybe<Scalars['String']['output']>;
  selfiePicture?: Maybe<Content>;
  status?: Maybe<Scalars['String']['output']>;
  tasks?: Maybe<Array<Maybe<Task>>>;
  taxIdentification?: Maybe<Content>;
  title?: Maybe<Scalars['String']['output']>;
  uberProfileImageSrc?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  vehicle?: Maybe<Vehicle>;
};

export type ApplicationChecklist = {
  __typename?: 'ApplicationChecklist';
  application?: Maybe<Application>;
  applicationId: Scalars['String']['output'];
  checklist?: Maybe<Checklist>;
  checklistId: Scalars['String']['output'];
  childs?: Maybe<Array<Maybe<ApplicationChecklist>>>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  dismissible: Scalars['Boolean']['output'];
  fullTasks?: Maybe<Array<Maybe<Task>>>;
  id: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  isDismissed?: Maybe<Scalars['Boolean']['output']>;
  isPending?: Maybe<Scalars['Boolean']['output']>;
  isStarted?: Maybe<Scalars['Boolean']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<ApplicationChecklist>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  tasks?: Maybe<Array<Maybe<Task>>>;
};

export enum ApplicationFlowStatus {
  Approve = 'APPROVE',
  BackofficeReview = 'BACKOFFICE_REVIEW',
  ManagerReview = 'MANAGER_REVIEW',
  Reject = 'REJECT'
}

export type BankReferDeatil = {
  __typename?: 'BankReferDeatil';
  account?: Maybe<Scalars['String']['output']>;
  agreement?: Maybe<Scalars['Int']['output']>;
  bank?: Maybe<Scalars['String']['output']>;
  bankId?: Maybe<Scalars['Int']['output']>;
  ciaId?: Maybe<Scalars['Int']['output']>;
  clabe?: Maybe<Scalars['String']['output']>;
};

export type BitacoraEntity = {
  __typename?: 'BitacoraEntity';
  alarmId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type Checklist = {
  __typename?: 'Checklist';
  childs?: Maybe<Array<Maybe<Checklist>>>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<Checklist>;
};

export type ClientApiAuthResponse = {
  __typename?: 'ClientApiAuthResponse';
  accessToken: Scalars['String']['output'];
};

export type ClientOverview = {
  __typename?: 'ClientOverview';
  byActivity: ClientsByActivity;
};

export type ClientsByActivity = {
  __typename?: 'ClientsByActivity';
  withDebt: Scalars['Int']['output'];
  withoutDebt: Scalars['Int']['output'];
};

export type Content = {
  __typename?: 'Content';
  downloadUrl?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<ContentMetadata>;
  previewUrl?: Maybe<Scalars['String']['output']>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  viewUrl?: Maybe<Scalars['String']['output']>;
};

export type ContentMetadata = {
  __typename?: 'ContentMetadata';
  originalFilename?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

export type ContractEntity = {
  __typename?: 'ContractEntity';
  bankReference?: Maybe<Scalars['String']['output']>;
  clientId?: Maybe<Scalars['Int']['output']>;
  companyId: Scalars['Int']['output'];
  contractWeeks?: Maybe<Scalars['Int']['output']>;
  deliveryDate?: Maybe<Scalars['DateTime']['output']>;
  deliveryLocation?: Maybe<DeliveryLocation>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  insurancePolicyFolio?: Maybe<Scalars['String']['output']>;
  interestRate?: Maybe<Scalars['Float']['output']>;
  pathBankReference?: Maybe<Scalars['String']['output']>;
  pathContract?: Maybe<Scalars['String']['output']>;
  pathDeliveryLetter?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['DateTime']['output'];
  status?: Maybe<Scalars['String']['output']>;
  weeklyCost?: Maybe<Scalars['Float']['output']>;
};

export type ContractSigningEntity = {
  __typename?: 'ContractSigningEntity';
  Id?: Maybe<Scalars['String']['output']>;
};

export type Conversation = {
  __typename?: 'Conversation';
  canReply: Scalars['Boolean']['output'];
  channel: Scalars['String']['output'];
  externalLink: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastActivityAt: Scalars['DateTime']['output'];
  messages?: Maybe<Array<Maybe<ConversationMessage>>>;
  unreadCount: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};

export type ConversationContact = {
  __typename?: 'ConversationContact';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type ConversationMessage = {
  __typename?: 'ConversationMessage';
  content: Scalars['String']['output'];
  contentType: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  sender: ConversationContact;
  status: Scalars['String']['output'];
};

export type CreateApplicationResponse = {
  __typename?: 'CreateApplicationResponse';
  application?: Maybe<Application>;
  flowStatus?: Maybe<ApplicationFlowStatus>;
};

export type CreateInvitationInput = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  campaignId?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  hasUberAccount?: InputMaybe<Scalars['Boolean']['input']>;
  isOnsite?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
  promotionId?: InputMaybe<Scalars['String']['input']>;
  referrerId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLeadInput = {
  contactype?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  supportUserId?: InputMaybe<Scalars['ID']['input']>;
  visitAppointmentAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CreateUserInput = {
  assignedGroups: Array<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type DeliveryEntity = {
  __typename?: 'DeliveryEntity';
  Id?: Maybe<Scalars['String']['output']>;
};

export type DeliveryLocation = {
  __typename?: 'DeliveryLocation';
  address?: Maybe<Scalars['String']['output']>;
  categoryId?: Maybe<Scalars['Int']['output']>;
  companyId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
};

export type DeviceTokenEntity = {
  __typename?: 'DeviceTokenEntity';
  createdAt: Scalars['String']['output'];
  device: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  token: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type FullTasks = {
  __typename?: 'FullTasks';
  userAssigned: Array<Maybe<Task>>;
  userGroupsAssigned: Array<Maybe<Task>>;
};

export type Gps = {
  __typename?: 'GPS';
  id?: Maybe<Scalars['Int']['output']>;
  imei?: Maybe<Scalars['String']['output']>;
  partNumber?: Maybe<Scalars['Int']['output']>;
  serialNumber?: Maybe<Scalars['String']['output']>;
  simCard?: Maybe<SimCard>;
};

export type GetProspectsFilters = {
  inactivityInHours?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  supportUserId?: InputMaybe<Array<Scalars['ID']['input']>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  withApplication?: InputMaybe<Scalars['Boolean']['input']>;
  withQuotes?: InputMaybe<Scalars['Boolean']['input']>;
  withoutAssignedSupportUser?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  users?: Maybe<Array<Maybe<User>>>;
};

export type IncidentEntity = {
  __typename?: 'IncidentEntity';
  amount?: Maybe<Scalars['Float']['output']>;
  companyId?: Maybe<Scalars['Int']['output']>;
  contractId?: Maybe<Scalars['Int']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  registeredAt?: Maybe<Scalars['String']['output']>;
  uberItem?: Maybe<UberItemEntity>;
  uberItemId?: Maybe<Scalars['Int']['output']>;
};

export type IncidentFilesInput = {
  content: Scalars['String']['input'];
  filename: Scalars['String']['input'];
};

export type IncidentInput = {
  amount: Scalars['Float']['input'];
  comments?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Array<IncidentFilesInput>>;
  uberItemId: Scalars['Int']['input'];
};

export type Invitation = {
  __typename?: 'Invitation';
  application?: Maybe<Application>;
  applicationId?: Maybe<Scalars['ID']['output']>;
  branchId?: Maybe<Scalars['String']['output']>;
  campaignId?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  hasUberAccount?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  isOnsite?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['String']['output']>;
  promotionId?: Maybe<Scalars['String']['output']>;
  prospect?: Maybe<Prospect>;
  prospectId?: Maybe<Scalars['ID']['output']>;
  quote?: Maybe<Quote>;
  quoteId?: Maybe<Scalars['ID']['output']>;
  referrer?: Maybe<User>;
  referrerId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<InvitationStatus>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type InvitationOverview = {
  __typename?: 'InvitationOverview';
  withUberAccount: InvitationOverviewCountRefine;
  withoutUberAccount: InvitationOverviewCountRefine;
};

export type InvitationOverviewCountRefine = {
  __typename?: 'InvitationOverviewCountRefine';
  accepted: Scalars['Int']['output'];
  created: Scalars['Int']['output'];
  expired: Scalars['Int']['output'];
  sent: Scalars['Int']['output'];
};

export enum InvitationStatus {
  Accepted = 'ACCEPTED',
  Created = 'CREATED',
  Expired = 'EXPIRED',
  Sent = 'SENT'
}

export type KycApplicationsByActivity = {
  __typename?: 'KycApplicationsByActivity';
  delayedByBackoffice: Scalars['Int']['output'];
  delayedByDriver: Scalars['Int']['output'];
  delayedByManager: Scalars['Int']['output'];
  onTime: Scalars['Int']['output'];
};

export type KycApplicationsByProgress = {
  __typename?: 'KycApplicationsByProgress';
  deliveryProcess: Scalars['Int']['output'];
  kycComplete: Scalars['Int']['output'];
  kycDriverEngaged: Scalars['Int']['output'];
};

export type KycIdentificationCardMatch = {
  __typename?: 'KycIdentificationCardMatch';
  parsed?: Maybe<KycIdentificationCardMatchParsed>;
  verdict?: Maybe<Scalars['String']['output']>;
};

export type KycIdentificationCardMatchParsed = {
  __typename?: 'KycIdentificationCardMatchParsed';
  addressCity?: Maybe<Scalars['String']['output']>;
  addressHouseNumber?: Maybe<Scalars['String']['output']>;
  addressNeighborhood?: Maybe<Scalars['String']['output']>;
  addressPostalCode?: Maybe<Scalars['String']['output']>;
  addressState?: Maybe<Scalars['String']['output']>;
  addressStreetName?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
};

export type KycOverview = {
  __typename?: 'KycOverview';
  byActivity: KycApplicationsByActivity;
  byProgress: KycApplicationsByProgress;
};

export type Lead = {
  __typename?: 'Lead';
  browserName?: Maybe<Scalars['String']['output']>;
  browserVersion?: Maybe<Scalars['String']['output']>;
  contactype?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  deviceModel?: Maybe<Scalars['String']['output']>;
  deviceType?: Maybe<Scalars['String']['output']>;
  deviceVendor?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  engineName?: Maybe<Scalars['String']['output']>;
  engineVersion?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  hasUberAccount?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  isBot?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Location>;
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<LeadStatus>;
  supportUser?: Maybe<User>;
  supportUserId?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  visitAppointmentAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LeadOverview = {
  __typename?: 'LeadOverview';
  withUberAccount: LeadOverviewCountRefine;
  withoutUberAccount: LeadOverviewCountRefine;
};

export type LeadOverviewCountRefine = {
  __typename?: 'LeadOverviewCountRefine';
  arrived: Scalars['Int']['output'];
  beingManaged: Scalars['Int']['output'];
  converted: Scalars['Int']['output'];
  dismissed: Scalars['Int']['output'];
};

export enum LeadStatus {
  Arrived = 'ARRIVED',
  Contacted = 'CONTACTED',
  Converted = 'CONVERTED',
  Dismissed = 'DISMISSED'
}

export type Leasing = {
  __typename?: 'Leasing';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  location?: Maybe<Location>;
  locationId?: Maybe<Scalars['ID']['output']>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
  vehicle?: Maybe<Vehicle>;
  vehicleId?: Maybe<Scalars['ID']['output']>;
};

export type LeasingAccountSummary = {
  __typename?: 'LeasingAccountSummary';
  accounts?: Maybe<Array<Maybe<AccountSummary>>>;
  companyId?: Maybe<Scalars['Int']['output']>;
  contractId?: Maybe<Scalars['Int']['output']>;
  cycleEndDate?: Maybe<Scalars['DateTime']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  grandTotal?: Maybe<Scalars['Float']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  weekNumber?: Maybe<Scalars['Int']['output']>;
};

export type LeasingAlarmsResponse = {
  __typename?: 'LeasingAlarmsResponse';
  alarms?: Maybe<Array<Maybe<Alarm>>>;
};

export type LeasingDailySummary = {
  __typename?: 'LeasingDailySummary';
  trips?: Maybe<Scalars['Int']['output']>;
  tripsDailyDistance?: Maybe<Scalars['Float']['output']>;
  tripsDailyScoring?: Maybe<Scalars['Float']['output']>;
  tripsEndOdometer?: Maybe<Scalars['Float']['output']>;
  uberDailyDistance?: Maybe<Scalars['Float']['output']>;
  uberFare?: Maybe<Scalars['Float']['output']>;
  uberTrips?: Maybe<Scalars['Int']['output']>;
  uberUsage?: Maybe<Scalars['Float']['output']>;
};

export type LeasingFinancialDebtVoucher = {
  __typename?: 'LeasingFinancialDebtVoucher';
  amount?: Maybe<Scalars['Float']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  validUntil?: Maybe<Scalars['DateTime']['output']>;
};

export type LeasingFinancialWeekSummary = {
  __typename?: 'LeasingFinancialWeekSummary';
  behaviorFineAmount?: Maybe<Scalars['Float']['output']>;
  cutDate?: Maybe<Scalars['DateTime']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  interestsAmount?: Maybe<Scalars['Float']['output']>;
  otherFinesAmount?: Maybe<Scalars['Float']['output']>;
  previousUnpaidAmount?: Maybe<Scalars['Float']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  weekNumber?: Maybe<Scalars['Int']['output']>;
  weeklyFeeAmount?: Maybe<Scalars['Float']['output']>;
};

export type LeasingPendingBankReference = {
  __typename?: 'LeasingPendingBankReference';
  amount: Scalars['Float']['output'];
  endDate?: Maybe<Scalars['DateTime']['output']>;
  pendingPayments?: Maybe<Array<Maybe<LeasingPendingPayment>>>;
  reference: Scalars['String']['output'];
};

export type LeasingPendingPayment = {
  __typename?: 'LeasingPendingPayment';
  bankReferer?: Maybe<Scalars['String']['output']>;
  cycleEndDate?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  details?: Maybe<Array<Maybe<LeasingPendingPaymentDetail>>>;
  id?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Float']['output']>;
  week?: Maybe<Scalars['Int']['output']>;
};

export type LeasingPendingPaymentDetail = {
  __typename?: 'LeasingPendingPaymentDetail';
  amount?: Maybe<Scalars['Float']['output']>;
  code?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
};

export type LeasingSummary = {
  __typename?: 'LeasingSummary';
  baseServiceAmount?: Maybe<Scalars['Int']['output']>;
  contractNumber?: Maybe<Scalars['String']['output']>;
  earningsProgress?: Maybe<Scalars['Int']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  expensesAmount?: Maybe<Scalars['Int']['output']>;
  lastUpdate?: Maybe<Scalars['String']['output']>;
  previousExpensesAmount?: Maybe<Scalars['Int']['output']>;
  previousExpensesDueDate?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['Int']['output']>;
  uberEarningsGross?: Maybe<Scalars['Int']['output']>;
  usage?: Maybe<Scalars['Int']['output']>;
  usagePenalty?: Maybe<Scalars['String']['output']>;
  usagePenaltyAmount?: Maybe<Scalars['Int']['output']>;
  weekNumber?: Maybe<Scalars['Int']['output']>;
};

export type LeasingWeekDetail = {
  __typename?: 'LeasingWeekDetail';
  companyId?: Maybe<Scalars['Int']['output']>;
  contractId?: Maybe<Scalars['Int']['output']>;
  cycleEndDate?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  isClosed?: Maybe<Scalars['Boolean']['output']>;
  isReconciliated?: Maybe<Scalars['Boolean']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  weekNumber: Scalars['Int']['output'];
};

export type LeasingWeeklySummary = {
  __typename?: 'LeasingWeeklySummary';
  trips?: Maybe<Scalars['Int']['output']>;
  tripsWeeklyDistance?: Maybe<Scalars['Float']['output']>;
  tripsWeeklyEndOdometer?: Maybe<Scalars['Float']['output']>;
  tripsWeeklyScoring?: Maybe<Scalars['Float']['output']>;
  uberFares?: Maybe<Scalars['Float']['output']>;
  uberTrips?: Maybe<Scalars['Int']['output']>;
  uberUsage?: Maybe<Scalars['Float']['output']>;
  uberWeeklyDistance?: Maybe<Scalars['Float']['output']>;
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: Invitation;
  assignTrackerDeviceSimToVehicle?: Maybe<Vehicle>;
  assignTrackerDeviceToVehicle?: Maybe<Vehicle>;
  confirmSlot?: Maybe<Slot>;
  conversationSendMessage?: Maybe<Array<Maybe<Conversation>>>;
  createApplication: CreateApplicationResponse;
  createBankReference?: Maybe<LeasingPendingBankReference>;
  createBitacora: BitacoraEntity;
  createIncident?: Maybe<IncidentEntity>;
  createInvitation: Invitation;
  createLead?: Maybe<Scalars['Boolean']['output']>;
  createPaymentBill?: Maybe<PaymentBillEntity>;
  createPerson?: Maybe<Person>;
  createPersonRegi: PersonRegis;
  createQuote: Quote;
  createQuoteSmartIt?: Maybe<QuoteSmartItResponse>;
  createUser?: Maybe<User>;
  dismissApplicationChecklist: ApplicationChecklist;
  generateContract?: Maybe<ContractEntity>;
  generateDelivery?: Maybe<DeliveryEntity>;
  getOrCreateQuote: Quote;
  moveTask: Scalars['Boolean']['output'];
  populateSlots?: Maybe<Array<Maybe<Slot>>>;
  prospectAddNote?: Maybe<Array<Maybe<ProspectActivity>>>;
  prospectReassignSupportUser?: Maybe<Array<Maybe<ProspectActivity>>>;
  prospectUpdateStatus?: Maybe<Array<Maybe<ProspectActivity>>>;
  registerDeviceToken: DeviceTokenEntity;
  reserveVehicle?: Maybe<Vehicle>;
  reserveVehicleSmarIt?: Maybe<VehicleReservationEntity>;
  revokeApplication?: Maybe<Scalars['Boolean']['output']>;
  sendNotification?: Maybe<Scalars['Boolean']['output']>;
  setInactivityStatement?: Maybe<Scalars['Boolean']['output']>;
  setInvitationStatus?: Maybe<Scalars['Boolean']['output']>;
  setKycAddress?: Maybe<Address>;
  setLeadStatus?: Maybe<Scalars['Boolean']['output']>;
  signContract?: Maybe<ContractSigningEntity>;
  updateBitacoraStatus: BitacoraEntity;
  updateDriversLicenseInfo?: Maybe<Scalars['Boolean']['output']>;
  updatePerson?: Maybe<PersonUpdateEntity>;
  updateUserDriverLicenseInfo?: Maybe<Scalars['Boolean']['output']>;
  updateUserPersonalInfo?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAcceptInvitationArgs = {
  invitationId?: InputMaybe<Scalars['ID']['input']>;
  userId: Scalars['ID']['input'];
};


export type MutationAssignTrackerDeviceSimToVehicleArgs = {
  taskId: Scalars['ID']['input'];
  trackerDeviceSim: Scalars['String']['input'];
};


export type MutationAssignTrackerDeviceToVehicleArgs = {
  taskId: Scalars['ID']['input'];
  trackerDeviceId: Scalars['String']['input'];
};


export type MutationConfirmSlotArgs = {
  slotId: Scalars['String']['input'];
};


export type MutationConversationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationCreateApplicationArgs = {
  offerId: Scalars['ID']['input'];
};


export type MutationCreateBankReferenceArgs = {
  pendingPaymentsIds: Array<InputMaybe<Scalars['Int']['input']>>;
  quoteSmartItId: Scalars['Int']['input'];
};


export type MutationCreateBitacoraArgs = {
  alarmId: Scalars['String']['input'];
  status: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationCreateIncidentArgs = {
  contractId: Scalars['Int']['input'];
  idsmartIt: Scalars['String']['input'];
  incident: IncidentInput;
};


export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
};


export type MutationCreateLeadArgs = {
  input: CreateLeadInput;
};


export type MutationCreatePaymentBillArgs = {
  idcliente: Scalars['Int']['input'];
  referencia: Scalars['String']['input'];
};


export type MutationCreatePersonArgs = {
  birthdate: Scalars['DateTime']['input'];
  businessname?: InputMaybe<Scalars['String']['input']>;
  cfdiuse: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  curp?: InputMaybe<Scalars['String']['input']>;
  district: Scalars['String']['input'];
  email: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  maidenname?: InputMaybe<Scalars['String']['input']>;
  mobile: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  noext: Scalars['String']['input'];
  noint?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  rfc?: InputMaybe<Scalars['String']['input']>;
  state: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
  taxReg?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
  zipCode: Scalars['Int']['input'];
};


export type MutationCreatePersonRegiArgs = {
  ApellidoMaterno: Scalars['String']['input'];
  ApellidoPaterno: Scalars['String']['input'];
  Email: Scalars['String']['input'];
  Nombre: Scalars['String']['input'];
  NumeroCelular: Scalars['String']['input'];
  idGUID: Scalars['String']['input'];
};


export type MutationCreateQuoteArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationCreateQuoteSmartItArgs = {
  Anio: Scalars['Int']['input'];
  IdSmartIt: Scalars['String']['input'];
  IdVersion: Scalars['String']['input'];
  Marca: Scalars['String']['input'];
  Modelo: Scalars['String']['input'];
  UUID: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDismissApplicationChecklistArgs = {
  applicationChecklistId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGenerateContractArgs = {
  IdCotizacion: Scalars['String']['input'];
  contractDate: Scalars['Date']['input'];
  deliveryLocationId: Scalars['Int']['input'];
  idsmartIt: Scalars['String']['input'];
};


export type MutationGenerateDeliveryArgs = {
  IdContrato: Scalars['String']['input'];
  idsmartIt: Scalars['String']['input'];
};


export type MutationGetOrCreateQuoteArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationMoveTaskArgs = {
  metadata?: InputMaybe<TaskMetadataInput>;
  taskAction: TaskAction;
  taskId: Scalars['ID']['input'];
};


export type MutationPopulateSlotsArgs = {
  dateFrom: Scalars['DateTime']['input'];
  dateTo: Scalars['DateTime']['input'];
  slotType: Scalars['String']['input'];
};


export type MutationProspectAddNoteArgs = {
  notes: Scalars['String']['input'];
  prospectId: Scalars['ID']['input'];
};


export type MutationProspectReassignSupportUserArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  prospectId: Scalars['ID']['input'];
  supportUserId: Scalars['ID']['input'];
};


export type MutationProspectUpdateStatusArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  prospectId: Scalars['ID']['input'];
  prospectStatusId: Scalars['String']['input'];
};


export type MutationRegisterDeviceTokenArgs = {
  device: Scalars['String']['input'];
  token: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationReserveVehicleArgs = {
  input: ReserveVehicleInput;
  taskId: Scalars['ID']['input'];
};


export type MutationReserveVehicleSmarItArgs = {
  IdCotizacion: Scalars['Int']['input'];
  IdUsuarioUber: Scalars['String']['input'];
  idsmartIt: Scalars['String']['input'];
};


export type MutationRevokeApplicationArgs = {
  applicationId: Scalars['ID']['input'];
};


export type MutationSendNotificationArgs = {
  input: SendNotificationInput;
  userId: Scalars['ID']['input'];
};


export type MutationSetInactivityStatementArgs = {
  input: SetInactivityStatementInput;
  taskId: Scalars['ID']['input'];
};


export type MutationSetInvitationStatusArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationSetKycAddressArgs = {
  input: SetKycAddressInput;
  taskId: Scalars['ID']['input'];
};


export type MutationSetLeadStatusArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationSignContractArgs = {
  IdContrato: Scalars['Int']['input'];
  idsmartIt: Scalars['String']['input'];
};


export type MutationUpdateBitacoraStatusArgs = {
  bitacoraId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateDriversLicenseInfoArgs = {
  expirationDate: Scalars['DateTime']['input'];
  idsmartIt: Scalars['String']['input'];
  licenseNumber: Scalars['String']['input'];
  personId: Scalars['Int']['input'];
};


export type MutationUpdatePersonArgs = {
  ApellidoMaterno: Scalars['String']['input'];
  ApellidoPaterno: Scalars['String']['input'];
  CURP: Scalars['String']['input'];
  Calle: Scalars['String']['input'];
  Ciudad: Scalars['String']['input'];
  CodigoPostal: Scalars['String']['input'];
  ColoniaFraccionamiento: Scalars['String']['input'];
  Email: Scalars['String']['input'];
  Estado: Scalars['String']['input'];
  FechaNacimiento: Scalars['String']['input'];
  Nombre: Scalars['String']['input'];
  NumeroCelular: Scalars['String']['input'];
  NumeroExterior: Scalars['String']['input'];
  NumeroInterior?: InputMaybe<Scalars['String']['input']>;
  Pais: Scalars['String']['input'];
  RFC: Scalars['String']['input'];
  RazonSocial?: InputMaybe<Scalars['String']['input']>;
  RegimenFiscal: Scalars['String']['input'];
  Sexo: Scalars['String']['input'];
  TelefonoCasa?: InputMaybe<Scalars['String']['input']>;
  UUID: Scalars['String']['input'];
  UsoCFDI: Scalars['String']['input'];
};


export type MutationUpdateUserDriverLicenseInfoArgs = {
  input: UpdateUserDriverLicenseInfoInput;
};


export type MutationUpdateUserPersonalInfoArgs = {
  input: UpdateUserPersonalInfoInput;
};

export type Offer = {
  __typename?: 'Offer';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  leasingPeriod?: Maybe<Scalars['Int']['output']>;
  product?: Maybe<Product>;
  quoteId: Scalars['ID']['output'];
  scoringAnalysis?: Maybe<Scalars['String']['output']>;
  scoringBrief?: Maybe<Scalars['String']['output']>;
  scoringDetails?: Maybe<Scalars['String']['output']>;
  scoringDetailsParsed?: Maybe<Array<Maybe<OfferScoringDetail>>>;
  scoringMark?: Maybe<Scalars['String']['output']>;
  scoringResolution?: Maybe<Scalars['String']['output']>;
  scoringVerdict?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  weeklyPrice?: Maybe<Scalars['Int']['output']>;
};

export type OfferScoringDetail = {
  __typename?: 'OfferScoringDetail';
  key?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ParamDetail = {
  __typename?: 'ParamDetail';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  idParam: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ParamHeader = {
  __typename?: 'ParamHeader';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  paramDetails?: Maybe<Array<Maybe<ParamDetail>>>;
};

export type PaymentBillEntity = {
  __typename?: 'PaymentBillEntity';
  billId: Scalars['Int']['output'];
  folio: Scalars['Int']['output'];
  serie: Scalars['String']['output'];
};

export type PaymentValidationEntity = {
  __typename?: 'PaymentValidationEntity';
  idPayment: Scalars['String']['output'];
};

export type PendingDocuments = {
  __typename?: 'PendingDocuments';
  Descripcion?: Maybe<Scalars['String']['output']>;
  Id?: Maybe<Scalars['Int']['output']>;
  Subcategorias?: Maybe<Array<Maybe<PendingDocuments>>>;
  TieneDocumentos?: Maybe<Scalars['Boolean']['output']>;
};

export type Person = {
  __typename?: 'Person';
  birthdate: Scalars['DateTime']['output'];
  businessname?: Maybe<Scalars['String']['output']>;
  cfdiuse: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  curp?: Maybe<Scalars['String']['output']>;
  district: Scalars['String']['output'];
  email: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  maidenname?: Maybe<Scalars['String']['output']>;
  mobile: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  noext: Scalars['String']['output'];
  noint?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  rfc?: Maybe<Scalars['String']['output']>;
  state: Scalars['String']['output'];
  street?: Maybe<Scalars['String']['output']>;
  taxReg?: Maybe<Scalars['String']['output']>;
  userId: Scalars['String']['output'];
  zipCode: Scalars['Int']['output'];
};

export type PersonRegis = {
  __typename?: 'PersonRegis';
  ApellidoMaterno: Scalars['String']['output'];
  ApellidoPaterno: Scalars['String']['output'];
  Email: Scalars['String']['output'];
  Nombre: Scalars['String']['output'];
  NumeroCelular: Scalars['String']['output'];
  idGUID: Scalars['String']['output'];
};

export type PersonUpdateEntity = {
  __typename?: 'PersonUpdateEntity';
  ApellidoMaterno?: Maybe<Scalars['String']['output']>;
  ApellidoPaterno?: Maybe<Scalars['String']['output']>;
  CURP?: Maybe<Scalars['String']['output']>;
  Calle?: Maybe<Scalars['String']['output']>;
  Ciudad?: Maybe<Scalars['String']['output']>;
  CodigoPostal?: Maybe<Scalars['String']['output']>;
  ColoniaFraccionamiento?: Maybe<Scalars['String']['output']>;
  Email?: Maybe<Scalars['String']['output']>;
  Estado?: Maybe<Scalars['String']['output']>;
  FechaNacimiento?: Maybe<Scalars['String']['output']>;
  Nombre?: Maybe<Scalars['String']['output']>;
  NumeroCelular?: Maybe<Scalars['String']['output']>;
  NumeroExterior?: Maybe<Scalars['String']['output']>;
  NumeroInterior?: Maybe<Scalars['String']['output']>;
  Pais?: Maybe<Scalars['String']['output']>;
  RFC?: Maybe<Scalars['String']['output']>;
  RazonSocial?: Maybe<Scalars['String']['output']>;
  RegimenFiscal?: Maybe<Scalars['String']['output']>;
  Sexo?: Maybe<Scalars['String']['output']>;
  TelefonoCasa?: Maybe<Scalars['String']['output']>;
  UUID?: Maybe<Scalars['String']['output']>;
  UsoCFDI?: Maybe<Scalars['String']['output']>;
};

export type Product = {
  __typename?: 'Product';
  brand: Scalars['String']['output'];
  cityFuelEconomy?: Maybe<Scalars['Float']['output']>;
  confortFeatures?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  cylinders?: Maybe<Scalars['String']['output']>;
  defaultLeasingPeriod?: Maybe<Scalars['Int']['output']>;
  defaultWeeklyPrice?: Maybe<Scalars['Int']['output']>;
  engineType?: Maybe<Scalars['String']['output']>;
  estimatedAcceleration?: Maybe<Scalars['Float']['output']>;
  estimatedHorsepower?: Maybe<Scalars['Int']['output']>;
  estimatedTopSpeedKmH?: Maybe<Scalars['Int']['output']>;
  estimatedTorqueLbFt?: Maybe<Scalars['Int']['output']>;
  frontElectricWindows?: Maybe<Scalars['String']['output']>;
  fuelType?: Maybe<Scalars['String']['output']>;
  highwayFuelEconomy?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  idversion?: Maybe<Scalars['Int']['output']>;
  isActive: Scalars['Boolean']['output'];
  liters?: Maybe<Scalars['Float']['output']>;
  model: Scalars['String']['output'];
  numberOfSpeeds?: Maybe<Scalars['Int']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  safetyFeatures?: Maybe<Scalars['String']['output']>;
  series: Scalars['String']['output'];
  startStop?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  transmission?: Maybe<Scalars['String']['output']>;
  turbo?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type Prospect = {
  __typename?: 'Prospect';
  activeApplication?: Maybe<Application>;
  activeApplicationId?: Maybe<Scalars['ID']['output']>;
  activity?: Maybe<Array<Maybe<ProspectActivity>>>;
  applications?: Maybe<Array<Maybe<Application>>>;
  createdAt: Scalars['DateTime']['output'];
  friendlyId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invitations?: Maybe<Array<Maybe<Invitation>>>;
  lastActivityAt: Scalars['DateTime']['output'];
  lastActivityUser?: Maybe<User>;
  lastActivityUserId?: Maybe<Scalars['ID']['output']>;
  lastQuote?: Maybe<Quote>;
  prospectStatus?: Maybe<ProspectStatus>;
  prospectStatusId: Scalars['String']['output'];
  quoteCount: Scalars['Int']['output'];
  quotes?: Maybe<Array<Maybe<Quote>>>;
  supportUser?: Maybe<User>;
  supportUserId?: Maybe<Scalars['ID']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type ProspectActivity = {
  __typename?: 'ProspectActivity';
  createdAt: Scalars['DateTime']['output'];
  createdByUser?: Maybe<User>;
  createdByUserId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  prospectActivityType?: Maybe<ProspectActivityType>;
  prospectActivityTypeId: Scalars['String']['output'];
  prospectId: Scalars['ID']['output'];
  prospectStatus?: Maybe<ProspectStatus>;
  prospectStatusId: Scalars['String']['output'];
  prospects?: Maybe<Array<Maybe<Prospect>>>;
};

export type ProspectActivityType = {
  __typename?: 'ProspectActivityType';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  prospectActivity?: Maybe<Array<Maybe<ProspectActivity>>>;
};

export type ProspectCountByScoringMark = {
  __typename?: 'ProspectCountByScoringMark';
  A?: Maybe<Scalars['Int']['output']>;
  B?: Maybe<Scalars['Int']['output']>;
  C?: Maybe<Scalars['Int']['output']>;
  D?: Maybe<Scalars['Int']['output']>;
  E?: Maybe<Scalars['Int']['output']>;
  F?: Maybe<Scalars['Int']['output']>;
  NoScore?: Maybe<Scalars['Int']['output']>;
};

export type ProspectOverview = {
  __typename?: 'ProspectOverview';
  byQuoteScoringMark: ProspectCountByScoringMark;
  bySituation: ProspectSituationCount;
};

export type ProspectSituationCount = {
  __typename?: 'ProspectSituationCount';
  active: Scalars['Int']['output'];
  expired: Scalars['Int']['output'];
  recent: Scalars['Int']['output'];
};

export type ProspectStatus = {
  __typename?: 'ProspectStatus';
  id: Scalars['String']['output'];
  manualAssignable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  prospects?: Maybe<Array<Maybe<Prospect>>>;
};

export type Query = {
  __typename?: 'Query';
  activeApplications?: Maybe<Array<Maybe<Application>>>;
  activeInvitations?: Maybe<Array<Maybe<Invitation>>>;
  activeLeads?: Maybe<Array<Maybe<Lead>>>;
  activeLeasings?: Maybe<Array<Maybe<Leasing>>>;
  activeQuotes?: Maybe<Array<Maybe<Quote>>>;
  applicationById: Application;
  applicationChecklist?: Maybe<Array<ApplicationChecklist>>;
  applications?: Maybe<Array<Maybe<Application>>>;
  authWithCredentials: ClientApiAuthResponse;
  authWithUberDriver: ClientApiAuthResponse;
  banksWithReferDeatils?: Maybe<Array<Maybe<BankReferDeatil>>>;
  clientOverview: ClientOverview;
  currentVehicleStatus: VehicleStatusResponse;
  fetchPendingDocuments?: Maybe<Array<Maybe<PendingDocuments>>>;
  findParamHeaderByIdParam?: Maybe<ParamHeader>;
  getAvailableInventory: Array<VehicleInventory>;
  getAvailableProspectStatusList?: Maybe<Array<Maybe<ProspectStatus>>>;
  getBitacoraByUser: Array<BitacoraEntity>;
  getConversations?: Maybe<Array<Maybe<Conversation>>>;
  getDatesWithFreeSlots?: Maybe<Array<Maybe<Scalars['Date']['output']>>>;
  getDeviceTokensByUser: Array<DeviceTokenEntity>;
  getFreeSlots?: Maybe<Array<Maybe<Slot>>>;
  getIncidentsByContract?: Maybe<Array<Maybe<IncidentEntity>>>;
  getMeetings?: Maybe<Array<Maybe<Slot>>>;
  getProducts?: Maybe<Array<Maybe<Product>>>;
  getProspects?: Maybe<Array<Maybe<Prospect>>>;
  getSlotById?: Maybe<Slot>;
  getSlots?: Maybe<Array<Maybe<Slot>>>;
  getUserSlots?: Maybe<Array<Maybe<Slot>>>;
  invitationById: Invitation;
  invitationOverview: InvitationOverview;
  invitations?: Maybe<Array<Maybe<Invitation>>>;
  kycIdentificationCardMatch: KycIdentificationCardMatch;
  kycOverview: KycOverview;
  leadById: Lead;
  leadOverview: LeadOverview;
  leads?: Maybe<Array<Maybe<Lead>>>;
  leasingAccountSummary?: Maybe<LeasingAccountSummary>;
  leasingAlarms: LeasingAlarmsResponse;
  leasingById: Leasing;
  leasingDailySummary: LeasingDailySummary;
  leasingFinancialDebtVoucher?: Maybe<LeasingFinancialDebtVoucher>;
  leasingFinancialWeeklySummary: Array<LeasingFinancialWeekSummary>;
  leasingPendingBankReferences: Array<Maybe<LeasingPendingBankReference>>;
  leasingPendingPayments: Array<Maybe<LeasingPendingPayment>>;
  leasingSummary: LeasingSummary;
  leasingWeeklySummary: LeasingWeeklySummary;
  myInvitations?: Maybe<Array<Maybe<Invitation>>>;
  offerById?: Maybe<Offer>;
  personList: Array<Maybe<TaxPerson>>;
  prospectActivity?: Maybe<Array<Maybe<ProspectActivity>>>;
  prospectById?: Maybe<Prospect>;
  prospectByUserId?: Maybe<Prospect>;
  prospectOverview: ProspectOverview;
  quoteById?: Maybe<Quote>;
  quotesByUser?: Maybe<Array<Maybe<Quote>>>;
  scrapingUrl: PersonUpdateEntity;
  taskById?: Maybe<Task>;
  taskTypes?: Maybe<Array<Maybe<TaskType>>>;
  trackerTrips: Array<Maybe<TrackerTrip>>;
  tripsByDate?: Maybe<Array<Maybe<Trip>>>;
  user: User;
  usersByGroup?: Maybe<Array<User>>;
  validatePayment?: Maybe<PaymentValidationEntity>;
  vehicle?: Maybe<Vehicle>;
  /** This query gets the average usage over the last 3 weeks */
  vehicleUsageSummary?: Maybe<VehicleUsageSummary>;
  vehicles?: Maybe<Array<Maybe<Vehicle>>>;
  weeklyVehicleUsage?: Maybe<Array<Maybe<VehicleUsage>>>;
};


export type QueryApplicationByIdArgs = {
  applicationId: Scalars['ID']['input'];
};


export type QueryApplicationChecklistArgs = {
  applicationId: Scalars['ID']['input'];
  parentChecklistId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAuthWithCredentialsArgs = {
  email: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAuthWithUberDriverArgs = {
  token: Scalars['String']['input'];
};


export type QueryCurrentVehicleStatusArgs = {
  leasingId: Scalars['ID']['input'];
};


export type QueryFetchPendingDocumentsArgs = {
  numeroDeSerie: Scalars['String']['input'];
};


export type QueryFindParamHeaderByIdParamArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAvailableProspectStatusListArgs = {
  prospectId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetBitacoraByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetConversationsArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetDatesWithFreeSlotsArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  slotType: Scalars['String']['input'];
};


export type QueryGetDeviceTokensByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetFreeSlotsArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  slotType: Scalars['String']['input'];
};


export type QueryGetIncidentsByContractArgs = {
  contractId: Scalars['Int']['input'];
};


export type QueryGetMeetingsArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  slotType: Scalars['String']['input'];
};


export type QueryGetProspectsArgs = {
  filters?: InputMaybe<GetProspectsFilters>;
};


export type QueryGetSlotByIdArgs = {
  slotId: Scalars['ID']['input'];
};


export type QueryGetSlotsArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  slotType: Scalars['String']['input'];
};


export type QueryGetUserSlotsArgs = {
  filter?: InputMaybe<SlotFilterInput>;
  userId: Scalars['ID']['input'];
};


export type QueryInvitationByIdArgs = {
  invitationId: Scalars['ID']['input'];
};


export type QueryKycIdentificationCardMatchArgs = {
  applicationId: Scalars['ID']['input'];
};


export type QueryLeadByIdArgs = {
  leadId: Scalars['ID']['input'];
};


export type QueryLeasingAccountSummaryArgs = {
  quoteSmartItId: Scalars['Int']['input'];
};


export type QueryLeasingAlarmsArgs = {
  leasingId: Scalars['ID']['input'];
};


export type QueryLeasingByIdArgs = {
  leasingId: Scalars['ID']['input'];
};


export type QueryLeasingDailySummaryArgs = {
  date: Scalars['String']['input'];
  leasingId: Scalars['ID']['input'];
};


export type QueryLeasingFinancialDebtVoucherArgs = {
  leasingId: Scalars['ID']['input'];
  weekNumber: Scalars['Int']['input'];
};


export type QueryLeasingFinancialWeeklySummaryArgs = {
  leasingId: Scalars['ID']['input'];
  weekNumber?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLeasingPendingBankReferencesArgs = {
  quoteSmartItId: Scalars['Int']['input'];
};


export type QueryLeasingPendingPaymentsArgs = {
  contractId: Scalars['Int']['input'];
};


export type QueryLeasingSummaryArgs = {
  leasingId: Scalars['ID']['input'];
  weekNumber: Scalars['Int']['input'];
};


export type QueryLeasingWeeklySummaryArgs = {
  leasingId: Scalars['ID']['input'];
  weekNumber: Scalars['Int']['input'];
};


export type QueryOfferByIdArgs = {
  offerId: Scalars['ID']['input'];
};


export type QueryProspectActivityArgs = {
  prospectId: Scalars['ID']['input'];
};


export type QueryProspectByIdArgs = {
  prospectId: Scalars['ID']['input'];
};


export type QueryProspectByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryQuoteByIdArgs = {
  quoteId: Scalars['ID']['input'];
};


export type QueryQuotesByUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryScrapingUrlArgs = {
  Url: Scalars['String']['input'];
  idUser: Scalars['String']['input'];
  saveBool: Scalars['Boolean']['input'];
};


export type QueryTaskByIdArgs = {
  taskId: Scalars['ID']['input'];
};


export type QueryTrackerTripsArgs = {
  date: Scalars['String']['input'];
  leasingId: Scalars['ID']['input'];
};


export type QueryTripsByDateArgs = {
  from: Scalars['String']['input'];
  leasingId: Scalars['ID']['input'];
  to: Scalars['String']['input'];
};


export type QueryUsersByGroupArgs = {
  groupId: Scalars['String']['input'];
};


export type QueryValidatePaymentArgs = {
  idCotizacion: Scalars['Int']['input'];
  idsmartIt: Scalars['String']['input'];
};


export type QueryVehicleArgs = {
  vehicleId: Scalars['ID']['input'];
};


export type QueryVehicleUsageSummaryArgs = {
  leasingId: Scalars['ID']['input'];
};


export type QueryWeeklyVehicleUsageArgs = {
  leasingId: Scalars['ID']['input'];
};

export type Quote = {
  __typename?: 'Quote';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isExpired?: Maybe<Scalars['Boolean']['output']>;
  isRecent?: Maybe<Scalars['Boolean']['output']>;
  offers?: Maybe<Array<Maybe<Offer>>>;
  scoreMark?: Maybe<Scalars['String']['output']>;
  scoreResolution?: Maybe<Scalars['String']['output']>;
  scoringComplete: Scalars['Boolean']['output'];
  scoringEngine?: Maybe<Scalars['String']['output']>;
  scoringError: Scalars['Boolean']['output'];
  scoringErrorMessage?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type QuoteSmartItResponse = {
  __typename?: 'QuoteSmartItResponse';
  IdAgencia?: Maybe<Scalars['Int']['output']>;
  IdCotizacion?: Maybe<Scalars['Int']['output']>;
  IdPersona?: Maybe<Scalars['Int']['output']>;
  LinkReporte?: Maybe<Scalars['String']['output']>;
};

export type ReserveVehicleInput = {
  contractId: Scalars['String']['input'];
  vin: Scalars['String']['input'];
};

export type SimCard = {
  __typename?: 'SIMCard';
  id?: Maybe<Scalars['Int']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

export enum ScoringResolution {
  Approve = 'APPROVE',
  BackofficeReview = 'BACKOFFICE_REVIEW',
  ManagerReview = 'MANAGER_REVIEW',
  Reject = 'REJECT'
}

export type SendMessageInput = {
  content: Scalars['String']['input'];
  conversationChannel: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type SendNotificationInput = {
  channel: Scalars['String']['input'];
};

export type SetInactivityStatementInput = {
  reason: Scalars['String']['input'];
};

export type SetKycAddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  district: Scalars['String']['input'];
  extNumber: Scalars['String']['input'];
  intNumber: Scalars['String']['input'];
  latitude: Scalars['String']['input'];
  longitude: Scalars['String']['input'];
  real_time_latitude?: InputMaybe<Scalars['String']['input']>;
  real_time_longitude?: InputMaybe<Scalars['String']['input']>;
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type Slot = {
  __typename?: 'Slot';
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  free: Scalars['Boolean']['output'];
  guestUser?: Maybe<User>;
  guestUserId?: Maybe<Scalars['String']['output']>;
  hostUser?: Maybe<User>;
  hostUserId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  prospect?: Maybe<Prospect>;
  prospectId?: Maybe<Scalars['String']['output']>;
  slotType: Scalars['String']['output'];
  startsAt?: Maybe<Scalars['DateTime']['output']>;
  tasks?: Maybe<Array<Maybe<Task>>>;
};

export type SlotFilterInput = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  slotType?: InputMaybe<Scalars['String']['input']>;
};

export type SmartItRegistry = {
  __typename?: 'SmartItRegistry';
  contractId: Scalars['Int']['output'];
  curp?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  quoteSmartItId: Scalars['Int']['output'];
  rfc?: Maybe<Scalars['String']['output']>;
  secondLastName?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  termsId?: Maybe<Scalars['ID']['output']>;
  userId: Scalars['ID']['output'];
  vin: Scalars['String']['output'];
};

export type Task = {
  __typename?: 'Task';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  acceptedByUser?: Maybe<User>;
  application?: Maybe<Application>;
  applicationChecklist?: Maybe<ApplicationChecklist>;
  applicationId?: Maybe<Scalars['ID']['output']>;
  assignedGroups?: Maybe<Array<Maybe<Group>>>;
  assignedUser?: Maybe<User>;
  assignedUserId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  customData?: Maybe<Scalars['String']['output']>;
  declinedAt?: Maybe<Scalars['DateTime']['output']>;
  declinedByUser?: Maybe<User>;
  dismissedAt?: Maybe<Scalars['DateTime']['output']>;
  dismissedByUser?: Maybe<User>;
  dismissible: Scalars['Boolean']['output'];
  done: Scalars['Boolean']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  flaggedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  leasing?: Maybe<Leasing>;
  leasingId?: Maybe<Scalars['ID']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  offer?: Maybe<Offer>;
  offerId?: Maybe<Scalars['ID']['output']>;
  optional: Scalars['Boolean']['output'];
  originTask?: Maybe<Task>;
  originatedTasks?: Maybe<Array<Maybe<Task>>>;
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  quote?: Maybe<Quote>;
  quoteId?: Maybe<Scalars['ID']['output']>;
  relevance?: Maybe<Scalars['Int']['output']>;
  slot?: Maybe<Slot>;
  slotId?: Maybe<Scalars['ID']['output']>;
  taskType?: Maybe<TaskType>;
  taskTypeId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  vehicle?: Maybe<Vehicle>;
  vehicleId?: Maybe<Scalars['ID']['output']>;
};

export enum TaskAction {
  Accept = 'ACCEPT',
  Decline = 'DECLINE',
  Dismiss = 'DISMISS'
}

export type TaskMetadataInput = {
  idcliente?: InputMaybe<Scalars['Int']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  referencia?: InputMaybe<Scalars['String']['input']>;
  slotId?: InputMaybe<Scalars['String']['input']>;
};

export type TaskType = {
  __typename?: 'TaskType';
  assignedGroups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tasks?: Maybe<Array<Maybe<Task>>>;
};

export type TaskTypeGroup = {
  __typename?: 'TaskTypeGroup';
  group?: Maybe<Group>;
  groupId: Scalars['String']['output'];
  taskType?: Maybe<TaskType>;
  taskTypeId: Scalars['String']['output'];
};

export enum TaskTypeId {
  ApplicationBackofficeApproval = 'APPLICATION_BACKOFFICE_APPROVAL',
  ApplicationManagerApproval = 'APPLICATION_MANAGER_APPROVAL',
  DeliveryDate = 'DELIVERY_DATE',
  KycAddressInput = 'KYC_ADDRESS_INPUT',
  KycAddressProofJob = 'KYC_ADDRESS_PROOF_JOB',
  KycAddressProofUpload = 'KYC_ADDRESS_PROOF_UPLOAD',
  KycAddressVerification = 'KYC_ADDRESS_VERIFICATION',
  KycDriversLicenseJob = 'KYC_DRIVERS_LICENSE_JOB',
  KycDriversLicenseReverseJob = 'KYC_DRIVERS_LICENSE_REVERSE_JOB',
  KycDriversLicenseReverseUpload = 'KYC_DRIVERS_LICENSE_REVERSE_UPLOAD',
  KycDriversLicenseUpload = 'KYC_DRIVERS_LICENSE_UPLOAD',
  KycDriversLicenseVerification = 'KYC_DRIVERS_LICENSE_VERIFICATION',
  KycFinalApproval = 'KYC_FINAL_APPROVAL',
  KycIdentificationCardJob = 'KYC_IDENTIFICATION_CARD_JOB',
  KycIdentificationCardReverserJob = 'KYC_IDENTIFICATION_CARD_REVERSER_JOB',
  KycIdentificationCardReverseUpload = 'KYC_IDENTIFICATION_CARD_REVERSE_UPLOAD',
  KycIdentificationCardUpload = 'KYC_IDENTIFICATION_CARD_UPLOAD',
  KycIdentificationCardVerification = 'KYC_IDENTIFICATION_CARD_VERIFICATION',
  KycInactivityStatementInput = 'KYC_INACTIVITY_STATEMENT_INPUT',
  KycInactivityStatementJob = 'KYC_INACTIVITY_STATEMENT_JOB',
  KycInactivityStatementUpload = 'KYC_INACTIVITY_STATEMENT_UPLOAD',
  KycInactivityStatementVerification = 'KYC_INACTIVITY_STATEMENT_VERIFICATION',
  KycIncomeStatementJob = 'KYC_INCOME_STATEMENT_JOB',
  KycIncomeStatementUpload = 'KYC_INCOME_STATEMENT_UPLOAD',
  KycIncomeStatementVerification = 'KYC_INCOME_STATEMENT_VERIFICATION',
  KycMeetAddressMatch = 'KYC_MEET_ADDRESS_MATCH',
  KycMeetCancelDate = 'KYC_MEET_CANCEL_DATE',
  KycMeetCheckin = 'KYC_MEET_CHECKIN',
  KycMeetConfirmDate = 'KYC_MEET_CONFIRM_DATE',
  KycMeetGuestInvitation = 'KYC_MEET_GUEST_INVITATION',
  KycMeetHostInvitation = 'KYC_MEET_HOST_INVITATION',
  KycMeetPickDate = 'KYC_MEET_PICK_DATE',
  KycSelfiePictureJob = 'KYC_SELFIE_PICTURE_JOB',
  KycSelfiePictureUpload = 'KYC_SELFIE_PICTURE_UPLOAD',
  KycSelfiePictureVerification = 'KYC_SELFIE_PICTURE_VERIFICATION',
  KycTaxIdentificationJob = 'KYC_TAX_IDENTIFICATION_JOB',
  KycTaxIdentificationUpload = 'KYC_TAX_IDENTIFICATION_UPLOAD',
  KycTaxIdentificationVerification = 'KYC_TAX_IDENTIFICATION_VERIFICATION',
  LeasingContractSignature = 'LEASING_CONTRACT_SIGNATURE',
  PaymentCheckout = 'PAYMENT_CHECKOUT',
  PaymentReconciliation = 'PAYMENT_RECONCILIATION',
  PaymentValidation = 'PAYMENT_VALIDATION',
  PendingDocuments = 'PENDING_DOCUMENTS',
  UberDriverContract = 'UBER_DRIVER_CONTRACT',
  UberVehicleRegistration = 'UBER_VEHICLE_REGISTRATION',
  VehicleAssurance = 'VEHICLE_ASSURANCE',
  VehicleAuthorization = 'VEHICLE_AUTHORIZATION',
  VehicleHandoffCancelDate = 'VEHICLE_HANDOFF_CANCEL_DATE',
  VehicleHandoffCheckin = 'VEHICLE_HANDOFF_CHECKIN',
  VehicleHandoffConfirmDate = 'VEHICLE_HANDOFF_CONFIRM_DATE',
  VehicleHandoffPickDate = 'VEHICLE_HANDOFF_PICK_DATE',
  VehicleInventoryRelease = 'VEHICLE_INVENTORY_RELEASE',
  VehicleInventoryReserve = 'VEHICLE_INVENTORY_RESERVE',
  VehicleStreetTagInstallation = 'VEHICLE_STREET_TAG_INSTALLATION',
  VehicleTitle = 'VEHICLE_TITLE',
  VehicleTrackerInstallation = 'VEHICLE_TRACKER_INSTALLATION',
  VehicleTrackerSim = 'VEHICLE_TRACKER_SIM'
}

export type TaxPerson = {
  __typename?: 'TaxPerson';
  Url: Scalars['String']['output'];
  idUser: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type TrackerDeviceStatus = {
  __typename?: 'TrackerDeviceStatus';
  currentOdometer?: Maybe<Scalars['Int']['output']>;
  drivingScore?: Maybe<Scalars['Float']['output']>;
  ignition?: Maybe<Scalars['Boolean']['output']>;
  lastConnection?: Maybe<Scalars['DateTime']['output']>;
  lastLat?: Maybe<Scalars['Float']['output']>;
  lastLon?: Maybe<Scalars['Float']['output']>;
  lastUpdate?: Maybe<Scalars['DateTime']['output']>;
  motion?: Maybe<Scalars['Boolean']['output']>;
  speed?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalEvents?: Maybe<Scalars['Int']['output']>;
  totalTrips?: Maybe<Scalars['Int']['output']>;
  uberWeeksSumDistance?: Maybe<Scalars['Float']['output']>;
  uberWeeksUsage?: Maybe<Scalars['Float']['output']>;
  weeksSumDistance?: Maybe<Scalars['Float']['output']>;
};

export type TrackerTrip = {
  __typename?: 'TrackerTrip';
  averageSpeed?: Maybe<Scalars['Float']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  deviceId?: Maybe<Scalars['Int']['output']>;
  deviceName?: Maybe<Scalars['String']['output']>;
  distance?: Maybe<Scalars['Float']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  endAddress?: Maybe<Scalars['String']['output']>;
  endLat?: Maybe<Scalars['Float']['output']>;
  endLon?: Maybe<Scalars['Float']['output']>;
  endOdometer?: Maybe<Scalars['Int']['output']>;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  maxSpeed?: Maybe<Scalars['Float']['output']>;
  score?: Maybe<TrackerTripScore>;
  startAddress?: Maybe<Scalars['String']['output']>;
  startLat?: Maybe<Scalars['Float']['output']>;
  startLon?: Maybe<Scalars['Float']['output']>;
  startOdometer?: Maybe<Scalars['Int']['output']>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
  tripId?: Maybe<Scalars['String']['output']>;
};

export type TrackerTripScore = {
  __typename?: 'TrackerTripScore';
  contextScore?: Maybe<Scalars['String']['output']>;
  distance?: Maybe<Scalars['Float']['output']>;
  drivingScore?: Maybe<Scalars['Int']['output']>;
  drivingScoreContextualized?: Maybe<Scalars['Int']['output']>;
  events?: Maybe<Scalars['String']['output']>;
  totalEvents?: Maybe<Scalars['Int']['output']>;
  validPositions?: Maybe<Scalars['String']['output']>;
};

export type Trip = {
  __typename?: 'Trip';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  arrivedAt?: Maybe<Scalars['DateTime']['output']>;
  distance?: Maybe<Scalars['Int']['output']>;
  dropoffAt?: Maybe<Scalars['DateTime']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  fareAmount?: Maybe<Scalars['Float']['output']>;
  fareCurrency?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  loggedAt: Scalars['DateTime']['output'];
  pickupAt?: Maybe<Scalars['DateTime']['output']>;
  pickupLat?: Maybe<Scalars['Int']['output']>;
  pickupLng?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
  vehicleId?: Maybe<Scalars['ID']['output']>;
};

export type UberItemCategory = {
  __typename?: 'UberItemCategory';
  category: Scalars['String']['output'];
  categoryId?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  parentCategory?: Maybe<UberItemCategory>;
};

export type UberItemEntity = {
  __typename?: 'UberItemEntity';
  billItemId?: Maybe<Scalars['Int']['output']>;
  contentCategoryId?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  paymentItemId?: Maybe<Scalars['Int']['output']>;
  uberItem: Scalars['String']['output'];
  uberItemCategory?: Maybe<UberItemCategory>;
  uberItemCategoryId: Scalars['Int']['output'];
};

export type UpdateUserDriverLicenseInfoInput = {
  driverLicenseNumber: Scalars['String']['input'];
  driverLicensePermanent: Scalars['Boolean']['input'];
  driverLicenseValidity?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['ID']['input'];
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
  application?: Maybe<Application>;
  applications?: Maybe<Array<Maybe<Application>>>;
  assignedTasks?: Maybe<Array<Maybe<Task>>>;
  curp?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['DateTime']['output']>;
  driverLicenseNumber?: Maybe<Scalars['String']['output']>;
  driverLicensePermanent?: Maybe<Scalars['Boolean']['output']>;
  driverLicenseValidity?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  fullTasks?: Maybe<FullTasks>;
  gender?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  leasings?: Maybe<Array<Maybe<Leasing>>>;
  pendingTasks?: Maybe<Array<Maybe<Task>>>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  picture?: Maybe<Scalars['String']['output']>;
  quotes?: Maybe<Array<Maybe<Quote>>>;
  rfc?: Maybe<Scalars['String']['output']>;
  secondLastName?: Maybe<Scalars['String']['output']>;
  smartItRegistry?: Maybe<SmartItRegistry>;
  uberActivationStatus?: Maybe<Scalars['String']['output']>;
  uberCityCode?: Maybe<Scalars['String']['output']>;
  uberCityName?: Maybe<Scalars['String']['output']>;
  uberDriverId?: Maybe<Scalars['String']['output']>;
  uberEarningsRetentionActive?: Maybe<Scalars['Boolean']['output']>;
  uberLastMonthEarnings?: Maybe<Scalars['Int']['output']>;
  uberLastMonthTripCount?: Maybe<Scalars['Int']['output']>;
  uberPartnerRole?: Maybe<Scalars['String']['output']>;
  uberPromoCode?: Maybe<Scalars['String']['output']>;
  uberRating?: Maybe<Scalars['String']['output']>;
  uberTenureMonths?: Maybe<Scalars['Int']['output']>;
  uberTier?: Maybe<Scalars['String']['output']>;
};

export type Vehicle = {
  __typename?: 'Vehicle';
  color?: Maybe<Scalars['String']['output']>;
  contract?: Maybe<ContractEntity>;
  contractId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['String']['output']>;
  trackerDeviceId?: Maybe<Scalars['String']['output']>;
  trackerDeviceSim?: Maybe<Scalars['String']['output']>;
  vehicleSmartIt?: Maybe<VehicleSmartIt>;
  vin?: Maybe<Scalars['String']['output']>;
};

export type VehicleColorSmartIt = {
  __typename?: 'VehicleColorSmartIt';
  external?: Maybe<Scalars['String']['output']>;
  internal?: Maybe<Scalars['String']['output']>;
};

export type VehicleInventory = {
  __typename?: 'VehicleInventory';
  brand: Scalars['String']['output'];
  inventoryNumber: Scalars['Int']['output'];
  invoiceValue: Scalars['Float']['output'];
  model: Scalars['String']['output'];
  serialNumber: Scalars['String']['output'];
  vehicleId: Scalars['Int']['output'];
  version: Scalars['String']['output'];
  versionId: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type VehicleReservationEntity = {
  __typename?: 'VehicleReservationEntity';
  IMEI: Scalars['String']['output'];
  IdGPS: Scalars['Int']['output'];
  Telefono: Scalars['String']['output'];
  VIN: Scalars['String']['output'];
};

export type VehicleSmartIt = {
  __typename?: 'VehicleSmartIt';
  brand?: Maybe<Scalars['String']['output']>;
  color?: Maybe<VehicleColorSmartIt>;
  cost?: Maybe<Scalars['Int']['output']>;
  gps?: Maybe<Gps>;
  inventoryId?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  numberPlates?: Maybe<Scalars['String']['output']>;
  serialNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  vehicleSmartItId?: Maybe<Scalars['Int']['output']>;
  version?: Maybe<Scalars['String']['output']>;
  versionId?: Maybe<Scalars['Int']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type VehicleStatusResponse = {
  __typename?: 'VehicleStatusResponse';
  tracker?: Maybe<TrackerDeviceStatus>;
};

export type VehicleUsage = {
  __typename?: 'VehicleUsage';
  date?: Maybe<Scalars['DateTime']['output']>;
  dayOfWeek: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  tracker: Scalars['Float']['output'];
  uber: Scalars['Float']['output'];
};

export type VehicleUsageSummary = {
  __typename?: 'VehicleUsageSummary';
  currentOdometer: Scalars['Float']['output'];
  drivingScore: Scalars['Float']['output'];
  percentage: Scalars['Float']['output'];
  totalEvents: Scalars['Int']['output'];
  totalTrips: Scalars['Int']['output'];
  uberWeeksSumDistance: Scalars['Float']['output'];
  uberWeeksUsage: Scalars['Float']['output'];
  weeksSumDistance: Scalars['Float']['output'];
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
  AccountSummary: ResolverTypeWrapper<AccountSummary>;
  Address: ResolverTypeWrapper<Address>;
  Alarm: ResolverTypeWrapper<Alarm>;
  Application: ResolverTypeWrapper<Application>;
  ApplicationChecklist: ResolverTypeWrapper<ApplicationChecklist>;
  ApplicationFlowStatus: ApplicationFlowStatus;
  BankReferDeatil: ResolverTypeWrapper<BankReferDeatil>;
  BitacoraEntity: ResolverTypeWrapper<BitacoraEntity>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Checklist: ResolverTypeWrapper<Checklist>;
  ClientApiAuthResponse: ResolverTypeWrapper<ClientApiAuthResponse>;
  ClientOverview: ResolverTypeWrapper<ClientOverview>;
  ClientsByActivity: ResolverTypeWrapper<ClientsByActivity>;
  Content: ResolverTypeWrapper<Content>;
  ContentMetadata: ResolverTypeWrapper<ContentMetadata>;
  ContractEntity: ResolverTypeWrapper<ContractEntity>;
  ContractSigningEntity: ResolverTypeWrapper<ContractSigningEntity>;
  Conversation: ResolverTypeWrapper<Conversation>;
  ConversationContact: ResolverTypeWrapper<ConversationContact>;
  ConversationMessage: ResolverTypeWrapper<ConversationMessage>;
  CreateApplicationResponse: ResolverTypeWrapper<CreateApplicationResponse>;
  CreateInvitationInput: CreateInvitationInput;
  CreateLeadInput: CreateLeadInput;
  CreateUserInput: CreateUserInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeliveryEntity: ResolverTypeWrapper<DeliveryEntity>;
  DeliveryLocation: ResolverTypeWrapper<DeliveryLocation>;
  DeviceTokenEntity: ResolverTypeWrapper<DeviceTokenEntity>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FullTasks: ResolverTypeWrapper<FullTasks>;
  GPS: ResolverTypeWrapper<Gps>;
  GetProspectsFilters: GetProspectsFilters;
  Group: ResolverTypeWrapper<Group>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IncidentEntity: ResolverTypeWrapper<IncidentEntity>;
  IncidentFilesInput: IncidentFilesInput;
  IncidentInput: IncidentInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Invitation: ResolverTypeWrapper<Invitation>;
  InvitationOverview: ResolverTypeWrapper<InvitationOverview>;
  InvitationOverviewCountRefine: ResolverTypeWrapper<InvitationOverviewCountRefine>;
  InvitationStatus: InvitationStatus;
  KycApplicationsByActivity: ResolverTypeWrapper<KycApplicationsByActivity>;
  KycApplicationsByProgress: ResolverTypeWrapper<KycApplicationsByProgress>;
  KycIdentificationCardMatch: ResolverTypeWrapper<KycIdentificationCardMatch>;
  KycIdentificationCardMatchParsed: ResolverTypeWrapper<KycIdentificationCardMatchParsed>;
  KycOverview: ResolverTypeWrapper<KycOverview>;
  Lead: ResolverTypeWrapper<Lead>;
  LeadOverview: ResolverTypeWrapper<LeadOverview>;
  LeadOverviewCountRefine: ResolverTypeWrapper<LeadOverviewCountRefine>;
  LeadStatus: LeadStatus;
  Leasing: ResolverTypeWrapper<Leasing>;
  LeasingAccountSummary: ResolverTypeWrapper<LeasingAccountSummary>;
  LeasingAlarmsResponse: ResolverTypeWrapper<LeasingAlarmsResponse>;
  LeasingDailySummary: ResolverTypeWrapper<LeasingDailySummary>;
  LeasingFinancialDebtVoucher: ResolverTypeWrapper<LeasingFinancialDebtVoucher>;
  LeasingFinancialWeekSummary: ResolverTypeWrapper<LeasingFinancialWeekSummary>;
  LeasingPendingBankReference: ResolverTypeWrapper<LeasingPendingBankReference>;
  LeasingPendingPayment: ResolverTypeWrapper<LeasingPendingPayment>;
  LeasingPendingPaymentDetail: ResolverTypeWrapper<LeasingPendingPaymentDetail>;
  LeasingSummary: ResolverTypeWrapper<LeasingSummary>;
  LeasingWeekDetail: ResolverTypeWrapper<LeasingWeekDetail>;
  LeasingWeeklySummary: ResolverTypeWrapper<LeasingWeeklySummary>;
  Location: ResolverTypeWrapper<Location>;
  Mutation: ResolverTypeWrapper<{}>;
  Offer: ResolverTypeWrapper<Offer>;
  OfferScoringDetail: ResolverTypeWrapper<OfferScoringDetail>;
  ParamDetail: ResolverTypeWrapper<ParamDetail>;
  ParamHeader: ResolverTypeWrapper<ParamHeader>;
  PaymentBillEntity: ResolverTypeWrapper<PaymentBillEntity>;
  PaymentValidationEntity: ResolverTypeWrapper<PaymentValidationEntity>;
  PendingDocuments: ResolverTypeWrapper<PendingDocuments>;
  Person: ResolverTypeWrapper<Person>;
  PersonRegis: ResolverTypeWrapper<PersonRegis>;
  PersonUpdateEntity: ResolverTypeWrapper<PersonUpdateEntity>;
  Product: ResolverTypeWrapper<Product>;
  Prospect: ResolverTypeWrapper<Prospect>;
  ProspectActivity: ResolverTypeWrapper<ProspectActivity>;
  ProspectActivityType: ResolverTypeWrapper<ProspectActivityType>;
  ProspectCountByScoringMark: ResolverTypeWrapper<ProspectCountByScoringMark>;
  ProspectOverview: ResolverTypeWrapper<ProspectOverview>;
  ProspectSituationCount: ResolverTypeWrapper<ProspectSituationCount>;
  ProspectStatus: ResolverTypeWrapper<ProspectStatus>;
  Query: ResolverTypeWrapper<{}>;
  Quote: ResolverTypeWrapper<Quote>;
  QuoteSmartItResponse: ResolverTypeWrapper<QuoteSmartItResponse>;
  ReserveVehicleInput: ReserveVehicleInput;
  SIMCard: ResolverTypeWrapper<SimCard>;
  ScoringResolution: ScoringResolution;
  SendMessageInput: SendMessageInput;
  SendNotificationInput: SendNotificationInput;
  SetInactivityStatementInput: SetInactivityStatementInput;
  SetKycAddressInput: SetKycAddressInput;
  Slot: ResolverTypeWrapper<Slot>;
  SlotFilterInput: SlotFilterInput;
  SmartItRegistry: ResolverTypeWrapper<SmartItRegistry>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Task: ResolverTypeWrapper<Task>;
  TaskAction: TaskAction;
  TaskMetadataInput: TaskMetadataInput;
  TaskType: ResolverTypeWrapper<TaskType>;
  TaskTypeGroup: ResolverTypeWrapper<TaskTypeGroup>;
  TaskTypeId: TaskTypeId;
  TaxPerson: ResolverTypeWrapper<TaxPerson>;
  TrackerDeviceStatus: ResolverTypeWrapper<TrackerDeviceStatus>;
  TrackerTrip: ResolverTypeWrapper<TrackerTrip>;
  TrackerTripScore: ResolverTypeWrapper<TrackerTripScore>;
  Trip: ResolverTypeWrapper<Trip>;
  UberItemCategory: ResolverTypeWrapper<UberItemCategory>;
  UberItemEntity: ResolverTypeWrapper<UberItemEntity>;
  UpdateUserDriverLicenseInfoInput: UpdateUserDriverLicenseInfoInput;
  UpdateUserPersonalInfoInput: UpdateUserPersonalInfoInput;
  User: ResolverTypeWrapper<User>;
  Vehicle: ResolverTypeWrapper<Vehicle>;
  VehicleColorSmartIt: ResolverTypeWrapper<VehicleColorSmartIt>;
  VehicleInventory: ResolverTypeWrapper<VehicleInventory>;
  VehicleReservationEntity: ResolverTypeWrapper<VehicleReservationEntity>;
  VehicleSmartIt: ResolverTypeWrapper<VehicleSmartIt>;
  VehicleStatusResponse: ResolverTypeWrapper<VehicleStatusResponse>;
  VehicleUsage: ResolverTypeWrapper<VehicleUsage>;
  VehicleUsageSummary: ResolverTypeWrapper<VehicleUsageSummary>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccountSummary: AccountSummary;
  Address: Address;
  Alarm: Alarm;
  Application: Application;
  ApplicationChecklist: ApplicationChecklist;
  BankReferDeatil: BankReferDeatil;
  BitacoraEntity: BitacoraEntity;
  Boolean: Scalars['Boolean']['output'];
  Checklist: Checklist;
  ClientApiAuthResponse: ClientApiAuthResponse;
  ClientOverview: ClientOverview;
  ClientsByActivity: ClientsByActivity;
  Content: Content;
  ContentMetadata: ContentMetadata;
  ContractEntity: ContractEntity;
  ContractSigningEntity: ContractSigningEntity;
  Conversation: Conversation;
  ConversationContact: ConversationContact;
  ConversationMessage: ConversationMessage;
  CreateApplicationResponse: CreateApplicationResponse;
  CreateInvitationInput: CreateInvitationInput;
  CreateLeadInput: CreateLeadInput;
  CreateUserInput: CreateUserInput;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  DeliveryEntity: DeliveryEntity;
  DeliveryLocation: DeliveryLocation;
  DeviceTokenEntity: DeviceTokenEntity;
  Float: Scalars['Float']['output'];
  FullTasks: FullTasks;
  GPS: Gps;
  GetProspectsFilters: GetProspectsFilters;
  Group: Group;
  ID: Scalars['ID']['output'];
  IncidentEntity: IncidentEntity;
  IncidentFilesInput: IncidentFilesInput;
  IncidentInput: IncidentInput;
  Int: Scalars['Int']['output'];
  Invitation: Invitation;
  InvitationOverview: InvitationOverview;
  InvitationOverviewCountRefine: InvitationOverviewCountRefine;
  KycApplicationsByActivity: KycApplicationsByActivity;
  KycApplicationsByProgress: KycApplicationsByProgress;
  KycIdentificationCardMatch: KycIdentificationCardMatch;
  KycIdentificationCardMatchParsed: KycIdentificationCardMatchParsed;
  KycOverview: KycOverview;
  Lead: Lead;
  LeadOverview: LeadOverview;
  LeadOverviewCountRefine: LeadOverviewCountRefine;
  Leasing: Leasing;
  LeasingAccountSummary: LeasingAccountSummary;
  LeasingAlarmsResponse: LeasingAlarmsResponse;
  LeasingDailySummary: LeasingDailySummary;
  LeasingFinancialDebtVoucher: LeasingFinancialDebtVoucher;
  LeasingFinancialWeekSummary: LeasingFinancialWeekSummary;
  LeasingPendingBankReference: LeasingPendingBankReference;
  LeasingPendingPayment: LeasingPendingPayment;
  LeasingPendingPaymentDetail: LeasingPendingPaymentDetail;
  LeasingSummary: LeasingSummary;
  LeasingWeekDetail: LeasingWeekDetail;
  LeasingWeeklySummary: LeasingWeeklySummary;
  Location: Location;
  Mutation: {};
  Offer: Offer;
  OfferScoringDetail: OfferScoringDetail;
  ParamDetail: ParamDetail;
  ParamHeader: ParamHeader;
  PaymentBillEntity: PaymentBillEntity;
  PaymentValidationEntity: PaymentValidationEntity;
  PendingDocuments: PendingDocuments;
  Person: Person;
  PersonRegis: PersonRegis;
  PersonUpdateEntity: PersonUpdateEntity;
  Product: Product;
  Prospect: Prospect;
  ProspectActivity: ProspectActivity;
  ProspectActivityType: ProspectActivityType;
  ProspectCountByScoringMark: ProspectCountByScoringMark;
  ProspectOverview: ProspectOverview;
  ProspectSituationCount: ProspectSituationCount;
  ProspectStatus: ProspectStatus;
  Query: {};
  Quote: Quote;
  QuoteSmartItResponse: QuoteSmartItResponse;
  ReserveVehicleInput: ReserveVehicleInput;
  SIMCard: SimCard;
  SendMessageInput: SendMessageInput;
  SendNotificationInput: SendNotificationInput;
  SetInactivityStatementInput: SetInactivityStatementInput;
  SetKycAddressInput: SetKycAddressInput;
  Slot: Slot;
  SlotFilterInput: SlotFilterInput;
  SmartItRegistry: SmartItRegistry;
  String: Scalars['String']['output'];
  Task: Task;
  TaskMetadataInput: TaskMetadataInput;
  TaskType: TaskType;
  TaskTypeGroup: TaskTypeGroup;
  TaxPerson: TaxPerson;
  TrackerDeviceStatus: TrackerDeviceStatus;
  TrackerTrip: TrackerTrip;
  TrackerTripScore: TrackerTripScore;
  Trip: Trip;
  UberItemCategory: UberItemCategory;
  UberItemEntity: UberItemEntity;
  UpdateUserDriverLicenseInfoInput: UpdateUserDriverLicenseInfoInput;
  UpdateUserPersonalInfoInput: UpdateUserPersonalInfoInput;
  User: User;
  Vehicle: Vehicle;
  VehicleColorSmartIt: VehicleColorSmartIt;
  VehicleInventory: VehicleInventory;
  VehicleReservationEntity: VehicleReservationEntity;
  VehicleSmartIt: VehicleSmartIt;
  VehicleStatusResponse: VehicleStatusResponse;
  VehicleUsage: VehicleUsage;
  VehicleUsageSummary: VehicleUsageSummary;
};

export type AccountSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountSummary'] = ResolversParentTypes['AccountSummary']> = {
  accountName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  accountTypeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  subAccounts?: Resolver<Maybe<Array<Maybe<ResolversTypes['AccountSummary']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  district?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  extNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  intNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  real_time_latitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  real_time_longitude?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zipCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AlarmResolvers<ContextType = any, ParentType extends ResolversParentTypes['Alarm'] = ResolversParentTypes['Alarm']> = {
  alertLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deviceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subcategory?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApplicationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Application'] = ResolversParentTypes['Application']> = {
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  addressProof?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  checklist?: Resolver<Maybe<Array<Maybe<ResolversTypes['ApplicationChecklist']>>>, ParentType, ContextType>;
  contract?: Resolver<Maybe<ResolversTypes['ContractEntity']>, ParentType, ContextType>;
  contractDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  currentStep?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  driversLicense?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  driversLicenseReverse?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  expiredAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  finishedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  friendlyId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasDriverEngaged?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasKycFinished?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  identificationCard?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  identificationCardReverse?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  idpersona?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  inactivityStatement?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  inactivityStatementReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  incomeStatement?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  offer?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType>;
  offerId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType>;
  quoteSmartItId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  selfiePicture?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  taxIdentification?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberProfileImageSrc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  vehicle?: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApplicationChecklistResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApplicationChecklist'] = ResolversParentTypes['ApplicationChecklist']> = {
  application?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType>;
  applicationId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  checklist?: Resolver<Maybe<ResolversTypes['Checklist']>, ParentType, ContextType>;
  checklistId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  childs?: Resolver<Maybe<Array<Maybe<ResolversTypes['ApplicationChecklist']>>>, ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dismissible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  fullTasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isCompleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isDismissed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPending?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isStarted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['ApplicationChecklist']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BankReferDeatilResolvers<ContextType = any, ParentType extends ResolversParentTypes['BankReferDeatil'] = ResolversParentTypes['BankReferDeatil']> = {
  account?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  agreement?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bank?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bankId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ciaId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  clabe?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BitacoraEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['BitacoraEntity'] = ResolversParentTypes['BitacoraEntity']> = {
  alarmId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChecklistResolvers<ContextType = any, ParentType extends ResolversParentTypes['Checklist'] = ResolversParentTypes['Checklist']> = {
  childs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Checklist']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Checklist']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientApiAuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClientApiAuthResponse'] = ResolversParentTypes['ClientApiAuthResponse']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientOverviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClientOverview'] = ResolversParentTypes['ClientOverview']> = {
  byActivity?: Resolver<ResolversTypes['ClientsByActivity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientsByActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClientsByActivity'] = ResolversParentTypes['ClientsByActivity']> = {
  withDebt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  withoutDebt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Content'] = ResolversParentTypes['Content']> = {
  downloadUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['ContentMetadata']>, ParentType, ContextType>;
  previewUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  viewUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentMetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContentMetadata'] = ResolversParentTypes['ContentMetadata']> = {
  originalFilename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContractEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContractEntity'] = ResolversParentTypes['ContractEntity']> = {
  bankReference?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clientId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contractWeeks?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  deliveryDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deliveryLocation?: Resolver<Maybe<ResolversTypes['DeliveryLocation']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  insurancePolicyFolio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  interestRate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  pathBankReference?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pathContract?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pathDeliveryLetter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weeklyCost?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContractSigningEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContractSigningEntity'] = ResolversParentTypes['ContractSigningEntity']> = {
  Id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConversationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Conversation'] = ResolversParentTypes['Conversation']> = {
  canReply?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  channel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalLink?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastActivityAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['ConversationMessage']>>>, ParentType, ContextType>;
  unreadCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConversationContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConversationContact'] = ResolversParentTypes['ConversationContact']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConversationMessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConversationMessage'] = ResolversParentTypes['ConversationMessage']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['ConversationContact'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateApplicationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateApplicationResponse'] = ResolversParentTypes['CreateApplicationResponse']> = {
  application?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType>;
  flowStatus?: Resolver<Maybe<ResolversTypes['ApplicationFlowStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeliveryEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryEntity'] = ResolversParentTypes['DeliveryEntity']> = {
  Id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryLocation'] = ResolversParentTypes['DeliveryLocation']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  categoryId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  latitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeviceTokenEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeviceTokenEntity'] = ResolversParentTypes['DeviceTokenEntity']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  device?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FullTasksResolvers<ContextType = any, ParentType extends ResolversParentTypes['FullTasks'] = ResolversParentTypes['FullTasks']> = {
  userAssigned?: Resolver<Array<Maybe<ResolversTypes['Task']>>, ParentType, ContextType>;
  userGroupsAssigned?: Resolver<Array<Maybe<ResolversTypes['Task']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GpsResolvers<ContextType = any, ParentType extends ResolversParentTypes['GPS'] = ResolversParentTypes['GPS']> = {
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  imei?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  partNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  serialNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  simCard?: Resolver<Maybe<ResolversTypes['SIMCard']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IncidentEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['IncidentEntity'] = ResolversParentTypes['IncidentEntity']> = {
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  companyId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  registeredAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberItem?: Resolver<Maybe<ResolversTypes['UberItemEntity']>, ParentType, ContextType>;
  uberItemId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvitationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invitation'] = ResolversParentTypes['Invitation']> = {
  application?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType>;
  applicationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  branchId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  campaignId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasUberAccount?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isOnsite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  promotionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prospect?: Resolver<Maybe<ResolversTypes['Prospect']>, ParentType, ContextType>;
  prospectId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType>;
  quoteId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  referrer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  referrerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['InvitationStatus']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvitationOverviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvitationOverview'] = ResolversParentTypes['InvitationOverview']> = {
  withUberAccount?: Resolver<ResolversTypes['InvitationOverviewCountRefine'], ParentType, ContextType>;
  withoutUberAccount?: Resolver<ResolversTypes['InvitationOverviewCountRefine'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvitationOverviewCountRefineResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvitationOverviewCountRefine'] = ResolversParentTypes['InvitationOverviewCountRefine']> = {
  accepted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  expired?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KycApplicationsByActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycApplicationsByActivity'] = ResolversParentTypes['KycApplicationsByActivity']> = {
  delayedByBackoffice?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  delayedByDriver?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  delayedByManager?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  onTime?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KycApplicationsByProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycApplicationsByProgress'] = ResolversParentTypes['KycApplicationsByProgress']> = {
  deliveryProcess?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  kycComplete?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  kycDriverEngaged?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KycIdentificationCardMatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycIdentificationCardMatch'] = ResolversParentTypes['KycIdentificationCardMatch']> = {
  parsed?: Resolver<Maybe<ResolversTypes['KycIdentificationCardMatchParsed']>, ParentType, ContextType>;
  verdict?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KycIdentificationCardMatchParsedResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycIdentificationCardMatchParsed'] = ResolversParentTypes['KycIdentificationCardMatchParsed']> = {
  addressCity?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addressHouseNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addressNeighborhood?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addressPostalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addressState?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addressStreetName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dob?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KycOverviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['KycOverview'] = ResolversParentTypes['KycOverview']> = {
  byActivity?: Resolver<ResolversTypes['KycApplicationsByActivity'], ParentType, ContextType>;
  byProgress?: Resolver<ResolversTypes['KycApplicationsByProgress'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeadResolvers<ContextType = any, ParentType extends ResolversParentTypes['Lead'] = ResolversParentTypes['Lead']> = {
  browserName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  browserVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactype?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  countryCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deviceModel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deviceType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deviceVendor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  engineName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  engineVersion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasUberAccount?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isBot?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['LeadStatus']>, ParentType, ContextType>;
  supportUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  supportUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  visitAppointmentAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeadOverviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeadOverview'] = ResolversParentTypes['LeadOverview']> = {
  withUberAccount?: Resolver<ResolversTypes['LeadOverviewCountRefine'], ParentType, ContextType>;
  withoutUberAccount?: Resolver<ResolversTypes['LeadOverviewCountRefine'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeadOverviewCountRefineResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeadOverviewCountRefine'] = ResolversParentTypes['LeadOverviewCountRefine']> = {
  arrived?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  beingManaged?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  converted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dismissed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Leasing'] = ResolversParentTypes['Leasing']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  locationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  vehicle?: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType>;
  vehicleId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingAccountSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingAccountSummary'] = ResolversParentTypes['LeasingAccountSummary']> = {
  accounts?: Resolver<Maybe<Array<Maybe<ResolversTypes['AccountSummary']>>>, ParentType, ContextType>;
  companyId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cycleEndDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  grandTotal?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  weekNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingAlarmsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingAlarmsResponse'] = ResolversParentTypes['LeasingAlarmsResponse']> = {
  alarms?: Resolver<Maybe<Array<Maybe<ResolversTypes['Alarm']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingDailySummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingDailySummary'] = ResolversParentTypes['LeasingDailySummary']> = {
  trips?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tripsDailyDistance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  tripsDailyScoring?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  tripsEndOdometer?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  uberDailyDistance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  uberFare?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  uberTrips?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uberUsage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingFinancialDebtVoucherResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingFinancialDebtVoucher'] = ResolversParentTypes['LeasingFinancialDebtVoucher']> = {
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  validUntil?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingFinancialWeekSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingFinancialWeekSummary'] = ResolversParentTypes['LeasingFinancialWeekSummary']> = {
  behaviorFineAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  cutDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  interestsAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  otherFinesAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  previousUnpaidAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  weekNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  weeklyFeeAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingPendingBankReferenceResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingPendingBankReference'] = ResolversParentTypes['LeasingPendingBankReference']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  pendingPayments?: Resolver<Maybe<Array<Maybe<ResolversTypes['LeasingPendingPayment']>>>, ParentType, ContextType>;
  reference?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingPendingPaymentResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingPendingPayment'] = ResolversParentTypes['LeasingPendingPayment']> = {
  bankReferer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cycleEndDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  details?: Resolver<Maybe<Array<Maybe<ResolversTypes['LeasingPendingPaymentDetail']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  week?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingPendingPaymentDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingPendingPaymentDetail'] = ResolversParentTypes['LeasingPendingPaymentDetail']> = {
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingSummary'] = ResolversParentTypes['LeasingSummary']> = {
  baseServiceAmount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  contractNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  earningsProgress?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expensesAmount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  previousExpensesAmount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  previousExpensesDueDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalAmount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uberEarningsGross?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  usage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  usagePenalty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  usagePenaltyAmount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  weekNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingWeekDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingWeekDetail'] = ResolversParentTypes['LeasingWeekDetail']> = {
  companyId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cycleEndDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dueDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isClosed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isReconciliated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  weekNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LeasingWeeklySummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeasingWeeklySummary'] = ResolversParentTypes['LeasingWeeklySummary']> = {
  trips?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tripsWeeklyDistance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  tripsWeeklyEndOdometer?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  tripsWeeklyScoring?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  uberFares?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  uberTrips?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uberUsage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  uberWeeklyDistance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptInvitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<MutationAcceptInvitationArgs, 'userId'>>;
  assignTrackerDeviceSimToVehicle?: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType, RequireFields<MutationAssignTrackerDeviceSimToVehicleArgs, 'taskId' | 'trackerDeviceSim'>>;
  assignTrackerDeviceToVehicle?: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType, RequireFields<MutationAssignTrackerDeviceToVehicleArgs, 'taskId' | 'trackerDeviceId'>>;
  confirmSlot?: Resolver<Maybe<ResolversTypes['Slot']>, ParentType, ContextType, RequireFields<MutationConfirmSlotArgs, 'slotId'>>;
  conversationSendMessage?: Resolver<Maybe<Array<Maybe<ResolversTypes['Conversation']>>>, ParentType, ContextType, RequireFields<MutationConversationSendMessageArgs, 'input'>>;
  createApplication?: Resolver<ResolversTypes['CreateApplicationResponse'], ParentType, ContextType, RequireFields<MutationCreateApplicationArgs, 'offerId'>>;
  createBankReference?: Resolver<Maybe<ResolversTypes['LeasingPendingBankReference']>, ParentType, ContextType, RequireFields<MutationCreateBankReferenceArgs, 'pendingPaymentsIds' | 'quoteSmartItId'>>;
  createBitacora?: Resolver<ResolversTypes['BitacoraEntity'], ParentType, ContextType, RequireFields<MutationCreateBitacoraArgs, 'alarmId' | 'status' | 'userId'>>;
  createIncident?: Resolver<Maybe<ResolversTypes['IncidentEntity']>, ParentType, ContextType, RequireFields<MutationCreateIncidentArgs, 'contractId' | 'idsmartIt' | 'incident'>>;
  createInvitation?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<MutationCreateInvitationArgs, 'input'>>;
  createLead?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateLeadArgs, 'input'>>;
  createPaymentBill?: Resolver<Maybe<ResolversTypes['PaymentBillEntity']>, ParentType, ContextType, RequireFields<MutationCreatePaymentBillArgs, 'idcliente' | 'referencia'>>;
  createPerson?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType, RequireFields<MutationCreatePersonArgs, 'birthdate' | 'cfdiuse' | 'city' | 'country' | 'district' | 'email' | 'mobile' | 'noext' | 'state' | 'userId' | 'zipCode'>>;
  createPersonRegi?: Resolver<ResolversTypes['PersonRegis'], ParentType, ContextType, RequireFields<MutationCreatePersonRegiArgs, 'ApellidoMaterno' | 'ApellidoPaterno' | 'Email' | 'Nombre' | 'NumeroCelular' | 'idGUID'>>;
  createQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationCreateQuoteArgs, 'userId'>>;
  createQuoteSmartIt?: Resolver<Maybe<ResolversTypes['QuoteSmartItResponse']>, ParentType, ContextType, RequireFields<MutationCreateQuoteSmartItArgs, 'Anio' | 'IdSmartIt' | 'IdVersion' | 'Marca' | 'Modelo' | 'UUID'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  dismissApplicationChecklist?: Resolver<ResolversTypes['ApplicationChecklist'], ParentType, ContextType, RequireFields<MutationDismissApplicationChecklistArgs, 'applicationChecklistId'>>;
  generateContract?: Resolver<Maybe<ResolversTypes['ContractEntity']>, ParentType, ContextType, RequireFields<MutationGenerateContractArgs, 'IdCotizacion' | 'contractDate' | 'deliveryLocationId' | 'idsmartIt'>>;
  generateDelivery?: Resolver<Maybe<ResolversTypes['DeliveryEntity']>, ParentType, ContextType, RequireFields<MutationGenerateDeliveryArgs, 'IdContrato' | 'idsmartIt'>>;
  getOrCreateQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationGetOrCreateQuoteArgs, 'userId'>>;
  moveTask?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationMoveTaskArgs, 'taskAction' | 'taskId'>>;
  populateSlots?: Resolver<Maybe<Array<Maybe<ResolversTypes['Slot']>>>, ParentType, ContextType, RequireFields<MutationPopulateSlotsArgs, 'dateFrom' | 'dateTo' | 'slotType'>>;
  prospectAddNote?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProspectActivity']>>>, ParentType, ContextType, RequireFields<MutationProspectAddNoteArgs, 'notes' | 'prospectId'>>;
  prospectReassignSupportUser?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProspectActivity']>>>, ParentType, ContextType, RequireFields<MutationProspectReassignSupportUserArgs, 'prospectId' | 'supportUserId'>>;
  prospectUpdateStatus?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProspectActivity']>>>, ParentType, ContextType, RequireFields<MutationProspectUpdateStatusArgs, 'prospectId' | 'prospectStatusId'>>;
  registerDeviceToken?: Resolver<ResolversTypes['DeviceTokenEntity'], ParentType, ContextType, RequireFields<MutationRegisterDeviceTokenArgs, 'device' | 'token' | 'userId'>>;
  reserveVehicle?: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType, RequireFields<MutationReserveVehicleArgs, 'input' | 'taskId'>>;
  reserveVehicleSmarIt?: Resolver<Maybe<ResolversTypes['VehicleReservationEntity']>, ParentType, ContextType, RequireFields<MutationReserveVehicleSmarItArgs, 'IdCotizacion' | 'IdUsuarioUber' | 'idsmartIt'>>;
  revokeApplication?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRevokeApplicationArgs, 'applicationId'>>;
  sendNotification?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendNotificationArgs, 'input' | 'userId'>>;
  setInactivityStatement?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSetInactivityStatementArgs, 'input' | 'taskId'>>;
  setInvitationStatus?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSetInvitationStatusArgs, 'id' | 'status'>>;
  setKycAddress?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType, RequireFields<MutationSetKycAddressArgs, 'input' | 'taskId'>>;
  setLeadStatus?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSetLeadStatusArgs, 'id' | 'status'>>;
  signContract?: Resolver<Maybe<ResolversTypes['ContractSigningEntity']>, ParentType, ContextType, RequireFields<MutationSignContractArgs, 'IdContrato' | 'idsmartIt'>>;
  updateBitacoraStatus?: Resolver<ResolversTypes['BitacoraEntity'], ParentType, ContextType, RequireFields<MutationUpdateBitacoraStatusArgs, 'bitacoraId' | 'status'>>;
  updateDriversLicenseInfo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateDriversLicenseInfoArgs, 'expirationDate' | 'idsmartIt' | 'licenseNumber' | 'personId'>>;
  updatePerson?: Resolver<Maybe<ResolversTypes['PersonUpdateEntity']>, ParentType, ContextType, RequireFields<MutationUpdatePersonArgs, 'ApellidoMaterno' | 'ApellidoPaterno' | 'CURP' | 'Calle' | 'Ciudad' | 'CodigoPostal' | 'ColoniaFraccionamiento' | 'Email' | 'Estado' | 'FechaNacimiento' | 'Nombre' | 'NumeroCelular' | 'NumeroExterior' | 'Pais' | 'RFC' | 'RegimenFiscal' | 'Sexo' | 'UUID' | 'UsoCFDI'>>;
  updateUserDriverLicenseInfo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserDriverLicenseInfoArgs, 'input'>>;
  updateUserPersonalInfo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserPersonalInfoArgs, 'input'>>;
};

export type OfferResolvers<ContextType = any, ParentType extends ResolversParentTypes['Offer'] = ResolversParentTypes['Offer']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  leasingPeriod?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  quoteId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  scoringAnalysis?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scoringBrief?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scoringDetails?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scoringDetailsParsed?: Resolver<Maybe<Array<Maybe<ResolversTypes['OfferScoringDetail']>>>, ParentType, ContextType>;
  scoringMark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scoringResolution?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scoringVerdict?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  weeklyPrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OfferScoringDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['OfferScoringDetail'] = ResolversParentTypes['OfferScoringDetail']> = {
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rank?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParamDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['ParamDetail'] = ResolversParentTypes['ParamDetail']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idParam?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParamHeaderResolvers<ContextType = any, ParentType extends ResolversParentTypes['ParamHeader'] = ResolversParentTypes['ParamHeader']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paramDetails?: Resolver<Maybe<Array<Maybe<ResolversTypes['ParamDetail']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentBillEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentBillEntity'] = ResolversParentTypes['PaymentBillEntity']> = {
  billId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  folio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  serie?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentValidationEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentValidationEntity'] = ResolversParentTypes['PaymentValidationEntity']> = {
  idPayment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PendingDocumentsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PendingDocuments'] = ResolversParentTypes['PendingDocuments']> = {
  Descripcion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  Subcategorias?: Resolver<Maybe<Array<Maybe<ResolversTypes['PendingDocuments']>>>, ParentType, ContextType>;
  TieneDocumentos?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = {
  birthdate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  businessname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cfdiuse?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  curp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  district?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  maidenname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mobile?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  noext?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rfc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taxReg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  zipCode?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonRegisResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonRegis'] = ResolversParentTypes['PersonRegis']> = {
  ApellidoMaterno?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ApellidoPaterno?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  Nombre?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  NumeroCelular?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  idGUID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonUpdateEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonUpdateEntity'] = ResolversParentTypes['PersonUpdateEntity']> = {
  ApellidoMaterno?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ApellidoPaterno?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CURP?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Calle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Ciudad?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  CodigoPostal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ColoniaFraccionamiento?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Estado?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  FechaNacimiento?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Nombre?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  NumeroCelular?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  NumeroExterior?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  NumeroInterior?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Pais?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  RFC?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  RazonSocial?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  RegimenFiscal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Sexo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  TelefonoCasa?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  UUID?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  UsoCFDI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cityFuelEconomy?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  confortFeatures?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cylinders?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  defaultLeasingPeriod?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  defaultWeeklyPrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  engineType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estimatedAcceleration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  estimatedHorsepower?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  estimatedTopSpeedKmH?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  estimatedTorqueLbFt?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  frontElectricWindows?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fuelType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  highwayFuelEconomy?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idversion?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  liters?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numberOfSpeeds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  safetyFeatures?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  series?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startStop?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transmission?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  turbo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProspectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Prospect'] = ResolversParentTypes['Prospect']> = {
  activeApplication?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType>;
  activeApplicationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  activity?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProspectActivity']>>>, ParentType, ContextType>;
  applications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Application']>>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  friendlyId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invitations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invitation']>>>, ParentType, ContextType>;
  lastActivityAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  lastActivityUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  lastActivityUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lastQuote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType>;
  prospectStatus?: Resolver<Maybe<ResolversTypes['ProspectStatus']>, ParentType, ContextType>;
  prospectStatusId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quoteCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Quote']>>>, ParentType, ContextType>;
  supportUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  supportUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProspectActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProspectActivity'] = ResolversParentTypes['ProspectActivity']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdByUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdByUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prospectActivityType?: Resolver<Maybe<ResolversTypes['ProspectActivityType']>, ParentType, ContextType>;
  prospectActivityTypeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prospectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  prospectStatus?: Resolver<Maybe<ResolversTypes['ProspectStatus']>, ParentType, ContextType>;
  prospectStatusId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prospects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Prospect']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProspectActivityTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProspectActivityType'] = ResolversParentTypes['ProspectActivityType']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prospectActivity?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProspectActivity']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProspectCountByScoringMarkResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProspectCountByScoringMark'] = ResolversParentTypes['ProspectCountByScoringMark']> = {
  A?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  B?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  C?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  D?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  E?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  F?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  NoScore?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProspectOverviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProspectOverview'] = ResolversParentTypes['ProspectOverview']> = {
  byQuoteScoringMark?: Resolver<ResolversTypes['ProspectCountByScoringMark'], ParentType, ContextType>;
  bySituation?: Resolver<ResolversTypes['ProspectSituationCount'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProspectSituationCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProspectSituationCount'] = ResolversParentTypes['ProspectSituationCount']> = {
  active?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  expired?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProspectStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProspectStatus'] = ResolversParentTypes['ProspectStatus']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  manualAssignable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  prospects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Prospect']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeApplications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Application']>>>, ParentType, ContextType>;
  activeInvitations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invitation']>>>, ParentType, ContextType>;
  activeLeads?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lead']>>>, ParentType, ContextType>;
  activeLeasings?: Resolver<Maybe<Array<Maybe<ResolversTypes['Leasing']>>>, ParentType, ContextType>;
  activeQuotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Quote']>>>, ParentType, ContextType>;
  applicationById?: Resolver<ResolversTypes['Application'], ParentType, ContextType, RequireFields<QueryApplicationByIdArgs, 'applicationId'>>;
  applicationChecklist?: Resolver<Maybe<Array<ResolversTypes['ApplicationChecklist']>>, ParentType, ContextType, RequireFields<QueryApplicationChecklistArgs, 'applicationId'>>;
  applications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Application']>>>, ParentType, ContextType>;
  authWithCredentials?: Resolver<ResolversTypes['ClientApiAuthResponse'], ParentType, ContextType, RequireFields<QueryAuthWithCredentialsArgs, 'email'>>;
  authWithUberDriver?: Resolver<ResolversTypes['ClientApiAuthResponse'], ParentType, ContextType, RequireFields<QueryAuthWithUberDriverArgs, 'token'>>;
  banksWithReferDeatils?: Resolver<Maybe<Array<Maybe<ResolversTypes['BankReferDeatil']>>>, ParentType, ContextType>;
  clientOverview?: Resolver<ResolversTypes['ClientOverview'], ParentType, ContextType>;
  currentVehicleStatus?: Resolver<ResolversTypes['VehicleStatusResponse'], ParentType, ContextType, RequireFields<QueryCurrentVehicleStatusArgs, 'leasingId'>>;
  fetchPendingDocuments?: Resolver<Maybe<Array<Maybe<ResolversTypes['PendingDocuments']>>>, ParentType, ContextType, RequireFields<QueryFetchPendingDocumentsArgs, 'numeroDeSerie'>>;
  findParamHeaderByIdParam?: Resolver<Maybe<ResolversTypes['ParamHeader']>, ParentType, ContextType, RequireFields<QueryFindParamHeaderByIdParamArgs, 'id'>>;
  getAvailableInventory?: Resolver<Array<ResolversTypes['VehicleInventory']>, ParentType, ContextType>;
  getAvailableProspectStatusList?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProspectStatus']>>>, ParentType, ContextType, Partial<QueryGetAvailableProspectStatusListArgs>>;
  getBitacoraByUser?: Resolver<Array<ResolversTypes['BitacoraEntity']>, ParentType, ContextType, RequireFields<QueryGetBitacoraByUserArgs, 'userId'>>;
  getConversations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Conversation']>>>, ParentType, ContextType, RequireFields<QueryGetConversationsArgs, 'userId'>>;
  getDatesWithFreeSlots?: Resolver<Maybe<Array<Maybe<ResolversTypes['Date']>>>, ParentType, ContextType, RequireFields<QueryGetDatesWithFreeSlotsArgs, 'slotType'>>;
  getDeviceTokensByUser?: Resolver<Array<ResolversTypes['DeviceTokenEntity']>, ParentType, ContextType, RequireFields<QueryGetDeviceTokensByUserArgs, 'userId'>>;
  getFreeSlots?: Resolver<Maybe<Array<Maybe<ResolversTypes['Slot']>>>, ParentType, ContextType, RequireFields<QueryGetFreeSlotsArgs, 'slotType'>>;
  getIncidentsByContract?: Resolver<Maybe<Array<Maybe<ResolversTypes['IncidentEntity']>>>, ParentType, ContextType, RequireFields<QueryGetIncidentsByContractArgs, 'contractId'>>;
  getMeetings?: Resolver<Maybe<Array<Maybe<ResolversTypes['Slot']>>>, ParentType, ContextType, RequireFields<QueryGetMeetingsArgs, 'slotType'>>;
  getProducts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  getProspects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Prospect']>>>, ParentType, ContextType, Partial<QueryGetProspectsArgs>>;
  getSlotById?: Resolver<Maybe<ResolversTypes['Slot']>, ParentType, ContextType, RequireFields<QueryGetSlotByIdArgs, 'slotId'>>;
  getSlots?: Resolver<Maybe<Array<Maybe<ResolversTypes['Slot']>>>, ParentType, ContextType, RequireFields<QueryGetSlotsArgs, 'slotType'>>;
  getUserSlots?: Resolver<Maybe<Array<Maybe<ResolversTypes['Slot']>>>, ParentType, ContextType, RequireFields<QueryGetUserSlotsArgs, 'userId'>>;
  invitationById?: Resolver<ResolversTypes['Invitation'], ParentType, ContextType, RequireFields<QueryInvitationByIdArgs, 'invitationId'>>;
  invitationOverview?: Resolver<ResolversTypes['InvitationOverview'], ParentType, ContextType>;
  invitations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invitation']>>>, ParentType, ContextType>;
  kycIdentificationCardMatch?: Resolver<ResolversTypes['KycIdentificationCardMatch'], ParentType, ContextType, RequireFields<QueryKycIdentificationCardMatchArgs, 'applicationId'>>;
  kycOverview?: Resolver<ResolversTypes['KycOverview'], ParentType, ContextType>;
  leadById?: Resolver<ResolversTypes['Lead'], ParentType, ContextType, RequireFields<QueryLeadByIdArgs, 'leadId'>>;
  leadOverview?: Resolver<ResolversTypes['LeadOverview'], ParentType, ContextType>;
  leads?: Resolver<Maybe<Array<Maybe<ResolversTypes['Lead']>>>, ParentType, ContextType>;
  leasingAccountSummary?: Resolver<Maybe<ResolversTypes['LeasingAccountSummary']>, ParentType, ContextType, RequireFields<QueryLeasingAccountSummaryArgs, 'quoteSmartItId'>>;
  leasingAlarms?: Resolver<ResolversTypes['LeasingAlarmsResponse'], ParentType, ContextType, RequireFields<QueryLeasingAlarmsArgs, 'leasingId'>>;
  leasingById?: Resolver<ResolversTypes['Leasing'], ParentType, ContextType, RequireFields<QueryLeasingByIdArgs, 'leasingId'>>;
  leasingDailySummary?: Resolver<ResolversTypes['LeasingDailySummary'], ParentType, ContextType, RequireFields<QueryLeasingDailySummaryArgs, 'date' | 'leasingId'>>;
  leasingFinancialDebtVoucher?: Resolver<Maybe<ResolversTypes['LeasingFinancialDebtVoucher']>, ParentType, ContextType, RequireFields<QueryLeasingFinancialDebtVoucherArgs, 'leasingId' | 'weekNumber'>>;
  leasingFinancialWeeklySummary?: Resolver<Array<ResolversTypes['LeasingFinancialWeekSummary']>, ParentType, ContextType, RequireFields<QueryLeasingFinancialWeeklySummaryArgs, 'leasingId'>>;
  leasingPendingBankReferences?: Resolver<Array<Maybe<ResolversTypes['LeasingPendingBankReference']>>, ParentType, ContextType, RequireFields<QueryLeasingPendingBankReferencesArgs, 'quoteSmartItId'>>;
  leasingPendingPayments?: Resolver<Array<Maybe<ResolversTypes['LeasingPendingPayment']>>, ParentType, ContextType, RequireFields<QueryLeasingPendingPaymentsArgs, 'contractId'>>;
  leasingSummary?: Resolver<ResolversTypes['LeasingSummary'], ParentType, ContextType, RequireFields<QueryLeasingSummaryArgs, 'leasingId' | 'weekNumber'>>;
  leasingWeeklySummary?: Resolver<ResolversTypes['LeasingWeeklySummary'], ParentType, ContextType, RequireFields<QueryLeasingWeeklySummaryArgs, 'leasingId' | 'weekNumber'>>;
  myInvitations?: Resolver<Maybe<Array<Maybe<ResolversTypes['Invitation']>>>, ParentType, ContextType>;
  offerById?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType, RequireFields<QueryOfferByIdArgs, 'offerId'>>;
  personList?: Resolver<Array<Maybe<ResolversTypes['TaxPerson']>>, ParentType, ContextType>;
  prospectActivity?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProspectActivity']>>>, ParentType, ContextType, RequireFields<QueryProspectActivityArgs, 'prospectId'>>;
  prospectById?: Resolver<Maybe<ResolversTypes['Prospect']>, ParentType, ContextType, RequireFields<QueryProspectByIdArgs, 'prospectId'>>;
  prospectByUserId?: Resolver<Maybe<ResolversTypes['Prospect']>, ParentType, ContextType, RequireFields<QueryProspectByUserIdArgs, 'userId'>>;
  prospectOverview?: Resolver<ResolversTypes['ProspectOverview'], ParentType, ContextType>;
  quoteById?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<QueryQuoteByIdArgs, 'quoteId'>>;
  quotesByUser?: Resolver<Maybe<Array<Maybe<ResolversTypes['Quote']>>>, ParentType, ContextType, RequireFields<QueryQuotesByUserArgs, 'userId'>>;
  scrapingUrl?: Resolver<ResolversTypes['PersonUpdateEntity'], ParentType, ContextType, RequireFields<QueryScrapingUrlArgs, 'Url' | 'idUser' | 'saveBool'>>;
  taskById?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTaskByIdArgs, 'taskId'>>;
  taskTypes?: Resolver<Maybe<Array<Maybe<ResolversTypes['TaskType']>>>, ParentType, ContextType>;
  trackerTrips?: Resolver<Array<Maybe<ResolversTypes['TrackerTrip']>>, ParentType, ContextType, RequireFields<QueryTrackerTripsArgs, 'date' | 'leasingId'>>;
  tripsByDate?: Resolver<Maybe<Array<Maybe<ResolversTypes['Trip']>>>, ParentType, ContextType, RequireFields<QueryTripsByDateArgs, 'from' | 'leasingId' | 'to'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  usersByGroup?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryUsersByGroupArgs, 'groupId'>>;
  validatePayment?: Resolver<Maybe<ResolversTypes['PaymentValidationEntity']>, ParentType, ContextType, RequireFields<QueryValidatePaymentArgs, 'idCotizacion' | 'idsmartIt'>>;
  vehicle?: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType, RequireFields<QueryVehicleArgs, 'vehicleId'>>;
  vehicleUsageSummary?: Resolver<Maybe<ResolversTypes['VehicleUsageSummary']>, ParentType, ContextType, RequireFields<QueryVehicleUsageSummaryArgs, 'leasingId'>>;
  vehicles?: Resolver<Maybe<Array<Maybe<ResolversTypes['Vehicle']>>>, ParentType, ContextType>;
  weeklyVehicleUsage?: Resolver<Maybe<Array<Maybe<ResolversTypes['VehicleUsage']>>>, ParentType, ContextType, RequireFields<QueryWeeklyVehicleUsageArgs, 'leasingId'>>;
};

export type QuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quote'] = ResolversParentTypes['Quote']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isExpired?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isRecent?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  offers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Offer']>>>, ParentType, ContextType>;
  scoreMark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scoreResolution?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scoringComplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  scoringEngine?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scoringError?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  scoringErrorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuoteSmartItResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuoteSmartItResponse'] = ResolversParentTypes['QuoteSmartItResponse']> = {
  IdAgencia?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  IdCotizacion?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  IdPersona?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  LinkReporte?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SimCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['SIMCard'] = ResolversParentTypes['SIMCard']> = {
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  serialNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SlotResolvers<ContextType = any, ParentType extends ResolversParentTypes['Slot'] = ResolversParentTypes['Slot']> = {
  endsAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  free?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  guestUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  guestUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hostUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hostUserId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  prospect?: Resolver<Maybe<ResolversTypes['Prospect']>, ParentType, ContextType>;
  prospectId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slotType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startsAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SmartItRegistryResolvers<ContextType = any, ParentType extends ResolversParentTypes['SmartItRegistry'] = ResolversParentTypes['SmartItRegistry']> = {
  contractId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  curp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quoteSmartItId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rfc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secondLastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  termsId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = {
  acceptedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  acceptedByUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  application?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType>;
  applicationChecklist?: Resolver<Maybe<ResolversTypes['ApplicationChecklist']>, ParentType, ContextType>;
  applicationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  assignedGroups?: Resolver<Maybe<Array<Maybe<ResolversTypes['Group']>>>, ParentType, ContextType>;
  assignedUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  assignedUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  customData?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  declinedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  declinedByUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  dismissedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dismissedByUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  dismissible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  done?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  flaggedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  leasing?: Resolver<Maybe<ResolversTypes['Leasing']>, ParentType, ContextType>;
  leasingId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  offer?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType>;
  offerId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  optional?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  originTask?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType>;
  originatedTasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType>;
  quoteId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  relevance?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  slot?: Resolver<Maybe<ResolversTypes['Slot']>, ParentType, ContextType>;
  slotId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  taskType?: Resolver<Maybe<ResolversTypes['TaskType']>, ParentType, ContextType>;
  taskTypeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  vehicle?: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType>;
  vehicleId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskType'] = ResolversParentTypes['TaskType']> = {
  assignedGroups?: Resolver<Maybe<Array<Maybe<ResolversTypes['Group']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaskTypeGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskTypeGroup'] = ResolversParentTypes['TaskTypeGroup']> = {
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  groupId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taskType?: Resolver<Maybe<ResolversTypes['TaskType']>, ParentType, ContextType>;
  taskTypeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxPersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxPerson'] = ResolversParentTypes['TaxPerson']> = {
  Url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  idUser?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TrackerDeviceStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['TrackerDeviceStatus'] = ResolversParentTypes['TrackerDeviceStatus']> = {
  currentOdometer?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  drivingScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ignition?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastConnection?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  lastLat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lastLon?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  motion?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  speed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalEvents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalTrips?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uberWeeksSumDistance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  uberWeeksUsage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weeksSumDistance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TrackerTripResolvers<ContextType = any, ParentType extends ResolversParentTypes['TrackerTrip'] = ResolversParentTypes['TrackerTrip']> = {
  averageSpeed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deviceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  deviceName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  distance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endLat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  endLon?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  endOdometer?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  maxSpeed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['TrackerTripScore']>, ParentType, ContextType>;
  startAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startLat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  startLon?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  startOdometer?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  tripId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TrackerTripScoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['TrackerTripScore'] = ResolversParentTypes['TrackerTripScore']> = {
  contextScore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  distance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  drivingScore?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  drivingScoreContextualized?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  events?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalEvents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  validPositions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TripResolvers<ContextType = any, ParentType extends ResolversParentTypes['Trip'] = ResolversParentTypes['Trip']> = {
  acceptedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  arrivedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  distance?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  dropoffAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  fareAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  fareCurrency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loggedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  pickupAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  pickupLat?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pickupLng?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  vehicleId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UberItemCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['UberItemCategory'] = ResolversParentTypes['UberItemCategory']> = {
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  categoryId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parentCategory?: Resolver<Maybe<ResolversTypes['UberItemCategory']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UberItemEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['UberItemEntity'] = ResolversParentTypes['UberItemEntity']> = {
  billItemId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  contentCategoryId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  paymentItemId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uberItem?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uberItemCategory?: Resolver<Maybe<ResolversTypes['UberItemCategory']>, ParentType, ContextType>;
  uberItemCategoryId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  application?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType>;
  applications?: Resolver<Maybe<Array<Maybe<ResolversTypes['Application']>>>, ParentType, ContextType>;
  assignedTasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  curp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dob?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  driverLicenseNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  driverLicensePermanent?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  driverLicenseValidity?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullTasks?: Resolver<Maybe<ResolversTypes['FullTasks']>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  groups?: Resolver<Maybe<Array<Maybe<ResolversTypes['Group']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  leasings?: Resolver<Maybe<Array<Maybe<ResolversTypes['Leasing']>>>, ParentType, ContextType>;
  pendingTasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Task']>>>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  picture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quotes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Quote']>>>, ParentType, ContextType>;
  rfc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secondLastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smartItRegistry?: Resolver<Maybe<ResolversTypes['SmartItRegistry']>, ParentType, ContextType>;
  uberActivationStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberCityCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberCityName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberDriverId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberEarningsRetentionActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  uberLastMonthEarnings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uberLastMonthTripCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uberPartnerRole?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberPromoCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberRating?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uberTenureMonths?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  uberTier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vehicle'] = ResolversParentTypes['Vehicle']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contract?: Resolver<Maybe<ResolversTypes['ContractEntity']>, ParentType, ContextType>;
  contractId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trackerDeviceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trackerDeviceSim?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vehicleSmartIt?: Resolver<Maybe<ResolversTypes['VehicleSmartIt']>, ParentType, ContextType>;
  vin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleColorSmartItResolvers<ContextType = any, ParentType extends ResolversParentTypes['VehicleColorSmartIt'] = ResolversParentTypes['VehicleColorSmartIt']> = {
  external?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleInventoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['VehicleInventory'] = ResolversParentTypes['VehicleInventory']> = {
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inventoryNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  invoiceValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  serialNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vehicleId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  versionId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleReservationEntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['VehicleReservationEntity'] = ResolversParentTypes['VehicleReservationEntity']> = {
  IMEI?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  IdGPS?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  Telefono?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  VIN?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleSmartItResolvers<ContextType = any, ParentType extends ResolversParentTypes['VehicleSmartIt'] = ResolversParentTypes['VehicleSmartIt']> = {
  brand?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['VehicleColorSmartIt']>, ParentType, ContextType>;
  cost?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  gps?: Resolver<Maybe<ResolversTypes['GPS']>, ParentType, ContextType>;
  inventoryId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  model?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  numberPlates?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  serialNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vehicleSmartItId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  versionId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleStatusResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['VehicleStatusResponse'] = ResolversParentTypes['VehicleStatusResponse']> = {
  tracker?: Resolver<Maybe<ResolversTypes['TrackerDeviceStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleUsageResolvers<ContextType = any, ParentType extends ResolversParentTypes['VehicleUsage'] = ResolversParentTypes['VehicleUsage']> = {
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dayOfWeek?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tracker?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  uber?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleUsageSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['VehicleUsageSummary'] = ResolversParentTypes['VehicleUsageSummary']> = {
  currentOdometer?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  drivingScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalEvents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalTrips?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  uberWeeksSumDistance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  uberWeeksUsage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  weeksSumDistance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AccountSummary?: AccountSummaryResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  Alarm?: AlarmResolvers<ContextType>;
  Application?: ApplicationResolvers<ContextType>;
  ApplicationChecklist?: ApplicationChecklistResolvers<ContextType>;
  BankReferDeatil?: BankReferDeatilResolvers<ContextType>;
  BitacoraEntity?: BitacoraEntityResolvers<ContextType>;
  Checklist?: ChecklistResolvers<ContextType>;
  ClientApiAuthResponse?: ClientApiAuthResponseResolvers<ContextType>;
  ClientOverview?: ClientOverviewResolvers<ContextType>;
  ClientsByActivity?: ClientsByActivityResolvers<ContextType>;
  Content?: ContentResolvers<ContextType>;
  ContentMetadata?: ContentMetadataResolvers<ContextType>;
  ContractEntity?: ContractEntityResolvers<ContextType>;
  ContractSigningEntity?: ContractSigningEntityResolvers<ContextType>;
  Conversation?: ConversationResolvers<ContextType>;
  ConversationContact?: ConversationContactResolvers<ContextType>;
  ConversationMessage?: ConversationMessageResolvers<ContextType>;
  CreateApplicationResponse?: CreateApplicationResponseResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DeliveryEntity?: DeliveryEntityResolvers<ContextType>;
  DeliveryLocation?: DeliveryLocationResolvers<ContextType>;
  DeviceTokenEntity?: DeviceTokenEntityResolvers<ContextType>;
  FullTasks?: FullTasksResolvers<ContextType>;
  GPS?: GpsResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  IncidentEntity?: IncidentEntityResolvers<ContextType>;
  Invitation?: InvitationResolvers<ContextType>;
  InvitationOverview?: InvitationOverviewResolvers<ContextType>;
  InvitationOverviewCountRefine?: InvitationOverviewCountRefineResolvers<ContextType>;
  KycApplicationsByActivity?: KycApplicationsByActivityResolvers<ContextType>;
  KycApplicationsByProgress?: KycApplicationsByProgressResolvers<ContextType>;
  KycIdentificationCardMatch?: KycIdentificationCardMatchResolvers<ContextType>;
  KycIdentificationCardMatchParsed?: KycIdentificationCardMatchParsedResolvers<ContextType>;
  KycOverview?: KycOverviewResolvers<ContextType>;
  Lead?: LeadResolvers<ContextType>;
  LeadOverview?: LeadOverviewResolvers<ContextType>;
  LeadOverviewCountRefine?: LeadOverviewCountRefineResolvers<ContextType>;
  Leasing?: LeasingResolvers<ContextType>;
  LeasingAccountSummary?: LeasingAccountSummaryResolvers<ContextType>;
  LeasingAlarmsResponse?: LeasingAlarmsResponseResolvers<ContextType>;
  LeasingDailySummary?: LeasingDailySummaryResolvers<ContextType>;
  LeasingFinancialDebtVoucher?: LeasingFinancialDebtVoucherResolvers<ContextType>;
  LeasingFinancialWeekSummary?: LeasingFinancialWeekSummaryResolvers<ContextType>;
  LeasingPendingBankReference?: LeasingPendingBankReferenceResolvers<ContextType>;
  LeasingPendingPayment?: LeasingPendingPaymentResolvers<ContextType>;
  LeasingPendingPaymentDetail?: LeasingPendingPaymentDetailResolvers<ContextType>;
  LeasingSummary?: LeasingSummaryResolvers<ContextType>;
  LeasingWeekDetail?: LeasingWeekDetailResolvers<ContextType>;
  LeasingWeeklySummary?: LeasingWeeklySummaryResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Offer?: OfferResolvers<ContextType>;
  OfferScoringDetail?: OfferScoringDetailResolvers<ContextType>;
  ParamDetail?: ParamDetailResolvers<ContextType>;
  ParamHeader?: ParamHeaderResolvers<ContextType>;
  PaymentBillEntity?: PaymentBillEntityResolvers<ContextType>;
  PaymentValidationEntity?: PaymentValidationEntityResolvers<ContextType>;
  PendingDocuments?: PendingDocumentsResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  PersonRegis?: PersonRegisResolvers<ContextType>;
  PersonUpdateEntity?: PersonUpdateEntityResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Prospect?: ProspectResolvers<ContextType>;
  ProspectActivity?: ProspectActivityResolvers<ContextType>;
  ProspectActivityType?: ProspectActivityTypeResolvers<ContextType>;
  ProspectCountByScoringMark?: ProspectCountByScoringMarkResolvers<ContextType>;
  ProspectOverview?: ProspectOverviewResolvers<ContextType>;
  ProspectSituationCount?: ProspectSituationCountResolvers<ContextType>;
  ProspectStatus?: ProspectStatusResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Quote?: QuoteResolvers<ContextType>;
  QuoteSmartItResponse?: QuoteSmartItResponseResolvers<ContextType>;
  SIMCard?: SimCardResolvers<ContextType>;
  Slot?: SlotResolvers<ContextType>;
  SmartItRegistry?: SmartItRegistryResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskType?: TaskTypeResolvers<ContextType>;
  TaskTypeGroup?: TaskTypeGroupResolvers<ContextType>;
  TaxPerson?: TaxPersonResolvers<ContextType>;
  TrackerDeviceStatus?: TrackerDeviceStatusResolvers<ContextType>;
  TrackerTrip?: TrackerTripResolvers<ContextType>;
  TrackerTripScore?: TrackerTripScoreResolvers<ContextType>;
  Trip?: TripResolvers<ContextType>;
  UberItemCategory?: UberItemCategoryResolvers<ContextType>;
  UberItemEntity?: UberItemEntityResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vehicle?: VehicleResolvers<ContextType>;
  VehicleColorSmartIt?: VehicleColorSmartItResolvers<ContextType>;
  VehicleInventory?: VehicleInventoryResolvers<ContextType>;
  VehicleReservationEntity?: VehicleReservationEntityResolvers<ContextType>;
  VehicleSmartIt?: VehicleSmartItResolvers<ContextType>;
  VehicleStatusResponse?: VehicleStatusResponseResolvers<ContextType>;
  VehicleUsage?: VehicleUsageResolvers<ContextType>;
  VehicleUsageSummary?: VehicleUsageSummaryResolvers<ContextType>;
};

