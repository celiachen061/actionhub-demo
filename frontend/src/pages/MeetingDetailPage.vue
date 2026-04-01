<template>
  <section class="meeting-detail-page">
    <header class="meeting-detail-header">
      <div class="header-left">
        <button class="back-link" type="button" @click="goBack">
          {{ t({ zh: '← 返回', en: '← Back' }) }}
        </button>
        <span class="title-sep">|</span>
        <h1 class="meeting-title">{{ t(meetingHeader.title) }}</h1>
        <span class="status-badge warning header-status">{{ t(headerStatusBadge) }}</span>
      </div>
      <div class="header-right">
        <span class="autosave">{{ t({ zh: '刚刚自动保存', en: 'Auto-saved just now' }) }}</span>
        <button
          class="primary-button small-btn header-confirm-btn"
          type="button"
          :title="
            t({
              zh: '锁定本场纪要草稿，表示主持人审阅通过，可继续推送邮件与 Jira。',
              en: 'Mark this draft as reviewed so you can push email and Jira.',
            })
          "
          @click="confirmResult"
        >
          <CheckCircle :size="14" color="#ffffff" :stroke-width="1.8" style="margin-right:6px;" />
          {{ t({ zh: '确认纪要', en: 'Confirm draft' }) }}
        </button>
      </div>
    </header>

    <div class="meeting-detail-layout">
      <aside class="left-column surface">
        <section class="left-block meeting-info-block">
          <h3 class="block-title">{{ t({ zh: '会议信息', en: 'Meeting Details' }) }}</h3>
          <div class="meeting-fact">
            <Calendar class="meeting-fact-icon" :size="12" color="#64748b" :stroke-width="1.8" />
            <div>
              <div class="fact-main">{{ meetingHeader.time }}</div>
              <div class="fact-sub">{{ t(meetingProvenance.durationLine) }}</div>
            </div>
          </div>
          <div class="meeting-fact meeting-fact--participants">
            <Users class="meeting-fact-icon" :size="12" color="#64748b" :stroke-width="1.8" />
            <div>
              <div class="fact-main">{{ t(participantFact.heading) }}</div>
              <div class="fact-sub">{{ t(participantFact.names) }}</div>
            </div>
          </div>
          <button
            id="meeting-info-details-trigger"
            type="button"
            class="meeting-info-toggle"
            :aria-expanded="meetingInfoDetailsOpen"
            aria-controls="meeting-info-details-panel"
            @click="meetingInfoDetailsOpen = !meetingInfoDetailsOpen"
          >
            <ChevronDown
              class="meeting-info-toggle-chevron"
              :class="{ 'meeting-info-toggle-chevron--open': meetingInfoDetailsOpen }"
              :size="14"
              color="#64748b"
              :stroke-width="2"
            />
            <span>{{ meetingInfoToggleLabel }}</span>
          </button>
          <div
            id="meeting-info-details-panel"
            v-show="meetingInfoDetailsOpen"
            class="meeting-info-details"
            role="region"
            :aria-label="t({ zh: '日历与转写来源详情', en: 'Calendar and transcript source details' })"
          >
            <div class="meeting-fact meeting-fact--provenance">
              <Mail class="meeting-fact-icon" :size="12" color="#64748b" :stroke-width="1.8" />
              <div>
                <div class="fact-main">{{ t(meetingProvenance.outlook.headline) }}</div>
                <div class="fact-sub">{{ t(meetingProvenance.outlook.syncDetail) }}</div>
                <div class="fact-sub">{{ t(meetingProvenance.outlook.graphSyncLine) }}</div>
                <div class="fact-sub fact-sub--mono" :title="t(meetingProvenance.outlook.eventIdFullTitle)">
                  {{ t(meetingProvenance.outlook.eventIdMasked) }}
                </div>
              </div>
            </div>
            <div class="meeting-fact meeting-fact--provenance">
              <Video class="meeting-fact-icon" :size="12" color="#64748b" :stroke-width="1.8" />
              <div>
                <div class="fact-main">{{ t(meetingProvenance.teams.headline) }}</div>
                <div class="fact-sub">{{ t(meetingProvenance.teams.detail) }}</div>
              </div>
            </div>
            <div class="meeting-fact meeting-fact--provenance meeting-fact--last-in-panel">
              <Server class="meeting-fact-icon" :size="12" color="#64748b" :stroke-width="1.8" />
              <div>
                <div class="fact-main">{{ t(meetingProvenance.transcript.headline) }}</div>
                <div class="fact-sub">{{ t(meetingProvenance.transcript.sourcesLine) }}</div>
                <div class="fact-sub">{{ t(meetingProvenance.transcript.readyLine) }}</div>
                <div class="fact-sub">{{ t(meetingProvenance.transcript.mergeLine) }}</div>
              </div>
            </div>
          </div>
        </section>

        <section class="left-block timeline-block">
          <div class="timeline-head">
            <h3 class="block-title">{{ t({ zh: '会议记录', en: 'Meeting Record' }) }}</h3>
            <div class="timeline-tabs" role="tablist" :aria-label="t({ zh: '会议记录视图', en: 'Meeting record view' })">
              <button
                type="button"
                class="timeline-tab"
                :class="{ active: timelineMode === 'key' }"
                role="tab"
                :aria-selected="timelineMode === 'key'"
                @click="timelineMode = 'key'"
              >
                {{ t({ zh: '关键发言', en: 'Key Moments' }) }}
              </button>
              <button
                type="button"
                class="timeline-tab"
                :class="{ active: timelineMode === 'raw' }"
                role="tab"
                :aria-selected="timelineMode === 'raw'"
                @click="timelineMode = 'raw'"
              >
                {{ t({ zh: '原文', en: 'Raw Transcript' }) }}
              </button>
            </div>
          </div>
          <div class="transcript-provenance" role="status">
            <p class="transcript-provenance-text">{{ t(meetingProvenance.transcript.provenanceBlurb) }}</p>
            <div
              class="transcript-source-chips"
              :aria-label="t({ zh: '转写来源标签', en: 'Transcript source tags' })"
            >
              <span class="source-chip source-chip--teams">Teams</span>
              <span class="source-chip source-chip--terminal">{{ t(transcriptChips.secondary) }}</span>
              <span class="source-chip source-chip--primary">{{ t(transcriptChips.primary) }}</span>
            </div>
          </div>
          <div v-if="timelineMode === 'key'" class="timeline-list">
            <div
              v-for="entry in visibleTranscript"
              :key="entry.id"
              class="timeline-row"
              :class="{ focused: activeEvidence === entry.id }"
              @click="activeEvidence = entry.id"
            >
              <span class="timeline-dot" />
              <div class="timeline-main">
                <div class="timeline-meta">
                  <span class="timeline-speaker">{{ entry.speaker }}</span>
                  <span class="timeline-time">{{ entry.time }}</span>
                </div>
                <p>{{ t(entry.keyExcerpt ?? entry.content) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="transcript-raw">
            <div
              v-for="entry in transcriptEntries"
              :key="`raw-${entry.id}`"
              class="transcript-raw-turn"
            >
              <div class="transcript-raw-meta">
                <span class="transcript-raw-speaker">{{ entry.speaker }}</span>
                <span class="transcript-raw-time">{{ entry.time }}</span>
              </div>
              <p class="transcript-raw-text">{{ t(entry.content) }}</p>
            </div>
          </div>
        </section>
      </aside>

      <main class="middle-column">
        <div class="ai-draft-banner ai-sheen">
          <div class="ai-draft-title-row">
            <span class="ai-dot-icon" aria-hidden="true"></span>
            <strong class="ai-draft-title">{{ t({ zh: 'AI 已生成草稿', en: 'AI Draft Generated' }) }}</strong>
          </div>
          <p class="ai-draft-desc">{{ aiDraftDescText }}</p>
        </div>

        <article class="surface center-card">
          <div class="center-card-head">
            <FileText :size="14" color="#334155" :stroke-width="2" />
            <h3>{{ t({ zh: '执行摘要', en: 'Executive Summary' }) }}</h3>
            <span class="center-card-head-spacer" aria-hidden="true" />
            <div
              class="center-card-actions"
              role="toolbar"
              :aria-label="t({ zh: '执行摘要操作', en: 'Executive summary actions' })"
            >
              <button
                type="button"
                class="icon-ghost-btn"
                :title="t({ zh: '编辑', en: 'Edit' })"
                :aria-label="t({ zh: '编辑执行摘要', en: 'Edit executive summary' })"
                @click="openSectionModal('summary')"
              >
                <PenLine :size="14" color="#64748b" :stroke-width="2" />
              </button>
              <button
                type="button"
                class="icon-ghost-btn"
                :title="t({ zh: 'AI 重新生成此区块', en: 'Regenerate this section with AI' })"
                :aria-label="t({ zh: '重新生成执行摘要', en: 'Regenerate executive summary' })"
                @click="regenerateSection('summary')"
              >
                <Sparkles :size="14" color="#6366f1" :stroke-width="2" />
              </button>
            </div>
          </div>
          <p class="summary-body">
            {{ t(executiveSummary) }}
          </p>
        </article>

        <article class="surface center-card">
          <div class="center-card-head">
            <CheckCircle :size="14" color="var(--green-main)" :stroke-width="2" />
            <h3>{{ t({ zh: '关键决议', en: 'Key Decisions' }) }}</h3>
            <span class="center-card-head-spacer" aria-hidden="true" />
            <div
              class="center-card-actions"
              role="toolbar"
              :aria-label="t({ zh: '关键决议操作', en: 'Key decisions actions' })"
            >
              <button
                type="button"
                class="icon-ghost-btn"
                :title="t({ zh: '编辑', en: 'Edit' })"
                :aria-label="t({ zh: '编辑关键决议', en: 'Edit key decisions' })"
                @click="openSectionModal('decisions')"
              >
                <PenLine :size="14" color="#64748b" :stroke-width="2" />
              </button>
              <button
                type="button"
                class="icon-ghost-btn"
                :title="t({ zh: 'AI 重新生成此区块', en: 'Regenerate this section with AI' })"
                :aria-label="t({ zh: '重新生成关键决议', en: 'Regenerate key decisions' })"
                @click="regenerateSection('decisions')"
              >
                <Sparkles :size="14" color="#6366f1" :stroke-width="2" />
              </button>
            </div>
          </div>
          <ul class="decision-list">
            <li v-for="item in keyDecisions" :key="item.id">
              <span class="decision-mark" aria-hidden="true">
                <CheckCircle :size="12" color="#4f46e5" :stroke-width="2" />
              </span>
              <span class="decision-text">{{ t(item.text) }}</span>
              <span
                :class="['confidence-pill', 'confidence-pill--corner', confidenceToneClass(item.confidencePct)]"
                tabindex="0"
                :title="t(item.confidenceReason)"
                :aria-label="t(item.confidenceReason)"
              >
                {{ item.confidencePct }}%
              </span>
            </li>
          </ul>
        </article>

        <article class="surface center-card action-card">
          <div class="center-card-head">
            <ListTodo :size="14" color="#d97706" :stroke-width="2" />
            <h3>{{ t({ zh: '行动项', en: 'Action Items' }) }}</h3>
            <span class="center-card-head-spacer" aria-hidden="true" />
            <div
              class="center-card-actions"
              role="toolbar"
              :aria-label="t({ zh: '行动项操作', en: 'Action items actions' })"
            >
              <button
                type="button"
                class="icon-ghost-btn"
                :title="t({ zh: '编辑', en: 'Edit' })"
                :aria-label="t({ zh: '编辑行动项', en: 'Edit action items' })"
                @click="openSectionModal('actions')"
              >
                <PenLine :size="14" color="#64748b" :stroke-width="2" />
              </button>
              <button
                type="button"
                class="icon-ghost-btn"
                :title="t({ zh: 'AI 重新生成此区块', en: 'Regenerate this section with AI' })"
                :aria-label="t({ zh: '重新生成行动项', en: 'Regenerate action items' })"
                @click="regenerateSection('actions')"
              >
                <Sparkles :size="14" color="#6366f1" :stroke-width="2" />
              </button>
            </div>
          </div>
          <div class="action-list">
            <div
              v-for="item in actionItems"
              :key="item.id"
              class="action-item-row"
              :class="{ blocker: item.blocker, 'has-blocker-tag': item.blocker }"
            >
              <div class="action-pill-row">
                <span class="status-badge default">{{ item.owner }}</span>
                <span class="status-badge default">{{ t({ zh: '截止', en: 'Due' }) }}: {{ item.deadline }}</span>
              </div>
              <span v-if="item.blocker" class="blocker-corner-tag">{{ t({ zh: '阻塞', en: 'BLOCKER' }) }}</span>
              <p class="action-title">{{ t(item.title) }}</p>
              <blockquote>{{ t(item.quote) }}</blockquote>
              <button class="evidence-btn" type="button" @click="focusEvidence(item.evidenceId)">
                {{ t({ zh: '定位到原文证据', en: 'Locate source evidence' }) }}
              </button>
            </div>
          </div>
        </article>

        <article class="surface center-card risk-card">
          <div class="center-card-head">
            <AlertTriangle :size="14" color="#dc2626" :stroke-width="2" />
            <h3>{{ t({ zh: '未关闭风险', en: 'Open Risks' }) }}</h3>
            <span class="center-card-head-spacer" aria-hidden="true" />
            <div
              class="center-card-actions"
              role="toolbar"
              :aria-label="t({ zh: '风险操作', en: 'Open risks actions' })"
            >
              <button
                type="button"
                class="icon-ghost-btn"
                :title="t({ zh: '编辑', en: 'Edit' })"
                :aria-label="t({ zh: '编辑未关闭风险', en: 'Edit open risks' })"
                @click="openSectionModal('risks')"
              >
                <PenLine :size="14" color="#64748b" :stroke-width="2" />
              </button>
              <button
                type="button"
                class="icon-ghost-btn"
                :title="t({ zh: 'AI 重新生成此区块', en: 'Regenerate this section with AI' })"
                :aria-label="t({ zh: '重新生成风险', en: 'Regenerate open risks' })"
                @click="regenerateSection('risks')"
              >
                <Sparkles :size="14" color="#6366f1" :stroke-width="2" />
              </button>
            </div>
          </div>
          <ul class="risk-list">
            <li v-for="risk in openRisks" :key="risk.id" class="risk-row">
              <p class="risk-body">{{ t(risk.text) }}</p>
              <span
                :class="['confidence-pill', 'confidence-pill--risk', 'confidence-pill--corner', confidenceToneClass(risk.confidencePct)]"
                tabindex="0"
                :title="t(risk.confidenceReason)"
                :aria-label="t(risk.confidenceReason)"
              >
                {{ risk.confidencePct }}%
              </span>
            </li>
          </ul>
        </article>
      </main>

      <aside class="right-column">
        <section class="right-panel-head">
          <div class="right-panel-head-row">
            <div class="right-panel-head-text">
              <h3>{{ t({ zh: '分发与同步', en: 'Distribution & Sync' }) }}</h3>
              <p>{{ t({ zh: '审阅动作去向。', en: 'Review where actions will route.' }) }}</p>
            </div>
          </div>
          <p class="ai-sync-caption">
            {{ t({ zh: '以下邮件与 Jira 草稿均由 AI 从本场会议生成，推送前请核对或弹窗修改。', en: 'Email and Jira drafts below are AI-generated from this meeting—review or edit in the dialog before push.' }) }}
          </p>
        </section>

        <div class="right-scroll">
          <article class="surface right-card right-card--ai">
            <div class="right-card-top outlook-top">
              <span class="right-card-top-title">
                <Sparkles :size="12" color="#6366f1" :stroke-width="2" class="right-card-top-icon" />
                {{ t({ zh: '会议纪要邮件', en: 'Meeting Minutes Email' }) }}
              </span>
              <span class="status-badge warning">{{ t({ zh: '主持人待确认', en: 'Host review required' }) }}</span>
            </div>
            <div class="right-card-body outlook-card-body">
              <div class="confirm-tip">
                {{ t({ zh: '说明：点击「查看 / 修改」在弹窗中编辑；「推送 Outlook」将发送邮件并视为主持人最终确认。', en: 'Use View / Edit to change content in a dialog. Push to Outlook sends and counts as host confirmation.' }) }}
              </div>
              <div class="outlook-meta" role="group" :aria-label="t({ zh: '邮件头信息', en: 'Email headers' })">
                <div class="outlook-meta-row">
                  <span class="outlook-meta-label">{{ t({ zh: '收件人', en: 'To' }) }}:</span>
                  <span class="outlook-meta-value">{{ t(outlookDraft.to) }}</span>
                </div>
                <div class="outlook-meta-row">
                  <span class="outlook-meta-label">{{ t({ zh: '抄送', en: 'Cc' }) }}:</span>
                  <span class="outlook-meta-value">{{ t(outlookDraft.cc) }}</span>
                </div>
                <div class="outlook-meta-row">
                  <span class="outlook-meta-label">{{ t({ zh: '主题', en: 'Sub' }) }}:</span>
                  <span class="outlook-meta-value outlook-subject">{{ t(outlookDraft.subject) }}</span>
                </div>
              </div>
              <div class="outlook-body-preview">
                <pre class="outlook-body-text">{{ t(outlookBodyFull) }}</pre>
              </div>
              <div class="review-actions">
                <button class="ghost-button small-btn" type="button" @click="openEmailModal">
                  {{ t({ zh: '查看 / 修改', en: 'View / Edit' }) }}
                </button>
                <button class="primary-button small-btn" type="button" @click="pushEmail">
                  {{ t({ zh: '推送 Outlook', en: 'Push to Outlook' }) }}
                </button>
              </div>
            </div>
          </article>

          <article class="surface right-card right-card--ai">
            <div class="right-card-top jira-top">
              <span class="right-card-top-title">
                <Sparkles :size="12" color="#6366f1" :stroke-width="2" class="right-card-top-icon" />
                {{ t({ zh: 'Jira 目标', en: 'Jira Target' }) }}
              </span>
              <span class="jira-epic">{{ t({ zh: '2 个事项', en: '2 Epics' }) }}</span>
            </div>
            <div class="right-card-body compact">
              <div class="confirm-tip">
                {{ t({ zh: '说明：点击「查看 / 修改」在弹窗中核对负责人与截止日；「推送 Jira」将写入 Jira 并视为主持人最终确认。', en: 'Use View / Edit to adjust assignee and due dates. Push to Jira writes issues and counts as host confirmation.' }) }}
              </div>
              <div v-for="item in actionItems" :key="`jira-${item.id}`" class="jira-row">
                <div class="jira-issue-icon" aria-hidden="true">
                  <FolderKanban :size="13" color="#4f46e5" :stroke-width="1.8" />
                </div>
                <div class="jira-row-main">
                  <p class="jira-title">{{ t(item.jira.summary) }}</p>
                  <p class="jira-meta">
                    {{ item.jira.projectKey }} · {{ item.jira.issueType }} · {{ t({ zh: '负责人', en: 'Assignee' }) }}: {{ item.owner }} · {{ t({ zh: '截止', en: 'Due' }) }}: {{ item.deadline }}
                  </p>
                  <p v-if="item.jira.labels" class="jira-labels">{{ t({ zh: '标签', en: 'Labels' }) }}: {{ item.jira.labels }}</p>
                  <p class="jira-desc-preview">{{ t(item.jira.description) }}</p>
                </div>
              </div>
              <div class="review-actions">
                <button class="ghost-button small-btn" type="button" @click="openJiraModal">
                  {{ t({ zh: '查看 / 修改', en: 'View / Edit' }) }}
                </button>
                <button class="primary-button small-btn" type="button" @click="pushJira">
                  {{ t({ zh: '推送 Jira', en: 'Push to Jira' }) }}
                </button>
              </div>
            </div>
          </article>

          <article class="surface right-card memory-card right-card--ai">
            <div class="right-card-top memory-top">
              <span class="right-card-top-title">
                <Sparkles :size="12" color="#6366f1" :stroke-width="2" class="right-card-top-icon" />
                {{ t({ zh: '跨会议记忆', en: 'Cross-Meeting Memory' }) }}
              </span>
            </div>
            <div class="right-card-body">
              <p>{{ t({ zh: 'AI 在历史会议中发现相关上下文，可能影响本次决策：', en: 'AI found context from previous meetings that may impact today\'s decision:' }) }}</p>
              <div class="memory-quote">
                <strong>{{ t(crossMeetingMemory.title) }}</strong>
                <p>{{ t(crossMeetingMemory.quote) }}</p>
              </div>
            </div>
          </article>
        </div>
      </aside>
    </div>

    <!-- 会议纪要邮件 · 弹窗编辑 -->
    <Teleport to="body">
      <div v-if="showEmailModal" class="modal-root">
        <div class="modal-backdrop" aria-hidden="true" @click.self="cancelEmailModal" />
        <div
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="t({ zh: '编辑会议纪要邮件', en: 'Edit meeting minutes email' })"
        >
          <header class="modal-header">
            <h2 class="modal-title">{{ t({ zh: '编辑会议纪要邮件', en: 'Edit meeting minutes email' }) }}</h2>
            <button type="button" class="modal-close" :aria-label="t({ zh: '关闭', en: 'Close' })" @click="cancelEmailModal">×</button>
          </header>
          <p class="modal-desc">
            {{
              t({
                zh: '仅编辑当前界面语言；确定时另一语言由模型自动转译（演示为占位）。推送请在卡片上点击「推送 Outlook」（即最终确认）。',
                en: 'Edit the current UI language; the other language is auto-translated on OK (demo placeholder). Use Push on the card to send (final confirmation).',
              })
            }}
          </p>
          <div class="modal-body">
            <div class="modal-field">
              <label class="modal-label">{{ t({ zh: '收件人', en: 'To' }) }}</label>
              <input v-model="emailForm.to[appStore.language]" class="modal-input" type="text" />
            </div>
            <div class="modal-field">
              <label class="modal-label">{{ t({ zh: '抄送', en: 'Cc' }) }}</label>
              <input v-model="emailForm.cc[appStore.language]" class="modal-input" type="text" />
            </div>
            <div class="modal-field">
              <label class="modal-label">{{ t({ zh: '主题', en: 'Sub' }) }}</label>
              <input v-model="emailForm.subject[appStore.language]" class="modal-input" type="text" />
            </div>
            <div class="modal-field">
              <label class="modal-label">{{ t({ zh: '正文', en: 'Body' }) }}</label>
              <textarea
                v-model="emailForm.body[appStore.language]"
                class="modal-textarea modal-textarea-body"
                rows="12"
              />
            </div>
          </div>
          <footer class="modal-footer">
            <button type="button" class="ghost-button modal-btn" @click="cancelEmailModal">
              {{ t({ zh: '取消', en: 'Cancel' }) }}
            </button>
            <button
              type="button"
              class="primary-button modal-btn"
              :disabled="emailModalSaving"
              @click="applyEmailModal"
            >
              {{ emailModalSaving ? t({ zh: '保存中…', en: 'Saving…' }) : t({ zh: '确定', en: 'OK' }) }}
            </button>
          </footer>
        </div>
      </div>
    </Teleport>

    <!-- Jira Target · 弹窗编辑 -->
    <Teleport to="body">
      <div v-if="showJiraModal" class="modal-root">
        <div class="modal-backdrop" aria-hidden="true" @click.self="cancelJiraModal" />
        <div
          class="modal-panel modal-panel--jira"
          role="dialog"
          aria-modal="true"
          :aria-label="t({ zh: '编辑 Jira 推送内容', en: 'Edit Jira push payload' })"
        >
          <header class="modal-header">
            <h2 class="modal-title">{{ t({ zh: '编辑 Jira 推送内容', en: 'Edit Jira push payload' }) }}</h2>
            <button type="button" class="modal-close" :aria-label="t({ zh: '关闭', en: 'Close' })" @click="cancelJiraModal">×</button>
          </header>
          <p class="modal-desc">
            {{
              t({
                zh: '仅编辑当前界面语言下的摘要与描述；确定时另一语言自动转译（演示为占位）。推送请在卡片上点击「推送 Jira」（即最终确认）。',
                en: 'Edit summary and description in the current UI language; the other language is auto-translated on OK (demo). Push on the card is final confirmation.',
              })
            }}
          </p>
          <p class="modal-jira-hint modal-jira-hint--top">
            {{ t({ zh: '说明：正式调用 Jira Cloud 时需将负责人解析为 assignee.accountId；描述需转为 Atlassian Document Format（ADF）。', en: 'Note: production calls resolve assignee to accountId; description uses Atlassian Document Format (ADF) on Jira Cloud.' }) }}
          </p>
          <div class="modal-body">
            <div v-for="row in jiraModalRows" :key="row.id" class="modal-jira-block">
              <div class="modal-field-row">
                <div class="modal-field">
                  <label class="modal-label">{{ t({ zh: '项目 Key', en: 'Project key' }) }}</label>
                  <input v-model="row.projectKey" class="modal-input" type="text" />
                </div>
                <div class="modal-field">
                  <label class="modal-label">{{ t({ zh: '类型', en: 'Issue type' }) }}</label>
                  <input v-model="row.issueType" class="modal-input" type="text" />
                </div>
              </div>
              <div class="modal-field">
                <label class="modal-label">{{ t({ zh: '摘要 Summary', en: 'Summary' }) }}</label>
                <input v-model="row.summary[appStore.language]" class="modal-input" type="text" />
              </div>
              <div class="modal-field">
                <label class="modal-label">{{ t({ zh: '描述 Description', en: 'Description' }) }}</label>
                <textarea
                  v-model="row.description[appStore.language]"
                  class="modal-textarea modal-textarea-jira-desc"
                  rows="5"
                />
              </div>
              <div class="modal-field">
                <label class="modal-label">{{ t({ zh: '标签 Labels', en: 'Labels' }) }}</label>
                <input
                  v-model="row.labels"
                  class="modal-input"
                  type="text"
                  :placeholder="t({ zh: '逗号分隔，如：mp-risk,capacity', en: 'Comma-separated, e.g. mp-risk,capacity' })"
                />
              </div>
              <div class="modal-field-row">
                <div class="modal-field">
                  <label class="modal-label">{{ t({ zh: '负责人（显示名）', en: 'Assignee (display)' }) }}</label>
                  <input v-model="row.owner" class="modal-input" type="text" />
                </div>
                <div class="modal-field">
                  <label class="modal-label">{{ t({ zh: '截止日期 Due', en: 'Due date' }) }}</label>
                  <input
                    v-model="row.deadline"
                    class="modal-input"
                    type="text"
                    :placeholder="t({ zh: 'YYYY-MM-DD', en: 'YYYY-MM-DD' })"
                  />
                </div>
              </div>
            </div>
          </div>
          <footer class="modal-footer">
            <button type="button" class="ghost-button modal-btn" @click="cancelJiraModal">
              {{ t({ zh: '取消', en: 'Cancel' }) }}
            </button>
            <button
              type="button"
              class="primary-button modal-btn"
              :disabled="jiraModalSaving"
              @click="applyJiraModal"
            >
              {{ jiraModalSaving ? t({ zh: '保存中…', en: 'Saving…' }) : t({ zh: '确定', en: 'OK' }) }}
            </button>
          </footer>
        </div>
      </div>
    </Teleport>

    <!-- 中间栏区块：主持人编辑 / 单区块 AI 重新生成 -->
    <Teleport to="body">
      <div v-if="sectionModalKind" class="modal-root">
        <div class="modal-backdrop" aria-hidden="true" @click.self="closeSectionModal" />
        <div
          class="modal-panel"
          :class="{ 'modal-panel--wide': sectionModalKind === 'actions' }"
          role="dialog"
          aria-modal="true"
          :aria-label="sectionModalAriaLabel"
        >
          <header class="modal-header">
            <h2 class="modal-title">{{ sectionModalTitle }}</h2>
            <button
              type="button"
              class="modal-close"
              :aria-label="t({ zh: '关闭', en: 'Close' })"
              @click="closeSectionModal"
            >
              ×
            </button>
          </header>
          <p class="modal-desc">{{ sectionModalHint }}</p>
          <div class="modal-body modal-body--section">
            <template v-if="sectionModalKind === 'summary'">
              <div class="modal-field">
                <label class="modal-label" for="section-summary-current">{{ sectionEditFieldLabel }}</label>
                <textarea
                  id="section-summary-current"
                  v-model="summaryDraft[appStore.language]"
                  class="modal-textarea"
                  rows="8"
                />
              </div>
            </template>
            <template v-else-if="sectionModalKind === 'decisions'">
              <div class="modal-field">
                <label class="modal-label" for="section-decisions-current">{{ sectionDecisionsRisksLabel }}</label>
                <textarea
                  id="section-decisions-current"
                  v-model="decisionsDraft[appStore.language]"
                  class="modal-textarea"
                  rows="8"
                />
              </div>
            </template>
            <template v-else-if="sectionModalKind === 'risks'">
              <div class="modal-field">
                <label class="modal-label" for="section-risks-current">{{ sectionRisksLabel }}</label>
                <textarea
                  id="section-risks-current"
                  v-model="risksDraft[appStore.language]"
                  class="modal-textarea"
                  rows="8"
                />
              </div>
            </template>
            <template v-else-if="sectionModalKind === 'actions'">
              <div v-for="(row, idx) in actionEditRows" :key="row.id" class="section-action-block">
                <p class="section-action-block-title">
                  {{ t({ zh: `行动项 ${idx + 1}`, en: `Action ${idx + 1}` }) }}
                  <span v-if="row.blocker" class="section-action-block-badge">{{ t({ zh: '阻塞', en: 'BLOCKER' }) }}</span>
                </p>
                <div class="modal-field-row">
                  <div class="modal-field">
                    <label class="modal-label" :for="`act-owner-${row.id}`">{{ t({ zh: '负责人', en: 'Owner' }) }}</label>
                    <input :id="`act-owner-${row.id}`" v-model="row.owner" class="modal-input" type="text" />
                  </div>
                  <div class="modal-field">
                    <label class="modal-label" :for="`act-due-${row.id}`">{{ t({ zh: '截止', en: 'Due' }) }}</label>
                    <input :id="`act-due-${row.id}`" v-model="row.deadline" class="modal-input" type="text" />
                  </div>
                </div>
                <div class="modal-field">
                  <label class="modal-label" :for="`act-title-${row.id}`">{{ t({ zh: '标题', en: 'Title' }) }}</label>
                  <input
                    :id="`act-title-${row.id}`"
                    v-model="row.title[appStore.language]"
                    class="modal-input"
                    type="text"
                  />
                </div>
                <div class="modal-field">
                  <label class="modal-label" :for="`act-quote-${row.id}`">{{ t({ zh: '引用原文', en: 'Quote' }) }}</label>
                  <textarea
                    :id="`act-quote-${row.id}`"
                    v-model="row.quote[appStore.language]"
                    class="modal-textarea"
                    rows="3"
                  />
                </div>
              </div>
            </template>
          </div>
          <footer class="modal-footer">
            <button type="button" class="ghost-button modal-btn" @click="closeSectionModal">
              {{ t({ zh: '取消', en: 'Cancel' }) }}
            </button>
            <button
              type="button"
              class="primary-button modal-btn"
              :disabled="sectionModalSaving"
              @click="applySectionModal"
            >
              {{ sectionModalSaving ? t({ zh: '保存中…', en: 'Saving…' }) : t({ zh: '保存', en: 'Save' }) }}
            </button>
          </footer>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronDown,
  FileText,
  FolderKanban,
  ListTodo,
  Mail,
  PenLine,
  Server,
  Sparkles,
  Users,
  Video,
} from '../components/fakeLucide'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  cloneSnapshotArrays,
  getMeetingDetailSnapshot,
  patchLocalizedTree,
} from '../services/meetingDetailPresets'
import { localize } from '../services/mockData'
import { translatePeerLanguage } from '../services/peerTranslate'
import { useAppStore } from '../stores/app'
import { useUiStore } from '../stores/ui'
import type { LocalizedText } from '../types/app'

