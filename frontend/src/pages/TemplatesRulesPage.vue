<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ t({ zh: '模板与规则', en: 'Templates & Rules' }) }}</h1>
        <p class="page-subtitle">{{ t({ zh: '覆盖会议全流程：采集、抽取、路由、同步、通知、AI 与审计治理。', en: 'Covers end-to-end flow: ingest, extract, route, sync, notify, AI and audit governance.' }) }}</p>
      </div>
    </header>

    <section class="two-column tr-layout">
      <article class="surface section-card tr-nav-card">
        <div class="card-header tr-nav-head">
          <h3 class="card-title">{{ t({ zh: '配置域', en: 'Configuration domains' }) }}</h3>
        </div>
        <div class="card-body tr-nav-body">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="tr-category-btn"
            :class="{ 'tr-category-btn--active': selectedCategoryId === cat.id }"
            @click="selectedCategoryId = cat.id"
          >
            <component :is="iconMap[cat.icon]" :size="15" color="#64748b" :stroke-width="1.9" class="tr-category-icon" />
            <span class="tr-category-title">{{ t(cat.title) }}</span>
            <span v-if="isReadOnly(cat.id)" class="tr-readonly-tag">{{ t({ zh: '只读', en: 'Read only' }) }}</span>
          </button>
        </div>
      </article>

      <article class="surface section-card tr-detail-card">
        <div class="card-header tr-detail-head">
          <div>
            <h3 class="card-title">{{ t(currentCategory.title) }}</h3>
            <p class="tr-detail-subtitle">{{ t(currentCategory.desc) }}</p>
          </div>
          <div v-if="!isReadOnlyCategory && (selectedCategoryId !== 'meeting-template' || meetingConfig.editingTemplateId)" class="toolbar-row">
            <button class="tr-text-btn tr-action-btn" @click="resetCurrent">{{ t({ zh: '放弃修改', en: 'Discard Changes' }) }}</button>
            <button class="primary-button tr-action-btn" @click="saveCurrent">{{ t({ zh: '保存', en: 'Save' }) }}</button>
          </div>
        </div>

        <div class="card-body tr-detail-body">
          <div v-if="isReadOnlyCategory" class="tr-readonly-banner">
            {{ t({ zh: '该配置属于平台治理项，仅支持查看。变更需走管理员发布流程。', en: 'This domain is platform-governed and view-only. Changes must go through admin release flow.' }) }}
          </div>
          <fieldset class="tr-readonly-fieldset" :disabled="isReadOnlyCategory">
          <template v-if="selectedCategoryId === 'meeting-template'">
            <section v-if="!meetingConfig.editingTemplateId" class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '标准会议模板', en: 'Standard Meeting Templates' }) }}</h4>
              <div class="tr-template-list">
                <div v-for="item in meetingConfig.templateItems" :key="item.id" class="tr-template-item">
                  <div class="tr-template-item-main">
                    <p class="tr-template-item-name">{{ t(item.name) }}</p>
                    <div class="tr-template-chip-row">
                      <span v-for="module in enabledModules(item.modules)" :key="`${item.id}-${module}`" class="tr-module-chip">{{ moduleNameText(module) }}</span>
                    </div>
                    <p class="tr-template-item-meta">
                      <LinkSpark :size="13" color="#10b981" :stroke-width="2" />
                      <span>{{ t({ zh: '默认同步', en: 'Default Sync' }) }}:</span>
                      <strong>{{ defaultSyncLabel(item.meetingTypeKey) }}</strong>
                    </p>
                  </div>
                  <button
                    class="tr-icon-btn"
                    :title="t({ zh: '编辑模板', en: 'Edit template' })"
                    :aria-label="t({ zh: '编辑模板', en: 'Edit template' })"
                    @click="editTemplate(item.id)"
                  >
                    <PenLine :size="15" color="#98a2b3" :stroke-width="1.9" />
                  </button>
                </div>
              </div>
              <button class="tr-create-template-btn" @click="createTemplate">+ {{ t({ zh: '新建模板', en: 'Create New Template' }) }}</button>
            </section>

            <section v-else class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '编辑模板', en: 'Edit template' }) }}</h4>
              <div class="tr-form-grid">
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '模板中文名', en: 'Template name (ZH)' }) }}</span>
                  <input v-model.trim="editingMeetingTemplate.name.zh" class="input-box" />
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '模板英文名', en: 'Template name (EN)' }) }}</span>
                  <input v-model.trim="editingMeetingTemplate.name.en" class="input-box" />
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '版本', en: 'Version' }) }}</span>
                  <input v-model.trim="editingMeetingTemplate.version" class="input-box" />
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '会议类型', en: 'Meeting type' }) }}</span>
                  <select v-model="editingMeetingTemplate.meetingTypeKey" class="select-box">
                    <option v-for="type in meetingTypeOptions" :key="type.key" :value="type.key">{{ t(type.label) }}</option>
                  </select>
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '纪要确认 SLA（分钟）', en: 'Summary review SLA (minutes)' }) }}</span>
                  <input v-model.number="editingMeetingTemplate.reviewSlaMinutes" type="number" min="10" class="input-box" />
                </label>
              </div>
              <div class="tr-row-head">{{ t({ zh: 'AI 提取模块', en: 'AI extraction modules' }) }}</div>
              <div v-for="module in editingMeetingTemplate.modules" :key="module.name" class="tr-row tr-row--compact">
                <span>{{ moduleNameText(module.name) }}</span>
                <button class="tr-switch" role="switch" :aria-checked="module.enabled" @click="module.enabled = !module.enabled">
                  <span class="tr-switch-knob" />
                </button>
              </div>
            </section>
          </template>

          <template v-else-if="selectedCategoryId === 'extraction-rules'">
            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '字段抽取策略', en: 'Field extraction policy' }) }}</h4>
              <div class="tr-form-grid">
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '规则版本', en: 'Rules version' }) }}</span>
                  <input v-model.trim="extractionConfig.version" class="input-box" />
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '最小置信度（%）', en: 'Minimum confidence (%)' }) }}</span>
                  <input v-model.number="extractionConfig.minConfidencePct" type="number" min="0" max="100" class="input-box" />
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '行动项必填字段', en: 'Action Item required fields' }) }}</span>
                  <input v-model.trim="extractionConfig.requiredFields" class="input-box" />
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '去重窗口（分钟）', en: 'Dedup window (minutes)' }) }}</span>
                  <input v-model.number="extractionConfig.dedupWindowMins" type="number" min="0" class="input-box" />
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '忽略关键词', en: 'Ignored keywords' }) }}</span>
                  <input v-model.trim="extractionConfig.keywordBlocklist" class="input-box" />
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '阻塞关键词', en: 'Blocker keywords' }) }}</span>
                  <input v-model.trim="extractionConfig.blockerKeywords" class="input-box" />
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '连续风险升级阈值（次）', en: 'Risk escalation threshold (times)' }) }}</span>
                  <input v-model.number="extractionConfig.riskEscalationThreshold" type="number" min="1" class="input-box" />
                </label>
              </div>
              <div class="toolbar-row">
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '抽取 Open Questions', en: 'Extract Open Questions' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="extractionConfig.enableOpenQuestions" @click="extractionConfig.enableOpenQuestions = !extractionConfig.enableOpenQuestions">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '重复项自动合并', en: 'Auto merge duplicates' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="extractionConfig.autoMergeDuplicates" @click="extractionConfig.autoMergeDuplicates = !extractionConfig.autoMergeDuplicates">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
              </div>
            </section>
          </template>

          <template v-else-if="selectedCategoryId === 'auto-routing-sync'">
            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '路由规则', en: 'Routing rules' }) }}</h4>
              <div class="tr-route-list">
                <div v-for="(rule, idx) in routingConfig.rules" :key="idx" class="tr-route-row">
                  <label class="visually-hidden" :for="`route-keyword-${idx}`">{{ t({ zh: '关键词', en: 'Keyword' }) }}</label>
                  <input :id="`route-keyword-${idx}`" v-model.trim="rule.keyword" class="input-box" :placeholder="t({ zh: '关键词', en: 'Keyword' })" />
                  <label class="visually-hidden" :for="`route-target-${idx}`">{{ t({ zh: '目标系统', en: 'Target' }) }}</label>
                  <select :id="`route-target-${idx}`" v-model="rule.target" class="select-box">
                    <option value="jira">Jira</option>
                    <option value="email_only">{{ t({ zh: '仅邮件', en: 'Email only' }) }}</option>
                    <option value="ehr">EHR</option>
                    <option value="confluence">Confluence</option>
                  </select>
                  <button class="tr-switch" role="switch" :aria-checked="rule.enabled" @click="rule.enabled = !rule.enabled">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
              </div>
            </section>

            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '同步策略', en: 'Sync policy' }) }}</h4>
              <div class="tr-form-grid">
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '默认目标', en: 'Default target' }) }}</span>
                  <select v-model="routingConfig.defaultTarget" class="select-box">
                    <option value="jira">Jira</option>
                    <option value="email_only">{{ t({ zh: '仅邮件', en: 'Email only' }) }}</option>
                    <option value="ehr">EHR</option>
                  </select>
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '重试次数', en: 'Retry attempts' }) }}</span>
                  <input v-model.number="routingConfig.retryLimit" type="number" min="0" class="input-box" />
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '失败告警通道', en: 'Failure alert channel' }) }}</span>
                  <select v-model="routingConfig.alertChannel" class="select-box">
                    <option value="email">Email</option>
                    <option value="teams">Teams</option>
                    <option value="slack">Slack</option>
                  </select>
                </label>
              </div>
            </section>
          </template>

          <template v-else-if="selectedCategoryId === 'email-template'">
            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '邮件模板', en: 'Email template' }) }}</h4>
              <div class="tr-form-grid">
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '主题模板', en: 'Subject template' }) }}</span>
                  <input v-model.trim="emailConfig.subjectTemplate" class="input-box" />
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '抄送规则', en: 'CC rule' }) }}</span>
                  <input v-model.trim="emailConfig.ccRule" class="input-box" />
                </label>
              </div>
              <label class="tr-field tr-required">
                <span>{{ t({ zh: '正文模板', en: 'Body template' }) }}</span>
                <textarea v-model="emailConfig.bodyTemplate" class="textarea-box" rows="10" />
              </label>
              <div class="toolbar-row">
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '附加行动项表格', en: 'Attach action table' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="emailConfig.attachActionTable" @click="emailConfig.attachActionTable = !emailConfig.attachActionTable">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '附加风险摘要', en: 'Attach risk summary' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="emailConfig.attachRiskSummary" @click="emailConfig.attachRiskSummary = !emailConfig.attachRiskSummary">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
              </div>
            </section>
          </template>

          <template v-else-if="selectedCategoryId === 'approval-sla'">
            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '人工复核与审批', en: 'Human review and approvals' }) }}</h4>
              <div class="tr-form-grid">
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '低置信度复核阈值（%）', en: 'Low-confidence review threshold (%)' }) }}</span>
                  <input v-model.number="approvalConfig.reviewThreshold" type="number" min="0" max="100" class="input-box" />
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '主持人确认 SLA（分钟）', en: 'Host confirmation SLA (minutes)' }) }}</span>
                  <input v-model.number="approvalConfig.confirmSlaMins" type="number" min="10" class="input-box" />
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '超时升级到', en: 'Escalate to' }) }}</span>
                  <input v-model.trim="approvalConfig.escalateToRole" class="input-box" />
                </label>
              </div>
              <div class="toolbar-row">
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '关键规则双人审批', en: 'Dual approval for critical rules' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="approvalConfig.requireDualApproval" @click="approvalConfig.requireDualApproval = !approvalConfig.requireDualApproval">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
              </div>
            </section>
          </template>

          <template v-else-if="selectedCategoryId === 'ai-governance'">
            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '模型与合规', en: 'Model and compliance' }) }}</h4>
              <div class="tr-form-grid">
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '模型路由策略', en: 'Model routing strategy' }) }}</span>
                  <select v-model="aiConfig.modelStrategy" class="select-box">
                    <option value="fast-first">{{ t({ zh: '快速优先', en: 'Fast first' }) }}</option>
                    <option value="quality-first">{{ t({ zh: '质量优先', en: 'Quality first' }) }}</option>
                  </select>
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '提示词版本', en: 'Prompt version' }) }}</span>
                  <input v-model.trim="aiConfig.promptVersion" class="input-box" />
                </label>
              </div>
              <div class="toolbar-row">
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '隐私信息脱敏', en: 'PII masking' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="aiConfig.maskPII" @click="aiConfig.maskPII = !aiConfig.maskPII">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '提示词审计', en: 'Prompt audit' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="aiConfig.enablePromptAudit" @click="aiConfig.enablePromptAudit = !aiConfig.enablePromptAudit">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '允许外部模型', en: 'Allow external model' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="aiConfig.allowExternalLLM" @click="aiConfig.allowExternalLLM = !aiConfig.allowExternalLLM">
                    <span class="tr-switch-knob" />
                  </button>
            </div>
          </div>
            </section>
          </template>

          <template v-else-if="selectedCategoryId === 'skills-registry'">
            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '技能基线策略', en: 'Skill baseline policy' }) }}</h4>
              <div class="tr-form-grid">
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '默认灰度范围', en: 'Default rollout scope' }) }}</span>
                  <select v-model="skillsConfig.defaultRollout" class="select-box">
                    <option value="pilot">{{ t({ zh: '试点项目', en: 'Pilot projects' }) }}</option>
                    <option value="all">{{ t({ zh: '全量项目', en: 'All projects' }) }}</option>
                  </select>
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '失败回退策略', en: 'Failure fallback strategy' }) }}</span>
                  <select v-model="skillsConfig.fallbackStrategy" class="select-box">
                    <option value="module-only">{{ t({ zh: '回退到模块输出', en: 'Fallback to module output' }) }}</option>
                    <option value="manual-review">{{ t({ zh: '强制人工复核', en: 'Force manual review' }) }}</option>
                  </select>
                </label>
              </div>
            </section>

            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '技能列表', en: 'Skills list' }) }}</h4>
              <div class="tr-route-list">
                <div v-for="(skill, idx) in skillsConfig.skills" :key="idx" class="tr-skill-row">
                  <div class="tr-skill-main">
                    <p class="tr-skill-name">{{ skill.name }}</p>
                    <p class="tr-skill-meta">{{ t({ zh: '版本', en: 'Version' }) }} {{ skill.version }}</p>
                  </div>
                  <select v-model="skill.rollout" class="select-box">
                    <option value="pilot">{{ t({ zh: '试点', en: 'Pilot' }) }}</option>
                    <option value="all">{{ t({ zh: '全量', en: 'All' }) }}</option>
                  </select>
                  <button class="tr-switch" role="switch" :aria-checked="skill.enabled" @click="skill.enabled = !skill.enabled">
                    <span class="tr-switch-knob" />
                  </button>
            </div>
          </div>
            </section>
          </template>

          <template v-else>
            <section class="tr-panel">
              <h4 class="tr-section-title">{{ t({ zh: '安全、审计与保留', en: 'Security, audit and retention' }) }}</h4>
              <div class="tr-form-grid">
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '审计日志保留天数', en: 'Audit retention days' }) }}</span>
                  <input v-model.number="systemConfig.auditRetentionDays" type="number" min="7" class="input-box" />
                </label>
                <label class="tr-field tr-required">
                  <span>{{ t({ zh: '会议纪要保留策略', en: 'Minutes retention policy' }) }}</span>
                  <select v-model="systemConfig.minutesRetentionPolicy" class="select-box">
                    <option value="180d">180 days</option>
                    <option value="365d">365 days</option>
                    <option value="forever">{{ t({ zh: '长期保留', en: 'Forever' }) }}</option>
                  </select>
                </label>
                <label class="tr-field">
                  <span>{{ t({ zh: '导出审批人角色', en: 'Export approver role' }) }}</span>
                  <input v-model.trim="systemConfig.exportApproverRole" class="input-box" />
                </label>
              </div>
              <div class="toolbar-row">
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '管理端强制 MFA', en: 'Require MFA for admin' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="systemConfig.requireMFA" @click="systemConfig.requireMFA = !systemConfig.requireMFA">
                    <span class="tr-switch-knob" />
                  </button>
                </div>
                <div class="tr-switch-field">
                  <span>{{ t({ zh: '静态加密', en: 'Encrypt at rest' }) }}</span>
                  <button class="tr-switch" role="switch" :aria-checked="systemConfig.encryptAtRest" @click="systemConfig.encryptAtRest = !systemConfig.encryptAtRest">
                    <span class="tr-switch-knob" />
                  </button>
            </div>
          </div>
            </section>
          </template>
          </fieldset>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { CheckCircle, FileText, LinkSpark, ListTodo, Mail, OrbitNodes, PenLine, Sparkles, Zap } from '../components/fakeLucide'

