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
        label_password: '密码',
        input_password_placeholder: '请输入您的密码',
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
    }
  }
}