const appStore = useAppStore()
const uiStore = useUiStore()
const router = useRouter()
const t = (text: LocalizedText) => localize(appStore.language, text)

const activeEvidence = ref('')
const meetingInfoDetailsOpen = ref(false)
const meetingInfoToggleLabel = computed(() =>
  meetingInfoDetailsOpen.value
    ? t({ zh: '收起来源与同步详情', en: 'Hide source & sync details' })
    : t({ zh: '展开来源与同步详情', en: 'Show source & sync details' }),
)
const timelineMode = ref<'key' | 'raw'>('key')
const showEmailModal = ref(false)
const showJiraModal = ref(false)
const emailModalSaving = ref(false)
const jiraModalSaving = ref(false)

type JiraModalRow = {
  id: string
  projectKey: string
  issueType: string
  summary: LocalizedText
  description: LocalizedText
  labels: string
  owner: string
  deadline: string
}
const jiraModalRows = ref<JiraModalRow[]>([])

const route = useRoute()

const meetingHeader = reactive({
  title: { zh: '', en: '' },
  time: '',
})
const headerStatusBadge = reactive<LocalizedText>({ zh: '', en: '' })
const participantFact = reactive({
  heading: { zh: '', en: '' } as LocalizedText,
  names: { zh: '', en: '' } as LocalizedText,
})
const meetingProvenance = reactive(
  JSON.parse(JSON.stringify(getMeetingDetailSnapshot('risk-sync').meetingProvenance)),
)
const transcriptChips = reactive({
  secondary: { zh: '', en: '' } as LocalizedText,
  primary: { zh: '', en: '' } as LocalizedText,
})
const crossMeetingMemory = reactive({
  title: { zh: '', en: '' } as LocalizedText,
  quote: { zh: '', en: '' } as LocalizedText,
})
const aiDraftConfidencePct = ref(91)

