import { z } from 'zod'

export const CREDENTIALS_FORM_SCHEMA = z.object({
  username: z.string().min(1, {
    message: 'Username cannot be empty.'
  }),
  password: z.string().min(1, {
    message: 'Password cannot be empty.'
  }),
  saveCredential: z.boolean()
})

export const SAVED_CREDENTIALS_FORM_SCHEMA = z.object({
  userId: z.string()
})

export const REAUTHENTICATE_FORM_SCHEMA = z.object({
  username: z.string().min(1, {
    message: 'Username cannot be empty.'
  }),
  password: z.string().min(1, {
    message: 'Password cannot be empty.'
  })
})

export const TWOFA_AUTHENTICATOR_FORM_SCHEMA = z.object({
  code: z.string().length(6, {
    message: 'Authenticator code must be exactly 6 digits.'
  })
})

export const TWOFA_EMAIL_FORM_SCHEMA = z.object({
  code: z.string().length(6, {
    message: 'Email code must be exactly 6 digits.'
  })
})

export const TWOFA_RECOVERY_FORM_SCHEMA = z.object({
  code: z.string().length(8, {
    message: 'Email code must be exactly 8 digits.'
  })
})
