import type { Languageinstance } from './types'

export const LANGUAGE_EN_US: Languageinstance = {
  label: 'English (US)',
  value: 'en-US',
  definition: {
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
        input_username_not_empty: 'Cannot be empty',
        label_password: 'Password',
        input_password_placeholder: 'Enter your password',
        input_password_not_empty: 'Cannot be empty',
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
        input_password_not_empty: 'Cannot be empty',
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
        input_code_not_empty: 'At least 8 characters long.',
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
    },
    setting: {
      network: {
        proxy_settings_title: 'Proxy Settings',
        proxy_disable_proxy: 'Disable proxy',
        proxy_use_system_proxy: 'Use system proxy settings',
        proxy_use_custom_proxy: 'Use custom proxy',
        proxy_host: 'Host',
        proxy_host_not_empty: 'Host cannot be empty',
        proxy_port: 'Port',
        proxy_port_invaild: 'Port must be in 1~65535',
        proxy_credential_optional: 'Credential (Optional)',
        proxy_credential_username: 'Username',
        proxy_credential_password: 'Password',
        proxy_apply: 'Apply and restart VRCX',
        proxy_cancel: 'Cancel'
      },
      locale: {
        select_placeholder: 'Language...',
        search_input_placeholder: 'Search',
        search_result_empty: 'Oops...Nothing found!'
      }
    },
    toast: {
      error: {
        vrcapi_api_not_found: 'API not found: {reason}',
        vrcapi_api_forbidden: 'Access forbidden: {reason}',
        vrcapi_api_network_error: 'Network connection error: {reason}',
        vrcapi_api_server_error: 'Server internal error: {reason}',
        vrcapi_api_ratelimit_exceeded: 'API request rate limit exceeded: {reason}',
        vrcapi_api_unknown_error: 'Unknown API error: {reason}',
        vrcapi_api_invalid_credentials: 'Invalid API credentials: {reason}',
        vrcapi_api_bad_request: 'Bad API request parameters: {reason}',
        vrcapi_authentication_2fa_bad_request:
          'Invalid verification code, please check your input and try again.',
        vrcapi_authentication_login_invalid_credentials:
          'Invalid account credentials, please check your username and password and try again.',
        vrcapi_authentication_relogin_invalid_credentials:
          'To ensure the security of your VRChat account, you need to provide your credentials again.'
      }
    }
  }
}
