import { ChangeEventHandler } from "react"

interface InputProps {
  type: 'text' | 'email'
  label?: string
  className?: string
  error?: boolean
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export function Input({ type, label, className, error, value, onChange }: InputProps) {


  return (
    <div className={`flex flex-col w-full`}>
      {label && <label className={`text-md font-semibold transition-all ${error ? 'text-red-500' : 'text-black'}`}>{label}</label>}
      
      <input
        className={`w-full border-2 transition-all ${error ? 'border-red-500 text-red-500' : 'border-black text-black'} rounded-md p-2 outline-none text-sm ${className}`}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}