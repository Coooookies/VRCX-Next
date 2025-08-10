<script setup lang="ts">
import z from 'zod'
import AuthTitle from './auth-title.vue'
import AuthCredentialsComboBox from './auth-credentials-combo-box.vue'
import { cn } from '@renderer/shared/utils/style'
import { toTypedSchema } from '@vee-validate/zod'
import { onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/shared/components/ui/form'
import { Button, SpinnerButton } from '@renderer/shared/components/ui/button'
import { SAVED_CREDENTIALS_FORM_SCHEMA } from './schema'
import type { AuthenticationCredentialEntity } from '@shared/types/vrchat-authentication'

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
    initialValues?: z.infer<typeof SAVED_CREDENTIALS_FORM_SCHEMA>
    items: AuthenticationCredentialEntity[]
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
  (e: 'delectCredential', userId: string): void
  (e: 'changeToOtherAccount'): void
}>()

const onSubmit = form.handleSubmit((values) => {
  emits('submit', values)
})

onMounted(() => {
  if (props.initialValues) {
    form.setValues(props.initialValues)
  }
})
</script>

<template>
  <form class="w-79 flex flex-col gap-6" @submit="onSubmit">
    <AuthTitle title="Login to VRChat" />
    <div className="grid gap-6">
      <FormField v-slot="{ componentField }" name="userId">
        <FormItem>
          <FormLabel class="leading-5">Account</FormLabel>
          <FormControl>
            <AuthCredentialsComboBox
              v-model:open="credentialComboxBoxOpen"
              :items="props.items"
              :value="componentField.modelValue"
              :disabled="props.loading"
              @update:value="componentField['onUpdate:modelValue']"
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
          @click="emits('changeToOtherAccount')"
        >
          Other account
        </Button>
      </div>
    </div>
  </form>
</template>
