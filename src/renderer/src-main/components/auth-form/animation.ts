import type { MotionStyle, VariantType } from 'motion-v'

export const ANIME_AUTH_FORM_COMPOSITION: Record<string, VariantType> = {
  hidden: {
    opacity: 0,
    translateY: 6
  },
  enter: {
    opacity: 1,
    translateY: 0,
    transition: {
      type: 'keyframes',
      duration: 0.3,
      ease: [0.38, 0.05, 0.07, 1]
    }
  },
  exit: {
    opacity: 0,
    translateY: -6,
    transition: {
      type: 'keyframes',
      duration: 0.15,
      ease: [0.38, 0.05, 0.07, 1]
    }
  }
}

export const ANIME_AUTH_TRANSITION_STYLE: MotionStyle = {
  position: 'absolute',
  width: 'fit-content',
  height: 'fit-content'
}
