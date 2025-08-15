<script setup lang="ts">
import { cn } from '@renderer/shared/utils/style'

// https://codepen.io/jkantner/pen/ZEvQbOK
interface SpinnerProps {
  variant?: 'default' | 'secondary'
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  variant: 'default'
})
</script>

<template>
  <svg
    class="animate-[spinner-bump_3s_infinite_linear]"
    viewBox="0 0 128 128"
    width="20px"
    height="20px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="pl-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" />
        <stop offset="100%" />
      </linearGradient>
    </defs>
    <circle
      :class="
        cn(
          'transition-[stroke_.3s]',
          props.variant === 'default'
            ? 'stroke-foreground/10 dark:stroke-foreground/20'
            : 'stroke-white/20 dark:stroke-foreground/20'
        )
      "
      r="56"
      cx="64"
      cy="64"
      fill="none"
      stroke-width="16"
      stroke-linecap="round"
    />
    <path
      :class="
        cn(
          'animate-[spinner-worm_3s_infinite_cubic-bezier(.42,.17,.75,.83)]',
          props.variant === 'default'
            ? 'stroke-primary dark:stroke-primary'
            : 'stroke-white dark:stroke-foreground'
        )
      "
      d="M 92 15.492 S 61 -1 45 46 c -4 11 -9 28 -17 61 L 119 57 l -101 -24 l 53 86 L 94 17 L 9 75 l 94 29 S 97 56 71 22 C 57 4 36 15.492 36 15.492 a 56 56 0 1 0 56 0 Z"
      fill="none"
      stroke="url(#pl-grad)"
      stroke-width="16"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-dasharray="44 1111"
      stroke-dashoffset="10"
    />
  </svg>
</template>

<style>
@keyframes spinner-bump {
  from,
  42%,
  46%,
  51%,
  55%,
  59%,
  63%,
  67%,
  71%,
  74%,
  78%,
  81%,
  85%,
  88%,
  92%,
  to {
    transform: translate(0, 0);
  }
  44% {
    transform: translate(1.33%, 6.75%);
  }
  53% {
    transform: translate(-16.67%, -0.54%);
  }
  61% {
    transform: translate(3.66%, -2.46%);
  }
  69% {
    transform: translate(-0.59%, 15.27%);
  }
  76% {
    transform: translate(-1.92%, -4.68%);
  }
  83% {
    transform: translate(9.38%, 0.96%);
  }
  90% {
    transform: translate(-4.55%, 1.98%);
  }
}

@keyframes spinner-worm {
  from {
    stroke-dashoffset: 10;
  }
  25% {
    stroke-dashoffset: 295;
  }
  to {
    stroke-dashoffset: 1165;
  }
}
</style>
