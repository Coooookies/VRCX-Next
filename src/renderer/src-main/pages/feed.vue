<script setup lang="ts">
import AppRoute from '../layouts/app-route.vue'
import CurrentInstanceInfoTabs from '../components/current-instance/current-instance-info-tabs.vue'
import CurrentInstanceLocationThumbnail from '../components/current-instance/current-instance-location-thumbnail.vue'
import CurrentInstanceStats from '../components/current-instance/current-instance-stats.vue'
import CurrentInstanceArrowButton from '../components/current-instance/current-instance-arrow-button.vue'
import CurrentInstancePageTabs from '../components/current-instance/current-instance-page-tabs.vue'
import { ref } from 'vue'
import { cn } from '@renderer/shared/utils/style'
import { Tabs, TabsContent } from '@renderer/shared/components/ui/tabs'
import type { CurrentInstanceInfoTab } from '../components/current-instance/current-instance-info-tabs.vue'
import type { CurrentInstancePageTab } from '../components/current-instance/current-instance-page-tabs.vue'
import CurrentInstanceSearchInput from '../components/current-instance/current-instance-search-input.vue'
import CurrentInstancePlayerTable from '../components/current-instance/current-instance-player-table.vue'
// import { useModule } from '@renderer/shared/hooks/use-module'
// import type { VRChatInstances } from '@renderer/shared/modules/vrchat-instances'
import { useCurrentInstance } from '../composables/current-instance'

// const instance = useModule<VRChatInstances>('VRChatInstances')
const { instancePlayers } = useCurrentInstance()

const infoTabs: CurrentInstanceInfoTab[] = [
  { value: 'info-room', label: 'Room' },
  { value: 'info-world', label: 'World' }
]

const pageTabs: CurrentInstancePageTab[] = [
  { value: 'page-players', label: 'Players' },
  { value: 'page-event-history', label: 'Event History' }
]

const currentPageTab = ref(pageTabs[0].value)
</script>

<template>
  <AppRoute>
    <div class="@container w-full">
      <div
        :class="
          cn(
            'relative flex mx-auto gap-8 w-full px-10 flex-col',
            '@7xl:w-300 @7xl:px-0',
            '@5xl:flex-row'
          )
        "
      >
        <div
          :class="
            cn('relative w-full pt-21 h-fit z-2', '@5xl:sticky @5xl:top-0 @5xl:w-64', '@7xl:w-70')
          "
        >
          <div :class="cn('h-12 flex flex-row items-center', '@5xl:h-9')">
            <p :class="cn('font-semibold text-2xl', '@5xl:text-lg')">Location</p>
          </div>
          <div :class="cn('flex h-48 mt-4 flex-row gap-8', '@5xl:flex-col @5xl:gap-4')">
            <CurrentInstanceLocationThumbnail
              :thumbnail-file-id="'file_5b4b96dc-8cf1-4a67-850c-94736ca9e5a0'"
              :thumbnail-file-version="2"
              :author-name="'RootGentle'"
              :world-name="'Japan Shrine[early autumn]Japan Shrine[early autumn]'"
              :class="cn('w-[unset] h-full', '@5xl:w-full @5xl:h-[unset]')"
            />
            <Tabs :default-value="infoTabs[0].value" class="size-full gap-0">
              <CurrentInstanceInfoTabs :class="cn('w-1/2', '@5xl:w-full')" :tabs="infoTabs" />
              <TabsContent
                :value="infoTabs[0].value"
                :class="cn('px-0.5 flex flex-1 flex-col', '@5xl:flex-[unset]')"
              >
                <div
                  :class="
                    cn(
                      'flex flex-row border-b border-border border-dashed py-0 flex-1 items-center',
                      '@5xl:py-5 @5xl:flex-[unset]'
                    )
                  "
                >
                  <CurrentInstanceArrowButton label="Owner" value="RootGentle" />
                </div>
                <div
                  :class="
                    cn(
                      'grid grid-cols-4 gap-5 py-0 flex-1 items-center',
                      '@5xl:grid-cols-2 @5xl:py-5 @5xl:flex-[unset]'
                    )
                  "
                >
                  <CurrentInstanceStats label="In Room" value="23/50" />
                  <CurrentInstanceStats label="Access Type" value="Public" />
                  <CurrentInstanceStats label="Join Time" value="01:42:50" />
                  <CurrentInstanceStats label="Age Gate" value="-" />
                </div>
              </TabsContent>
              <TabsContent :value="infoTabs[1].value" class="px-0.5">
                <p class="text-muted-foreground p-4 text-center text-xs">Content for Tab 2</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div :class="cn('relative w-full pb-10 -mt-21', '@5xl:mt-0 @5xl:w-[unset] @5xl:flex-1')">
          <div class="sticky top-0 z-1 pt-21 pb-4 bg-background">
            <div class="flex flex-row justify-between h-9 pl-1">
              <CurrentInstancePageTabs v-model="currentPageTab" :tabs="pageTabs" />
              <CurrentInstanceSearchInput class="w-46 h-full" />
            </div>
          </div>
          <div>
            <CurrentInstancePlayerTable :players="instancePlayers" />
          </div>
        </div>
      </div>
    </div>
  </AppRoute>
</template>
