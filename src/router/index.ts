import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomeView.vue'),
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('@/pages/ExplorePage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('@/components/PhotoUploadModal.vue'),
    },
  ],
})

export default router
