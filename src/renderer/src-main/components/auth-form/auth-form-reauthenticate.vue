<script setup lang="ts">
import z from 'zod'
import AuthTitle from './auth-title.vue'
import AuthUserOverviewButton from './auth-user-overview-button.vue'
import { cn } from '@renderer/shared/utils/style'
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
import { REAUTHENTICATE_FORM_SCHEMA } from './schema'
import { onMounted } from 'vue'
import { AuthenticationUserOverview } from '@shared/types/vrchat-authentication'

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

onMounted(() => {
  form.setFieldValue('username', props.overview.username)
})
</script>

<template>
  <form class="w-79 flex flex-col gap-6" @submit="onSubmit">
    <AuthTitle title="Reverify Credentials" />
    <div className="grid gap-6">
      <FormField name="username">
        <FormItem>
          <FormLabel class="leading-5">Account</FormLabel>
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
            <FormLabel class="leading-5">Password</FormLabel>
            <a
              class="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
              @click="emits('changeToForgetPassword')"
            >
              Forgot your password?
            </a>
          </div>
          <FormControl>
            <Input
              type="password"
              placeholder="Password"
              v-bind="componentField"
              :disabled="props.loading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <SpinnerButton type="submit" :loading="props.loading">Login</SpinnerButton>
      <div
        :class="
          cn(
            'after:border-border relative text-center text-sm',
            'after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'
          )
        "
      >
        <span class="bg-background text-muted-foreground relative z-10 px-2">Or</span>
      </div>
      <div className="flex flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          class="flex-1"
          :disabled="props.loading"
          @click="emits('back')"
        >
          Back
        </Button>
      </div>
    </div>
  </form>
</template>
