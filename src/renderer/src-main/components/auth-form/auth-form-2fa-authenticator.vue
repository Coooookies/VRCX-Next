<script setup lang="ts">
import z from 'zod'
import AuthSeparator from './auth-separator.vue'
import AuthAnimeWrapper from './auth-anime-wrapper.vue'
import AuthUserOverviewButton from './auth-user-overview-button.vue'
import { useForm } from 'vee-validate'
import { useI18n } from '@renderer/shared/locale'
import { nextTick, onMounted, useTemplateRef } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel } from '@renderer/shared/components/ui/form'
import { Label } from '@renderer/shared/components/ui/label'
import { Button } from '@renderer/shared/components/ui/button'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import { AuthenticationUserOverview } from '@shared/types/vrchat-authentication'
import { PinInput, PinInputGroup, PinInputSlot } from '@renderer/shared/components/ui/pin-input'
import { TWOFA_AUTHENTICATOR_FORM_SCHEMA } from './schema'

const { t } = useI18n()
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
    recoveryAvailable?: boolean
  }>(),
  {
    loading: false
  }
)

const emits = defineEmits<{
  (e: 'submit', values: z.infer<typeof TWOFA_AUTHENTICATOR_FORM_SCHEMA>): void
  (e: 'back'): void
  (e: 'changeToUseRecoveryCode'): void
}>()

const onSubmit = form.handleSubmit((values) => {
  emits('submit', values)
})

const resetPinInput = () => {
  form.setFieldValue('code', [])
  nextTick(() => pinInputRef.value?.focus())
}

onMounted(() => {
  pinInputRef.value?.focus()
})

defineExpose({
  resetPinInput
})
</script>

<template>
  <AuthAnimeWrapper>
    <form class="w-80 flex flex-col gap-6" @submit="onSubmit">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-xl font-bold">{{ t('authentication.twoFAAuthenticator.title') }}</h1>
      </div>
      <div className="grid gap-6">
        <div class="grid gap-2">
          <Label class="leading-5">
            {{ t('authentication.twoFAAuthenticator.label_account') }}
          </Label>
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
                <span>{{ t('authentication.twoFAAuthenticator.label_processing') }}</span>
              </template>
              <span v-else>{{ t('authentication.twoFAAuthenticator.label_code') }}</span>
            </FormLabel>
            <FormControl>
              <PinInput
                ref="pinInputRef"
                type="number"
                :model-value="componentField.modelValue"
                :disabled="props.loading"
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
          </FormItem>
        </FormField>
        <AuthSeparator />
        <div className="flex flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            class="flex-1"
            :disabled="props.loading"
            @click="emits('back')"
          >
            {{ t('authentication.twoFAAuthenticator.button_back') }}
          </Button>
          <Button
            v-if="props.recoveryAvailable"
            type="button"
            variant="outline"
            class="flex-1"
            :disabled="props.loading"
            @click="emits('changeToUseRecoveryCode')"
          >
            {{ t('authentication.twoFAAuthenticator.button_recovery_code') }}
          </Button>
        </div>
      </div>
    </form>
  </AuthAnimeWrapper>
</template>
