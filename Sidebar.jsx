import React from 'react'
import {
  Mail, Users, BookOpen, BarChart2, UserCog, LogOut, MessageCircle
} from 'lucide-react'
import { useAuthStore, useUIStore } from '../../store'
import { useConversations } from '../../hooks'
import { avatarColor, initials } from '../../lib/utils'

const NAV = [
  { id: 'inbox',     icon: Mail,       label: 'Inbox',          adminOnly: false },
  { id: 'contacts',  icon: Users,      label: 'Contacts',       adminOnly: false },
  { id: 'knowledge', icon: BookOpen,   label: 'Knowledge Base', adminOnly: false },
  { id: 'reports',   icon: BarChart2,  label: 'Reports',        adminOnly: true  },
  { id: 'agents',    icon: UserCog,    label: 'Agents',         adminOnly: true  },
]

export default function Sidebar() {
  const { session, clearSession, isAdmin } = useAuthStore()
  const { activeView, setActiveView, convFilter } = useUIStore()
  const { data: convs = [] } = useConversations(convFilter, session?.agent_id)

  const unread = convs.filter(c => c.unread_count > 0).length
  const admin  = isAdmin()

  const btn = (item) => {
    if (item.adminOnly && !admin) return null
    const active = activeView === item.id
    const Icon   = item.icon
    return (
      <div key={item.id} style={{ position: 'relative' }}>
        <button
          onClick={() => setActiveView(item.id)}
          title={item.label}
          style={{
            width: 38, height: 38, borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', border: 'none',
            background: active ? 'var(--accent-dim)' : 'transparent',
            color: active ? 'var(--accent)' : 'var(--text2)',
            transition: 'all .15s', position: 'relative',
          }}
          onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)' }}}
          onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)' }}}
        >
          <Icon size={18} strokeWidth={1.7} />
          {item.id === 'inbox' && unread > 0 && (
            <span style={{
              position: 'absolute', top: 3, right: 3,
              minWidth: 15, height: 15, background: 'var(--red)',
              borderRadius: 8, fontSize: 9, fontWeight: 700,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px'
            }}>{unread}</span>
          )}
        </button>
        {/* Tooltip */}
        <div style={{
          position: 'absolute', left: 46, top: '50%', transform: 'translateY(-50%)',
          background: 'var(--bg4)', border: '1px solid var(--border2)',
          padding: '4px 8px', borderRadius: 6, fontSize: 12, color: 'var(--text)',
          whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0, zIndex: 100,
          transition: 'opacity .1s',
        }} className="sb-tooltip">{item.label}</div>
      </div>
    )
  }

  return (
    <aside style={{
      width: 'var(--sidebar-w)', background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '10px 0', gap: 2, flexShrink: 0, zIndex: 10,
    }}>
      <style>{`.sb-tooltip { opacity: 0; } button:hover + .sb-tooltip { opacity: 1 !important; }`}</style>

      {/* Logo */}
      <div style={{
        width: 36, height: 36, background: 'var(--accent)', borderRadius: 9,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, color: '#fff',
        marginBottom: 10, flexShrink: 0,
      }}>CD</div>

      {/* Nav items */}
      {NAV.map(btn)}

      <div style={{ flex: 1 }} />

      {/* Logout */}
      <button
        onClick={() => { if (confirm('Sign out?')) clearSession() }}
        title="Sign out"
        style={{
          width: 38, height: 38, borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', border: 'none',
          background: 'transparent', color: 'var(--text3)', transition: 'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)' }}
      >
        <LogOut size={16} strokeWidth={1.7} />
      </button>

      {/* User avatar */}
      <div
        title={`${session?.name} (${session?.role})`}
        style={{
          width: 30, height: 30, borderRadius: '50%', marginTop: 4,
          background: avatarColor(session?.name || ''),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'default', flexShrink: 0,
        }}
      >
        {initials(session?.name || '')}
      </div>
    </aside>
  )
}
