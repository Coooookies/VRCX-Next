<script setup lang="ts">
import AppTitle from '@shared/assets/vector/icon-vrcx.svg?component'
import AuthLayout from '../layouts/auth-layout.vue'
import { toast } from 'vue-sonner'
import { useTemplateRef } from 'vue'
import { useAuth } from '../composables/auth'
import { useAuthSubmit } from '../composables/auth-submit'
import { AnimatePresence } from 'motion-v'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import { LocaleCombobox } from '@renderer/shared/components/locale'
import {
  AuthFormCredentials,
  AuthFormSavedCredentials,
  AuthFormReauthenticate,
  AuthForm2FAAuthenticator,
  AuthForm2FARecovery,
  AuthForm2FAEmail,
  AuthProxyButton
} from '../components/auth-form'
import { ResponseErrorReason } from '@shared/definition/vrchat-api-status'
import { useI18n } from '@renderer/shared/locale'

const credentialFormRef = useTemplateRef('credentialFormRef')
const reauthenticateFormRef = useTemplateRef('reauthenticateFormRef')
const twoFactorAuthenticatorFormRef = useTemplateRef('twoFactorAuthenticatorFormRef')
const twoFactorRecoveryFormRef = useTemplateRef('twoFactorRecoveryFormRef')
const twoFactorEmailFormRef = useTemplateRef('twoFactorEmailFormRef')

const { t } = useI18n()

const {
  isInitializing,
  isLoading,
  savedCredentials,
  resumeSession,
  recoveryCodeAvailable,
  currentFormType,
  currentOverview,
  deleteSavedCredential,
  backToAuthenticatorFromRecovery,
  backFromTwoFactorAuth,
  backFromReauthenticate,
  changeToSaveCredentials,
  changeToCredentials,
  changeToUseRecoveryCode
} = useAuth({
  onCredentialError(error) {
    if (error === ResponseErrorReason.InvalidCredentials) {
      toast.error(t('toast.error.vrcapi_authentication_login_invalid_credentials'))
      return
    }

    toastError(error)
    clearInput()
  },
  onReauthenticateRequest(error) {
    if (error === ResponseErrorReason.InvalidCredentials) {
      toast.error(t('toast.error.vrcapi_authentication_relogin_invalid_credentials'))
      return
    }

    toastError(error)
  },
  on2FAError(error) {
    if (error === ResponseErrorReason.BadRequest) {
      toast.error(t('toast.error.vrcapi_authentication_2fa_bad_request'))
      return
    }

    clearInput()
  }
})

const {
  saveCredentials,
  login,
  loginWithSavedCredential,
  relogin,
  resendEmailOTP,
  verifyTOTP,
  verifyEmailOTP,
  verifyRecoveryOTP
} = useAuthSubmit()

function clearInput() {
  credentialFormRef.value?.resetPasswordInput()
  reauthenticateFormRef.value?.resetPasswordInput()
  twoFactorAuthenticatorFormRef.value?.resetPinInput()
  twoFactorRecoveryFormRef.value?.resetPinInput()
  twoFactorEmailFormRef.value?.resetPinInput()
}

function toastError(error: ResponseErrorReason) {
  switch (error) {
    case ResponseErrorReason.BadRequest:
      toast.error(t('toast.error.vrcapi_api_bad_request'))
      break
    case ResponseErrorReason.NetworkError:
      toast.error(t('toast.error.vrcapi_api_network_error'))
      break
    case ResponseErrorReason.Forbidden:
      toast.error(t('toast.error.vrcapi_api_forbidden'))
      break
    case ResponseErrorReason.ServerError:
      toast.error(t('toast.error.vrcapi_api_server_error'))
      break
    case ResponseErrorReason.RateLimitExceeded:
      toast.error(t('toast.error.vrcapi_api_ratelimit_exceeded'))
      break
    case ResponseErrorReason.InvalidCredentials:
      toast.error(t('toast.error.vrcapi_api_invalid_credentials'))
      break
    case ResponseErrorReason.NotFound:
      toast.error(t('toast.error.vrcapi_api_not_found'))
      break
    case ResponseErrorReason.UnknownError:
      toast.error(t('toast.error.vrcapi_api_unknown_error'))
      break
  }
}
</script>

<template>
  <AuthLayout>
    <template #background>
      <div class="absolute top-0 left-0 w-full h-10.5 z-15 electron-drag" />
      <Spinner class="size-12" />
    </template>
    <template #content>
      <div class="absolute top-0 left-0 w-full h-10.5 z-15 electron-drag" />
      <div class="absolute top-0 left-0 w-full z-10 px-8 pt-8">
        <AppTitle class="w-17.5 h-6" />
      </div>
      <div class="absolute bottom-0 left-0 w-full flex flex-row justify-end gap-x-2 px-8 pb-8 z-10">
        <AuthProxyButton />
        <LocaleCombobox :align="'end'" :side-offset="8" content-class="w-51" />
      </div>
      <div v-if="!isInitializing" class="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait" :initial="false">
          <AuthFormCredentials
            v-if="currentFormType === 'credentials'"
            ref="credentialFormRef"
            :key="currentFormType"
            :loading="isLoading"
            :saved-credentials-available="savedCredentials.length > 0"
            :default-enable-save-credentials="saveCredentials"
            @change-to-save-credentials="changeToSaveCredentials"
            @submit="(values) => login(values.username, values.password, values.saveCredential)"
          />
          <AuthFormSavedCredentials
            v-else-if="currentFormType === 'savedCredentials'"
            :loading="isLoading"
            :items="savedCredentials"
            :default-user-id="resumeSession.loggedInUserId"
            @change-to-credentials="changeToCredentials"
            @delete-credential="deleteSavedCredential"
            @submit="(values) => loginWithSavedCredential(values.userId)"
          />
          <AuthFormReauthenticate
            v-else-if="currentFormType === 'reauthenticate'"
            ref="reauthenticateFormRef"
            :loading="isLoading"
            :overview="currentOverview"
            @back="backFromReauthenticate"
            @submit="(values) => relogin(values.username, values.password)"
          />
          <AuthForm2FAAuthenticator
            v-else-if="currentFormType === '2faAuthenticator'"
            ref="twoFactorAuthenticatorFormRef"
            :loading="isLoading"
            :overview="currentOverview"
            :recovery-available="recoveryCodeAvailable"
            @back="backFromTwoFactorAuth"
            @change-to-use-recovery-code="changeToUseRecoveryCode"
            @submit="(values) => verifyTOTP(values.code)"
          />
          <AuthForm2FARecovery
            v-else-if="currentFormType === '2faRecovery'"
            ref="twoFactorRecoveryFormRef"
            :loading="isLoading"
            :overview="currentOverview"
            @back="backToAuthenticatorFromRecovery"
            @submit="(values) => verifyRecoveryOTP(values.code)"
          />
          <AuthForm2FAEmail
            v-else-if="currentFormType === '2faEmail'"
            ref="twoFactorEmailFormRef"
            :loading="isLoading"
            :overview="currentOverview"
            @back="backFromTwoFactorAuth"
            @resend-email-otp="resendEmailOTP"
            @submit="(values) => verifyEmailOTP(values.code)"
          />
        </AnimatePresence>
      </div>
    </template>
  </AuthLayout>
</template>
