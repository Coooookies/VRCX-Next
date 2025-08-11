<script setup lang="ts">
import z from 'zod'
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
import { Checkbox } from '@renderer/shared/components/ui/checkbox'
import { CREDENTIALS_FORM_SCHEMA } from './schema'

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
</script>

<template>
  <form class="w-79 flex flex-col gap-6" @submit="onSubmit">
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
      <FormField v-slot="{ componentField }" name="saveCredential">
        <FormItem class="flex flex-row items-center gap-2">
          <FormControl>
            <Checkbox
              :model-value="componentField.modelValue"
              :disabled="props.loading"
              @update:model-value="componentField['onUpdate:modelValue']"
            />
          </FormControl>
          <FormLabel class="text-sm font-normal">Save Account</FormLabel>
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
          @click="emits('changeToRegister')"
        >
          Register
        </Button>
        <Button
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
</template>