import { localize, templateModules, templates } from '../services/mockData'
import { useAppStore } from '../stores/app'
import { useUiStore } from '../stores/ui'
import type { LocalizedText } from '../types/app'

type RuleCategoryId =
  | 'meeting-template'
  | 'extraction-rules'
  | 'approval-sla'
  | 'auto-routing-sync'
  | 'email-template'
  | 'skills-registry'
  | 'ai-governance'
  | 'security-audit'

const appStore = useAppStore()
const uiStore = useUiStore()
const t = (text: LocalizedText) => localize(appStore.language, text)

const categories: Array<{ id: RuleCategoryId; title: LocalizedText; desc: LocalizedText; tag: LocalizedText; icon: string }> = [
  { id: 'meeting-template', title: { zh: '会议模板', en: 'Meeting Templates' }, desc: { zh: '会议类型、模块与纪要结构基线', en: 'Meeting type, modules and minutes baseline' }, tag: { zh: '基础', en: 'Core' }, icon: 'ListTodo' },
  { id: 'extraction-rules', title: { zh: '提取规则', en: 'Extraction Rules' }, desc: { zh: '字段抽取、置信度、去重与风险规则', en: 'Fields, confidence, dedup and risk rules' }, tag: { zh: 'AI', en: 'AI' }, icon: 'Zap' },
  { id: 'approval-sla', title: { zh: '复核与审批', en: 'Review & Approval' }, desc: { zh: '人工复核阈值、主持人确认与升级', en: 'Review threshold, host confirm and escalation' }, tag: { zh: '治理', en: 'Govern' }, icon: 'CheckCircle' },
  { id: 'auto-routing-sync', title: { zh: '自动路由同步', en: 'Auto-Routing Sync' }, desc: { zh: '路由建议、目标系统与失败重试', en: 'Routing suggestion, targets and retries' }, tag: { zh: '同步', en: 'Sync' }, icon: 'LinkSpark' },
  { id: 'email-template', title: { zh: '邮件模板', en: 'Email Template' }, desc: { zh: 'Outlook 邮件主题、收件与正文模板', en: 'Outlook subject, recipients and body template' }, tag: { zh: '通知', en: 'Notify' }, icon: 'Mail' },
  { id: 'skills-registry', title: { zh: '技能注册表', en: 'Skills Registry' }, desc: { zh: 'Skill 开关、版本、灰度与回退', en: 'Skill toggle, version, rollout and fallback' }, tag: { zh: '第二阶段', en: 'Phase 2' }, icon: 'OrbitNodes' },
  { id: 'ai-governance', title: { zh: 'AI 治理', en: 'AI Governance' }, desc: { zh: '模型策略、PII 脱敏与 Prompt 审计', en: 'Model strategy, PII masking and prompt audit' }, tag: { zh: 'AI', en: 'AI' }, icon: 'Sparkles' },
  { id: 'security-audit', title: { zh: '安全与审计', en: 'Security & Audit' }, desc: { zh: '保留策略、MFA、导出审批', en: 'Retention, MFA and export controls' }, tag: { zh: '系统', en: 'System' }, icon: 'FileText' },
]
const iconMap: Record<string, unknown> = {
  ListTodo,
  Zap,
  CheckCircle,
  LinkSpark,
  Mail,
  OrbitNodes,
  Sparkles,
  FileText,
  PenLine,
}

