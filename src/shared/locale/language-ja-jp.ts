import type { Languageinstance } from './types'

export const LANGUAGE_JA_JP: Languageinstance = {
  label: '日本語',
  value: 'ja-JP',
  definition: {
    authentication: {
      global: {
        or: 'その他',
        network_setting: 'ネットワーク設定',
        language_setting: '言語設定'
      },
      credentials: {
        title: 'VRChat にログイン',
        label_username: 'ユーザー名',
        input_username_placeholder: 'ユーザー名またはメールアドレス',
        label_password: 'パスワード',
        input_password_placeholder: 'パスワードを入力してください',
        link_forget_password: 'パスワードをお忘れですか？',
        checkbox_remember_me: '資格情報を保存',
        button_login: 'ログイン',
        button_register: '新規登録',
        button_saved_account: '既存アカウント'
      },
      savedCredentials: {
        title: 'VRChat にログイン',
        label_account: 'アカウント',
        button_login: 'ログイン',
        button_other_account: 'その他のアカウント'
      },
      reauthenticate: {
        title: '資格情報を再認証',
        label_account: 'アカウント',
        label_password: 'パスワード',
        input_password_placeholder: 'パスワードを入力してください',
        link_forget_password: 'パスワードをお忘れですか？',
        button_login: 'ログイン',
        button_back: '戻る'
      },
      twoFAAuthenticator: {
        title: '二要素認証',
        label_account: 'アカウント',
        label_processing: '処理中...',
        label_code: '認証アプリのコードを入力',
        button_recovery_code: '復元コードを使用',
        button_back: '戻る'
      },
      twoFAfaRecovery: {
        title: '二要素認証',
        label_account: 'アカウント',
        label_code: '復元コードを入力',
        button_verify: '確認',
        button_back: '戻る'
      },
      twoFAfaEmail: {
        title: '二要素認証',
        label_account: 'アカウント',
        label_processing: '処理中...',
        label_code: 'メールに送信された6桁のコードを入力',
        label_did_not_receive_tip: 'コードが届きませんか？',
        button_resend_email_otp: '再送信',
        button_back: '戻る'
      }
    }
  }
}
