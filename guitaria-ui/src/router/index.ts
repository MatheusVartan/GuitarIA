import { createRouter, createWebHistory } from 'vue-router'
import FretboardPlayground from '@/views/FretboardPlayground.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/fretboard' },
    { path: '/fretboard', component: FretboardPlayground },
  ],
})

export default router
