import { ref } from 'vue'
import type { LensId } from '../content/stack'

/**
 * Which target role the visitor is hiring for. The stack grid and the case
 * studies both read it, so picking a role in one place highlights the other.
 * It only highlights: nothing is hidden for the other roles.
 */
const lens = ref<LensId>('backend')

export function useLens() {
  return { lens }
}
