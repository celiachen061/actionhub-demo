import type { Language } from '../types/app'

/** 演示占位：另一语言由大模型转译；接入后端时替换为真实翻译/LLM 调用 */
export async function translatePeerLanguage(
  text: string,
  from: Language,
  to: Language,
): Promise<string> {
  const s = text.trim()
  if (!s)
    return ''
  if (from === to)
    return s
  await new Promise((r) => setTimeout(r, 80))
  if (from === 'zh' && to === 'en')
    return `[Auto-translated] ${s}`
  return `[自动译] ${s}`
}
