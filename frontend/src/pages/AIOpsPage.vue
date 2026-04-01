<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ t({ zh: 'AI 运营', en: 'AI Ops' }) }}<span class="page-phase-tag">P2</span></h1>
        <p class="page-subtitle">
          {{ t({ zh: '让 AI 优化从零散反馈升级为模块级运营能力。问题样本管理 · 技能注册表 · 版本治理', en: 'Turn scattered AI feedback into module-level operational governance. Badcase · Skill Registry · Versioning' }) }}
        </p>
      </div>
      <div class="toolbar-row">
        <span style="font-size:12px;color:#64748b;">2025-07-01 ~ 2025-08-05</span>
        <button class="secondary-button" style="height:32px;font-size:12.5px;" @click="exportReport">{{ t({ zh: '导出报告', en: 'Export Report' }) }}</button>
      </div>
    </header>

    <section class="metric-grid">
      <article v-for="metric in aiOpsMetrics" :key="t(metric.label)" class="metric-card">
        <span class="metric-label">{{ t(metric.label) }}</span>
        <strong
          class="metric-value"
          :style="metric.tone === 'danger' ? 'color:#dc2626' : metric.tone === 'warning' ? 'color:#d97706' : metric.tone === 'success' ? 'color:#059669' : ''"
        >{{ metric.value }}</strong>
        <span class="metric-hint" :class="metric.hint && t(metric.hint).startsWith('↑') ? 'up' : metric.hint && t(metric.hint).startsWith('↓') ? 'down' : ''">
          {{ metric.hint ? t(metric.hint) : '' }}
        </span>
      </article>
    </section>

    <section class="two-column">
      <!-- AI Capability Monitor -->
      <article class="surface table-card">
        <div class="card-header">
          <h3 class="card-title">{{ t({ zh: 'AI 模块监控', en: 'AI Capability Monitor' }) }}</h3>
          <span class="status-badge default">{{ t({ zh: '技能注册表', en: 'Skill Registry' }) }}</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ t({ zh: '模块', en: 'Module' }) }}</th>
                <th>{{ t({ zh: '版本', en: 'Version' }) }}</th>
                <th>{{ t({ zh: '指标', en: 'Metric' }) }}</th>
                <th>{{ t({ zh: '问题样本', en: 'Badcases' }) }}</th>
                <th>{{ t({ zh: '状态', en: 'Status' }) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="skill in skillMetrics" :key="skill.module">
                <td style="font-weight:600;">{{ skillModuleText(skill.module) }}</td>
                <td style="font-family:monospace;font-size:12px;color:#64748b;">{{ skill.version }}</td>
                <td>{{ skill.metric }}</td>
                <td>{{ skill.badcases }}</td>
                <td>
                  <span
                    class="status-badge"
                    :class="skill.status === 'Stable' ? 'success' : skill.status === 'Watch' ? 'warning' : 'default'"
                  >{{ skillStatusText(skill.status) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <!-- Right side -->
      <div class="side-stack">
        <!-- Badcase Management -->
        <article class="surface section-card">
          <div class="card-header">
            <h3 class="card-title">{{ t({ zh: '问题样本管理', en: 'Badcase Management' }) }}</h3>
            <button class="status-badge default aiops-badge-button" @click="addBadcase">{{ t({ zh: '新增样本', en: 'Add Badcase' }) }}</button>
          </div>
          <div class="card-body">
            <div v-for="item in badcases" :key="item.id" class="notice-card" :class="item.severity === 'P0' ? 'warning' : ''">
              <div class="toolbar-row" style="justify-content: space-between;margin-bottom:4px;">
                <h4>{{ t(item.title) }}</h4>
                <span
                  class="status-badge"
                  :class="item.severity === 'P0' ? 'danger' : item.severity === 'P1' ? 'warning' : 'default'"
                >{{ item.severity }}</span>
              </div>
              <p class="list-meta">{{ t(item.type) }} · {{ t(item.status) }}</p>
              <p style="margin-top:6px;">{{ t(item.summary) }}</p>
            </div>
          </div>
        </article>

        <!-- Regression Status -->
        <article class="surface section-card gradient-card">
          <div class="card-header">
            <h3 class="card-title">{{ t({ zh: '回归状态', en: 'Regression Status' }) }}</h3>
          </div>
          <div class="card-body">
            <div class="notice-card success">
              <h4>{{ t({ zh: '本周回归通过率 91%', en: 'Regression Pass Rate 91%' }) }}</h4>
              <p>{{ t({ zh: 'Action Item Extraction 与 Routing Suggestion 已通过回归；Owner / Deadline 识别仍在观察。', en: 'Action Item Extraction and Routing Suggestion passed regression; Owner / Deadline is still under watch.' }) }}</p>
            </div>
            <div class="notice-card warning">
              <h4>{{ t({ zh: '版本治理建议', en: 'Versioning Advice' }) }}</h4>
              <p>{{ t({ zh: '先暂停扩大 Blocker Scan 的灰度范围，等 badcase 再收敛一轮。', en: 'Pause wider rollout of Blocker Scan until one more badcase iteration is completed.' }) }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { aiOpsMetrics, badcases, localize, skillMetrics } from '../services/mockData'
import { useAppStore } from '../stores/app'
import { useUiStore } from '../stores/ui'
import type { LocalizedText } from '../types/app'

const appStore = useAppStore()
const uiStore = useUiStore()
const t = (text: LocalizedText) => localize(appStore.language, text)

const exportReport = () => {
  uiStore.pushToast(
    t({ zh: '报告导出中', en: 'Exporting report' }),
    t({ zh: '已为当前时间范围生成 AI Ops 演示报告。', en: 'An AI Ops demo report was generated for the selected time range.' }),
    'success',
  )
}

const addBadcase = () => {
  uiStore.pushToast(
    t({ zh: '问题样本草稿已创建', en: 'Badcase draft created' }),
    t({ zh: '请继续补充严重级别、模块和复现描述。', en: 'Please continue filling in severity, module, and reproduction details.' }),
  )
}

const skillModuleText = (module: string) => {
  const dict: Record<string, LocalizedText> = {
    'Action Item Extraction': { zh: '行动项提取', en: 'Action Item Extraction' },
    'Owner / Deadline': { zh: '负责人/截止日期识别', en: 'Owner / Deadline' },
    'Blocker Scan': { zh: '阻塞扫描', en: 'Blocker Scan' },
    '会议总结生成': { zh: '会议总结生成', en: 'Meeting Summary Generation' },
  }
  return dict[module] ? t(dict[module]) : module
}

const skillStatusText = (status: string) => {
  const dict: Record<string, LocalizedText> = {
    Stable: { zh: '稳定', en: 'Stable' },
    Watch: { zh: '观察中', en: 'Watch' },
    Iterating: { zh: '迭代中', en: 'Iterating' },
  }
  return dict[status] ? t(dict[status]) : status
}
</script>

<style scoped>
.aiops-badge-button {
  border: none;
  cursor: pointer;
}
</style>
