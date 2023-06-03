
interface CheckmarkProps {
  message?: string
}

export function Checkmark({ message }: CheckmarkProps) {

  return (
    <div className={`flex flex-col items-center`}>
      <div className="success-checkmark">
        <div className="check-icon">
          <span className="icon-line line-tip" />
          <span className="icon-line line-long" />
          <div className="icon-circle" />
          <div className="icon-fix" />
        </div>
      </div>

      <label className={`mt-4 font-semibold`}>
        {message}
      </label>
    </div>
  );
}