const selectedCategoryId = ref<RuleCategoryId>('meeting-template')
const currentCategory = computed(() => categories.find((c) => c.id === selectedCategoryId.value) ?? categories[0])
const readOnlyCategorySet = new Set<RuleCategoryId>(['extraction-rules', 'skills-registry', 'ai-governance', 'security-audit'])
const isReadOnlyCategory = computed(() => readOnlyCategorySet.has(selectedCategoryId.value))
const isReadOnly = (id: RuleCategoryId) => readOnlyCategorySet.has(id)

const buildTemplateModules = (meetingType: string) => {
  const key = meetingType.toLowerCase()
  const modules = templateModules.map((m) => ({ ...m }))
  if (key.includes('technical') || key.includes('review') || key.includes('技术评审')) {
    return modules.map((m) => (m.name === 'Open Questions' ? { ...m, enabled: true } : m))
  }
  if (key.includes('risk') || key.includes('风险')) {
    return modules.map((m) => {
      if (m.name === 'Risks & Blockers') return { ...m, enabled: true }
      if (m.name === 'Open Questions') return { ...m, enabled: true }
      return m
    })
  }
  return modules
}

const meetingTypeOptions = [
  { key: 'weekly', label: { zh: '项目周会', en: 'Project Weekly' } },
  { key: 'review', label: { zh: '技术评审会', en: 'Technical Review' } },
  { key: 'risk', label: { zh: '风险同步会', en: 'Risk Sync' } },
]
const meetingTypeKeyFromTemplate = (meetingTypeEn: string) => {
  if (meetingTypeEn.includes('Weekly')) return 'weekly'
  if (meetingTypeEn.includes('Review')) return 'review'
  return 'risk'
}

