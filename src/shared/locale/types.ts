import { LANGUAGES } from '.'
import { LCID_DEFINITIONS } from './lcid'
import type { UserLanguage } from '@shared/definition/vrchat-users'

export type LanguageDefinition = {
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
    locate: Record<UserLanguage, string>
  }
  sidebar: {
    notifications: string
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
}

export type Languageinstance = {
  label: string
  value: string
  definition: LanguageDefinition
}

export type LanguageAvailableCode = keyof typeof LANGUAGES
export type LanguageCode = (typeof LCID_DEFINITIONS)[keyof typeof LCID_DEFINITIONS]
