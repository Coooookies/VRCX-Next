import { UserLanguage } from '@shared/definition/vrchat-users'
import type { LocaleStructure } from './types'

export const LANGUAGE_EN_US: LocaleStructure = {
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
    profile: {
      status: {
        active: 'Online',
        join_me: 'Join Me',
        ask_me: 'Ask Me',
        busy: 'Busy',
        offline: 'Offline'
      },
      trust_rank: {
        visitor: 'Visitor',
        troll: 'Troll',
        new: 'New User',
        user: 'User',
        known: 'Known User',
        trusted: 'Trusted User',
        moderator: 'Moderator'
      },
      instance_type: {
        friends_plus: 'Friends+',
        friends: 'Friends',
        invite_plus: 'Invite+',
        invite: 'Invite',
        group_public: 'Group Public',
        group_plus: 'Group+',
        group: 'Group',
        public: 'Public',
        private: 'Private'
      },
      locate: {
        [UserLanguage.ENG]: 'English',
        [UserLanguage.KOR]: 'Korean',
        [UserLanguage.RUS]: 'Russian',
        [UserLanguage.SPA]: 'Spanish',
        [UserLanguage.POR]: 'Portuguese',
        [UserLanguage.ZHO]: 'Chinese',
        [UserLanguage.DEU]: 'German',
        [UserLanguage.JPN]: 'Japanese',
        [UserLanguage.FRA]: 'French',
        [UserLanguage.SWE]: 'Swedish',
        [UserLanguage.NLD]: 'Dutch',
        [UserLanguage.POL]: 'Polish',
        [UserLanguage.DAN]: 'Danish',
        [UserLanguage.NOR]: 'Norwegian',
        [UserLanguage.ITA]: 'Italian',
        [UserLanguage.THA]: 'Thai',
        [UserLanguage.FIN]: 'Finnish',
        [UserLanguage.HUN]: 'Hungarian',
        [UserLanguage.CES]: 'Czech',
        [UserLanguage.TUR]: 'Turkish',
        [UserLanguage.ARA]: 'Arabic',
        [UserLanguage.RON]: 'Romanian',
        [UserLanguage.VIE]: 'Vietnamese',
        [UserLanguage.IND]: 'Indonesian',
        [UserLanguage.MSA]: 'Malay',
        [UserLanguage.TWS]: 'Teochew',
        [UserLanguage.FIL]: 'Filipino',
        [UserLanguage.CMN]: 'Mandarin',
        [UserLanguage.HEB]: 'Hebrew',
        [UserLanguage.HMN]: 'Hmong',
        [UserLanguage.UKR]: 'Ukrainian',
        [UserLanguage.TOK]: 'Toki Pona',
        [UserLanguage.YUE]: 'Cantonese',
        [UserLanguage.WUU]: 'Wu Chinese',
        [UserLanguage.ASE]: 'American Sign Language',
        [UserLanguage.BFI]: 'British Sign Language',
        [UserLanguage.DSE]: 'Dutch Sign Language',
        [UserLanguage.FSL]: 'French Sign Language',
        [UserLanguage.JSL]: 'Japanese Sign Language',
        [UserLanguage.KVK]: 'Korean Sign Language'
      }
    },
    notification: {
      empty_title: 'No notifications',
      empty_description: 'It’s very quiet here...',
      show_all_notification: 'Show all',
      content: {
        friend_request: 'wants to be your friend.',
        instance_invite: 'invited you to',
        instance_invite_response: 'declined your invitation.',
        instance_request_invite: 'requested to join your world.',
        instance_request_invite_response: 'declined your request.',
        system_vote_to_kick: 'A player started a kick vote.',
        group_join_request: 'wants to join the group',
        group_invite: 'invited you to the group',
        friend_accept: 'Accept',
        friend_decline: 'Decline',
        instance_invite_decline: 'Decline',
        instance_invite_decline_with_message: 'Decline with message',
        instance_invite_decline_with_photo: 'Decline with photo',
        instance_request_invite_decline: 'Decline',
        instance_request_invite_decline_with_message: 'Decline with message',
        instance_request_invite_decline_with_photo: 'Decline with photo',
        system_vote_to_kick_show_details: 'View details'
      }
    },
    sidebar: {
      notifications: 'Notifications',
      notifications_title: 'Notifications',
      notifications_category: {
        friends: 'Friends',
        groups: 'Groups',
        others: 'Others'
      },
      friends_manage: 'Manage Friends',
      friends_search_input_placeholder: 'Search',
      friends_group_name: {
        online: 'Online',
        offline: 'Offline',
        favorite: 'Favorite',
        web_active: 'Web Active'
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
    },
    date: {
      just_now: 'now',
      just_now_future: 'in a moment',
      yesterday: 'yesterday',
      tomorrow: 'tomorrow',
      minute_ago: '{value} minute ago',
      minutes_ago: '{value} minutes ago',
      hour_ago: '{value} hour ago',
      hours_ago: '{value} hours ago',
      days_ago: '{value} days ago',
      one_month_ago: '{value} month ago',
      months_ago: '{value} months ago',
      one_year_ago: '{value} year ago',
      years_ago: '{value} years ago',
      in_minute: 'in {value} minute',
      in_minutes: 'in {value} minutes',
      in_hour: 'in {value} hour',
      in_hours: 'in {value} hours',
      in_days: 'in {value} days',
      in_one_month: 'in {value} month',
      in_months: 'in {value} months',
      in_one_year: 'in {value} year',
      in_years: 'in {value} years'
    }
  }
}
