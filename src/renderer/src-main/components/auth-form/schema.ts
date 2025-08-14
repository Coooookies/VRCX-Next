import { z } from 'zod'

export const CREDENTIALS_FORM_SCHEMA = z.object({
  username: z.string().min(1, {
    message: 'authentication.credentials.input_username_not_empty'
  }),
  password: z.string().min(1, {
    message: 'authentication.credentials.input_password_not_empty'
  }),
  saveCredential: z.boolean()
})

export const SAVED_CREDENTIALS_FORM_SCHEMA = z.object({
  userId: z.string()
})

export const REAUTHENTICATE_FORM_SCHEMA = z.object({
  username: z.string().min(1),
  password: z.string().min(1, {
    message: 'authentication.reauthenticate.input_password_not_empty'
  })
})

export const TWOFA_AUTHENTICATOR_FORM_SCHEMA = z.object({
  code: z.array(z.number()).length(6)
})

export const TWOFA_EMAIL_FORM_SCHEMA = z.object({
  code: z.array(z.number()).length(6)
})

export const TWOFA_RECOVERY_FORM_SCHEMA = z.object({
  code: z.array(z.string().length(1)).length(8, {
    message: 'authentication.twoFAfaRecovery.input_code_not_empty'
  })
})
