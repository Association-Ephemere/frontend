import { useTicket } from "@/context/ticket/TicketProvider";
import { Minus, Plus } from "lucide-react";

export default function QuantityButtons({
  displayQuantity,
  photoKey,
}: Readonly<{
  displayQuantity: boolean;
  photoKey: string;
}>) {
  const { increment, decrement, getQty } = useTicket();

  return (
    <div className="flex gap-2">
      {(getQty(photoKey) > 0 || displayQuantity) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            decrement(photoKey);
          }}
          className="w-7 h-7 rounded-full bg-white/90 text-stone-800 font-bold text-lg flex items-center justify-center shadow hover:bg-red-100 transition-colors"
        >
          <Minus />
        </button>
      )}

      {displayQuantity && (
        <div className="bg-blue-600 text-white font-bold rounded-full w-7 h-7  flex items-center justify-center shadow pointer-events-none">
          {getQty(photoKey)}
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          increment(photoKey);
        }}
        className="w-7 h-7 rounded-full bg-white/90 text-stone-800 font-bold text-lg flex items-center justify-center shadow hover:bg-blue-100 transition-colors"
      >
        <Plus />
      </button>
    </div>
  );
}
