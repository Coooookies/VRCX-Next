import { UserLanguage } from '@shared/definition/vrchat-users'
import type { LocaleStructure } from './types'

export const LANGUAGE_ZH_CN: LocaleStructure = {
  label: '简体中文',
  value: 'zh-CN',
  definition: {
    authentication: {
      global: {
        or: '其它',
        network_setting: '网络设置',
        language_setting: '语言设置'
      },
      credentials: {
        title: '登录到 VRChat',
        label_username: '用户名',
        input_username_placeholder: '用户名或邮箱',
        input_username_not_empty: '用户名不能为空',
        label_password: '密码',
        input_password_placeholder: '请输入您的密码',
        input_password_not_empty: '密码不能为空',
        link_forget_password: '忘记密码？',
        checkbox_remember_me: '保存凭据',
        button_login: '登录',
        button_register: '注册',
        button_saved_account: '已保存账户'
      },
      savedCredentials: {
        title: '登录到 VRChat',
        label_account: '账户',
        button_login: '登录',
        button_other_account: '其他账户'
      },
      reauthenticate: {
        title: '重新验证凭据',
        label_account: '账户',
        label_password: '密码',
        input_password_placeholder: '请输入您的密码',
        input_password_not_empty: '密码不能为空',
        link_forget_password: '忘记密码？',
        button_login: '登录',
        button_back: '返回'
      },
      twoFAAuthenticator: {
        title: '双重身份验证',
        label_account: '账户',
        label_processing: '处理中...',
        label_code: '输入验证器应用中的代码',
        button_recovery_code: '使用恢复代码',
        button_back: '返回'
      },
      twoFAfaRecovery: {
        title: '双重身份验证',
        label_account: '账户',
        label_code: '输入您的恢复代码',
        input_code_not_empty: '恢复代码需要至少8位字符',
        button_verify: '验证',
        button_back: '返回'
      },
      twoFAfaEmail: {
        title: '双重身份验证',
        label_account: '账户',
        label_processing: '处理中...',
        label_code: '输入发送到您邮箱的6位数字代码',
        label_did_not_receive_tip: '没有收到代码？',
        button_resend_email_otp: '重新发送',
        button_back: '返回'
      }
    },
    profile: {
      status: {
        active: '在线',
        join_me: '随时欢迎',
        ask_me: '需要许可',
        busy: '忙碌',
        offline: '离线'
      },
      trust_rank: {
        visitor: '游客',
        troll: '劣迹玩家',
        new: '萌新',
        user: '玩家',
        known: '长期玩家',
        trusted: '资深玩家',
        moderator: 'VRChat 团队'
      },
      instance_type: {
        friends_plus: '好友+',
        friends: '仅限好友',
        invite_plus: '邀请+',
        invite: '仅限邀请',
        group_public: '群组公开',
        group_plus: '群组+',
        group: '仅限群组',
        public: '公开',
        private: '位于私人房间'
      },
      locate: {
        [UserLanguage.ENG]: '英语',
        [UserLanguage.KOR]: '韩语',
        [UserLanguage.RUS]: '俄语',
        [UserLanguage.SPA]: '西班牙语',
        [UserLanguage.POR]: '葡萄牙语',
        [UserLanguage.ZHO]: '中文',
        [UserLanguage.DEU]: '德语',
        [UserLanguage.JPN]: '日语',
        [UserLanguage.FRA]: '法语',
        [UserLanguage.SWE]: '瑞典语',
        [UserLanguage.NLD]: '荷兰语',
        [UserLanguage.POL]: '波兰语',
        [UserLanguage.DAN]: '丹麦语',
        [UserLanguage.NOR]: '挪威语',
        [UserLanguage.ITA]: '意大利语',
        [UserLanguage.THA]: '泰语',
        [UserLanguage.FIN]: '芬兰语',
        [UserLanguage.HUN]: '匈牙利语',
        [UserLanguage.CES]: '捷克语',
        [UserLanguage.TUR]: '土耳其语',
        [UserLanguage.ARA]: '阿拉伯语',
        [UserLanguage.RON]: '罗马尼亚语',
        [UserLanguage.VIE]: '越南语',
        [UserLanguage.IND]: '印尼语',
        [UserLanguage.MSA]: '马来语',
        [UserLanguage.TWS]: '潮州话',
        [UserLanguage.FIL]: '菲律宾语',
        [UserLanguage.CMN]: '普通话',
        [UserLanguage.HEB]: '希伯来语',
        [UserLanguage.HMN]: '苗语',
        [UserLanguage.UKR]: '乌克兰语',
        [UserLanguage.TOK]: '托基波那语',
        [UserLanguage.YUE]: '粤语',
        [UserLanguage.WUU]: '吴语',
        [UserLanguage.ASE]: '美国手语',
        [UserLanguage.BFI]: '英国手语',
        [UserLanguage.DSE]: '荷兰手语',
        [UserLanguage.FSL]: '法国手语',
        [UserLanguage.JSL]: '日本手语',
        [UserLanguage.KVK]: '韩国手语'
      }
    },
    notification: {
      empty_title: '暂时没有通知',
      empty_description: '这里似乎非常安静...',
      show_all_notification: '所有通知',
      content: {
        friend_request: '想要成为你的好友。',
        instance_invite: '邀请你前往',
        instance_invite_response: '婉拒了你的邀请。',
        instance_request_invite: '申请加入你的世界。',
        instance_request_invite_response: '婉拒了你的申请。',
        system_vote_to_kick: '一位玩家发起了踢出投票。',
        group_join_request: '想要加入群组',
        group_invite: '邀请你加入群组'
      },
      response: {
        acknowledge: '知道了',
        unsubscribe: '取消订阅',
        friend_request_accept: '接受',
        friend_request_decline: '婉拒',
        instance_invite_decline: '婉拒',
        instance_invite_decline_with_message: '婉拒并附带留言',
        instance_invite_decline_with_photo: '婉拒并附带照片',
        instance_request_invite_decline: '婉拒',
        instance_request_invite_decline_with_message: '婉拒并附带留言',
        instance_request_invite_decline_with_photo: '婉拒并附带照片',
        system_vote_to_kick_show_details: '查看详情'
      }
    },
    sidebar: {
      notifications: '通知',
      notifications_title: '通知',
      notifications_category: {
        friends: '好友',
        groups: '群组',
        others: '其他'
      },
      friends_manage: '好友管理',
      friends_search_input_placeholder: '搜索',
      friends_group_name: {
        online: '在线',
        offline: '离线',
        favorite: '收藏',
        web_active: '网页活跃'
      }
    },
    setting: {
      network: {
        proxy_settings_title: '代理设置',
        proxy_disable_proxy: '不使用代理',
        proxy_use_system_proxy: '使用系统代理设置',
        proxy_use_custom_proxy: '使用自定义代理',
        proxy_host: '代理主机',
        proxy_host_not_empty: '不能为空',
        proxy_port: '代理端口',
        proxy_port_invaild: '端口必须在1~65535之间',
        proxy_credential_optional: '代理凭据设置（可选）',
        proxy_credential_username: '用户名',
        proxy_credential_password: '密码',
        proxy_apply: '应用并重启VRCX',
        proxy_cancel: '取消'
      },
      locale: {
        select_placeholder: '选择语言...',
        search_input_placeholder: '搜索语言',
        search_result_empty: '歪比巴卜，啥都没有'
      }
    },
    toast: {
      error: {
        vrcapi_api_not_found: '接口未找到: {reason}',
        vrcapi_api_forbidden: '访问被禁止: {reason}',
        vrcapi_api_network_error: '网络连接错误: {reason}',
        vrcapi_api_server_error: '服务器内部错误: {reason}',
        vrcapi_api_ratelimit_exceeded: 'API 请求频率超限: {reason}',
        vrcapi_api_unknown_error: '未知 API 错误: {reason}',
        vrcapi_api_invalid_credentials: 'API 凭据无效: {reason}',
        vrcapi_api_bad_request: 'API 请求参数错误: {reason}',
        vrcapi_authentication_2fa_bad_request: '无效的验证代码，请检查您的输入并重试。',
        vrcapi_authentication_login_invalid_credentials:
          '账户凭据无效，请检查您的用户名和密码并重试。',
        vrcapi_authentication_relogin_invalid_credentials:
          '为了保障VRChat账户的安全性，你需要再次提供您的身份凭据。'
      }
    },
    date: {
      just_now: '刚刚',
      just_now_future: '即刻',
      yesterday: '昨天',
      tomorrow: '明天',
      minute_ago: '{value}分钟前',
      minutes_ago: '{value}分钟前',
      hour_ago: '{value}小时前',
      hours_ago: '{value}小时前',
      days_ago: '{value}天前',
      one_month_ago: '{value}个月前',
      months_ago: '{value}个月前',
      one_year_ago: '{value}年前',
      years_ago: '{value}年前',
      in_minute: '{value}分钟后',
      in_minutes: '{value}分钟后',
      in_hour: '{value}小时后',
      in_hours: '{value}小时后',
      in_days: '{value}天后',
      in_one_month: '{value}个月后',
      in_months: '{value}个月后',
      in_one_year: '{value}年后',
      in_years: '{value}年后'
    }
  }
}
