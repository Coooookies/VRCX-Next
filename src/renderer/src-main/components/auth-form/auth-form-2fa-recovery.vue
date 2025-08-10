<script setup lang="ts">
import z from 'zod'
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

const form = useForm({
  validationSchema: toTypedSchema(TWOFA_RECOVERY_FORM_SCHEMA),
  initialValues: {
    code: ''
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
          :user-name="props.overview.username"
          :display-name="props.overview.displayName"
          :profile-icon-file-id="props.overview.profileThumbnailImageFileId"
          :profile-icon-file-version="props.overview.profileThumbnailImageFileVersion"
        />
      </div>
      <FormField v-slot="{ componentField }" name="code">
        <FormItem class="flex flex-col w-full justify-center items-center gap-y-3">
          <FormLabel class="leading-5">Enter your recovery code.</FormLabel>
          <FormControl>
            <PinInput
              :model-value="componentField.modelValue.split('')"
              :disabled="props.loading"
              @update:model-value="componentField['onUpdate:modelValue']?.($event.join(''))"
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
      <SpinnerButton type="submit" :loading="props.loading">Verify</SpinnerButton>
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
