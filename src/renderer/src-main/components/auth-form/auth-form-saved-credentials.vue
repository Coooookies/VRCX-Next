<script setup lang="ts">
import z from 'zod'
import AuthSeparator from './auth-separator.vue'
import AuthAnimeWrapper from './auth-anime-wrapper.vue'
import AuthCredentialsComboBox from './auth-credentials-combo-box.vue'
import { useForm } from 'vee-validate'
import { useI18n } from '@renderer/shared/locale'
import { toTypedSchema } from '@vee-validate/zod'
import { onMounted, ref } from 'vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/shared/components/ui/form'
import { Button, SpinnerButton } from '@renderer/shared/components/ui/button'
import { SAVED_CREDENTIALS_FORM_SCHEMA } from './schema'
import type { AuthenticationCredentialEntity } from '@shared/definition/vrchat-authentication'
import type { LocaleI18NKeys } from '@renderer/shared/locale/types'

const { t } = useI18n()
const credentialComboxBoxOpen = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(SAVED_CREDENTIALS_FORM_SCHEMA),
  initialValues: {
    userId: ''
  }
})

const props = withDefaults(
  defineProps<{
    loading?: boolean
    items: AuthenticationCredentialEntity[]
    defaultUserId?: string
  }>(),
  {
    loading: false,
    initialValues: () => ({
      userId: ''
    })
  }
)

const emits = defineEmits<{
  (e: 'submit', values: z.infer<typeof SAVED_CREDENTIALS_FORM_SCHEMA>): void
  (e: 'deleteCredential', userId: string): void
  (e: 'changeToCredentials'): void
}>()

const onSubmit = form.handleSubmit((values) => {
  emits('submit', values)
})

onMounted(() => {
  if (props.defaultUserId && props.items.some((item) => item.userId === props.defaultUserId)) {
    form.setFieldValue('userId', props.defaultUserId)
  } else if (props.items.length > 0) {
    form.setFieldValue('userId', props.items[0].userId)
  }
})
</script>

<template>
  <AuthAnimeWrapper>
    <form class="w-80 flex flex-col gap-6" @submit="onSubmit">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">{{ t('authentication.savedCredentials.title') }}</h1>
      </div>
      <div className="grid gap-5">
        <FormField v-slot="{ componentField }" name="userId">
          <FormItem>
            <FormLabel class="leading-5">
              {{ t('authentication.savedCredentials.label_account') }}
            </FormLabel>
            <FormControl>
              <AuthCredentialsComboBox
                v-model:open="credentialComboxBoxOpen"
                :items="props.items"
                :value="componentField.modelValue"
                :disabled="props.loading"
                @delete="emits('deleteCredential', $event)"
                @update:value="componentField['onUpdate:modelValue']"
              />
            </FormControl>
            <FormMessage v-slot="{ message }">
              {{ t(message as LocaleI18NKeys) }}
            </FormMessage>
          </FormItem>
        </FormField>
        <SpinnerButton type="submit" :loading="props.loading">
          {{ t('authentication.savedCredentials.button_login') }}
        </SpinnerButton>
        <AuthSeparator />
        <div className="flex flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            class="flex-1"
            :disabled="props.loading"
            @click="emits('changeToCredentials')"
          >
            {{ t('authentication.savedCredentials.button_other_account') }}
          </Button>
        </div>
      </div>
    </form>
  </AuthAnimeWrapper>
</template>
