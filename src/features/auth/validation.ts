import Joi from 'joi'

/**
 * Client-side validation, with Joi.
 *
 * This is for UX only — it catches mistakes before a round trip and puts the
 * message next to the field that caused it. The backend revalidates everything
 * and remains the source of truth; a rule relaxed here does not become a rule
 * relaxed there.
 *
 * The rules mirror `api/schema.py` so the two do not disagree and produce the
 * confusing case where a form passes locally and then fails server-side.
 *
 * Joi infers no types, so each form's values are declared explicitly below.
 * They must be kept in step with their schema by hand — TypeScript cannot catch
 * a field added to one and not the other.
 */

/** Options applied to every schema. */
export const JOI_OPTIONS: Joi.ValidationOptions = {
  // Report every invalid field at once. Stopping at the first would make the
  // user fix one problem per submit.
  abortEarly: false,
  // Apply .trim() and .lowercase() to the submitted values rather than only
  // testing against them.
  convert: true,
  // Reject anything not in the schema, so a stray field cannot reach the API.
  allowUnknown: false,
  stripUnknown: false,
}

/**
 * Email.
 *
 * `tlds: { allow: false }` turns off checking the domain suffix against IANA's
 * registry: that list is a large data file, and bundling it into the browser to
 * reject `.invalidtld` is not a trade worth making. Structure is still checked.
 *
 * `.trim().lowercase()` matches the backend's normalisation on both register
 * and login — without it, an account created as "Aer@Gmail.com" (stored
 * lowercased) could never be signed into as typed.
 */
const email = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
    'string.email': 'Enter a valid email address.',
  })

/**
 * Password strength.
 *
 * The backend enforces a minimum of 8 characters on password *change* and
 * *reset*, but does not constrain registration at all. Asking for a little more
 * at signup is a UX decision made here on purpose: it is the one moment the
 * user is choosing a password, and a weak one taken now is permanent.
 */
const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[a-zA-Z]/, 'letter')
  .pattern(/\d/, 'number')
  .required()
  .messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
    'string.min': 'Use at least 8 characters.',
    'string.max': 'Use no more than 128 characters.',
    'string.pattern.name': 'Include at least one {#name}.',
  })

/**
 * Phone — exactly 10 digits, matching `validate_phone` in the User Service.
 *
 * Required, and required all the way down: `RegisterUser.phone` is `str` with
 * no default, the model column is `nullable=False`, and the database agrees.
 * Omitting it is a clean 422 naming the field. Requiring it is also right for a
 * delivery platform — a driver needs a number to call.
 */
const phone = Joi.string()
  .trim()
  .pattern(/^\d{10}$/)
  .required()
  .messages({
    'string.empty': 'Phone number is required.',
    'any.required': 'Phone number is required.',
    'string.pattern.base': 'Enter a 10-digit phone number.',
  })

/* ── Login ───────────────────────────────────────────────────────────────── */

export interface LoginFormValues {
  email: string
  password: string
}

export const loginSchema = Joi.object<LoginFormValues>({
  email,
  // Not the strength rule: an existing account may predate it, and refusing to
  // submit a password the backend would accept locks the user out of their own
  // account.
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
})

/* ── Signup ──────────────────────────────────────────────────────────────── */

export interface SignupFormValues {
  name: string
  email: string
  phone: string
  password: string
}

export const signupSchema = Joi.object<SignupFormValues>({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Enter your full name.',
    'any.required': 'Enter your full name.',
    'string.min': 'Enter your full name.',
    'string.max': 'Name must be 100 characters or fewer.',
  }),
  email,
  phone,
  password,
})

/* ── Forgot password ─────────────────────────────────────────────────────── */

export interface ForgotPasswordFormValues {
  email: string
}

export const forgotPasswordSchema = Joi.object<ForgotPasswordFormValues>({ email })

/* ── Change password ─────────────────────────────────────────────────────── */

export interface ChangePasswordFormValues {
  current_password: string
  new_password: string
  confirm_password: string
}

export const changePasswordSchema = Joi.object<ChangePasswordFormValues>({
  current_password: Joi.string().required().messages({
    'string.empty': 'Enter your current password.',
    'any.required': 'Enter your current password.',
  }),

  // `.invalid(Joi.ref(...))` rejects a "new" password identical to the old one.
  new_password: password.invalid(Joi.ref('current_password')).messages({
    'any.invalid': 'Choose a password different from your current one.',
  }),

  // `.valid(Joi.ref(...))` is Joi's cross-field comparison: the only accepted
  // value is whatever new_password holds.
  confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({
    'string.empty': 'Confirm your new password.',
    'any.required': 'Confirm your new password.',
    'any.only': 'Passwords do not match.',
  }),
})

/* ── Reset password ──────────────────────────────────────────────────────── */

export interface ResetPasswordFormValues {
  token: string
  new_password: string
  confirm_password: string
}

export const resetPasswordSchema = Joi.object<ResetPasswordFormValues>({
  token: Joi.string().required().messages({
    'string.empty': 'The reset link is missing its token.',
    'any.required': 'The reset link is missing its token.',
  }),
  new_password: password,
  confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({
    'string.empty': 'Confirm your new password.',
    'any.required': 'Confirm your new password.',
    'any.only': 'Passwords do not match.',
  }),
})
