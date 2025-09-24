<template>
  <div class="relative flex flex-row size-full">
    <div class="relative w-1/2 bg-black/15 flex items-center justify-center">
      <slot name="background" />
    </div>
    <div class="relative flex-1 flex items-center justify-center">
      <slot name="content" />
    </div>
  </div>
</template>
