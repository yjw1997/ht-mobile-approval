import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import { useRouteCacheStore, useUserStore } from '@/stores'

import { getToken, isLogin, setToken } from '@/utils/auth'
import setPageTitle from '@/utils/set-page-title'

NProgress.configure({ showSpinner: true, parent: '#app' })

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

// This will update routes at runtime without reloading the page
if (import.meta.hot)
  handleHotUpdate(router)

router.beforeEach(async (to: EnhancedRouteLocation) => {
  NProgress.start()

  const routeCacheStore = useRouteCacheStore()
  const userStore = useUserStore()

  // 检测URL参数中的token，根据不同情况设置全局token
  const tokenFromUrl = to.query.token as string | undefined
  const currentToken = getToken()

  // 判断条件：
  // 1. URL中存在token参数
  // 2. token参数有效（非空字符串）
  // 3. 如果当前已有token，则用URL中的token覆盖（允许更新token）
  // 4. 如果当前没有token，则设置URL中的token
  if (tokenFromUrl && tokenFromUrl.trim()) {
    // 如果当前token与URL中的token不同，则更新
    if (currentToken !== tokenFromUrl) {
      setToken(tokenFromUrl.trim())
    }
  }

  // Route cache
  routeCacheStore.addRoute(to)

  // Set page title
  setPageTitle(to.name)

  if (isLogin() && !userStore.userInfo?.uid)
    await userStore.info()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
