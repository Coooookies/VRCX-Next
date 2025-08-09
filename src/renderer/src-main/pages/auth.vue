<script setup lang="ts">
import { ImageContext, ImageFallback, ImageRoot } from '@renderer/shared/components/ui/image'

// import { reactive } from 'vue'
// import { useModule } from '@renderer/shared/hooks/use-module'
// import { Button } from '@renderer/shared/components/ui/button'
// import { Input } from '@renderer/shared/components/ui/input'
// import { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

// const auth = useModule<VRChatAuthentication>('VRChatAuthentication')

// auth.on('state:update', (state) => {
//   console.log('Authentication state updated:', state)
// })

// const state = auth.state

// const form = reactive({
//   userId: '',
//   username: '',
//   password: '',
//   twoFactorAuthCode: ''
// })

// function login(): void {
//   auth.login(form.username, form.password)
// }

// function loginWithSavedCredential(): void {
//   auth.loginWithSavedCredential(form.userId)
// }
// function verifyTOTP(): void {
//   auth.verifyTOTP(form.twoFactorAuthCode)
// }

// function verifyEmailOTP(): void {
//   auth.verifyEmailOTP(form.twoFactorAuthCode)
// }

// function verifyRecoveryOTP(): void {
//   auth.verifyRecoveryOTP(form.twoFactorAuthCode)
// }

// function logout(): void {
//   auth.logout()
// }

// function getAllCredentials(): void {
//   auth.getAllCredentials().then((credentials) => {
//     console.log('All credentials:', credentials)
//   })
// }

// function getState(): void {
//   auth.getState().then((state) => {
//     console.log('State:', state)
//   })
// }

// function reset(): void {
//   auth.signout()
//   form.userId = ''
//   form.username = ''
//   form.password = ''
//   form.twoFactorAuthCode = ''
// }
</script>

<template>
  <div class="w-full h-full">
    <!-- <div>
      <Input v-model="form.username" placeholder="Username" />
      <Input v-model="form.password" placeholder="Password" />
      <Button @click="login">Login</Button>
    </div>
    <div>
      <Input v-model="form.userId" placeholder="UserId" />
      <Button @click="loginWithSavedCredential">Resume Login</Button>
    </div>
    <div>
      <Input v-model="form.twoFactorAuthCode" placeholder="2FA Code" />
      <Button @click="verifyTOTP">VerifyTOTP</Button>
      <Button @click="verifyEmailOTP">VerifyEmailOTP</Button>
      <Button @click="verifyRecoveryOTP">VerifyRecoveryOTP</Button>
    </div>
    <div>
      <Button @click="logout">Logout</Button>
      <Button @click="reset">Reset</Button>
      <Button @click="getAllCredentials">Get All Credentials</Button>
      <Button @click="getState">Get State</Button>
    </div>
    {{ state.type }} -->

    <div class="w-fit h-full overflow-y-scroll">
      <div class="flex flex-col">
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=1" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=2" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=3" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=4" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=5" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=6" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=7" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=8" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=9" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=10" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=11" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=12" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
        <ImageRoot class="block w-75 h-50">
          <ImageContext src="https://picsum.photos/300/200?random=13" lazy />
          <ImageFallback>test</ImageFallback>
        </ImageRoot>
      </div>
    </div>
  </div>
</template>