const outlookDraft = reactive({
  to: { zh: '', en: '' } as LocalizedText,
  cc: { zh: '', en: '' } as LocalizedText,
  subject: { zh: '', en: '' } as LocalizedText,
})

const outlookBodyFull = reactive<LocalizedText>({ zh: '', en: '' })

const emailForm = reactive({
  to: { zh: '', en: '' } as LocalizedText,
  cc: { zh: '', en: '' } as LocalizedText,
  subject: { zh: '', en: '' } as LocalizedText,
  body: { zh: '', en: '' } as LocalizedText,
})

const executiveSummary = reactive<LocalizedText>({ zh: '', en: '' })

type TranscriptEntry = {
  id: string
  speaker: string
  time: string
  key: boolean
  content: LocalizedText
  keyExcerpt?: LocalizedText
}

const transcriptEntries = reactive<TranscriptEntry[]>([])

const visibleTranscript = computed(() =>
  timelineMode.value === 'key' ? transcriptEntries.filter((entry) => entry.key) : transcriptEntries,
)

type DecisionRow = {
  id: string
  text: LocalizedText
  confidencePct: number
  confidenceReason: LocalizedText
}

const keyDecisions = reactive<DecisionRow[]>([])

type MeetingActionItem = {
  id: string
  owner: string
  deadline: string
  blocker: boolean
  evidenceId: string
  confidencePct: number
  confidenceReason: LocalizedText
  title: LocalizedText
  quote: LocalizedText
  jira: {
    projectKey: string
    issueType: string
    summary: LocalizedText
    description: LocalizedText
    labels: string
  }
}

