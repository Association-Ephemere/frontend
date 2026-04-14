import { useState, useEffect, type ReactNode } from "react";
import { TicketContext } from "./TicketProvider";
import type { Ticket } from "@/types/ticket";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const TICKET_NUMBER_STORAGE_KEY = "ticketNumber";
const MAX_TICKET_BOOK_STORAGE_KEY = "maxTicketNumber";
const TICKET_STORAGE_KEY = "ticket";

function readTicketNumber(): number {
  const parsed = parseInt(
    localStorage.getItem(TICKET_NUMBER_STORAGE_KEY) ?? "",
    10,
  );
  return isNaN(parsed) ? 1 : parsed;
}

function readMaxTicketBookNumber(): number {
  const parsed = parseInt(
    localStorage.getItem(MAX_TICKET_BOOK_STORAGE_KEY) ?? "",
    10,
  );
  return isNaN(parsed) ? 1 : parsed;
}

function readTicket(): Ticket {
  try {
    const stored = localStorage.getItem(TICKET_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export interface TicketContextValue {
  ticket: Ticket;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  getQty: (key: string) => number;
  clear: () => void;
  ticketNumber: number;
  setTicketNumber: (n: number) => void;
  incrementTicketNumber: () => void;
  maxTicketNumber: number;
  setMaxTicketNumber: (n: number) => void;
}

export function TicketProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [ticket, setTicket] = useState<Ticket>(readTicket);
  const [ticketNumber, setTicketNumberState] =
    useState<number>(readTicketNumber);
  const [maxTicketNumber, setMaxTicketNumberState] = useState<number>(
    readMaxTicketBookNumber,
  );

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(ticket));
  }, [ticket]);

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
    localStorage.removeItem(TICKET_STORAGE_KEY); // optional but clean
  }

  function setTicketNumber(n: number) {
    const clamped = Math.max(1, n);
    setTicketNumberState(clamped);
    localStorage.setItem(TICKET_NUMBER_STORAGE_KEY, String(clamped));
  }

  function setMaxTicketNumber(n: number) {
    const clamped = Math.max(1, n);
    setMaxTicketNumberState(clamped);
    localStorage.setItem(MAX_TICKET_BOOK_STORAGE_KEY, String(clamped));
  }

  function incrementTicketNumber() {
    setTicketNumber(ticketNumber + 1);
    if (ticketNumber >= maxTicketNumber) {
      toast.info(
        "Vous avez utilisé le dernier ticket disponible, veuillez prendre un nouveau carnet et changer les paramètres.",
      );

      navigate("/parameters");
    }
  }

  return (
    <TicketContext.Provider
      value={{
        ticket,
        increment,
        decrement,
        getQty,
        clear,
        ticketNumber,
        setTicketNumber,
        incrementTicketNumber,
        maxTicketNumber,
        setMaxTicketNumber,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}
