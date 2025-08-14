<script setup lang="ts">
import StateRadioGroup from './state-radio-group.vue'
import TypeRadioGroup from './type-radio-group.vue'
import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import { useModule } from '@renderer/shared/hooks/use-module'
import { useI18n } from '@renderer/shared/locale'
import { toTypedSchema } from '@vee-validate/zod'
import { VisuallyHidden } from 'reka-ui'
import { Input } from '../ui/input'
import { Button, SpinnerButton } from '@renderer/shared/components/ui/button'
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
import type { Runtime } from '@renderer/shared/modules/runtime'
import type { SettingModule } from '../../modules/setting'
import type { StateItem } from './state-radio-group.vue'
import type { TypeItem } from './type-radio-group.vue'
import type { LocaleI18NKeys } from '@renderer/shared/locale/types'

const { t } = useI18n()
const setting = useModule<SettingModule>('SettingModule')
const runtime = useModule<Runtime>('Runtime')
const credentialGroupOpen = ref(false)

const stateItems = computed<StateItem[]>(() => [
  {
    label: t('setting.network.proxy_disable_proxy'),
    value: 'disabled'
  },
  // {
  //   label: t('setting.network.proxy_use_system_proxy'),
  //   value: 'system_proxy'
  // },
  {
    label: t('setting.network.proxy_use_custom_proxy'),
    value: 'custom_proxy'
  }
])

const typeItems: TypeItem[] = [
  {
    label: 'HTTP',
    value: 'http'
  },
  // {
  //   label: 'HTTPS',
  //   value: 'https'
  // },
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

const onSubmit = form.handleSubmit(async (values) => {
  switch (values.state) {
    case 'disabled':
    case 'system_proxy': {
      await setting.update('network', 'proxy_state', values.state)
      break
    }
    case 'custom_proxy': {
      await Promise.all([
        setting.update('network', 'proxy_state', values.state),
        setting.update('network', 'proxy_type', values.type),
        setting.update('network', 'proxy_host', values.host),
        setting.update('network', 'proxy_port', values.port),
        setting.update('network', 'proxy_credential_username', values.credential_username || ''),
        setting.update('network', 'proxy_credential_password', values.credential_password || '')
      ])
    }
  }

  runtime.relaunch()
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
        <DialogTitle>{{ t('setting.network.proxy_settings_title') }}</DialogTitle>
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
                <FormLabel class="leading-5">{{ t('setting.network.proxy_host') }}</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Host" />
                </FormControl>
                <FormMessage v-slot="{ message }">
                  {{ t(message as LocaleI18NKeys) }}
                </FormMessage>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="port">
              <FormItem class="w-30">
                <FormLabel class="leading-5">{{ t('setting.network.proxy_port') }}</FormLabel>
                <FormControl>
                  <NumberField
                    :min="1"
                    :max="65535"
                    :model-value="componentField.modelValue"
                    :format-options="{ useGrouping: false }"
                    @update:model-value="
                      componentField['onUpdate:modelValue']?.($event || componentField.modelValue)
                    "
                  >
                    <NumberFieldInput class="px-3 text-left" />
                  </NumberField>
                </FormControl>
                <FormMessage v-slot="{ message }">
                  {{ t(message as LocaleI18NKeys) }}
                </FormMessage>
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
                <span>{{ t('setting.network.proxy_credential_optional') }}</span>
                <ChevronUpIcon v-if="credentialGroupOpen" class="h-4 w-4" />
                <ChevronDownIcon v-else class="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent class="flex flex-col gap-4">
              <FormField v-slot="{ componentField }" name="credential_username">
                <FormItem>
                  <FormLabel class="leading-5">
                    {{ t('setting.network.proxy_credential_username') }}
                  </FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Username" />
                  </FormControl>
                  <FormMessage v-slot="{ message }">
                    {{ t(message as LocaleI18NKeys) }}
                  </FormMessage>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="credential_password">
                <FormItem>
                  <FormLabel class="leading-5">
                    {{ t('setting.network.proxy_credential_password') }}
                  </FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Password" />
                  </FormControl>
                  <FormMessage v-slot="{ message }">
                    {{ t(message as LocaleI18NKeys) }}
                  </FormMessage>
                </FormItem>
              </FormField>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div class="grid gap-2">
          <SpinnerButton type="submit" class="flex-1" :loading="form.isSubmitting.value">
            {{ t('setting.network.proxy_apply') }}
          </SpinnerButton>
          <DialogClose as-child>
            <Button type="button" variant="ghost" class="flex-1">
              {{ t('setting.network.proxy_cancel') }}
            </Button>
          </DialogClose>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