const actionItems = reactive<MeetingActionItem[]>([])

type RiskRow = {
  id: string
  text: LocalizedText
  confidencePct: number
  confidenceReason: LocalizedText
}

const openRisks = reactive<RiskRow[]>([])

function hydrateMeetingDetail(meetingId: string) {
  const snap = getMeetingDetailSnapshot(meetingId)
  meetingHeader.title.zh = snap.meetingHeader.title.zh
  meetingHeader.title.en = snap.meetingHeader.title.en
  meetingHeader.time = snap.meetingHeader.time
  headerStatusBadge.zh = snap.headerStatusBadge.zh
  headerStatusBadge.en = snap.headerStatusBadge.en
  participantFact.heading.zh = snap.participantFact.heading.zh
  participantFact.heading.en = snap.participantFact.heading.en
  participantFact.names.zh = snap.participantFact.names.zh
  participantFact.names.en = snap.participantFact.names.en
  patchLocalizedTree(
    meetingProvenance as unknown as Record<string, unknown>,
    snap.meetingProvenance as unknown as Record<string, unknown>,
  )
  transcriptChips.secondary.zh = snap.transcriptChips.secondary.zh
  transcriptChips.secondary.en = snap.transcriptChips.secondary.en
  transcriptChips.primary.zh = snap.transcriptChips.primary.zh
  transcriptChips.primary.en = snap.transcriptChips.primary.en
  outlookDraft.to.zh = snap.outlookDraft.to.zh
  outlookDraft.to.en = snap.outlookDraft.to.en
  outlookDraft.cc.zh = snap.outlookDraft.cc.zh
  outlookDraft.cc.en = snap.outlookDraft.cc.en
  outlookDraft.subject.zh = snap.outlookDraft.subject.zh
  outlookDraft.subject.en = snap.outlookDraft.subject.en
  outlookBodyFull.zh = snap.outlookBodyFull.zh
  outlookBodyFull.en = snap.outlookBodyFull.en
  executiveSummary.zh = snap.executiveSummary.zh
  executiveSummary.en = snap.executiveSummary.en
  aiDraftConfidencePct.value = snap.aiDraftConfidencePct
  crossMeetingMemory.title.zh = snap.crossMeetingMemory.title.zh
  crossMeetingMemory.title.en = snap.crossMeetingMemory.title.en
  crossMeetingMemory.quote.zh = snap.crossMeetingMemory.quote.zh
  crossMeetingMemory.quote.en = snap.crossMeetingMemory.quote.en
  const arrays = cloneSnapshotArrays(snap)
  transcriptEntries.splice(0, transcriptEntries.length, ...arrays.transcriptEntries)
  keyDecisions.splice(0, keyDecisions.length, ...(arrays.keyDecisions as DecisionRow[]))
  actionItems.splice(0, actionItems.length, ...(arrays.actionItems as MeetingActionItem[]))
  openRisks.splice(0, openRisks.length, ...arrays.openRisks)
}

