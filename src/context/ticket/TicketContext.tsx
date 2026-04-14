import { useState, type ReactNode } from "react";
import { TicketContext } from "./TicketProvider";

type Ticket = Record<string, number>;

export interface TicketContextValue {
  ticket: Ticket;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  getQty: (key: string) => number;
  clear: () => void;
}

export function TicketProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [ticket, setTicket] = useState<Ticket>({});

  function increment(key: string) {
    setTicket((t) => ({ ...t, [key]: (t[key] ?? 0) + 1 }));
  }

  function decrement(key: string) {
    setTicket((t) => {
      const current = t[key] ?? 0;
      if (current <= 1) {
        const next = { ...t };
        delete next[key];
        return next;
      }
      return { ...t, [key]: current - 1 };
    });
  }

  function getQty(key: string) {
    return ticket[key] ?? 0;
  }

  function clear() {
    setTicket({});
  }

  return (
    <TicketContext.Provider
      value={{ ticket, increment, decrement, getQty, clear }}
    >
      {children}
    </TicketContext.Provider>
  );
}
