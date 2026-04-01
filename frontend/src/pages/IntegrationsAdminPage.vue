<template>
  <section class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">{{ t({ zh: '集成与管理', en: 'Integrations & Admin' }) }}</h1>
        <p class="page-subtitle">{{ t({ zh: '查看集成状态、终端在线情况和最近同步日志。', en: 'Monitor integrations, room terminals, and recent sync logs.' }) }}</p>
      </div>
    </header>

    <!-- Active Integrations -->
    <section class="integrations-admin-block">
      <h2 class="integrations-admin-heading">{{ t({ zh: '已启用集成', en: 'Active Integrations' }) }}</h2>
      <div class="integration-grid">
        <div
          v-for="card in integrationCards"
          :key="card.id"
          class="integration-card"
        >
          <div class="integration-card-top">
            <div class="integration-icon-tile" :style="{ background: card.color }">
              <span class="integration-icon-letter">{{ card.icon }}</span>
            </div>
            <span class="integration-badge" :class="integrationBadgeClass(card)">
              {{ integrationBadgeLabel(card) }}
            </span>
          </div>
          <div class="integration-card-body">
            <p class="integration-name">{{ card.name }}</p>
            <p class="integration-desc">{{ t(card.description) }}</p>
          </div>
          <div v-if="card.status.en !== 'Disconnected'" class="integration-card-actions">
            <button type="button" class="integration-btn integration-btn--grow" @click="toastAction(`${card.name} Settings`)">
              {{ t({ zh: '设置', en: 'Settings' }) }}
            </button>
            <button type="button" class="integration-btn integration-btn--fixed" @click="toastAction(`${card.name} Logs`)">
              {{ t({ zh: '日志', en: 'Logs' }) }}
            </button>
          </div>
          <div v-else class="integration-card-actions integration-card-actions--single">
            <button type="button" class="integration-btn integration-btn--grow" @click="toastAction(`${card.name} Connect`)">
              {{ t({ zh: '连接', en: 'Connect' }) }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Meeting Room Terminals -->
    <section class="integrations-admin-block">
      <h2 class="integrations-admin-heading">{{ t({ zh: '会议室终端', en: 'Meeting Room Terminals' }) }}</h2>
      <div class="terminal-grid">
        <div v-for="terminal in meetingRoomTerminals" :key="terminal.id" class="terminal-card">
          <div class="terminal-card-top">
            <div class="terminal-icon-shell">
              <Server :size="24" :color="terminal.status === 'online' ? '#10B981' : '#EF4444'" :stroke-width="2" />
            </div>
            <div class="terminal-status-pill" :class="terminal.status">
              <span class="terminal-status-pill-dot" aria-hidden="true" />
              <span class="terminal-status-pill-text">{{ terminalStatusLabel(terminal) }}</span>
            </div>
          </div>

          <div class="terminal-card-info">
            <p class="terminal-name">{{ t(terminal.name) }}</p>
            <p class="terminal-desc">{{ t(terminal.description) }}</p>
          </div>

          <div class="terminal-meta-list">
            <div class="terminal-meta-row">
              <span class="terminal-meta-label">{{ t({ zh: 'IP 地址', en: 'IP Address' }) }}</span>
              <span class="terminal-meta-value">{{ terminal.ip }}</span>
            </div>
            <div class="terminal-meta-row">
              <span class="terminal-meta-label">{{ t({ zh: '固件版本', en: 'Firmware' }) }}</span>
              <span class="terminal-meta-value">{{ terminal.firmware }}</span>
            </div>
            <div class="terminal-meta-row">
              <span class="terminal-meta-label">{{ t({ zh: '最近心跳', en: 'Last Ping' }) }}</span>
              <span class="terminal-meta-value">{{ t(terminal.lastPing) }}</span>
            </div>
          </div>

          <div class="terminal-card-actions">
            <button
              v-if="terminal.status === 'online'"
              type="button"
              class="terminal-action-full"
              @click="toastAction(`${t(terminal.name)} Restart`)"
            >
              <Power :size="14" color="#F8FAFC" :stroke-width="2" />
              {{ t({ zh: '重启设备', en: 'Restart Device' }) }}
            </button>
            <button
              v-else
              type="button"
              class="terminal-action-full"
              @click="toastAction(`${t(terminal.name)} Wake Up`)"
            >
              <Zap :size="14" color="#F8FAFC" :stroke-width="2" />
              {{ t({ zh: '唤醒设备', en: 'Wake Up Device' }) }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Sync Logs -->
    <article class="surface section-card">
      <div class="card-header">
        <h3 class="card-title">{{ t({ zh: '最近同步日志', en: 'Recent Sync Logs' }) }}</h3>
      </div>
      <div class="card-body" style="padding-bottom:8px;">
        <div v-for="log in syncLogs" :key="t(log.title)" class="sync-log-item">
          <div class="sync-dot" :class="log.type"></div>
          <span class="sync-log-title">{{ t(log.title) }}</span>
          <span class="sync-log-time">{{ t(log.detail) }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { Power, Server, Zap } from '../components/fakeLucide'
import { integrationCards, localize, meetingRoomTerminals, syncLogs } from '../services/mockData'
import { useAppStore } from '../stores/app'
import { useUiStore } from '../stores/ui'
import type { LocalizedText } from '../types/app'

const appStore = useAppStore()
const uiStore = useUiStore()
const t = (text: LocalizedText) => localize(appStore.language, text)

type IntegrationCard = (typeof integrationCards)[number]

const integrationBadgeClass = (card: IntegrationCard) => {
  if (card.status.en === 'Connected') return 'integration-badge--connected'
  if (card.status.en === 'Starting') return 'integration-badge--warning'
  return 'integration-badge--disconnected'
}

const integrationBadgeLabel = (card: IntegrationCard) => {
  const zh =
    card.status.en === 'Connected' ? '已连接' : card.status.en === 'Starting' ? '启动中' : '未连接'
  const en =
    card.status.en === 'Connected' ? 'CONNECTED' : card.status.en === 'Starting' ? 'WARNING' : 'DISCONNECTED'
  return appStore.language === 'zh' ? zh : en
}

type TerminalRow = (typeof meetingRoomTerminals)[number]

const terminalStatusLabel = (terminal: TerminalRow) => {
  if (appStore.language === 'zh') {
    return terminal.status === 'online' ? '在线' : '离线'
  }
  return terminal.status === 'online' ? 'ONLINE' : 'OFFLINE'
}

const toastAction = (name: string) => {
  uiStore.pushToast(
    t({ zh: '操作已触发', en: 'Action triggered' }),
    appStore.language === 'zh'
      ? `${name} 已记录为 demo 交互。`
      : `${name} was recorded as a demo interaction.`,
    'success',
  )
}
</script>