hydrateMeetingDetail(String(route.params.id ?? 'risk-sync'))

watch(
  () => route.params.id,
  (id) => {
    hydrateMeetingDetail(String(id ?? 'risk-sync'))
    activeEvidence.value = ''
    meetingInfoDetailsOpen.value = false
  },
)

const aiDraftDescText = computed(() => {
  const pct = aiDraftConfidencePct.value
  return appStore.language === 'zh'
    ? `请先审阅下方摘要与行动项。左侧会议记录已合并多路转写，可编辑任意区块或定位原文证据。置信度分数：${pct}%。`
    : `Review summary and action items below. The meeting record merges transcript sources; you can edit any block or locate evidence. Confidence score: ${pct}%.`
})

type SectionModalKind = 'summary' | 'decisions' | 'actions' | 'risks'
const sectionModalKind = ref<SectionModalKind | null>(null)
const sectionModalSaving = ref(false)
const summaryDraft = reactive({ zh: '', en: '' })
const decisionsDraft = reactive({ zh: '', en: '' })
const risksDraft = reactive({ zh: '', en: '' })
const actionEditRows = ref<MeetingActionItem[]>([])

const sectionModalTitle = computed(() => {
  if (sectionModalKind.value === 'summary')
    return t({ zh: '编辑执行摘要', en: 'Edit executive summary' })
  if (sectionModalKind.value === 'decisions')
    return t({ zh: '编辑关键决议', en: 'Edit key decisions' })
  if (sectionModalKind.value === 'actions')
    return t({ zh: '编辑行动项', en: 'Edit action items' })
  if (sectionModalKind.value === 'risks')
    return t({ zh: '编辑未关闭风险', en: 'Edit open risks' })
  return ''
})

const sectionModalHint = computed(() =>
  t({
    zh: '只需编辑当前界面语言；保存时会自动转译并写入另一种语言（演示为占位译文）。中间栏保存后不会自动刷新右侧邮件与 Jira 卡片，请按需核对。',
    en: 'Edit the current UI language only; the other language is auto-filled on save (demo placeholder). Outlook/Jira cards are not auto-synced—review if needed.',
  }),
)

