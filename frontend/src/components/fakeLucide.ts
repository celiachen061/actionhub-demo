import { defineComponent, h } from 'vue'

type IconProps = {
  size?: number | string
  color?: string
  strokeWidth?: number | string
}

type NodeDef = [string, Record<string, string>]

function createIcon(name: string, nodes: NodeDef[]) {
  return defineComponent({
    name,
    props: {
      size: { type: [Number, String], default: 16 },
      color: { type: String, default: 'currentColor' },
      strokeWidth: { type: [Number, String], default: 2 },
    },
    setup(props: IconProps) {
      return () =>
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: props.size ?? 16,
            height: props.size ?? 16,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: props.color ?? 'currentColor',
            'stroke-width': props.strokeWidth ?? 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'aria-hidden': 'true',
            style: {
              display: 'inline-block',
              verticalAlign: 'middle',
              flexShrink: '0',
            },
          },
          nodes.map(([tag, attrs]) => h(tag, attrs)),
        )
    },
  })
}

export const AlertTriangle = createIcon('AlertTriangle', [
  ['path', { d: 'm10.29 3.86-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.71-3.14l-8-14a2 2 0 0 0-3.42 0Z' }],
  ['path', { d: 'M12 9v4' }],
  ['path', { d: 'M12 17h.01' }],
])
export const AlignLeft = createIcon('AlignLeft', [
  ['path', { d: 'M15 12H3' }],
  ['path', { d: 'M17 18H3' }],
  ['path', { d: 'M21 6H3' }],
])
export const Bell = createIcon('Bell', [
  ['path', { d: 'M10.27 21a2 2 0 0 0 3.46 0' }],
  ['path', { d: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9' }],
])
export const Calendar = createIcon('Calendar', [
  ['path', { d: 'M8 2v4' }],
  ['path', { d: 'M16 2v4' }],
  ['rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }],
  ['path', { d: 'M3 10h18' }],
])
export const ChartColumn = createIcon('ChartColumn', [
  ['path', { d: 'M3 3v18h18' }],
  ['path', { d: 'M7 16v-4' }],
  ['path', { d: 'M12 16V8' }],
  ['path', { d: 'M17 16v-7' }],
])
export const CheckCircle = createIcon('CheckCircle', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'm9 12 2 2 4-4' }],
])
export const ChevronDown = createIcon('ChevronDown', [['path', { d: 'm6 9 6 6 6-6' }]])
export const ChevronRight = createIcon('ChevronRight', [['path', { d: 'M9 18L15 12L9 6' }]])
export const FileText = createIcon('FileText', [
  ['path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }],
  ['path', { d: 'M14 2v6h6' }],
  ['path', { d: 'M16 13H8' }],
  ['path', { d: 'M16 17H8' }],
  ['path', { d: 'M10 9H8' }],
])
export const FolderKanban = createIcon('FolderKanban', [
  [
    'path',
    {
      d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
    },
  ],
  ['path', { d: 'M8 10v4' }],
  ['path', { d: 'M12 10v2' }],
  ['path', { d: 'M16 10v6' }],
])

export const FileClock = createIcon('FileClock', [
  ['path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }],
  ['path', { d: 'M14 2v6h6' }],
  ['circle', { cx: '10', cy: '16', r: '3.5' }],
  ['path', { d: 'M10 14.8v1.5l1 1' }],
])
export const Globe = createIcon('Globe', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'M2 12h20' }],
  ['path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z' }],
])
export const History = createIcon('History', [
  ['path', { d: 'M3 3v5h5' }],
  ['path', { d: 'M3.05 13A9 9 0 1 0 6 5.3L3 8' }],
  ['path', { d: 'M12 7v5l4 2' }],
])
export const Inbox = createIcon('Inbox', [
  ['path', { d: 'M22 12h-4l-3 4H9l-3-4H2' }],
  ['path', { d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z' }],
])
export const LayoutDashboard = createIcon('LayoutDashboard', [
  ['rect', { x: '3', y: '3', width: '7', height: '7', rx: '1' }],
  ['rect', { x: '14', y: '3', width: '7', height: '5', rx: '1' }],
  ['rect', { x: '14', y: '12', width: '7', height: '9', rx: '1' }],
  ['rect', { x: '3', y: '14', width: '7', height: '7', rx: '1' }],
])
export const Lightbulb = createIcon('Lightbulb', [
  ['path', { d: 'M15 14c.62-.52 1.14-1.2 1.51-1.98A6 6 0 1 0 7.5 12c.37.78.89 1.46 1.5 1.98' }],
  ['path', { d: 'M9 18h6' }],
  ['path', { d: 'M10 22h4' }],
])
export const Link = createIcon('Link', [
  ['path', { d: 'M10 13a5 5 0 0 0 7.54.54l1.92-1.92a5 5 0 0 0-7.07-7.07L10.3 6.64' }],
  ['path', { d: 'M14 11a5 5 0 0 0-7.54-.54L4.54 12.38a5 5 0 0 0 7.07 7.07l2.09-2.09' }],
])
export const LinkIcon = Link
export const ExternalLink = createIcon('ExternalLink', [
  ['path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }],
  ['path', { d: 'M15 3h6v6' }],
  ['path', { d: 'm10 14 11-11' }],
])
export const LinkSpark = createIcon('LinkSpark', [
  ['path', { d: 'M8.5 13.5a4 4 0 0 0 6.04.42l1.44-1.44a4 4 0 0 0-5.66-5.66L8.9 8.24' }],
  ['path', { d: 'M15.5 10.5a4 4 0 0 0-6.04-.42l-1.44 1.44a4 4 0 0 0 5.66 5.66l1.42-1.42' }],
  ['path', { d: 'M18.6 4.6v2.2' }],
  ['path', { d: 'M17.5 5.7h2.2' }],
])
export const ListTodo = createIcon('ListTodo', [
  ['path', { d: 'M3 5h1' }],
  ['path', { d: 'M3 12h1' }],
  ['path', { d: 'M3 19h1' }],
  ['path', { d: 'M8 6h13' }],
  ['path', { d: 'M8 12h13' }],
  ['path', { d: 'M8 18h13' }],
  ['path', { d: 'm3.5 5.5.5.5 1-1' }],
])
export const Mail = createIcon('Mail', [
  ['rect', { x: '3', y: '5', width: '18', height: '14', rx: '2' }],
  ['path', { d: 'm3 7 9 6 9-6' }],
])
export const MessageSquare = createIcon('MessageSquare', [
  ['path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }],
])
export const RefreshCw = createIcon('RefreshCw', [
  ['path', { d: 'M21 2v6h-6' }],
  ['path', { d: 'M3 12a9 9 0 0 1 15.2-6.36L21 8' }],
  ['path', { d: 'M3 22v-6h6' }],
  ['path', { d: 'M21 12a9 9 0 0 1-15.2 6.36L3 16' }],
])
export const Search = createIcon('Search', [
  ['circle', { cx: '11', cy: '11', r: '8' }],
  ['path', { d: 'm21 21-4.3-4.3' }],
])
export const Server = createIcon('Server', [
  ['rect', { width: '20', height: '8', x: '2', y: '2', rx: '2', ry: '2' }],
  ['rect', { width: '20', height: '8', x: '2', y: '14', rx: '2', ry: '2' }],
  ['line', { x1: '6', x2: '6.01', y1: '6', y2: '6' }],
  ['line', { x1: '6', x2: '6.01', y1: '18', y2: '18' }],
])
export const Star = createIcon('Star', [
  [
    'polygon',
    {
      points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
    },
  ],
])
export const Sparkles = createIcon('Sparkles', [
  ['path', { d: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z' }],
  ['path', { d: 'M5 3v4' }],
  ['path', { d: 'M3 5h4' }],
  ['path', { d: 'M19 17v4' }],
  ['path', { d: 'M17 19h4' }],
])
export const PenLine = createIcon('PenLine', [
  ['path', { d: 'M12 20h9' }],
  ['path', { d: 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' }],
])
export const OrbitNodes = createIcon('OrbitNodes', [
  ['path', { d: 'M20 12a8 8 0 1 1-2.25-5.55' }],
  ['path', { d: 'm17.75 3.5.9 2.7 2.7.9-2.7.9-.9 2.7-.9-2.7-2.7-.9 2.7-.9z' }],
  ['circle', { cx: '7', cy: '12', r: '1.6' }],
  ['circle', { cx: '12', cy: '7', r: '1.6' }],
  ['circle', { cx: '16.2', cy: '14.6', r: '1.6' }],
])
export const Power = createIcon('Power', [
  ['path', { d: 'M12 2v10' }],
  ['path', { d: 'M18.4 6.6a9 9 0 1 1-12.77.04' }],
])
export const LoopNodes = createIcon('LoopNodes', [
  ['path', { d: 'M19 7a9 9 0 1 0 2.1 9.3' }],
  ['path', { d: 'm19 7-3.7.4 2-3.2' }],
  ['circle', { cx: '8.3', cy: '8.3', r: '1.4' }],
  ['circle', { cx: '7.1', cy: '15.2', r: '1.4' }],
  ['circle', { cx: '15.8', cy: '13.8', r: '1.4' }],
])
export const TrendingDown = createIcon('TrendingDown', [
  ['path', { d: 'M16 17 6 7' }],
  ['path', { d: 'M16 7h-6' }],
  ['path', { d: 'M16 7v6' }],
])
export const Video = createIcon('Video', [
  ['path', { d: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5' }],
  ['rect', { x: '2', y: '6', width: '14', height: '12', rx: '2' }],
])
export const Users = createIcon('Users', [
  ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
  ['circle', { cx: '9', cy: '7', r: '4' }],
  ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
  ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }],
])
export const Zap = createIcon('Zap', [['path', { d: 'M13 2 3 14h7l-1 8 10-12h-7l1-8z' }]])
