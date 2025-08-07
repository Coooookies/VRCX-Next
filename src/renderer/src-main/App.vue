<script setup lang="ts">
import { useModule } from '@renderer/shared/hook/use-module'
import { IPCRenderer } from '@renderer/shared/modules/ipc'
import { reactive } from 'vue'

const ipc = useModule<IPCRenderer>('IPCRenderer')

ipc.listener.on('vrchat-authentication:state:error', (_, ...args) => {
  console.log('Authentication error:', ...args)
})

ipc.listener.on('vrchat-authentication:state:logging-out', () => {
  console.log('Logging out...')
})

ipc.listener.on('vrchat-authentication:state:unauthenticated', () => {
  console.log('Unauthenticated')
})

ipc.listener.on('vrchat-authentication:state:authenticating', (_, ...args) => {
  console.log('Authenticating...', ...args)
})

ipc.listener.on('vrchat-authentication:state:authenticated', (_, ...args) => {
  console.log('Authenticated:', ...args)
})

ipc.listener.on('vrchat-authentication:state:twofa-verifying', (_, ...args) => {
  console.log('Verifying 2FA...', ...args)
})

ipc.listener.on('vrchat-authentication:state:twofa-required', (_, ...args) => {
  console.log('2FA required:', ...args)
})

const form = reactive({
  username: '',
  password: '',
  authToken: '',
  twoFactorAuthToken: '',
  twoFactorAuthCode: ''
})

function loginWithCredential(): void {
  ipc.emitter.invoke(
    'vrchat-authentication:login-with-credential',
    form.username,
    form.password,
    form.twoFactorAuthToken
  )
}

function loginWithAuthToken(): void {
  ipc.emitter.invoke(
    'vrchat-authentication:login-with-authtoken',
    { displayName: 'ButterCookies', username: 'buttercookies' },
    form.authToken,
    form.twoFactorAuthToken
  )
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
function reset(): void {
  ipc.emitter.invoke('vrchat-authentication:reset')
  form.username = ''
  form.password = ''
  form.authToken = ''
  form.twoFactorAuthToken = ''
  form.twoFactorAuthCode = ''
}
</script>

<template>
  <div>
    <div>
      <input v-model="form.username" placeholder="Username" />
      <input v-model="form.password" placeholder="Password" />
      <button @click="loginWithCredential">Credential Login</button>
    </div>
    <div>
      <input v-model="form.authToken" placeholder="Auth Token" />
      <input v-model="form.twoFactorAuthToken" placeholder="Auth Token" />
      <button @click="loginWithAuthToken">AuthToken Login</button>
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
    </div>
  </div>
</template>
