<script setup lang="ts">
import { Badge } from '@renderer/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/shared/components/ui/tabs'
import { PopoverContent } from '@renderer/shared/components/ui/popover'
</script>

<template>
  <PopoverContent
    :align="'start'"
    :align-offset="-32"
    :side-offset="24"
    side="left"
    update-position-strategy="optimized"
    disable-update-on-layout-shift
    class="relative w-94 h-160 p-0 rounded-lg"
  >
    <div class="pt-4 px-5 pb-1.5">
      <h2 class="text-base font-semibold">Notifications</h2>
    </div>
    <Tabs default-value="tab-1" class="w-full items-center">
      <TabsList
        class="w-full h-auto rounded-none border-b bg-transparent justify-start gap-4.5 px-5 py-0"
      >
        <TabsTrigger
          value="tab-1"
          class="h-10 gap-2 data-[state=active]:after:bg-primary relative rounded-none px-0 py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <span class="text-[13px]">Common</span>
          <Badge
            class="size-4 text-[10px] transition-opacity group-data-[state=inactive]:bg-primary/15"
          >
            3
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          class="h-10 data-[state=active]:after:bg-primary relative rounded-none px-0 py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <span class="text-[13px]">Group</span>
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          class="h-10 data-[state=active]:after:bg-primary relative rounded-none px-0 py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <span class="text-[13px]">System</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1">
        <p class="text-muted-foreground p-4 text-center text-xs">Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p class="text-muted-foreground p-4 text-center text-xs">Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p class="text-muted-foreground p-4 text-center text-xs">Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  </PopoverContent>
</template>
