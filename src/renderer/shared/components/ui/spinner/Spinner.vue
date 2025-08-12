<script setup lang="ts">
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
    class="pl"
    viewBox="0 0 128 128"
    width="20px"
    height="20px"
    xmlns="http://www.w3.org/2000/svg"
    :style="[`--fg: var(${props.variant === 'default' ? '--primary' : '--foreground'});`]"
  >
    <defs>
      <linearGradient id="pl-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" />
        <stop offset="100%" />
      </linearGradient>
    </defs>
    <circle
      class="pl__ring"
      r="56"
      cx="64"
      cy="64"
      fill="none"
      stroke-width="16"
      stroke-linecap="round"
    />
    <path
      class="pl__worm"
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

<style scoped>
.pl,
.pl__worm {
  animation-duration: 3s;
  animation-iteration-count: infinite;
}
.pl {
  --bg: color-mix(in oklab, var(--foreground) 20%, transparent);
  --fg: var(--foreground);

  animation-name: bump;
  animation-timing-function: linear;
}
.pl__ring {
  stroke: var(--bg);
  transition: stroke 0.3s;
}

.pl__worm {
  stroke: var(--fg);
  animation-name: worm;
  animation-timing-function: cubic-bezier(0.42, 0.17, 0.75, 0.83);
}

/* Animations */
@keyframes bump {
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
@keyframes worm {
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
