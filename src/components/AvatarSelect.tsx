import { ChangeEvent, useRef, useState } from 'react';
import iconUpload from '../assets/upload.svg';

interface AvatarSelectProps {
  className?: string
  onSelect: Function
}

export function AvatarSelect({ className = '', onSelect }: AvatarSelectProps) {
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
      className={`w-32 h-32 overflow-visible relative border-2 border-black rounded-md bg-cover bg-center ${className}`}
      style={{
        backgroundImage: preview === '' ? undefined : `url(${preview})`
      }}
      onClick={() => uploadRef.current?.click()}
    >
      <div
        className={`w-9 h-9 bg-black flex items-center justify-center rounded-md absolute top-0 right-0 translate-x-1/4 -translate-y-1/4`}

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