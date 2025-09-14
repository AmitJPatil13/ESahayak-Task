// Backend Zod schemas - matches frontend exactly
import { z } from "zod";

export const City = z.enum(['Chandigarh','Mohali','Zirakpur','Panchkula','Other']);
export const PropertyType = z.enum(['Apartment','Villa','Plot','Office','Retail']);
export const BHK = z.enum(['1','2','3','4','Studio']);
export const Purpose = z.enum(['Buy','Rent']);
export const Timeline = z.enum(['0-3m','3-6m','>6m','Exploring']);
export const Source = z.enum(['Website','Referral','Walk-in','Call','Other']);
export const Status = z.enum(['New','Qualified','Contacted','Visited','Negotiation','Converted','Dropped']);

export const BuyerBase = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().optional(),
  phone: z.string().regex(/^\d{10,15}$/, "phone must be 10-15 digits"),
  city: City,
  propertyType: PropertyType,
  bhk: z.union([BHK, z.undefined()]).optional(),
  purpose: Purpose,
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().nonnegative().optional(),
  timeline: Timeline,
  source: Source,
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).default([]),
  status: Status.optional(),
});

export const BuyerCreate = BuyerBase.extend({
  // server will set id, ownerId, updatedAt
}).superRefine((val, ctx) => {
  if (val.budgetMin !== undefined && val.budgetMax !== undefined) {
    if (val.budgetMax < val.budgetMin) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "budgetMax must be >= budgetMin" });
    }
  }
  if (['Apartment','Villa'].includes(val.propertyType)) {
    if (!val.bhk) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "bhk required for Apartment or Villa" });
  }
});

export const BuyerUpdate = BuyerBase.extend({
  id: z.string().uuid(),
  updatedAt: z.string().datetime(),
}).superRefine((val, ctx) => {
  if (val.budgetMin !== undefined && val.budgetMax !== undefined) {
    if (val.budgetMax < val.budgetMin) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "budgetMax must be >= budgetMin" });
    }
  }
  if (['Apartment','Villa'].includes(val.propertyType)) {
    if (!val.bhk) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "bhk required for Apartment or Villa" });
  }
});

export const Buyer = BuyerBase.extend({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: Status,
});

export const BuyerHistory = z.object({
  id: z.string().uuid(),
  buyerId: z.string().uuid(),
  changedBy: z.string().uuid(),
  changedAt: z.string().datetime(),
  diff: z.record(z.any()),
});

export const User = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  isAdmin: z.boolean(),
  createdAt: z.string().datetime(),
});

export const PaginatedResponse = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({
  items: z.array(itemSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const BuyerListResponse = PaginatedResponse(Buyer);

export const BuyerFilters = z.object({
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  city: City.optional(),
  propertyType: PropertyType.optional(),
  status: Status.optional(),
  timeline: Timeline.optional(),
  search: z.string().optional(),
  sort: z.enum(['updatedAt', 'createdAt', 'fullName']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

// Export types
export type BuyerType = z.infer<typeof Buyer>;
export type BuyerCreateType = z.infer<typeof BuyerCreate>;
export type BuyerUpdateType = z.infer<typeof BuyerUpdate>;
export type BuyerHistoryType = z.infer<typeof BuyerHistory>;
export type UserType = z.infer<typeof User>;
export type BuyerFiltersType = z.infer<typeof BuyerFilters>;
export type BuyerListResponseType = z.infer<typeof BuyerListResponse>;
