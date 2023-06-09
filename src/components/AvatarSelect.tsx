import { ChangeEvent, useRef, useState } from 'react';
import iconUpload from '../assets/upload.svg';

interface AvatarSelectProps {
  className?: string
  onSelect: Function
  initSrc?: string
  color?: string
}

export function AvatarSelect({ className = '', onSelect, initSrc = '', color = 'black' }: AvatarSelectProps) {
  const uploadRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState('');

  async function onFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const [imageFile] = e.target.files;

      if (imageFile) {
        setPreview(URL.createObjectURL(imageFile));
        onSelect(imageFile);
      }
    }
  }

  return (
    <div
      className={`w-32 h-32 overflow-visible relative border-2 rounded-md bg-cover bg-center cursor-pointer ${className}`}
      style={{
        backgroundImage: preview === '' ? initSrc !== '' ? `url(${initSrc})` : undefined : `url(${preview})`
      }}
      onClick={() => uploadRef.current?.click()}
    >
      <div
        className={`w-9 h-9 bg-black flex items-center justify-center rounded-md absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 border-2 border-${color}`}

      >
        <img
          src={iconUpload}
          alt="Upload profile picture."
        />
      </div>

      <input
        type="file"
        accept="image/png, image/gif, image/jpeg"
        ref={uploadRef}
        onChangeCapture={onFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}