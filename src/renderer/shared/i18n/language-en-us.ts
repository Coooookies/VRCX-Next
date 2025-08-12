import type { LanguageDefinition } from './language'

export const LANGUAGE_EN_US: LanguageDefinition = {
  authentication: {
    global: {
      or: 'Or',
      network_setting: 'Network Setting',
      language_setting: 'Language'
    },
    credentials: {
      title: 'Login to VRChat',
      label_username: 'Username',
      input_username_placeholder: 'Username or Email',
      label_password: 'Password',
      input_password_placeholder: 'Enter your password',
      link_forget_password: 'Forgot Password?',
      checkbox_remember_me: 'Remember Me',
      button_login: 'Login',
      button_register: 'Register',
      button_saved_account: 'Saved Accounts'
    },
    savedCredentials: {
      title: 'Login to VRChat',
      label_account: 'Account',
      button_login: 'Login',
      button_other_account: 'Other account'
    },
    reauthenticate: {
      title: 'Reverify Credentials',
      label_account: 'Account',
      label_password: 'Password',
      input_password_placeholder: 'Enter your password',
      link_forget_password: 'Forgot Password?',
      button_login: 'Login',
      button_back: 'Back'
    },
    twoFAAuthenticator: {
      title: 'Two-Factor Authentication',
      label_account: 'Account',
      label_processing: 'Processing...',
      label_code: 'Enter code from Authenticator App.',
      button_recovery_code: 'Recovery Code',
      button_back: 'Back'
    },
    twoFAfaRecovery: {
      title: 'Two-Factor Authentication',
      label_account: 'Account',
      label_code: 'Enter your recovery code.',
      button_verify: 'Verify',
      button_back: 'Back'
    },
    twoFAfaEmail: {
      title: 'Two-Factor Authentication',
      label_account: 'Account',
      label_processing: 'Processing...',
      label_code: 'Enter the 6 digit code sent to your Email.',
      label_did_not_receive_tip: "Didn't get the code?",
      button_resend_email_otp: 'Resend Code',
      button_back: 'Back'
    }
  }
}