const meetingConfig = reactive({
  editingTemplateId: '',
  templateItems: templates.map((tpl, idx) => ({
    id: `tpl-${idx + 1}`,
    meetingTypeKey: meetingTypeKeyFromTemplate(tpl.meetingType.en),
    name: { ...tpl.name },
    version: tpl.version,
    reviewSlaMinutes: 120,
    modules: buildTemplateModules(tpl.meetingType.en),
  })),
})
const editingMeetingTemplate = computed(() =>
  meetingConfig.templateItems.find((item) => item.id === meetingConfig.editingTemplateId) ?? meetingConfig.templateItems[0],
)
const enabledModules = (modules: Array<{ name: string; enabled: boolean }>) =>
  modules.filter((m) => m.enabled).map((m) => m.name)
const defaultSyncLabel = (meetingTypeKey: string) => {
  if (meetingTypeKey === 'review') return 'Confluence & Jira'
  if (meetingTypeKey === 'risk') return 'Workday EHR'
  return 'Jira Epic'
}

function createTemplate() {
  const next = {
    id: `tpl-${Date.now()}`,
    meetingTypeKey: 'weekly',
    name: {
      zh: `${t({ zh: '新建模板', en: 'New Template' })}-${meetingConfig.templateItems.length + 1}`,
      en: `New Template-${meetingConfig.templateItems.length + 1}`,
    },
    version: 'v1.0',
    reviewSlaMinutes: 120,
    modules: buildTemplateModules('weekly'),
  }
  meetingConfig.templateItems.push(next)
  meetingConfig.editingTemplateId = next.id
}

