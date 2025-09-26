import { UserLanguage, UserSocial } from '@shared/definition/vrchat-users'
import { Platform } from '@shared/definition/vrchat-api-response'
import type { LocaleStructure } from './types'

export const LANGUAGE_JA_JP: LocaleStructure = {
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
        visitor: 'Visitor',
        troll: 'Nuisance',
        new: 'New User',
        user: 'User',
        known: 'Known User',
        trusted: 'Trusted User',
        moderator: 'Administrator'
      },
      locale: {
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
        [UserLanguage.TWS]: '潮州語',
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
      },
      social: {
        [UserSocial.Pixiv]: 'Pixiv',
        [UserSocial.Bilibili]: 'Bilibili',
        [UserSocial.Booth]: 'Booth',
        [UserSocial.Youtube]: 'YouTube',
        [UserSocial.Discord]: 'Discord',
        [UserSocial.QQ]: 'QQ',
        [UserSocial.Telegram]: 'Telegram',
        [UserSocial.Steam]: 'Steam',
        [UserSocial.X]: 'X',
        [UserSocial.Github]: 'GitHub',
        [UserSocial.Tiktok]: 'TikTok',
        [UserSocial.Facebook]: 'Facebook',
        [UserSocial.Reddit]: 'Reddit',
        [UserSocial.Instagram]: 'Instagram',
        [UserSocial.Twitch]: 'Twitch',
        [UserSocial.Vimeo]: 'Vimeo',
        [UserSocial.Weibo]: 'Weibo',
        [UserSocial.Line]: 'LINE',
        [UserSocial.Niconico]: 'ニコニコ',
        [UserSocial.Patreon]: 'Patreon',
        [UserSocial.Kofi]: 'Ko-fi',
        [UserSocial.Other]: 'その他'
      }
    },
    works: {
      release_status: {
        public: '公開',
        private: '非公開',
        hidden: '非表示',
        all: 'すべて(?)'
      }
    },
    instance: {
      traveling: '進入中',
      type: {
        friends_plus: 'フレンド+',
        friends: 'フレンドのみ',
        invite_plus: '招待+',
        invite: '招待のみ',
        group_public: 'グループ公開',
        group_plus: 'グループ+',
        group: 'グループのみ',
        public: '公開',
        private: 'プライベート'
      }
    },
    platform: {
      [Platform.Android]: 'Android',
      [Platform.Standalonewindows]: 'Windows',
      [Platform.IOS]: 'iOS',
      [Platform.Web]: 'Web',
      [Platform.UnknownPlatform]: '不明'
    },
    notification: {
      empty_title: '通知はありません',
      empty_description: 'ここはとても静かです...',
      show_all_notification: 'すべての通知',
      content: {
        friend_request: 'フレンドになりたい。',
        instance_invite: 'に招待しました',
        instance_invite_response: '招待を辞退しました。',
        instance_request_invite: 'ワールド参加を申請しました。',
        instance_request_invite_response: '申請を辞退しました。',
        system_vote_to_kick: 'プレイヤーがキック投票を開始しました。',
        group_join_request: 'グループ参加を希望しています',
        group_invite: 'グループに招待しました'
      },
      response: {
        acknowledge: '了解',
        unsubscribe: '購読解除',
        group_invite_accept: '承認',
        group_invite_decline: '辞退',
        group_invite_block: 'ブロック',
        friend_request_accept: '承認',
        friend_request_decline: '辞退',
        instance_invite_accept: '承認',
        instance_invite_decline: '辞退',
        instance_invite_decline_with_message: '辞退（メッセージ付き）',
        instance_invite_decline_with_photo: '辞退（写真付き）',
        instance_request_invite_decline: '辞退',
        instance_request_invite_decline_with_message: '辞退（メッセージ付き）',
        instance_request_invite_decline_with_photo: '辞退（写真付き）',
        system_vote_to_kick_show_details: '詳細を見る'
      }
    },
    sidebar: {
      dashboard: 'ダッシュボード',
      favorites: 'お気に入り',
      feed: 'フィード',
      charts: 'チャート',
      settings: '設定',
      vrchat_waiting_for_join: '参加待機中',
      vrchat_not_running: '未実行',
      vrchat_world_loading: '読み込み中...',
      notifications: '通知',
      notifications_title: '通知',
      notifications_category: {
        friends: 'フレンド',
        groups: 'グループ',
        others: 'その他'
      },
      friends_manage: 'フレンド管理',
      friends_search_input_placeholder: '検索',
      friends_group_name: {
        online: 'オンライン',
        offline: 'オフライン',
        favorite: 'お気に入り',
        web_active: 'Web活動中'
      },
      collapse: '折りたたむ',
      expand: '展開する'
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
      processing: {
        vrcapi_notification_reponse_processing: '処理中...'
      },
      resolve: {
        vrcapi_notification_clear_success: 'すべての通知をクリアしました',
        vrcapi_notification_v1_accept_invite_success: '招待を承認しました',
        vrcapi_notification_v1_decline_invite_success: '招待を辞退しました',
        vrcapi_notification_v1_decline_invite_with_message_success: '招待を辞退しました',
        vrcapi_notification_v1_decline_invite_with_photo_success: '招待を辞退しました',
        vrcapi_notification_v1_accept_friend_request_success: 'フレンドリクエストを承認しました',
        vrcapi_notification_v1_decline_friend_request_success: 'フレンドリクエストを辞退しました',
        vrcapi_notification_v2_respond_success: '操作に成功しました'
      },
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
    },
    date: {
      just_now: '今',
      just_now_future: 'もうすぐ',
      yesterday: '昨日',
      tomorrow: '明日',
      minute_ago: '{value}分前',
      minutes_ago: '{value}分前',
      hour_ago: '{value}時間前',
      hours_ago: '{value}時間前',
      days_ago: '{value}日前',
      one_month_ago: '{value}ヶ月前',
      months_ago: '{value}ヶ月前',
      one_year_ago: '{value}年前',
      years_ago: '{value}年前',
      in_minute: '{value}分後',
      in_minutes: '{value}分後',
      in_hour: '{value}時間後',
      in_hours: '{value}時間後',
      in_days: '{value}日後',
      in_one_month: '{value}ヶ月後',
      in_months: '{value}ヶ月後',
      in_one_year: '{value}年後',
      in_years: '{value}年後'
    }
  }
}
