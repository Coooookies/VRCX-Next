<script setup lang="ts">
import Button from './Button.vue'
import Spinner from '../spinner/Spinner.vue'
import type { ButtonProps } from './Button.vue'

interface SpinnerButtonProps extends ButtonProps {
  loading?: boolean
}

const props = withDefaults(defineProps<SpinnerButtonProps>(), {
  loading: false
})
</script>

<template>
  <Button v-bind="props" :disabled="props.loading || props.disabled">
    <template v-if="props.loading">
      <Spinner variant="secondary" />
    </template>
    <template v-else>
      <slot />
    </template>
  </Button>
</template>

<style scoped></style>
