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
      label_password: string
      input_password_placeholder: string
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
}
