<script setup lang="ts">
import AppTitle from '@shared/assets/vector/icon-vrcx.svg?component'
import AuthTooltipContainer from '../components/auth-form/auth-tooltip-container.vue'
import { useTemplateRef } from 'vue'
import { useAuth } from '../composables/auth'
import { useAuthSubmit } from '../composables/auth-submit'
import { AnimatePresence } from 'motion-v'
import { Button } from '@renderer/shared/components/ui/button'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import { LanguagesIcon, NetworkIcon } from 'lucide-vue-next'
import {
  AuthFormCredentials,
  AuthFormSavedCredentials,
  AuthFormReauthenticate,
  AuthForm2FAAuthenticator,
  AuthForm2FARecovery,
  AuthForm2FAEmail
} from '../components/auth-form'

const credentialFormRef = useTemplateRef('credentialFormRef')
const reauthenticateFormRef = useTemplateRef('reauthenticateFormRef')
const twoFactorAuthenticatorFormRef = useTemplateRef('twoFactorAuthenticatorFormRef')
const twoFactorRecoveryFormRef = useTemplateRef('twoFactorRecoveryFormRef')
const twoFactorEmailFormRef = useTemplateRef('twoFactorEmailFormRef')

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
    console.error('Credential error:', error)
    clearInput()
  },
  onReauthenticateRequest(error) {
    console.error('Reauthentication error:', error)
  },
  on2FAError(error) {
    console.error('2FA error:', error)
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
</script>

<template>
  <div class="relative flex flex-row w-full h-full">
    <div class="relative flex-1 bg-black/20 flex items-center justify-center">
      <div class="absolute top-0 left-0 w-full h-10.5 z-15 electron-drag" />
      <Spinner class="size-12" />
    </div>
    <div class="relative flex-1 flex items-center justify-center">
      <div class="absolute top-0 left-0 w-full h-10.5 z-15 electron-drag" />
      <div class="absolute top-0 left-0 w-full z-10 px-8 pt-8">
        <AppTitle class="w-17.5 h-6" />
      </div>
      <div class="absolute bottom-0 left-0 w-full flex flex-row justify-end gap-2.5 px-8 pb-8 z-10">
        <AuthTooltipContainer text="Network Settings">
          <Button size="icon" variant="outline">
            <NetworkIcon />
          </Button>
        </AuthTooltipContainer>
        <AuthTooltipContainer text="Language">
          <Button size="icon" variant="outline">
            <LanguagesIcon />
          </Button>
        </AuthTooltipContainer>
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
    </div>
  </div>
</template>
