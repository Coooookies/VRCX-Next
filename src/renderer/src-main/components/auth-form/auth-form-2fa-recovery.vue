<script setup lang="ts">
import z from 'zod'
import AuthSeparator from './auth-separator.vue'
import AuthAnimeWrapper from './auth-anime-wrapper.vue'
import AuthUserOverviewButton from './auth-user-overview-button.vue'
import { useForm } from 'vee-validate'
import { useI18n } from '@renderer/shared/locale'
import { nextTick, onMounted, useTemplateRef } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/shared/components/ui/form'
import { Label } from '@renderer/shared/components/ui/label'
import { Button, SpinnerButton } from '@renderer/shared/components/ui/button'
import { AuthenticationUserOverview } from '@shared/types/vrchat-authentication'
import {
  PinInput,
  PinInputGroup,
  PinInputSeparator,
  PinInputSlot
} from '@renderer/shared/components/ui/pin-input'
import { TWOFA_RECOVERY_FORM_SCHEMA } from './schema'

const { t } = useI18n()
const pinInputRef = useTemplateRef('pinInputRef')

const form = useForm({
  validationSchema: toTypedSchema(TWOFA_RECOVERY_FORM_SCHEMA),
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
  (e: 'submit', values: z.infer<typeof TWOFA_RECOVERY_FORM_SCHEMA>): void
  (e: 'back'): void
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
        <h1 className="text-xl font-bold">{{ t('authentication.twoFAfaRecovery.title') }}</h1>
      </div>
      <div className="grid gap-5">
        <div class="grid gap-2">
          <Label class="leading-5">{{ t('authentication.twoFAfaRecovery.label_account') }}</Label>
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
            <FormLabel class="leading-5">
              {{ t('authentication.twoFAfaRecovery.label_code') }}
            </FormLabel>
            <FormControl>
              <PinInput
                ref="pinInputRef"
                type="text"
                :disabled="props.loading"
                :model-value="componentField.modelValue"
                @update:model-value="componentField['onUpdate:modelValue']"
              >
                <PinInputGroup>
                  <PinInputSlot :index="0" />
                  <PinInputSlot :index="1" />
                  <PinInputSlot :index="2" />
                  <PinInputSlot :index="3" />
                </PinInputGroup>
                <PinInputSeparator />
                <PinInputGroup>
                  <PinInputSlot :index="4" />
                  <PinInputSlot :index="5" />
                  <PinInputSlot :index="6" />
                  <PinInputSlot :index="7" />
                </PinInputGroup>
              </PinInput>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <SpinnerButton type="submit" :loading="props.loading">
          {{ t('authentication.twoFAfaRecovery.button_verify') }}
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
            {{ t('authentication.twoFAfaRecovery.button_back') }}
          </Button>
        </div>
      </div>
    </form>
  </AuthAnimeWrapper>
</template>
