import { onMounted, onUnmounted } from 'vue'
import { useI18n } from '@renderer/shared/locale'
import { useModule } from '@renderer/shared/hooks/use-module'
import type { SettingModule } from '@renderer/shared/modules/setting'
import type { InstanceProperties, SettingDefinition } from '@shared/definition/setting'

export function useLocaleUpdater() {
  const i18n = useI18n()
  const setting = useModule<SettingModule>('SettingModule')

  const handlePropertyUpdate = (property: InstanceProperties<SettingDefinition>) => {
    if (property.namespace === 'appearance' && property.key === 'language') {
      i18n.locale.value = property.value
    }
  }

  onMounted(() => {
    i18n.locale.value = setting.state.appearance.language
    setting.addListener('update', handlePropertyUpdate)
  })

  onUnmounted(() => {
    setting.removeListener('update', handlePropertyUpdate)
  })
}
