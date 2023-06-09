import { useState } from "react";

interface SettingsProps {

}

export function Settings({}: SettingsProps) {
  const pushSupported = ('PushManager' in window);
  const [pushGranted, setPushGranted] = useState(false);

  async function enablePush() {
    const permission = await Notification.requestPermission();

    if (permission !== 'denied') {
      const reg = await navigator.serviceWorker.getRegistration();
      
      if (reg) {
        console.log(reg);
      }
    }
  }

  return (
    <div className={`flex flex-col h-full items-center justify-start`}>
      {
        pushSupported &&
        <button
          className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center transition-all`}
          onClick={enablePush}
        >
          Enable Push Notifications
        </button>
      }
    </div>
  );
}