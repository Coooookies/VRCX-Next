<script setup lang="ts">
import StateRadioGroup from './state-radio-group.vue'
import TypeRadioGroup from './type-radio-group.vue'
import { useForm } from 'vee-validate'
import { useModule } from '../../hooks/use-module'
import { toTypedSchema } from '@vee-validate/zod'
import { VisuallyHidden } from 'reka-ui'
import { Input } from '../ui/input'
import { Button } from '@renderer/shared/components/ui/button'
import { NumberField, NumberFieldInput } from '../ui/number-field'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/shared/components/ui/dialog'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'
import { NETWORK_PROXY_SCHEMA } from './schema'
import type { SettingModule } from '../../modules/setting'
import type { StateItem } from './state-radio-group.vue'
import type { TypeItem } from './type-radio-group.vue'
import { ref } from 'vue'

const setting = useModule<SettingModule>('SettingModule')
const credentialGroupOpen = ref(false)

const stateItems: StateItem[] = [
  {
    label: 'Disable proxy',
    value: 'disabled'
  },
  {
    label: 'Use system proxy settings',
    value: 'system_proxy'
  },
  {
    label: 'Use custom proxy',
    value: 'custom_proxy'
  }
]

const typeItems: TypeItem[] = [
  {
    label: 'HTTP',
    value: 'http'
  },
  {
    label: 'HTTPS',
    value: 'https'
  },
  {
    label: 'Socks',
    value: 'socks'
  }
]

const form = useForm({
  validationSchema: toTypedSchema(NETWORK_PROXY_SCHEMA),
  initialValues: {
    state: 'disabled',
    type: 'http',
    host: '',
    port: 0,
    credential_username: '',
    credential_password: ''
  }
})

const onSubmit = form.handleSubmit((values) => {
  console.log(values)
})

function preloadSetting() {
  credentialGroupOpen.value = false
  form.setValues({
    state: setting.state.network.proxy_state,
    type: setting.state.network.proxy_type,
    host: setting.state.network.proxy_host,
    port: setting.state.network.proxy_port,
    credential_username: setting.state.network.proxy_credential_username,
    credential_password: setting.state.network.proxy_credential_password
  })
}
</script>

<template>
  <Dialog @update:open="(open) => open && preloadSetting()">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="w-100">
      <DialogHeader>
        <DialogTitle>Proxy Settings</DialogTitle>
        <DialogDescription as-child><VisuallyHidden /></DialogDescription>
      </DialogHeader>
      <form class="space-y-6 pt-1.5" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="state">
          <FormItem>
            <FormControl>
              <StateRadioGroup
                :items="stateItems"
                :model-value="componentField.modelValue"
                @update:model-value="componentField['onUpdate:modelValue']"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <div v-show="form.values.state === 'custom_proxy'" class="space-y-5">
          <FormField v-slot="{ componentField }" name="type">
            <FormItem>
              <FormControl>
                <TypeRadioGroup
                  :items="typeItems"
                  :model-value="componentField.modelValue"
                  @update:model-value="componentField['onUpdate:modelValue']"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <div class="flex flex-row items-start gap-3">
            <FormField v-slot="{ componentField }" name="host">
              <FormItem class="flex-1">
                <FormLabel class="leading-5">Host</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Host" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="port">
              <FormItem class="w-30">
                <FormLabel class="leading-5">Port</FormLabel>
                <FormControl>
                  <NumberField
                    :min="1"
                    :max="65535"
                    :model-value="componentField.modelValue"
                    :format-options="{ useGrouping: false }"
                    @update:model-value="componentField['onUpdate:modelValue']"
                  >
                    <NumberFieldInput class="px-3 text-left" />
                  </NumberField>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <Collapsible
            v-model:open="credentialGroupOpen"
            class="flex w-full flex-col gap-4 md:w-[350px]"
          >
            <CollapsibleTrigger as-child>
              <Button
                variant="link"
                class="w-fit h-6 !p-0 justify-start underline-offset-2 gap-1"
                size="sm"
              >
                <span>Credential (Optional)</span>
                <ChevronUpIcon v-if="credentialGroupOpen" class="h-4 w-4" />
                <ChevronDownIcon v-else class="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent class="flex flex-col gap-4">
              <FormField v-slot="{ componentField }" name="credential_username">
                <FormItem>
                  <FormLabel class="leading-5">Username</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="credential_password">
                <FormItem>
                  <FormLabel class="leading-5">Password</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div class="grid gap-2">
          <Button type="submit" class="flex-1">Apply and restart VRCX</Button>
          <DialogClose as-child>
            <Button type="button" variant="ghost" class="flex-1">Cancel</Button>
          </DialogClose>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
