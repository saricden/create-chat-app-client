
interface LoaderProps {
  message?: string
  width?: number
  height?: number
  color?: string
}

export function Loader({ message, width = 48, height = 48, color = '#000' }: LoaderProps) {

  return (
    <div className={`flex flex-col items-center`}>
      <div className="loader" style={{ width, height, borderColor: color, borderBottomColor: 'transparent' }} />

      {
        message &&
        <label className={`mt-4 font-semibold`}>
          {message}
        </label>
      }
    </div>
  );
}
