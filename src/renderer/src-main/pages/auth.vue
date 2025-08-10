<script setup lang="ts">
import { useModule } from '@renderer/shared/hooks/use-module'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

const auth = useModule<VRChatAuthentication>('VRChatAuthentication')

function getAllCredentials(): void {
  auth.getAllCredentials().then((credentials) => {
    console.log('All credentials:', credentials)
  })
}

import { AuthenticationCredentialEntity } from '@shared/types/vrchat-authentication'
import {
  AuthFormCredentials,
  AuthFormSavedCredentials,
  AuthFormReauthenticate,
  AuthForm2FAAuthenticator
} from '../components/auth-form'
import { Button } from '@renderer/shared/components/ui/button'
import { Spinner } from '@renderer/shared/components/ui/spinner'

const items: AuthenticationCredentialEntity[] = [
  {
    userId: 'usr_7c270fb3-adab-4ff1-8113-a2c062538349',
    userName: 'buttercookies',
    displayName: 'ButterCookies',
    profileIconFileId: 'file_b0bfc14c-5f97-4bb3-a740-0c6900d597de',
    profileIconFileVersion: 2,
    createdAt: new Date('2025-08-10T03:36:23.113Z')
  }
]
</script>

<template>
  <div class="relative flex flex-row w-full h-full">
    <div class="relative flex-1 bg-black/20 flex items-center justify-center">
      <!-- <Button @click="getAllCredentials">Get</Button> -->
      <Spinner class="size-32" />
    </div>
    <div class="relative flex-1 flex items-center justify-center">
      <AuthForm2FAAuthenticator
        :overview="{
          username: 'buttercookies',
          displayName: 'ButterCookies',
          profileThumbnailImageFileId: 'file_b0bfc14c-5f97-4bb3-a740-0c6900d597de',
          profileThumbnailImageFileVersion: 2
        }"
      />
    </div>
  </div>
</template>
