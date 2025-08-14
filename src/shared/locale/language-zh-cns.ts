import type { Languageinstance } from './types'

export const LANGUAGE_ZH_CNS: Languageinstance = {
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
    }
  }
}
