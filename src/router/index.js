import { createRouter, createWebHistory } from 'vue-router'
import Option from '../views/Option.vue'

const routes = [
  {
    path: '/',
    name: 'option',
    component: Option
  },
  {
    path: '/composition',
    name: 'composition',
    component: () => import('../views/Composition.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
