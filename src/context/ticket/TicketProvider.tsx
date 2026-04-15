import { createContext, useContext } from "react"
import type { TicketContextValue } from "./TicketContext"

export const TicketContext = createContext<TicketContextValue | null>(null)

export function useTicket() {
  const ctx = useContext(TicketContext)
  if (!ctx) throw new Error('useTicket must be used inside TicketProvider')
  return ctx
}