import { useState } from 'react'

type Ticket = Record<string, number>

export function useTicket() {
  const [ticket, setTicket] = useState<Ticket>({})

  function increment(key: string) {
    setTicket(t => ({ ...t, [key]: (t[key] ?? 0) + 1 }))
  }

  function decrement(key: string) {
    setTicket(t => {
      const current = t[key] ?? 0
      if (current <= 1) {
        const next = { ...t }
        delete next[key]
        return next
      }
      return { ...t, [key]: current - 1 }
    })
  }

  function getQty(key: string) {
    return ticket[key] ?? 0
  }

  return { ticket, increment, decrement, getQty }
}