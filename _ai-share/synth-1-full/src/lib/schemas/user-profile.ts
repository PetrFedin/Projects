import * as z from 'zod';

export const relativeRoleEnum = z.enum([
  'husband',
  'wife',
  'son',
  'daughter',
  'father',
  'mother',
  'other',
]);
export type RelativeRole = z.infer<typeof relativeRoleEnum>;

export const measurementsSchema = z.object({
  height: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  weight: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  footLength: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  footWidth: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  bust: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  underbust: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  waist: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  hips: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  chest: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  shoulderWidth: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().optional()
  ),
  sleeveLength: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().optional()
  ),
  inseam: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  neck: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  torsoLength: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
  armCircumference: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().optional()
  ),
  thighCircumference: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().optional()
  ),
  calfCircumference: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().optional()
  ),
  ankleCircumference: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().optional()
  ),
  shoeSize: z.string().max(16).optional(),
  clothingSize: z.string().max(16).optional(),
  clothingSizeTop: z.string().max(16).optional(),
  clothingSizeBottom: z.string().max(16).optional(),
  underwearSize: z.string().max(16).optional(),
  braSize: z.string().max(16).optional(),
  hatSize: z.string().max(16).optional(),
  ringSize: z.string().max(16).optional(),
  wristCircumference: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().optional()
  ),
});

export const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Имя должно содержать не менее 2 символов.' }),
  email: z.string().email({ message: 'Неверный формат email.' }),
  bio: z.string().max(160).optional(),
  styleGallery: z.array(z.object({ url: z.string(), isPrivate: z.boolean() })).optional(),
  nickname: z
    .string()
    .max(32)
    .regex(/^[a-z0-9]+(\.[a-z0-9]+)*$/i, { message: 'Только латиница, цифры и точка.' })
    .optional(),
  identity: z
    .object({
      firstName: z
        .string()
        .max(64)
        .regex(/^[\p{L} ]+$/u, { message: 'Только буквы.' })
        .optional(),
      lastName: z
        .string()
        .max(64)
        .regex(/^[\p{L} ]+$/u, { message: 'Только буквы.' })
        .optional(),
      firstNameEn: z
        .string()
        .max(64)
        .regex(/^[A-Za-z]+$/, { message: 'Только латиница.' })
        .optional(),
      lastNameEn: z
        .string()
        .max(64)
        .regex(/^[A-Za-z]+$/, { message: 'Только латиница.' })
        .optional(),
    })
    .optional(),
  personalInfo: z
    .object({
      gender: z.enum(['female', 'male']).optional(),
      birthDate: z.string().min(10, { message: 'Укажите дату рождения' }),
      bodyType: z.string().max(64).optional(),
      education: z.string().max(120).optional(),
      country: z.string().max(64).optional(),
      postalCode: z.string().max(16).optional(),
      city: z.string().max(64).optional(),
      emails: z
        .object({
          primary: z.string().email().optional(),
          secondary: z.string().email().optional(),
        })
        .optional(),
      phones: z
        .object({
          primary: z.string().max(32).optional(),
          secondary: z.string().max(32).optional(),
        })
        .optional(),
      verification: z
        .object({
          email: z.boolean().optional(),
          phone: z.boolean().optional(),
        })
        .optional(),
      addresses: z
        .object({
          primary: z.string().max(160).optional(),
          secondary: z.string().max(160).optional(),
        })
        .optional(),
      phoneNumbers: z
        .array(z.object({ value: z.string().max(32), verified: z.boolean(), primary: z.boolean() }))
        .optional(),
      emailAddresses: z
        .array(z.object({ value: z.string().email(), verified: z.boolean(), primary: z.boolean() }))
        .optional(),
      addressBook: z
        .array(
          z.object({
            country: z.string().max(64),
            postalCode: z.string().max(16),
            city: z.string().max(64),
            address: z.string().max(160),
            primary: z.boolean(),
          })
        )
        .optional(),
    })
    .optional(),
  socialLinks: z
    .array(
      z.object({
        network: z.enum(['instagram', 'telegram', 'youtube', 'vk', 'facebook', 'max']),
        value: z
          .string()
          .max(160)
          .regex(/^[A-Za-z0-9@._:/-]+$/i, {
            message: 'Только латиница и допустимые символы (@ . _ - / :).',
          })
          .optional(),
        synced: z.boolean().optional(),
        verified: z.boolean().optional(),
      })
    )
    .optional(),
  sync: z
    .object({
      accounts: z
        .array(
          z.object({
            role: relativeRoleEnum,
            name: z.string().max(120).optional(),
            phone: z.string().max(32).optional(),
            contact: z.string().max(120).optional(),
            gender: z.enum(['female', 'male']).optional(),
            birthDate: z.string().optional(),
            synced: z.boolean().optional(),
            measurements: measurementsSchema.optional(),
            shareBonuses: z.boolean(),
            accessLevel: z.enum(['bonuses', 'favorites', 'full']).optional(),
            verified: z.boolean().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  lifestyle: z
    .object({
      occupation: z.string().max(64).optional(),
      age: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number().int().min(0).max(120).optional()
      ),
    })
    .optional(),
  measurements: measurementsSchema.optional(),
  preferences: z
    .object({
      favoriteBrands: z.string().max(400).optional(), // comma-separated
      favoriteColors: z.string().max(400).optional(),
      favoriteCategories: z.string().max(400).optional(),
      preferredMaterials: z.string().max(400).optional(),
      stylePersonality: z.string().max(64).optional(),
      priceMin: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number().optional()
      ),
      priceMax: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number().optional()
      ),
      forbiddenMaterials: z.string().optional(),
      forbiddenCategories: z.string().optional(),
    })
    .optional(),
});
