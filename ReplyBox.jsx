import React, { useState, useRef } from 'react'
import { Image, Video, Mic, FileText, X, Send } from 'lucide-react'
import { useSendMessage, useSendAttachment } from '../../hooks'
import { Spinner } from '../ui'

const FILE_TYPES = [
  { type: 'image',    accept: 'image/*',  Icon: Image,    title: 'Image'    },
  { type: 'video',    accept: 'video/*',  Icon: Video,    title: 'Video'    },
  { type: 'audio',    accept: 'audio/*,.ogg,.mp3,.m4a,.wav,.webm', Icon: Mic, title: 'Audio/Voice' },
  { type: 'document', accept: '*/*',      Icon: FileText, title: 'Document' },
]

export default function ReplyBox({ convId }) {
  const [mode, setMode] = useState('reply') // 'reply' | 'note'
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const refs = useRef({})

  const isNote   = mode === 'note'
  const sendMsg  = useSendMessage(convId)
  const sendFile = useSendAttachment(convId)
  const sending  = sendMsg.isPending || sendFile.isPending

  const handleSend = async () => {
    if (!convId || sending) return
    if (file) {
      await sendFile.mutateAsync({ file, fileType, caption: text, isPrivate: isNote })
      setFile(null); setFileType(null); setText('')
    } else if (text.trim()) {
      await sendMsg.mutateAsync({ content: text.trim(), isPrivate: isNote })
      setText('')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleSend() }
  }

  const triggerFile = (type, accept) => {
    if (!refs.current[type]) return
    refs.current[type].click()
  }

  const handleFileChange = (e, type) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f); setFileType(type)
    e.target.value = ''
  }

  return (
    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0, padding: '10px 12px' }}>
      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 8, background: 'var(--bg3)', borderRadius: 8, padding: 3, width: 'fit-content' }}>
        {['reply', 'note'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 12,
            cursor: 'pointer', border: 'none', fontFamily: 'var(--font)',
            background: mode === m ? 'var(--bg4)' : 'transparent',
            color: mode === m ? 'var(--text)' : 'var(--text2)',
            transition: 'all .15s', textTransform: 'capitalize',
          }}>{m === 'note' ? 'Private Note' : 'Reply'}</button>
        ))}
      </div>

      {/* File preview */}
      {file && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
          background: 'var(--bg4)', border: '1px solid var(--border2)',
          borderRadius: 8, marginBottom: 6,
        }}>
          <span style={{ fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📎 {file.name}
          </span>
          <button onClick={() => { setFile(null); setFileType(null) }} style={{
            background: 'var(--red-dim)', border: 'none', borderRadius: 4,
            width: 20, height: 20, cursor: 'pointer', color: 'var(--red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><X size={12} /></button>
        </div>
      )}

      {/* Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={isNote
            ? 'Write a private note (not visible to customer)...'
            : 'Type a message... (Ctrl+Enter to send)'}
          rows={3}
          style={{
            width: '100%', background: 'var(--bg3)',
            border: `1px solid ${isNote ? 'rgba(255,176,32,0.3)' : 'var(--border)'}`,
            borderRadius: 10, padding: '10px 12px 42px', color: 'var(--text)',
            fontSize: 13, fontFamily: 'var(--font)', outline: 'none',
            resize: 'none', minHeight: 80, maxHeight: 180, lineHeight: 1.5,
            transition: 'border .15s',
          }}
          onFocus={e => e.target.style.borderColor = isNote ? 'var(--amber)' : 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = isNote ? 'rgba(255,176,32,0.3)' : 'var(--border)'}
        />

        {/* Toolbar inside textarea */}
        <div style={{
          position: 'absolute', bottom: 8, left: 8, right: 8,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {/* Attach buttons */}
          {FILE_TYPES.map(({ type, accept, Icon, title }) => (
            <React.Fragment key={type}>
              <button
                title={title}
                onClick={() => triggerFile(type, accept)}
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', border: '1px solid var(--border)',
                  background: 'transparent', color: 'var(--text3)',
                  transition: 'all .15s', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)' }}
              >
                <Icon size={13} />
              </button>
              <input
                type="file" accept={accept}
                ref={el => refs.current[type] = el}
                onChange={e => handleFileChange(e, type)}
                style={{ display: 'none' }}
              />
            </React.Fragment>
          ))}

          <div style={{ flex: 1 }} />

          <button
            onClick={handleSend}
            disabled={sending || (!text.trim() && !file)}
            style={{
              padding: '5px 14px', background: 'var(--accent)',
              border: 'none', borderRadius: 7, color: '#fff',
              fontSize: 12, fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5,
              opacity: sending || (!text.trim() && !file) ? 0.4 : 1,
              transition: 'opacity .15s', flexShrink: 0,
            }}
          >
            {sending ? <Spinner size={12} /> : <Send size={12} />}
            {sending ? 'Sending' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
