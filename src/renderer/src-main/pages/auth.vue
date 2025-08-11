<script setup lang="ts">
import { useAuth } from '../composables/auth'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import {
  AuthFormCredentials,
  AuthFormSavedCredentials,
  AuthFormReauthenticate,
  AuthForm2FAAuthenticator,
  AuthForm2FARecovery,
  AuthForm2FAEmail
} from '../components/auth-form'
const {
  isInitializing,
  isLoading,
  savedCredentials,
  resumeSession,
  currentFormType,
  currentOverview,
  backToAuthenticatorFromRecovery,
  backFromTwoFactorAuth,
  backFromReauthenticate,
  changeToSaveCredentials,
  changeToCredentials,
  changeToUseRecoveryCode
} = useAuth({
  onCredentialError(error) {
    console.error('Credential error:', error)
  },
  on2FAError(error) {
    console.error('2FA error:', error)
  }
})
</script>

<template>
  <div class="relative flex flex-row w-full h-full">
    <div class="relative flex-1 bg-black/20 flex items-center justify-center">
      <Spinner class="size-32" />
    </div>
    <div v-if="!isInitializing" class="relative flex-1 flex items-center justify-center">
      <AuthFormCredentials
        v-if="currentFormType === 'credentials'"
        :loading="isLoading"
        @change-to-save-credentials="changeToSaveCredentials"
      />
      <AuthFormSavedCredentials
        v-else-if="currentFormType === 'savedCredentials'"
        :loading="isLoading"
        :items="savedCredentials"
        :default-user-id="resumeSession.loggedInUserId"
        @change-to-credentials="changeToCredentials"
      />
      <AuthFormReauthenticate
        v-else-if="currentFormType === 'reauthenticate'"
        :loading="isLoading"
        :overview="currentOverview"
        @back="backFromReauthenticate"
      />
      <AuthForm2FAAuthenticator
        v-else-if="currentFormType === '2faAuthenticator'"
        :loading="isLoading"
        :overview="currentOverview"
        @back="backFromTwoFactorAuth"
        @change-to-use-recovery-code="changeToUseRecoveryCode"
      />
      <AuthForm2FARecovery
        v-else-if="currentFormType === '2faRecovery'"
        :loading="isLoading"
        :overview="currentOverview"
        @back="backToAuthenticatorFromRecovery"
      />
      <AuthForm2FAEmail
        v-else-if="currentFormType === '2faEmail'"
        :loading="isLoading"
        :overview="currentOverview"
        @back="backFromTwoFactorAuth"
      />
    </div>
  </div>
</template>
