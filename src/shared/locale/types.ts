import { LANGUAGES } from '.'
import { LCID_DEFINITIONS } from './lcid'
import type { NotificationGlobalCategory } from '@shared/definition/vrchat-notifications'
import type { UserLanguage, UserSocial } from '@shared/definition/vrchat-users'

export type LocaleDefinition = {
  authentication: {
    global: {
      or: string
      network_setting: string
      language_setting: string
    }
    credentials: {
      title: string
      label_username: string
      input_username_placeholder: string
      input_username_not_empty: string
      label_password: string
      input_password_placeholder: string
      input_password_not_empty: string
      link_forget_password: string
      checkbox_remember_me: string
      button_login: string
      button_register: string
      button_saved_account: string
    }
    savedCredentials: {
      title: string
      label_account: string
      button_login: string
      button_other_account: string
    }
    reauthenticate: {
      title: string
      label_account: string
      label_password: string
      input_password_placeholder: string
      input_password_not_empty: string
      link_forget_password: string
      button_login: string
      button_back: string
    }
    twoFAAuthenticator: {
      title: string
      label_account: string
      label_processing: string
      label_code: string
      button_recovery_code: string
      button_back: string
    }
    twoFAfaRecovery: {
      title: string
      label_account: string
      label_code: string
      input_code_not_empty: string
      button_verify: string
      button_back: string
    }
    twoFAfaEmail: {
      title: string
      label_account: string
      label_processing: string
      label_code: string
      label_did_not_receive_tip: string
      button_resend_email_otp: string
      button_back: string
    }
  }
  profile: {
    status: {
      active: string
      join_me: string
      ask_me: string
      busy: string
      offline: string
    }
    trust_rank: {
      visitor: string
      troll: string
      new: string
      user: string
      known: string
      trusted: string
      moderator: string
    }
    instance_type: {
      friends_plus: string
      friends: string
      invite_plus: string
      invite: string
      group_public: string
      group_plus: string
      group: string
      public: string
      private: string
    }
    loaction: {
      traveling: string
    }
    locale: Record<UserLanguage, string>
    social: Record<UserSocial, string>
  }
  notification: {
    empty_title: string
    empty_description: string
    show_all_notification: string
    content: {
      friend_request: string
      instance_invite: string
      instance_invite_response: string
      instance_request_invite: string
      instance_request_invite_response: string
      system_vote_to_kick: string
      group_join_request: string
      group_invite: string
    }
    response: {
      acknowledge: string
      unsubscribe: string
      group_invite_accept: string
      group_invite_decline: string
      group_invite_block: string
      friend_request_accept: string
      friend_request_decline: string
      instance_invite_decline: string
      instance_invite_decline_with_message: string
      instance_invite_decline_with_photo: string
      instance_request_invite_decline: string
      instance_request_invite_decline_with_message: string
      instance_request_invite_decline_with_photo: string
      system_vote_to_kick_show_details: string
    }
  }
  sidebar: {
    notifications: string
    notifications_title: string
    notifications_category: Record<NotificationGlobalCategory, string>
    friends_manage: string
    friends_search_input_placeholder: string
    friends_group_name: {
      online: string
      offline: string
      favorite: string
      web_active: string
    }
  }
  setting: {
    network: {
      proxy_settings_title: string
      proxy_disable_proxy: string
      proxy_use_system_proxy: string
      proxy_use_custom_proxy: string
      proxy_host: string
      proxy_host_not_empty: string
      proxy_port: string
      proxy_port_invaild: string
      proxy_credential_optional: string
      proxy_credential_username: string
      proxy_credential_password: string
      proxy_apply: string
      proxy_cancel: string
    }
    locale: {
      select_placeholder: string
      search_input_placeholder: string
      search_result_empty: string
    }
  }
  toast: {
    error: {
      vrcapi_api_not_found: string
      vrcapi_api_forbidden: string
      vrcapi_api_network_error: string
      vrcapi_api_server_error: string
      vrcapi_api_ratelimit_exceeded: string
      vrcapi_api_unknown_error: string
      vrcapi_api_invalid_credentials: string
      vrcapi_api_bad_request: string
      vrcapi_authentication_2fa_bad_request: string
      vrcapi_authentication_login_invalid_credentials: string
      vrcapi_authentication_relogin_invalid_credentials: string
    }
  }
  date: {
    just_now: string
    just_now_future: string
    yesterday: string
    tomorrow: string
    minute_ago: string
    minutes_ago: string
    hour_ago: string
    hours_ago: string
    days_ago: string
    one_month_ago: string
    months_ago: string
    one_year_ago: string
    years_ago: string
    in_minute: string
    in_minutes: string
    in_hour: string
    in_hours: string
    in_days: string
    in_one_month: string
    in_months: string
    in_one_year: string
    in_years: string
  }
}

export type LocaleStructure = {
  label: string
  value: string
  definition: LocaleDefinition
}

export type LanguageAvailableCode = keyof typeof LANGUAGES
export type LanguageCode = (typeof LCID_DEFINITIONS)[keyof typeof LCID_DEFINITIONS]
