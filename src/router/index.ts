
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/country/:code',
      name: 'country-detail',
      component: () => import('@/views/CountryDetailView.vue'),
    },
  ],
})

export default router
