<script setup lang="ts">
import { useModule } from '@renderer/shared/hook/use-module'
import { IPCRenderer } from '@renderer/shared/modules/ipc'
import { reactive } from 'vue'

const ipc = useModule<IPCRenderer>('IPCRenderer')

ipc.listener.on('vrchat-authentication:state:update', (_, ...args) => {
  console.log('update:', ...args)
})

const form = reactive({
  userId: '',
  username: '',
  password: '',
  twoFactorAuthCode: ''
})

function login(): void {
  ipc.emitter.invoke('vrchat-authentication:login', form.username, form.password)
}

function loginWithSavedCredential(): void {
  ipc.emitter.invoke('vrchat-authentication:login-with-saved-credential', form.userId)
}

function verifyTOTP(): void {
  ipc.emitter.invoke('vrchat-authentication:verify-totp', form.twoFactorAuthCode)
}

function verifyEmailOTP(): void {
  ipc.emitter.invoke('vrchat-authentication:verify-email-otp', form.twoFactorAuthCode)
}

function verifyRecoveryOTP(): void {
  ipc.emitter.invoke('vrchat-authentication:verify-recovery-otp', form.twoFactorAuthCode)
}

function logout(): void {
  ipc.emitter.invoke('vrchat-authentication:logout')
}

function getAllCredentials(): void {
  ipc.emitter.invoke('vrchat-authentication:get-all-credentials').then((credentials) => {
    console.log('All credentials:', credentials)
  })
}

function getState(): void {
  ipc.emitter.invoke('vrchat-authentication:state').then((state) => {
    console.log('State:', state)
  })
}

function reset(): void {
  ipc.emitter.invoke('vrchat-authentication:signout')
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
