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
        input_username_not_empty: 'ユーザー名を入力してください',
        label_password: 'パスワード',
        input_password_placeholder: 'パスワードを入力してください',
        input_password_not_empty: 'パスワードを入力してください',
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
        input_password_not_empty: 'パスワードを入力してください',
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
        input_code_not_empty: '復元コードは8文字以上必要です',
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
    },
    setting: {
      network: {
        proxy_settings_title: 'プロキシ設定',
        proxy_disable_proxy: 'プロキシを使用しない',
        proxy_use_system_proxy: 'システムのプロキシ設定を使用',
        proxy_use_custom_proxy: 'カスタムプロキシを使用',
        proxy_host: 'ホスト',
        proxy_host_not_empty: '空にできません',
        proxy_port: 'ポート',
        proxy_port_invaild: 'ポートは1〜65535です',
        proxy_credential_optional: 'プロキシ認証情報設定（オプション）',
        proxy_credential_username: 'ユーザー名',
        proxy_credential_password: 'パスワード',
        proxy_apply: '適用してVRCXを再起動',
        proxy_cancel: 'キャンセル'
      },
      locale: {
        select_placeholder: '言語を選択...',
        search_input_placeholder: '言語を検索',
        search_result_empty: '結果なし'
      }
    },
    toast: {
      error: {
        vrcapi_api_not_found: 'インターフェースが見つかりません: {reason}',
        vrcapi_api_forbidden: 'アクセスが禁止されています: {reason}',
        vrcapi_api_network_error: 'ネットワーク接続エラー: {reason}',
        vrcapi_api_server_error: 'サーバー内部エラー: {reason}',
        vrcapi_api_ratelimit_exceeded: 'APIリクエスト頻度制限を超えました: {reason}',
        vrcapi_api_unknown_error: '未知のAPIエラー: {reason}',
        vrcapi_api_invalid_credentials: 'API認証情報が無効です: {reason}',
        vrcapi_api_bad_request: 'APIリクエストパラメータエラー: {reason}',
        vrcapi_authentication_2fa_bad_request:
          '無効な認証コードです。入力内容を確認して再試行してください。',
        vrcapi_authentication_login_invalid_credentials:
          'アカウント認証情報が無効です。ユーザー名とパスワードを確認して再試行してください。',
        vrcapi_authentication_relogin_invalid_credentials:
          'VRChatアカウントのセキュリティを確保するため、再度認証情報を入力してください。'
      }
    }
  }
}
