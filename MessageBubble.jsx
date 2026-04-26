import React from 'react'
import { Download, FileText } from 'lucide-react'
import { Avatar } from '../ui'
import { formatTime, fileSize } from '../../lib/utils'

export function MessageBubble({ msg, isOptimistic = false }) {
  const isOut  = msg.message_type === 1
  const isNote = msg.message_type === 2
  const name   = msg.sender?.name || ''
  const time   = formatTime(msg.created_at)
  const atts   = msg.attachments || []

  const bubbleStyle = {
    padding: '9px 12px',
    borderRadius: 13,
    fontSize: 13,
    lineHeight: 1.55,
    wordBreak: 'break-word',
    maxWidth: 420,
    ...(isNote
      ? { background: 'rgba(255,176,32,0.08)', border: '1px solid rgba(255,176,32,0.2)', borderRadius: 10, color: 'var(--amber)', fontStyle: 'italic', fontSize: 12 }
      : isOut
        ? { background: 'var(--accent)', borderBottomRightRadius: 4, color: '#fff' }
        : { background: 'var(--bg3)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 }
    ),
  }

  return (
    <div style={{
      display: 'flex', gap: 8, maxWidth: '75%',
      alignSelf: isOut || isNote ? 'flex-end' : 'flex-start',
      flexDirection: isOut || isNote ? 'row-reverse' : 'row',
      opacity: isOptimistic ? 0.55 : 1,
      animation: 'msgIn 0.18s ease both',
    }}>
      {!isOut && !isNote && <Avatar name={name} size={28} style={{ flexShrink: 0, alignSelf: 'flex-end' }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: isOut || isNote ? 'right' : 'left' }}>
          {name}
        </div>
        {atts.length > 0
          ? atts.map((a, i) => <AttachmentBubble key={i} att={a} caption={msg.content} isOut={isOut} />)
          : msg.content && <div style={bubbleStyle}>{msg.content}</div>
        }
        <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: isOut || isNote ? 'right' : 'left' }}>
          {time}{isOptimistic && ' · sending…'}
        </div>
      </div>
    </div>
  )
}

function AttachmentBubble({ att, caption, isOut }) {
  const url  = att.data_url || att.download_url || ''
  const name = att.filename || 'file'
  const type = att.file_type || att.content_type || ''
  const size = fileSize(att.file_size)

  const wrap = {
    borderRadius: 12, overflow: 'hidden', maxWidth: 280,
    border: '1px solid var(--border)', background: 'var(--bg3)',
  }

  if (type.startsWith('image')) return (
    <div style={wrap}>
      <img src={url} alt={name} style={{ width: '100%', display: 'block', cursor: 'pointer', borderRadius: 10 }}
        onClick={() => window.open(url, '_blank')} />
      {caption && <div style={{ padding: '6px 12px 10px', fontSize: 12, color: 'var(--text2)' }}>{caption}</div>}
    </div>
  )

  if (type.startsWith('video')) return (
    <div style={wrap}>
      <video src={url} controls style={{ width: '100%', display: 'block' }} />
      {caption && <div style={{ padding: '6px 12px 10px', fontSize: 12, color: 'var(--text2)' }}>{caption}</div>}
    </div>
  )

  if (type.startsWith('audio')) return (
    <div style={wrap}>
      <audio src={url} controls style={{ width: '100%', padding: 8 }} />
      {caption && <div style={{ padding: '6px 12px 10px', fontSize: 12, color: 'var(--text2)' }}>{caption}</div>}
    </div>
  )

  return (
    <div style={wrap}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={18} color="var(--accent)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{size}</div>
          <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>
            Download
          </a>
        </div>
      </div>
      {caption && <div style={{ padding: '0 12px 10px', fontSize: 12, color: 'var(--text2)' }}>{caption}</div>}
    </div>
  )
}

export function DaySeparator({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 11, color: 'var(--text3)' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      {label}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}