function editTemplate(id: string) {
  meetingConfig.editingTemplateId = id
}
const extractionConfig = reactive({
  version: 'v2.1',
  minConfidencePct: 82,
  requiredFields: 'owner, deadline, routing, source_quote',
  dedupWindowMins: 30,
  keywordBlocklist: '闲聊, TODO?, 稍后再说',
  blockerKeywords: 'blocker, 阻塞, 卡住',
  riskEscalationThreshold: 2,
  enableOpenQuestions: true,
  autoMergeDuplicates: true,
})
const routingConfig = reactive({
  defaultTarget: 'jira',
  retryLimit: 2,
  alertChannel: 'teams',
  rules: [
    { keyword: 'blocker', target: 'jira', enabled: true },
    { keyword: '采购', target: 'email_only', enabled: true },
    { keyword: '绩效', target: 'ehr', enabled: true },
    { keyword: '架构变更', target: 'confluence', enabled: true },
  ],
})
const emailConfig = reactive({
  subjectTemplate: '[{{project}}][{{meetingType}}] {{meetingTitle}}',
  ccRule: '{{host}}, {{projectOwner}}, {{opsDri}}',
  bodyTemplate:
`Hi team,

Summary
{{summary}}

Decisions
{{decisions}}

Action Items
{{actionItems}}

Risks & Blockers
{{risks}}`,
  attachActionTable: true,
  attachRiskSummary: true,
})
const approvalConfig = reactive({
  reviewThreshold: 78,
  confirmSlaMins: 90,
  escalateToRole: 'Project Owner',
  requireDualApproval: true,
})
const aiConfig = reactive({
  modelStrategy: 'quality-first',
  promptVersion: 'prompt-rules-v4',
  maskPII: true,
  enablePromptAudit: true,
  allowExternalLLM: false,
})
const skillsConfig = reactive({
  defaultRollout: 'pilot',
  fallbackStrategy: 'module-only',
  skills: [
    { name: 'Management Summary Skill', version: 'v1.2', enabled: true, rollout: 'pilot' },
    { name: 'Action Focus Skill', version: 'v1.4', enabled: true, rollout: 'all' },
    { name: 'Cross-meeting Follow-up Skill', version: 'v0.9', enabled: false, rollout: 'pilot' },
    { name: 'Blocker Scan Skill', version: 'v1.1', enabled: true, rollout: 'pilot' },
    { name: 'Routing Suggestion Skill', version: 'v0.8', enabled: true, rollout: 'pilot' },
  ],
})
const systemConfig = reactive({
  auditRetentionDays: 365,
  minutesRetentionPolicy: '365d',
  exportApproverRole: 'Compliance Admin',
  requireMFA: true,
  encryptAtRest: true,
})

