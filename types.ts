
export enum RoleType {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  INDIVIDUAL = 'INDIVIDUAL',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN', // New Role: Meiwos Platform
}

export type SystemPermission = 
  | 'MANAGE_ACCOUNT' // Manage users and roles
  | 'VIEW_FINANCE'   // View billing and recharge
  | 'MANAGE_DATA'    // Edit product/knowledge base
  | 'VIEW_DATA';     // Read-only data access

export interface RoleDefinition {
  id: string;
  name: string; // e.g., "咨询师", "医生", "管理员"
  description: string;
  type: RoleType; // Internal classification
  appIds: string[]; // List of authorized App IDs
  permissions: SystemPermission[]; // List of system functional permissions
}

export enum AppType {
  OFFICIAL = '官方应用',
  THIRD_PARTY = '第三方应用',
}

export interface User {
  id: string;
  name: string;
  phone?: string; // Added for registration uniqueness check
  roleId: string; // Links to RoleDefinition
  avatar: string;
  dataScope: 'ALL' | 'ASSIGNED';
  // Individual supplements (on top of Role)
  extraAppIds: string[]; 
  extraPermissions: SystemPermission[];
}

export interface Institution {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  city: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinDate: string;
}

export interface ServiceProvider {
  id: string;
  name: string; // Company Name
  contactPerson: string;
  phone: string;
  email: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  joinDate: string;
  businessLicense?: string; // URL mock
}

export interface AppFeature {
  title: string;
  description: string;
}

export type PricingModel = 'SEAT' | 'SUBSCRIPTION' | 'USAGE' | 'RESOURCE_PACK';

export interface PricingPlan {
  id: string;
  name: string;
  type: 'TRIAL' | 'SUBSCRIPTION'; // 试用, 正式订阅
  model: PricingModel; // 席位, 订阅, 按量, 资源包
  
  // Model specific fields
  priceMonth?: number; // For SEAT & SUBSCRIPTION
  priceYear?: number;  // For SEAT & SUBSCRIPTION
  includedSeats?: number; // For SEAT
  
  pricePerUnit?: number; // For USAGE
  unitName?: string; // For USAGE/PACK (e.g. "次", "分钟")
  
  packQuota?: number; // For RESOURCE_PACK
  packPrice?: number; // For RESOURCE_PACK
  
  features: string[];
}

export interface AppReview {
  id: string;
  user: string;
  rating: number;
  date: string;
  content: string;
}

export interface AIApp {
  id: string;
  name: string;
  description: string; // Short description for card
  fullDescription: string; // Long description for detail page
  type: AppType;
  icon: string;
  category: string;
  status: 'active' | 'trial' | 'inactive';
  auditStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  listingStatus?: 'LISTED' | 'UNLISTED';
  integrationType: 'API_EMBEDDED' | 'EXTERNAL_LINK' | 'PURE_API';
  rating: number;
  // New detailed fields
  provider: string; // Name of the provider
  documentation: string; // Rich text content for app manual/description
  attachments: string[]; // List of attachment file names
  screenshots: string[]; // List of screenshot URLs
  features: AppFeature[];
  pricing: PricingPlan[];
  reviews: AppReview[];
  trialUsed: boolean; // Whether the user has used the free trial
}

export interface Task {
  id: string;
  appName: string;
  action: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  time: string;
  user: string;
}

export interface Transaction {
  id: string;
  date: string;
  appName: string;
  user: string;
  amount: number;
  type: 'consumption' | 'recharge' | 'refund';
}

export interface SettlementRecord {
  id: string;
  month: string; // YYYY-MM
  totalAmount: number;
  status: 'PENDING' | 'SETTLED';
  dueDate: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  syncSource: 'MANUAL' | 'API' | 'IMPORT';
  lastSync: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'EFFICACY' | 'SYMPTOM' | 'DEVICE';
  tags: string[];
  lastUpdated: string;
}

export interface SubscriptionRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  appId: string;
  appName: string;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AppUsageRecord {
  id: string;
  appId: string;
  appName: string;
  userId: string;
  date: string; // YYYY-MM-DD HH:mm
  actionType: string; // e.g., "Diagnosis", "Generation"
  resultSummary: string; // e.g., "Report #2039 generated"
  status: 'SUCCESS' | 'FAILED';
  resultUrl?: string; // Link to detail
}
