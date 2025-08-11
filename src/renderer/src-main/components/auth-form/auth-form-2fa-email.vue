<script setup lang="ts">
import z from 'zod'
import AuthUserOverviewButton from './auth-user-overview-button.vue'
import { onMounted, useTemplateRef } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel } from '@renderer/shared/components/ui/form'
import { Label } from '@renderer/shared/components/ui/label'
import { Button, CountdownButton } from '@renderer/shared/components/ui/button'
import { AuthenticationUserOverview } from '@shared/types/vrchat-authentication'
import { PinInput, PinInputGroup, PinInputSlot } from '@renderer/shared/components/ui/pin-input'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import { TWOFA_AUTHENTICATOR_FORM_SCHEMA } from './schema'

const pinInputRef = useTemplateRef('pinInputRef')

const form = useForm({
  validationSchema: toTypedSchema(TWOFA_AUTHENTICATOR_FORM_SCHEMA),
  initialValues: {
    code: []
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
  (e: 'submit', values: z.infer<typeof TWOFA_AUTHENTICATOR_FORM_SCHEMA>): void
  (e: 'back'): void
  (e: 'resendEmailOtp'): void
}>()

const onSubmit = form.handleSubmit((values) => {
  emits('submit', values)
})

const onResendEmailOtp = () => {
  emits('resendEmailOtp')
  form.setFieldValue('code', [])
  pinInputRef.value?.focus()
}

onMounted(() => {
  pinInputRef.value?.focus()
})
</script>

<template>
  <form class="w-79 flex flex-col gap-6" @submit="onSubmit">
    <div className="flex flex-col items-center text-center">
      <h1 className="text-xl font-bold">Two-Factor Authentication</h1>
    </div>
    <div className="grid gap-6">
      <div class="grid gap-2">
        <Label class="leading-5">Account</Label>
        <AuthUserOverviewButton
          type="button"
          :user-name="props.overview.username"
          :display-name="props.overview.displayName"
          :profile-icon-file-id="props.overview.profileThumbnailImageFileId"
          :profile-icon-file-version="props.overview.profileThumbnailImageFileVersion"
        />
      </div>
      <FormField v-slot="{ componentField }" name="code">
        <FormItem class="flex flex-col w-full justify-center items-center gap-y-3">
          <FormLabel class="leading-5 h-5">
            <template v-if="props.loading">
              <Spinner class="size-4" />
              <span>Verifying code</span>
            </template>
            <span v-else>Enter the 6 digit code sent to your Email.</span>
          </FormLabel>
          <FormControl>
            <PinInput
              ref="pinInputRef"
              type="number"
              :disabled="props.loading"
              :model-value="componentField.modelValue"
              @update:model-value="componentField['onUpdate:modelValue']"
              @complete="() => onSubmit()"
            >
              <PinInputGroup>
                <PinInputSlot :index="0" />
              </PinInputGroup>
              <PinInputGroup>
                <PinInputSlot :index="1" />
              </PinInputGroup>
              <PinInputGroup>
                <PinInputSlot :index="2" />
              </PinInputGroup>
              <PinInputGroup>
                <PinInputSlot :index="3" />
              </PinInputGroup>
              <PinInputGroup>
                <PinInputSlot :index="4" />
              </PinInputGroup>
              <PinInputGroup>
                <PinInputSlot :index="5" />
              </PinInputGroup>
            </PinInput>
          </FormControl>
          <div class="flex flex-row h-5 items-center gap-2 text-xs">
            <span class="text-muted-foreground">Didn't get the code?</span>
            <CountdownButton
              class="p-0 min-w-6 h-full text-xs font-semibold"
              variant="link"
              :countdown="60"
              :disabled="props.loading"
              @click="onResendEmailOtp"
            >
              Resend Code
            </CountdownButton>
          </div>
        </FormItem>
      </FormField>
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