const sectionEditFieldLabel = computed(() =>
  t({ zh: '摘要正文', en: 'Summary text' }),
)
const sectionDecisionsRisksLabel = computed(() =>
  t({ zh: '每行一条决议', en: 'One decision per line' }),
)
const sectionRisksLabel = computed(() =>
  t({ zh: '每行一条风险', en: 'One risk per line' }),
)

const sectionModalAriaLabel = computed(() => sectionModalTitle.value)

function splitNonEmptyLines(s: string): string[] {
  return s.split('\n').map((x) => x.trim()).filter(Boolean)
}

const openSectionModal = (kind: SectionModalKind) => {
  sectionModalKind.value = kind
  if (kind === 'summary') {
    summaryDraft.zh = executiveSummary.zh
    summaryDraft.en = executiveSummary.en
  }
  else if (kind === 'decisions') {
    decisionsDraft.zh = keyDecisions.map((d) => d.text.zh).join('\n')
    decisionsDraft.en = keyDecisions.map((d) => d.text.en).join('\n')
  }
  else if (kind === 'risks') {
    risksDraft.zh = openRisks.map((r) => r.text.zh).join('\n')
    risksDraft.en = openRisks.map((r) => r.text.en).join('\n')
  }
  else if (kind === 'actions') {
    actionEditRows.value = JSON.parse(JSON.stringify(actionItems)) as MeetingActionItem[]
  }
}

const closeSectionModal = () => {
  sectionModalKind.value = null
}

const applySectionModal = async () => {
  const kind = sectionModalKind.value
  if (!kind)
    return

  const lang = appStore.language
  const peer = lang === 'zh' ? 'en' : 'zh'

  if (kind === 'decisions') {
    const lines = splitNonEmptyLines(decisionsDraft[lang])
    if (lines.length === 0) {
      uiStore.pushToast(
        t({ zh: '请至少填写一条决议', en: 'Add at least one decision line' }),
        '',
        'default',
      )
      return
    }
  }
  if (kind === 'risks') {
    const lines = splitNonEmptyLines(risksDraft[lang])
    if (lines.length === 0) {
      uiStore.pushToast(
        t({ zh: '请至少填写一条风险', en: 'Add at least one risk line' }),
        '',
        'default',
      )
      return
    }
  }

  sectionModalSaving.value = true
  try {
    if (kind === 'summary') {
      const cur = summaryDraft[lang]
      executiveSummary[lang] = cur
      executiveSummary[peer] = cur.trim()
        ? await translatePeerLanguage(cur, lang, peer)
        : ''
    }
    else if (kind === 'decisions') {
      const lines = splitNonEmptyLines(decisionsDraft[lang])
      const next: DecisionRow[] = []
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const zh = lang === 'zh' ? line : await translatePeerLanguage(line, lang, 'zh')
        const en = lang === 'en' ? line : await translatePeerLanguage(line, lang, 'en')
        const prev = keyDecisions[i]
        next.push({
          id: prev?.id ?? `kd-${i + 1}`,
          text: { zh, en },
          confidencePct: prev?.confidencePct ?? 88,
          confidenceReason: prev?.confidenceReason
            ? { ...prev.confidenceReason }
            : { zh: '主持人已编辑。', en: 'Edited by host.' },
        })
      }
      keyDecisions.splice(0, keyDecisions.length, ...next)
    }
    else if (kind === 'risks') {
      const lines = splitNonEmptyLines(risksDraft[lang])
      const next: RiskRow[] = []
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const zh = lang === 'zh' ? line : await translatePeerLanguage(line, lang, 'zh')
        const en = lang === 'en' ? line : await translatePeerLanguage(line, lang, 'en')
        const prev = openRisks[i]
        next.push({
          id: prev?.id ?? `risk-${i + 1}`,
          text: { zh, en },
          confidencePct: prev?.confidencePct ?? 72,
          confidenceReason: prev?.confidenceReason
            ? { ...prev.confidenceReason }
            : { zh: '主持人已编辑。', en: 'Edited by host.' },
        })
      }
      openRisks.splice(0, openRisks.length, ...next)
    }
    else if (kind === 'actions') {
      for (const row of actionEditRows.value) {
        const item = actionItems.find((x) => x.id === row.id)
        if (!item)
          continue
        item.owner = row.owner
        item.deadline = row.deadline
        const titleCur = row.title[lang]
        item.title[lang] = titleCur
        item.title[peer] = titleCur.trim()
          ? await translatePeerLanguage(titleCur, lang, peer)
          : ''
        const quoteCur = row.quote[lang]
        item.quote[lang] = quoteCur
        item.quote[peer] = quoteCur.trim()
          ? await translatePeerLanguage(quoteCur, lang, peer)
          : ''
        Object.assign(item.jira.summary, item.title)
      }
    }

    closeSectionModal()
    uiStore.pushToast(t({ zh: '已保存', en: 'Saved' }), '', 'success')
  }
  finally {
    sectionModalSaving.value = false
  }
}

const regenerateSection = (kind: SectionModalKind) => {
  uiStore.pushToast(
    t({ zh: '已请求 AI 重新生成该区块', en: 'AI regeneration requested for this section' }),
    t({ zh: '演示：内容已恢复为当前会议的初始草稿。', en: 'Demo: content reset to this meeting’s initial draft.' }),
    'success',
  )
  const snap = getMeetingDetailSnapshot(String(route.params.id ?? 'risk-sync'))
  const arr = cloneSnapshotArrays(snap)
  if (kind === 'summary') {
    executiveSummary.zh = snap.executiveSummary.zh
    executiveSummary.en = snap.executiveSummary.en
  }
  else if (kind === 'decisions') {
    keyDecisions.splice(0, keyDecisions.length, ...(arr.keyDecisions as DecisionRow[]))
  }
  else if (kind === 'risks') {
    openRisks.splice(0, openRisks.length, ...arr.openRisks)
  }
  else if (kind === 'actions') {
    actionItems.splice(0, actionItems.length, ...(arr.actionItems as MeetingActionItem[]))
  }
}

const openEmailModal = () => {
  Object.assign(emailForm.to, outlookDraft.to)
  Object.assign(emailForm.cc, outlookDraft.cc)
  Object.assign(emailForm.subject, outlookDraft.subject)
  Object.assign(emailForm.body, outlookBodyFull)
  showEmailModal.value = true
}

const applyEmailModal = async () => {
  const lang = appStore.language
  const peer = lang === 'zh' ? 'en' : 'zh'
  emailModalSaving.value = true
  try {
    const fields = ['to', 'cc', 'subject', 'body'] as const
    for (const f of fields) {
      const cur = emailForm[f][lang]
      emailForm[f][lang] = cur
      emailForm[f][peer] = cur.trim()
        ? await translatePeerLanguage(cur, lang, peer)
        : ''
    }
    Object.assign(outlookDraft.to, emailForm.to)
    Object.assign(outlookDraft.cc, emailForm.cc)
    Object.assign(outlookDraft.subject, emailForm.subject)
    Object.assign(outlookBodyFull, emailForm.body)
    showEmailModal.value = false
    uiStore.pushToast(t({ zh: '邮件内容已保存', en: 'Email draft saved' }), '', 'success')
  }
  finally {
    emailModalSaving.value = false
  }
}

const cancelEmailModal = () => {
  showEmailModal.value = false
}

const openJiraModal = () => {
  jiraModalRows.value = actionItems.map(i => ({
    id: i.id,
    projectKey: i.jira.projectKey,
    issueType: i.jira.issueType,
    summary: { ...i.jira.summary },
    description: { ...i.jira.description },
    labels: i.jira.labels,
    owner: i.owner,
    deadline: i.deadline,
  }))
  showJiraModal.value = true
}