const snapshots = reactive<Record<RuleCategoryId, string>>({
  'meeting-template': JSON.stringify(meetingConfig),
  'extraction-rules': JSON.stringify(extractionConfig),
  'auto-routing-sync': JSON.stringify(routingConfig),
  'email-template': JSON.stringify(emailConfig),
  'approval-sla': JSON.stringify(approvalConfig),
  'skills-registry': JSON.stringify(skillsConfig),
  'ai-governance': JSON.stringify(aiConfig),
  'security-audit': JSON.stringify(systemConfig),
})

function applySnapshot(target: unknown, snapshot: string) {
  Object.assign(target as Record<string, unknown>, JSON.parse(snapshot))
}

function moduleNameText(name: string) {
  const dict: Record<string, LocalizedText> = {
    Summary: { zh: '摘要', en: 'Summary' },
    Decisions: { zh: '决议事项', en: 'Decisions' },
    'Action Items': { zh: '行动项', en: 'Action Items' },
    'Risks & Blockers': { zh: '风险与阻塞项', en: 'Risks & Blockers' },
    'Open Questions': { zh: '待确认问题', en: 'Open Questions' },
  }
  return dict[name] ? t(dict[name]) : name
}

function resetCurrent() {
  if (isReadOnlyCategory.value) {
    uiStore.pushToast(
      t({ zh: '当前配置为只读', en: 'Current domain is read-only' }),
      t({ zh: '请由管理员在治理流程中发起变更。', en: 'Please request changes via admin governance flow.' }),
      'warning',
    )
    return
  }
  const id = selectedCategoryId.value
  if (id === 'meeting-template') applySnapshot(meetingConfig, snapshots[id])
  else if (id === 'extraction-rules') applySnapshot(extractionConfig, snapshots[id])
  else if (id === 'auto-routing-sync') applySnapshot(routingConfig, snapshots[id])
  else if (id === 'email-template') applySnapshot(emailConfig, snapshots[id])
  else if (id === 'approval-sla') applySnapshot(approvalConfig, snapshots[id])
  else if (id === 'skills-registry') applySnapshot(skillsConfig, snapshots[id])
  else if (id === 'ai-governance') applySnapshot(aiConfig, snapshots[id])
  else applySnapshot(systemConfig, snapshots[id])

  uiStore.pushToast(
    t({ zh: '已恢复上次保存版本', en: 'Reverted to last saved version' }),
    t({ zh: '当前配置域修改已回滚。', en: 'Changes in this domain were discarded.' }),
  )
}

