<script setup lang="ts">
import z from 'zod'
import AuthSeparator from './auth-separator.vue'
import AuthAnimeWrapper from './auth-anime-wrapper.vue'
import AuthUserOverviewButton from './auth-user-overview-button.vue'
import { useForm } from 'vee-validate'
import { useI18n } from '@renderer/shared/i18n'
import { nextTick, onMounted, useTemplateRef } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/shared/components/ui/form'
import { Input } from '@renderer/shared/components/ui/input'
import { Button, SpinnerButton } from '@renderer/shared/components/ui/button'
import { REAUTHENTICATE_FORM_SCHEMA } from './schema'
import type { AuthenticationUserOverview } from '@shared/types/vrchat-authentication'

const { t } = useI18n()
const passwordInputRef = useTemplateRef('passwordInputRef')

const form = useForm({
  validationSchema: toTypedSchema(REAUTHENTICATE_FORM_SCHEMA),
  initialValues: {
    username: '',
    password: ''
  }
})

const props = withDefaults(
  defineProps<{
    loading?: boolean
    overview: AuthenticationUserOverview
  }>(),
  {
    loading: false
  }
)

const emits = defineEmits<{
  (e: 'submit', values: z.infer<typeof REAUTHENTICATE_FORM_SCHEMA>): void
  (e: 'changeToForgetPassword'): void
  (e: 'back'): void
}>()

const onSubmit = form.handleSubmit((values) => {
  emits('submit', values)
})

const resetPasswordInput = () => {
  form.setFieldValue('password', '')
  nextTick(() => passwordInputRef.value?.focus())
}

onMounted(() => {
  form.setFieldValue('username', props.overview.username)
  passwordInputRef.value?.focus()
})

defineExpose({
  resetPasswordInput
})
</script>

<template>
  <AuthAnimeWrapper>
    <form class="w-80 flex flex-col gap-6" @submit="onSubmit">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">{{ t('authentication.reauthenticate.title') }}</h1>
      </div>
      <div className="grid gap-6">
        <FormField name="username">
          <FormItem>
            <FormLabel class="leading-5">
              {{ t('authentication.reauthenticate.label_account') }}
            </FormLabel>
            <FormControl>
              <AuthUserOverviewButton
                :user-name="props.overview.username"
                :display-name="props.overview.displayName"
                :profile-icon-file-id="props.overview.profileThumbnailImageFileId"
                :profile-icon-file-version="props.overview.profileThumbnailImageFileVersion"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <div class="flex items-center">
              <FormLabel class="leading-5">
                {{ t('authentication.reauthenticate.label_password') }}
              </FormLabel>
              <a
                class="ml-auto text-sm underline hover:no-underline cursor-pointer"
                @click="emits('changeToForgetPassword')"
              >
                {{ t('authentication.reauthenticate.link_forget_password') }}
              </a>
            </div>
            <FormControl>
              <Input
                ref="passwordInputRef"
                type="password"
                v-bind="componentField"
                :placeholder="t('authentication.reauthenticate.input_password_placeholder')"
                :disabled="props.loading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <SpinnerButton type="submit" :loading="props.loading">
          {{ t('authentication.reauthenticate.button_login') }}
        </SpinnerButton>
        <AuthSeparator />
        <div className="flex flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            class="flex-1"
            :disabled="props.loading"
            @click="emits('back')"
          >
            {{ t('authentication.reauthenticate.button_back') }}
          </Button>
        </div>
      </div>
    </form>
  </AuthAnimeWrapper>
</template>
