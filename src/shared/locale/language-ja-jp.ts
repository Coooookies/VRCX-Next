import { UserLanguage } from '@shared/definition/vrchat-users'
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
    profile: {
      status: {
        active: 'オンライン',
        join_me: 'いつでも歓迎',
        ask_me: '許可が必要です',
        busy: '取り込み中',
        offline: 'オフライン'
      },
      trust_rank: {
        visitor: 'ビジター',
        troll: '問題のあるプレイヤー',
        new: '新規プレイヤー',
        user: 'プレイヤー',
        known: '常連プレイヤー',
        trusted: 'ベテラン',
        moderator: 'モデレーター'
      },
      instance_type: {
        friends_plus: 'フレンド+',
        friends: 'フレンドのみ',
        invite_plus: '招待+',
        invite: '招待のみ',
        group_public: 'グループ公開',
        group_plus: 'グループ+',
        group: 'グループのみ',
        public: '公開',
        private: 'プライベート'
      },
      locate: {
        [UserLanguage.ENG]: '英語',
        [UserLanguage.KOR]: '韓国語',
        [UserLanguage.RUS]: 'ロシア語',
        [UserLanguage.SPA]: 'スペイン語',
        [UserLanguage.POR]: 'ポルトガル語',
        [UserLanguage.ZHO]: '中国語',
        [UserLanguage.DEU]: 'ドイツ語',
        [UserLanguage.JPN]: '日本語',
        [UserLanguage.FRA]: 'フランス語',
        [UserLanguage.SWE]: 'スウェーデン語',
        [UserLanguage.NLD]: 'オランダ語',
        [UserLanguage.POL]: 'ポーランド語',
        [UserLanguage.DAN]: 'デンマーク語',
        [UserLanguage.NOR]: 'ノルウェー語',
        [UserLanguage.ITA]: 'イタリア語',
        [UserLanguage.THA]: 'タイ語',
        [UserLanguage.FIN]: 'フィンランド語',
        [UserLanguage.HUN]: 'ハンガリー語',
        [UserLanguage.CES]: 'チェコ語',
        [UserLanguage.TUR]: 'トルコ語',
        [UserLanguage.ARA]: 'アラビア語',
        [UserLanguage.RON]: 'ルーマニア語',
        [UserLanguage.VIE]: 'ベトナム語',
        [UserLanguage.IND]: 'インドネシア語',
        [UserLanguage.MSA]: 'マレー語',
        [UserLanguage.FIL]: 'フィリピン語',
        [UserLanguage.CMN]: '標準中国語',
        [UserLanguage.HEB]: 'ヘブライ語',
        [UserLanguage.HMN]: 'ミャオ語',
        [UserLanguage.UKR]: 'ウクライナ語',
        [UserLanguage.TOK]: 'トキポナ語',
        [UserLanguage.YUE]: '広東語',
        [UserLanguage.WUU]: '呉語',
        [UserLanguage.ASE]: 'アメリカ手話',
        [UserLanguage.BFI]: 'イギリス手話',
        [UserLanguage.DSE]: 'オランダ手話',
        [UserLanguage.FSL]: 'フランス手話',
        [UserLanguage.JSL]: '日本手話',
        [UserLanguage.KVK]: '韓国手話'
      }
    },
    sidebar: {
      notifications: '通知',
      friends_manage: 'フレンド管理',
      friends_search_input_placeholder: '検索',
      friends_group_name: {
        online: 'オンライン',
        offline: 'オフライン',
        favorite: 'お気に入り',
        web_active: 'Web活動中'
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
