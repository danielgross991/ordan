import { z } from 'zod'
import { normalizeExternalUrl, normalizeImageUrl } from '@/lib/security/url'

const nullableText = z
  .string()
  .trim()
  .max(500)
  .transform(value => (value ? value : null))
  .nullable()
  .optional()

const textArray = z.array(z.string().trim().min(1).max(120)).max(40).default([])

export const supplierStatusSchema = z.enum(['draft', 'published', 'hidden'])

export const supplierInputSchema = z
  .object({
    slug: z.string().trim().max(120).optional(),
    businessName: z.string().trim().min(1).max(160),
    shortDescription: z.string().trim().max(500).default(''),
    fullDescription: z.string().trim().max(5000).default(''),
    primaryCategory: z.string().trim().max(120).default(''),
    subcategories: textArray,
    supplierType: nullableText,
    businessFit: textArray,
    phone: nullableText,
    whatsapp: nullableText,
    email: z.string().trim().email().max(254).nullable().optional().or(z.literal('').transform(() => null)),
    website: z
      .string()
      .trim()
      .max(500)
      .nullable()
      .optional()
      .transform(value => normalizeExternalUrl(value ?? null)),
    address: nullableText,
    city: nullableText,
    region: nullableText,
    serviceAreas: textArray,
    openingHours: nullableText,
    logoUrl: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional()
      .transform(value => normalizeImageUrl(value ?? null)),
    coverImageUrl: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional()
      .transform(value => normalizeImageUrl(value ?? null)),
    galleryUrls: z
      .array(z.string().trim().max(1000))
      .max(12)
      .default([])
      .transform(items => items.map(item => normalizeImageUrl(item)).filter((item): item is string => !!item)),
    keywords: textArray,
    status: supplierStatusSchema.default('draft'),
    featured: z.boolean().default(false),
    forcePublish: z.boolean().default(false),
    kashrut: nullableText,
    catalogEnabled: z.boolean().default(false),
    catalogSummary: nullableText,
    sourceType: nullableText,
    sourceUrl: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional()
      .transform(value => normalizeExternalUrl(value ?? null)),
    lastVerifiedAt: z.date().nullable().optional(),
  })
  .strict()

export const supplierUpdateSchema = supplierInputSchema.partial()

export const idSchema = z.string().trim().uuid()

export const slugSchema = z.string().trim().min(1).max(160).regex(/^[\p{L}\p{N}._~%-]+$/u)