const applyJiraModal = async () => {
  const lang = appStore.language
  const peer = lang === 'zh' ? 'en' : 'zh'
  jiraModalSaving.value = true
  try {
    for (const row of jiraModalRows.value) {
      const s = row.summary[lang]
      row.summary[lang] = s
      row.summary[peer] = s.trim()
        ? await translatePeerLanguage(s, lang, peer)
        : ''
      const d = row.description[lang]
      row.description[lang] = d
      row.description[peer] = d.trim()
        ? await translatePeerLanguage(d, lang, peer)
        : ''
    }
    jiraModalRows.value.forEach((row) => {
      const item = actionItems.find(x => x.id === row.id)
      if (item) {
        item.owner = row.owner
        item.deadline = row.deadline
        item.jira.projectKey = row.projectKey
        item.jira.issueType = row.issueType
        item.jira.labels = row.labels
        Object.assign(item.jira.summary, row.summary)
        Object.assign(item.jira.description, row.description)
      }
    })
    showJiraModal.value = false
    uiStore.pushToast(t({ zh: 'Jira 推送内容已保存', en: 'Jira push payload saved' }), '', 'success')
  }
  finally {
    jiraModalSaving.value = false
  }
}

const cancelJiraModal = () => {
  showJiraModal.value = false
}

const confidenceToneClass = (pct: number) => {
  if (pct >= 90) return 'confidence-pill--high'
  if (pct >= 80) return 'confidence-pill--medium'
  return 'confidence-pill--low'
}

const focusEvidence = (id: string) => {
  activeEvidence.value = id
  uiStore.pushToast(
    t({ zh: '已定位原文', en: 'Source located' }),
    t({ zh: '左侧会议记录已高亮对应片段。', en: 'Matched segment is highlighted in meeting record.' }),
    'success',
  )
}

const goBack = () => {
  router.push({ name: 'meetings' })
}

const confirmResult = () => {
  uiStore.pushToast(
    t({ zh: '会议结果已确认', en: 'Meeting output confirmed' }),
    t({ zh: '可继续发送 Outlook 草稿并同步 Jira。', en: 'Now ready to send Outlook draft and sync Jira.' }),
    'success',
  )
}

const pushEmail = () => {
  uiStore.pushToast(
    t({ zh: '会议纪要邮件已推送', en: 'Meeting minutes email pushed' }),
    t({ zh: '已发送并完成主持人确认（演示）。', en: 'Sent and host confirmation recorded (demo).' }),
    'success',
  )
}

const pushJira = () => {
  uiStore.pushToast(
    t({ zh: 'Jira 任务已推送', en: 'Jira items pushed' }),
    t({ zh: '已写入并完成主持人确认（演示）。', en: 'Written and host confirmation recorded (demo).' }),
    'success',
  )
}
</script>

<style scoped>
.meeting-detail-page {
  height: 100%;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  overflow: hidden;
}

.meeting-detail-header {
  height: 64px;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.back-link {
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.title-sep {
  color: #cbd5e1;
}

.meeting-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  min-width: 0;
}

.header-confirm-btn {
  flex-shrink: 0;
}

.header-status {
  font-size: 11px;
}

.autosave {
  color: #94a3b8;
  font-size: 12px;
  margin-right: 6px;
}

.meeting-detail-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr) 330px;
  gap: 0;
  overflow: hidden;
}

.left-column {
  min-height: 0;
  border-right: 1px solid #e2e8f0;
  border-radius: 0;
  overflow: auto;
}

.left-block {
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.meeting-info-block {
  border-bottom: none;
  padding-bottom: 12px;
}

.meeting-fact--participants {
  margin-bottom: 8px;
}

.meeting-info-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin: 0 0 0;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.meeting-info-toggle:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}

.meeting-info-toggle:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.meeting-info-toggle-chevron {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .meeting-info-toggle-chevron {
    transition: none;
  }
}

.meeting-info-toggle-chevron--open {
  transform: rotate(180deg);
}

.meeting-info-details {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.meeting-info-details .meeting-fact--last-in-panel {
  margin-bottom: 0;
}

.timeline-block {
  padding-bottom: 20px;
}

.timeline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.block-title {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.timeline-tabs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px;
  border-radius: 8px;
  background: #f1f5f9;
}

.timeline-tab {
  height: 24px;
  padding: 0 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.16s ease;
}

.timeline-tab.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1);
}

.meeting-fact {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 10px;
}

.meeting-fact-icon {
  flex-shrink: 0;
  align-self: center;
}

.meeting-fact:last-child {
  margin-bottom: 0;
}

.meeting-fact--provenance {
  align-items: flex-start;
}

.meeting-fact--provenance .meeting-fact-icon {
  margin-top: 2px;
}

.meeting-fact--provenance .fact-sub + .fact-sub {
  margin-top: 3px;
}

.fact-sub--mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.02em;
  color: #94a3b8;
  word-break: break-all;
}

