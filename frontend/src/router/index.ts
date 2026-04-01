import { createRouter, createWebHashHistory } from 'vue-router'

import type { LocalizedText } from '../types/app'
import ActionCenterPage from '../pages/ActionCenterPage.vue'
import AIOpsPage from '../pages/AIOpsPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import IntegrationsAdminPage from '../pages/IntegrationsAdminPage.vue'
import MeetingDetailPage from '../pages/MeetingDetailPage.vue'
import MeetingsPage from '../pages/MeetingsPage.vue'
import MyActionItemsPage from '../pages/MyActionItemsPage.vue'
import ProjectHistoryPage from '../pages/ProjectHistoryPage.vue'
import TemplatesRulesPage from '../pages/TemplatesRulesPage.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: LocalizedText
  }
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { title: { zh: '总览', en: 'Overview' } },
    },
    {
      path: '/meetings',
      name: 'meetings',
      component: MeetingsPage,
      meta: { title: { zh: '会议', en: 'Meetings' } },
    },
    {
      path: '/meeting/:id',
      name: 'meeting-detail',
      component: MeetingDetailPage,
      meta: { title: { zh: '会议详情', en: 'Meeting detail' } },
    },
    {
      path: '/my-action-items',
      name: 'my-action-items',
      component: MyActionItemsPage,
      meta: { title: { zh: '我的行动项', en: 'My action items' } },
    },
    {
      path: '/project-history',
      name: 'project-history',
      component: ProjectHistoryPage,
      meta: { title: { zh: '项目历史', en: 'Project history' } },
    },
    {
      path: '/templates-rules',
      name: 'templates-rules',
      component: TemplatesRulesPage,
      meta: { title: { zh: '模板与规则', en: 'Templates & rules' } },
    },
    {
      path: '/integrations-admin',
      name: 'integrations-admin',
      component: IntegrationsAdminPage,
      meta: { title: { zh: '集成管理', en: 'Integrations' } },
    },
    {
      path: '/action-center',
      name: 'action-center',
      component: ActionCenterPage,
      meta: { title: { zh: '行动中心', en: 'Action center' } },
    },
    {
      path: '/ai-ops',
      name: 'ai-ops',
      component: AIOpsPage,
      meta: { title: { zh: 'AI 运维', en: 'AI ops' } },
    },
  ],
})

export default router
