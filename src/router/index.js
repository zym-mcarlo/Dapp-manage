import Vue from 'vue'
import VueRouter from 'vue-router'

import buySet from '@/pages/buySet'
import releasePrice from '@/pages/releasePrice'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'buySet',
      path: '/buySet',
      component: buySet
    },
    {
      name: 'releasePrice',
      path: '/releasePrice',
      component: releasePrice
    },
    {
      path: '/',
      redirect: '/buySet'
    }
  ]
})
