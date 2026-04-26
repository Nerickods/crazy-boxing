'use client'

import { usePathname } from 'next/navigation'
import { ChatDrawer } from './ChatDrawer'
import { AdminChatWidget } from './AdminChatWidget'

import { useChatStore } from '../store/chatStore'

export function GlobalChatOrchestrator() {
  const pathname = usePathname()
  const { isOpen, setOpen } = useChatStore()
  
  // Si estamos en cualquier ruta de admin, mostramos el estratega neural
  const isAdmin = pathname?.startsWith('/admin') || pathname?.includes('/dashboard') || pathname?.includes('/settings')

  if (isAdmin) {
    return <AdminChatWidget />
  }

  // De lo contrario, UI normal de landing con el nuevo modelo Drawer
  return (
    <ChatDrawer 
      isOpen={isOpen} 
      onClose={() => setOpen(false)} 
    />
  )
}
