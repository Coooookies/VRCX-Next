<script setup lang="ts">
import z from 'zod'
import AuthSeparator from './auth-separator.vue'
import AuthAnimeWrapper from './auth-anime-wrapper.vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/shared/components/ui/form'
import { Input } from '@renderer/shared/components/ui/input'
import { Button, SpinnerButton } from '@renderer/shared/components/ui/button'
import { Checkbox } from '@renderer/shared/components/ui/checkbox'
import { CREDENTIALS_FORM_SCHEMA } from './schema'
import { nextTick, onMounted, useTemplateRef } from 'vue'

const passwordInputRef = useTemplateRef('passwordInputRef')

const form = useForm({
  validationSchema: toTypedSchema(CREDENTIALS_FORM_SCHEMA),
  initialValues: {
    username: '',
    password: '',
    saveCredential: false
  }
})

const props = withDefaults(
  defineProps<{
    loading?: boolean
    defaultEnableSaveCredentials?: boolean
    savedCredentialsAvailable?: boolean
  }>(),
  {
    loading: false
  }
)

const emits = defineEmits<{
  (e: 'submit', values: z.infer<typeof CREDENTIALS_FORM_SCHEMA>): void
  (e: 'changeToSaveCredentials'): void
  (e: 'changeToRegister'): void
  (e: 'changeToForgetPassword'): void
}>()

const onSubmit = form.handleSubmit((values) => {
  emits('submit', values)
})

const resetPasswordInput = () => {
  form.setFieldValue('password', '')
  nextTick(() => passwordInputRef.value?.focus())
}

onMounted(() => {
  form.setFieldValue('saveCredential', props.defaultEnableSaveCredentials ?? false)
})

defineExpose({
  resetPasswordInput
})
</script>

<template>
  <AuthAnimeWrapper>
    <form class="w-80 flex flex-col gap-6" @submit="onSubmit">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Login to VRChat</h1>
      </div>
      <div className="grid gap-6">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel class="leading-5">Username</FormLabel>
            <FormControl>
              <Input
                placeholder="Username or Email"
                v-bind="componentField"
                :disabled="props.loading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel class="leading-5">Password</FormLabel>
            <FormControl>
              <Input
                ref="passwordInputRef"
                type="password"
                placeholder="Enter your password"
                v-bind="componentField"
                :disabled="props.loading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="saveCredential">
          <FormItem class="flex flex-row justify-betwee items-center gap-2">
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  :model-value="componentField.modelValue"
                  :disabled="props.loading"
                  @update:model-value="componentField['onUpdate:modelValue']"
                />
              </FormControl>
              <FormLabel class="text-sm text-muted-foreground font-normal">Remember me</FormLabel>
            </div>
            <a
              class="ml-auto text-sm underline hover:no-underline cursor-pointer"
              @click="emits('changeToForgetPassword')"
            >
              Forgot password?
            </a>
          </FormItem>
        </FormField>
        <SpinnerButton type="submit" :loading="props.loading">Login</SpinnerButton>
        <AuthSeparator />
        <div className="flex flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            class="flex-1"
            :disabled="props.loading"
            @click="emits('changeToRegister')"
          >
            Register
          </Button>
          <Button
            v-if="savedCredentialsAvailable"
            type="button"
            variant="outline"
            class="flex-1"
            :disabled="props.loading"
            @click="emits('changeToSaveCredentials')"
          >
            Saved Accounts
          </Button>
        </div>
      </div>
    </form>
  </AuthAnimeWrapper>
</template>
