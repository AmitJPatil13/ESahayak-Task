import { z } from 'zod';

// Enums matching Prisma schema
export const CityEnum = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const PropertyTypeEnum = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
export const BHKEnum = z.enum(['Studio', '1', '2', '3', '4']);
export const PurposeEnum = z.enum(['Buy', 'Rent']);
export const TimelineEnum = z.enum(['0-3m', '3-6m', '>6m', 'Exploring']);
export const SourceEnum = z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']);
export const StatusEnum = z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']);

// Base buyer schema with exact validation rules from problem statement
export const BuyerSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must be at most 80 characters'),
  
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
  
  phone: z.string()
    .regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  
  bhk: BHKEnum.optional(),
  
  purpose: PurposeEnum,
  
  budgetMin: z.number()
    .int()
    .positive('Budget minimum must be positive')
    .optional(),
  
  budgetMax: z.number()
    .int()
    .positive('Budget maximum must be positive')
    .optional(),
  
  timeline: TimelineEnum,
  source: SourceEnum,
  status: StatusEnum.default('New'),
  
  notes: z.string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
  
  tags: z.array(z.string()).default([]),
}).refine((data) => {
  // BHK required for Apartment and Villa
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa property types',
  path: ['bhk']
}).refine((data) => {
  // Budget max must be >= budget min when both present
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Budget maximum must be greater than or equal to budget minimum',
  path: ['budgetMax']
});

export const CreateBuyerSchema = BuyerSchema;

// Create a base object without refinements for UpdateBuyerSchema
const BaseBuyerSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must be at most 80 characters'),
  
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
  
  phone: z.string()
    .regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  bhk: BHKEnum.optional(),
  purpose: PurposeEnum,
  
  budgetMin: z.number()
    .int()
    .positive('Budget minimum must be positive')
    .optional(),
  
  budgetMax: z.number()
    .int()
    .positive('Budget maximum must be positive')
    .optional(),
  
  timeline: TimelineEnum,
  source: SourceEnum,
  status: StatusEnum.default('New'),
  
  notes: z.string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
  
  tags: z.array(z.string()).default([]),
});

export const UpdateBuyerSchema = BaseBuyerSchema.extend({
  id: z.string().uuid(),
  updatedAt: z.string().datetime().optional()
}).partial().required({ id: true });

// Query schemas for filtering and pagination
export const BuyerQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  city: CityEnum.optional(),
  propertyType: PropertyTypeEnum.optional(),
  status: StatusEnum.optional(),
  timeline: TimelineEnum.optional(),
  sortBy: z.enum(['fullName', 'createdAt', 'updatedAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// CSV import schema
export const CSVBuyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/),
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  bhk: BHKEnum.optional().or(z.literal('')),
  purpose: PurposeEnum,
  budgetMin: z.coerce.number().int().positive().optional().or(z.literal('')),
  budgetMax: z.coerce.number().int().positive().optional().or(z.literal('')),
  timeline: TimelineEnum,
  source: SourceEnum,
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')), // Comma-separated string
  status: StatusEnum.default('New')
}).transform((data) => ({
  ...data,
  email: data.email || undefined,
  bhk: data.bhk || undefined,
  budgetMin: data.budgetMin || undefined,
  budgetMax: data.budgetMax || undefined,
  notes: data.notes || undefined,
  tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
}));

export type Buyer = z.infer<typeof BuyerSchema>;
export type CreateBuyer = z.infer<typeof CreateBuyerSchema>;
export type UpdateBuyer = z.infer<typeof UpdateBuyerSchema>;
export type BuyerQuery = z.infer<typeof BuyerQuerySchema>;
export type CSVBuyer = z.infer<typeof CSVBuyerSchema>;