.transcript-provenance {
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.transcript-provenance-text {
  margin: 0 0 8px;
  font-size: 10px;
  line-height: 1.45;
  color: #64748b;
}

.transcript-source-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.source-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.source-chip--teams {
  color: #4338ca;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
}

.source-chip--terminal {
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
}

.source-chip--primary {
  color: #0f766e;
  background: #ecfdf5;
  border: 1px solid #99f6e4;
}

.fact-main {
  font-size: 12px;
  color: #0f172a;
  font-weight: 600;
  line-height: 1.2;
}

.fact-sub {
  margin-top: 1px;
  color: #64748b;
  font-size: 10px;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  max-height: 460px;
  overflow: auto;
  padding-right: 4px;
}

.transcript-raw {
  max-height: 460px;
  overflow: auto;
  padding: 2px 6px 4px 0;
}

.transcript-raw-turn {
  margin-bottom: 18px;
}

.transcript-raw-turn:last-child {
  margin-bottom: 0;
}

.transcript-raw-meta {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-bottom: 6px;
}

.transcript-raw-speaker {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.01em;
}

.transcript-raw-time {
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #94a3b8;
}

.transcript-raw-text {
  margin: 0;
  font-size: 13px;
  color: #334155;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

.timeline-row {
  position: relative;
  display: flex;
  gap: 10px;
  padding: 10px 12px 10px 10px;
  margin-bottom: 8px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.timeline-row:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05);
}

.timeline-row::before {
  display: none;
}

.timeline-row:last-child::before {
  display: none;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #cbd5e1;
  margin-top: 6px;
  box-shadow: 0 0 0 2px #ffffff;
  z-index: 1;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.timeline-main {
  min-width: 0;
}

.timeline-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-speaker {
  font-size: 12.5px;
  font-weight: 600;
  color: #0f172a;
}

.timeline-time {
  color: #64748b;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.timeline-main p {
  margin: 5px 0 0;
  color: #475569;
  font-size: 12px;
  line-height: 1.5;
}

.timeline-row.focused {
  background: #eff6ff;
  border-color: #93c5fd;
  box-shadow:
    inset 3px 0 0 #3b82f6,
    0 6px 14px rgba(59, 130, 246, 0.12);
}

.timeline-row.focused .timeline-dot {
  background: #3b82f6;
  transform: scale(1.15);
}

.middle-column {
  min-height: 0;
  padding: 0 16px 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-right: 1px solid #e2e8f0;
}

.ai-draft-banner {
  margin: 0 -16px 0;
  border: none;
  border-radius: 0;
  background: var(--ai-notice-surface);
  box-shadow: var(--ai-notice-inner), 0 8px 24px rgba(79, 70, 229, 0.12);
  padding: 12px 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-height: 76px;
  overflow: visible;
}

.ai-draft-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
}

.ai-draft-title {
  color: #312e81;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
}

.ai-draft-desc {
  margin: 0;
  padding-left: 20px;
  color: var(--ai-notice-text);
  font-size: 12px;
  line-height: 1.5;
  white-space: normal;
  overflow: visible;
}

.center-card {
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.center-card-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.center-card-head h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.center-card-head-spacer {
  flex: 1;
  min-width: 4px;
}

.center-card-actions {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

/* 有鼠标悬停能力时：编辑 / 重新生成仅在该卡片悬停或键盘焦点在卡片内时显示（不用 visibility:hidden，避免 Tab 无法聚焦按钮） */
@media (hover: hover) and (pointer: fine) {
  .center-card .center-card-actions {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  .center-card:hover .center-card-actions,
  .center-card:focus-within .center-card-actions {
    opacity: 1;
    pointer-events: auto;
  }
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: reduce) {
  .center-card .center-card-actions {
    transition: none;
  }
}

.icon-ghost-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.icon-ghost-btn:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #334155;
}

.icon-ghost-btn:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 1px;
}

.summary-body {
  margin: 0;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.55;
}

.decision-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.decision-list li {
  display: flex;
  align-items: flex-start;
  position: relative;
  gap: 10px;
  padding: 11px 70px 11px 12px;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  background: linear-gradient(135deg, #f8fbff 0%, #f5f3ff 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.decision-mark {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 1px;
  background: rgba(79, 70, 229, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.2);
}

.decision-text {
  flex: 1;
  min-width: 0;
  color: #334155;
  font-size: 13px;
  line-height: 1.55;
}

.confidence-pill {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #4338ca;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  cursor: default;
}

.confidence-pill--risk {
  color: #b45309;
  background: #fffbeb;
  border-color: #fcd34d;
}

.confidence-pill:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 1px;
}

.action-card .center-card-head {
  margin-bottom: 8px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-item-row {
  position: relative;
  padding: 12px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.action-item-row:hover {
  border-color: #93c5fd;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
}

.action-item-row.blocker {
  border-color: #f4dd9d;
  background: linear-gradient(180deg, #fffefb 0%, #fffcf3 100%);
  box-shadow: inset 0 0 0 1px rgba(234, 179, 8, 0.05);
}

.action-pill-row {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  padding-right: 12px;
}

.action-item-row.has-blocker-tag .action-pill-row {
  padding-right: 94px;
}

.action-title {
  margin: 8px 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

blockquote {
  margin: 0;
  margin-top: 2px;
  padding-left: 10px;
  border-left: 2px solid #e2e8f0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.55;
}

.evidence-btn {
  margin-top: 8px;
  border: none;
  background: transparent;
  color: #2563eb;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.blocker-corner-tag {
  position: absolute;
  top: -1px;
  right: 18px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid #f4dd9d;
  border-top: none;
  border-radius: 0 0 10px 10px;
  background: #fff5d6;
  color: #a16207;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.confidence-pill--action {
  color: #1e40af;
  background: #dbeafe;
  border-color: #93c5fd;
}

.confidence-pill.confidence-pill--high {
  color: var(--green-main);
  background: var(--green-soft);
  border-color: var(--green-soft-border);
}

.confidence-pill.confidence-pill--medium {
  color: #1e40af;
  background: #dbeafe;
  border-color: #93c5fd;
}

.confidence-pill.confidence-pill--low {
  color: #9a3412;
  background: #ffedd5;
  border-color: #fdba74;
}

.risk-card {
  border-color: #e2e8f0;
  background: #ffffff;
}

.risk-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risk-row {
  display: flex;
  position: relative;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 72px 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  border-left: 3px solid #fca5a5;
  background: #fafafa;
}

.risk-body {
  margin: 0;
  flex: 1;
  min-width: 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.55;
}

.confidence-pill--corner {
  position: absolute;
  top: 10px;
  right: 10px;
}

.right-column {
  min-height: 0;
  padding: 14px 12px 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
}

.right-scroll {
  flex: 1;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.right-panel-head {
  padding: 2px 2px 8px;
}

.right-panel-head-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.right-panel-head-text {
  min-width: 0;
}

.right-panel-head h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #475569;
}

.right-panel-head p {
  margin: 2px 0 0;
  color: #94a3b8;
  font-size: 12px;
}

.ai-sync-caption {
  margin: 10px 0 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f3ff 100%);
  border: 1px solid #e9d5ff;
  font-size: 11px;
  color: #5b21b6;
  line-height: 1.45;
}

.right-card-top-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.right-card-top-icon {
  flex-shrink: 0;
}

.right-card--ai {
  border-color: #e0e7ff;
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.06);
}

.right-card {
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
}

.right-card-top {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: #334155;
  font-size: 12.5px;
  font-weight: 700;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.outlook-top,
.jira-top {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.memory-top {
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}

.jira-epic {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #475569;
}

.right-card-body {
  padding: 12px;
  background: #ffffff;
}

.right-card-body.compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.right-card-body p {
  margin: 0 0 6px;
  color: #475569;
  font-size: 12.5px;
  line-height: 1.4;
}

.outlook-meta {
  display: flex;
  flex-direction: column;
}

.outlook-meta-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.outlook-meta-row:last-child {
  border-bottom: none;
}

.outlook-meta-label {
  flex: 0 0 32px;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.outlook-meta-value {
  flex: 1;
  min-width: 0;
  font-size: 12.5px;
  color: #0f172a;
  line-height: 1.45;
}

.outlook-subject {
  font-weight: 700;
}

.outlook-body-preview {
  position: relative;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  max-height: 5.2em;
  overflow: hidden;
}

.outlook-body-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #64748b;
  font: inherit;
}

.outlook-body-preview::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.35em;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
  pointer-events: none;
}

.confirm-tip {
  margin-bottom: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 11.5px;
}

.review-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.small-btn {
  height: 30px;
  font-size: 12px;
  padding: 0 10px;
}

.small-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Dialogs (Teleport → body, scoped attrs still apply) */
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.48);
}

.modal-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  max-height: min(88vh, 700px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.14);
}

.modal-panel--jira {
  max-width: 560px;
}

.modal-panel--wide {
  max-width: 560px;
}

.modal-body--section {
  max-height: min(70vh, 520px);
  overflow-y: auto;
}

.section-action-block {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.section-action-block:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-action-block-title {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-action-block-badge {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #a16207;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  padding: 1px 6px;
  border-radius: 4px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.modal-close {
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
  border-radius: 6px;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #475569;
}

.modal-desc {
  margin: 0;
  padding: 10px 20px 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

.modal-body {
  padding: 14px 20px 18px;
  overflow-y: auto;
}

.modal-field {
  margin-bottom: 12px;
}

.modal-field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.modal-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.modal-input {
  width: 100%;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 13px;
  color: #0f172a;
  background: #f8fafc;
}

.modal-input:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.modal-textarea {
  width: 100%;
  margin-bottom: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12.5px;
  line-height: 1.5;
  color: #334155;
  background: #f8fafc;
  resize: vertical;
}

.modal-textarea:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.modal-textarea-body {
  min-height: 200px;
  margin-bottom: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.55;
}

.modal-textarea-jira-desc {
  min-height: 100px;
  margin-bottom: 0;
}

.modal-jira-hint {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.45;
}

.modal-jira-hint--top {
  margin: 0 20px 0;
  padding: 0 0 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px 18px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
  border-radius: 0 0 14px 14px;
}

.modal-btn {
  min-width: 88px;
}

.modal-jira-block {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 10px;
  background: #fafbfc;
}

.modal-jira-block:last-child {
  margin-bottom: 0;
}

.jira-row-main {
  min-width: 0;
}

.jira-labels {
  margin: 4px 0 0;
  font-size: 11.5px;
  color: #64748b;
}

.jira-desc-preview {
  margin: 6px 0 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.jira-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.jira-row:hover {
  border-color: #bfdbfe;
  background: #f8fbff;
}

.jira-issue-icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-top: 2px;
  border-radius: 8px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border: 1px solid #c7d2fe;
}

.jira-title {
  margin: 0;
  font-size: 13px;
  color: #0f172a;
  font-weight: 600;
}

.jira-meta {
  margin: 2px 0 0;
  color: #64748b;
  font-size: 12px;
}

.memory-card .right-card-body p {
  margin-bottom: 8px;
}

.memory-quote {
  padding: 10px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.memory-quote strong {
  font-size: 12px;
  color: #1e3a8a;
}

.memory-quote p {
  margin: 6px 0 0;
  color: #1e40af;
}

@media (max-width: 1400px) {
  .meeting-detail-layout {
    grid-template-columns: 300px minmax(0, 1fr) 300px;
  }

  .meeting-title {
    font-size: 19px;
  }

  .fact-main { font-size: 12px; }
}

@media (max-width: 1100px) {
  .meeting-detail-layout {
    grid-template-columns: 1fr;
  }

  .left-column,
  .middle-column {
    border-right: none;
  }
}
</style>
