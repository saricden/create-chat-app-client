import { PointerEventHandler } from "react"

interface ButtonProps {
  label: string
  onClick: PointerEventHandler<HTMLButtonElement>
  disabled?: boolean
  pulse?: boolean
}

export function Button({ label, onClick, disabled = false, pulse = false }: ButtonProps) {

  return (
    <button
      className={`bg-black text-white font-bold px-6 py-2 rounded-md ${pulse ? 'animate-pulse' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}