function saveCurrent() {
  if (isReadOnlyCategory.value) {
    uiStore.pushToast(
      t({ zh: '当前配置为只读', en: 'Current domain is read-only' }),
      t({ zh: '请由管理员在治理流程中发起变更。', en: 'Please request changes via admin governance flow.' }),
      'warning',
    )
    return
  }
  const id = selectedCategoryId.value
  if (id === 'meeting-template') snapshots[id] = JSON.stringify(meetingConfig)
  else if (id === 'extraction-rules') snapshots[id] = JSON.stringify(extractionConfig)
  else if (id === 'auto-routing-sync') snapshots[id] = JSON.stringify(routingConfig)
  else if (id === 'email-template') snapshots[id] = JSON.stringify(emailConfig)
  else if (id === 'approval-sla') snapshots[id] = JSON.stringify(approvalConfig)
  else if (id === 'skills-registry') snapshots[id] = JSON.stringify(skillsConfig)
  else if (id === 'ai-governance') snapshots[id] = JSON.stringify(aiConfig)
  else snapshots[id] = JSON.stringify(systemConfig)

  uiStore.pushToast(
    t({ zh: '已保存', en: 'Saved' }),
    t(currentCategory.value.title),
    'success',
  )
}
</script>

<style scoped>
.tr-layout {
  grid-template-columns: 300px minmax(0, 1fr);
  align-items: start;
  gap: 14px;
}

.tr-nav-card {
  position: sticky;
  top: 20px;
  border-radius: var(--ui-radius-md);
  box-shadow: var(--ui-shadow-soft);
}

.tr-nav-head {
  padding-bottom: 10px;
}

.tr-nav-body {
  padding-top: 0;
  gap: 6px;
}

.tr-category-btn {
  width: 100%;
  border: 1px solid transparent;
  background: #ffffff;
  border-radius: var(--ui-radius-sm);
  text-align: left;
  cursor: pointer;
  padding: 11px 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.tr-category-btn:hover {
  border-color: var(--ui-card-border);
  background: #f8fafc;
}

.tr-category-btn--active {
  border-color: #bfdbfe;
  background: #f0f7ff;
}

.tr-category-title {
  margin: 0;
  font-size: var(--ui-font-14);
  font-weight: 600;
  color: #334155;
}

.tr-readonly-tag {
  margin-left: auto;
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid #fcd34d;
  background: #fffbeb;
  color: #92400e;
  font-size: 10.5px;
  font-weight: 600;
  line-height: 1.4;
}

.tr-category-icon {
  flex-shrink: 0;
}

.tr-detail-card .card-header {
  align-items: flex-start;
}

.tr-detail-subtitle {
  margin: 4px 0 0;
  font-size: var(--ui-font-12);
  color: var(--ui-text-secondary);
}

.tr-action-btn {
  height: 32px;
  font-size: 12.5px;
}

.tr-text-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  padding: 0 8px;
  cursor: pointer;
}

