<script setup lang="ts">
import { useModule } from '@renderer/shared/hook/use-module'
import { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'
import { reactive } from 'vue'

const auth = useModule<VRChatAuthentication>('VRChatAuthentication')

auth.on('state:update', (state) => {
  console.log('Authentication state updated:', state)
})

const form = reactive({
  userId: '',
  username: '',
  password: '',
  twoFactorAuthCode: ''
})

function login(): void {
  auth.login(form.username, form.password)
}

function loginWithSavedCredential(): void {
  auth.loginWithSavedCredential(form.userId)
}
function verifyTOTP(): void {
  auth.verifyTOTP(form.twoFactorAuthCode)
}

function verifyEmailOTP(): void {
  auth.verifyEmailOTP(form.twoFactorAuthCode)
}

function verifyRecoveryOTP(): void {
  auth.verifyRecoveryOTP(form.twoFactorAuthCode)
}

function logout(): void {
  auth.logout()
}

function getAllCredentials(): void {
  auth.getAllCredentials().then((credentials) => {
    console.log('All credentials:', credentials)
  })
}

function getState(): void {
  auth.getState().then((state) => {
    console.log('State:', state)
  })
}

function reset(): void {
  auth.signout()
  form.userId = ''
  form.username = ''
  form.password = ''
  form.twoFactorAuthCode = ''
}
</script>

<template>
  <div>
    <div>
      <input v-model="form.username" placeholder="Username" />
      <input v-model="form.password" placeholder="Password" />
      <button @click="login">Login</button>
    </div>
    <div>
      <input v-model="form.userId" placeholder="UserId" />
      <button @click="loginWithSavedCredential">Resume Login</button>
    </div>
    <div>
      <input v-model="form.twoFactorAuthCode" placeholder="2FA Code" />
      <button @click="verifyTOTP">VerifyTOTP</button>
      <button @click="verifyEmailOTP">VerifyEmailOTP</button>
      <button @click="verifyRecoveryOTP">VerifyRecoveryOTP</button>
    </div>
    <div>
      <button @click="logout">Logout</button>
      <button @click="reset">Reset</button>
      <button @click="getAllCredentials">Get All Credentials</button>
      <button @click="getState">Get State</button>
    </div>
  </div>
</template>
