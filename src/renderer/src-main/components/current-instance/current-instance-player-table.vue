<script setup lang="ts">
export interface CurrentInstancePlayer {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}
</script>

<template>
  <p>1</p>
</template>