.tr-text-btn:hover {
  color: #1f2937;
}

.tr-detail-body {
  gap: 14px;
}

.tr-readonly-banner {
  padding: 9px 11px;
  border-radius: var(--ui-radius-sm);
  border: 1px solid #fde68a;
  background: #fffbeb;
  color: #92400e;
  font-size: var(--ui-font-12);
  line-height: 1.45;
}

.tr-readonly-fieldset {
  margin: 0;
  padding: 0;
  border: none;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tr-readonly-fieldset:disabled {
  opacity: 1;
}

.tr-readonly-fieldset:disabled .input-box,
.tr-readonly-fieldset:disabled .select-box,
.tr-readonly-fieldset:disabled .textarea-box {
  background: #f8fafc;
  color: #64748b;
}

.tr-readonly-fieldset:disabled .tr-switch,
.tr-readonly-fieldset:disabled .tr-icon-btn,
.tr-readonly-fieldset:disabled .tr-create-template-btn {
  cursor: not-allowed;
}

.tr-panel {
  border: 1px solid var(--ui-card-border);
  border-radius: var(--ui-radius-md);
  padding: 16px;
  background: #ffffff;
}

.tr-section-title {
  margin: 0 0 10px;
  font-size: var(--ui-font-16);
  font-weight: 700;
  line-height: 1.25;
  color: var(--ui-text-primary);
}

.tr-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.tr-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--ui-font-12);
  color: var(--ui-text-secondary);
}

.tr-required > span::after {
  content: ' *';
  color: #dc2626;
}

.input-box,
.select-box,
.textarea-box {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: var(--ui-radius-sm);
  padding: 9px 10px;
  font-size: 13px;
  color: var(--ui-text-primary);
  background: #ffffff;
}

.input-box:focus,
.select-box:focus,
.textarea-box:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.22);
}

.textarea-box {
  min-height: 160px;
  line-height: 1.55;
  resize: vertical;
}

.tr-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid var(--ui-card-border-soft);
}

.tr-row:last-child {
  border-bottom: none;
}

.tr-row--compact span {
  font-size: 12.5px;
}

.tr-switch-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  font-size: 12.5px;
  color: #334155;
}

.tr-switch {
  width: 40px;
  height: 22px;
  border: none;
  border-radius: 999px;
  background: #cbd5e1;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.tr-switch[aria-checked="true"] {
  background: #2563eb;
  justify-content: flex-end;
}

.tr-switch:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}

.tr-switch-knob {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.2);
}

.tr-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #64748b;
}

.tr-template-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: end;
}

.tr-template-list {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tr-template-item {
  border: 1px solid var(--ui-card-border);
  border-radius: var(--ui-radius-md);
  background: #ffffff;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.tr-template-item-main {
  min-width: 0;
}

.tr-template-item-name {
  margin: 0;
  font-size: var(--ui-font-16);
  font-weight: 700;
  line-height: 1.2;
  color: var(--ui-text-primary);
}

.tr-template-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 7px;
}

.tr-module-chip {
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid var(--ui-card-border);
  background: #f1f5f9;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-12);
  font-weight: 600;
  line-height: 1.2;
}

.tr-template-item-meta {
  margin: 9px 0 0;
  font-size: var(--ui-font-12);
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--ui-text-secondary);
}

.tr-template-item-meta strong {
  color: #334155;
}

.tr-icon-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background-color 0.18s ease;
}

.tr-icon-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

.tr-create-template-btn {
  margin-top: 14px;
  width: 100%;
  height: 44px;
  border: 1.5px dashed #cbd5e1;
  border-radius: var(--ui-radius-sm);
  background: #fcfdff;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.tr-create-template-btn:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.tr-row-head {
  margin: 12px 0 2px;
  font-size: 12.5px;
  color: var(--ui-text-secondary);
  font-weight: 600;
}

.tr-detail-card {
  border-radius: var(--ui-radius-md);
  box-shadow: var(--ui-shadow-soft);
}

.tr-route-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tr-route-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px 98px;
  gap: 8px;
  align-items: center;
}

.tr-skill-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px 98px;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.tr-skill-row:last-child {
  border-bottom: none;
}

.tr-skill-main {
  min-width: 0;
}

.tr-skill-name {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.tr-skill-meta {
  margin: 3px 0 0;
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 1100px) {
  .tr-layout {
    grid-template-columns: 1fr;
  }

  .tr-nav-card {
    position: static;
  }
}

@media (max-width: 820px) {
  .tr-form-grid,
  .tr-route-row {
    grid-template-columns: 1fr;
  }
  .tr-template-toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
