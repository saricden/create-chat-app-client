import { ChangeEventHandler } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface InputProps {
  type: 'text' | 'email' | 'textarea'
  label?: string
  className?: string
  error?: boolean
  value?: string
  color?: string
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export function Input({ type, label, className, error, value, color = 'black', disabled = false, onChange }: InputProps) {

  return (
    <div className={`flex flex-col w-full`}>
      {label && <label className={`text-md font-semibold transition-all ${disabled ? 'opacity-50' : ''} ${error ? 'text-red-500' : `text-${color}`}`}>{label}</label>}
      
      {
        (type === 'text' || type === 'email') &&
        <input
          className={`w-full border-2 bg-transparent ${error ? 'border-red-500 text-red-500' : `border-${color} text-${color}`} ${disabled ? 'opacity-50' : ''} rounded-md p-2 outline-none text-sm ${className}`}
          type={type}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      }

      {
        type === 'textarea' &&
        <TextareaAutosize
          className={`w-full border-2 bg-transparent resize-none ${error ? 'border-red-500 text-red-500' : `border-${color} text-${color}`} ${disabled ? 'opacity-50' : ''} rounded-md p-2 outline-none text-sm ${className}`}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      }
      
    </div>
  );
}