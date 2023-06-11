// import { useState } from "react";

import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import { getVapidPublicKey, addUserPushSubscription } from "../../utils/account";

interface SettingsProps {

}

export function Settings({}: SettingsProps) {
  const pushSupported = ('PushManager' in window);
  const [loadingPush, setLoadingPush] = useState(true);
  const [pushGranted, setPushGranted] = useState(false);

  useEffect(() => {
    async function checkPushSubscription() {
      const reg = await navigator.serviceWorker.getRegistration();

      if (reg) {
        const subscription = await reg.pushManager.getSubscription();

        setPushGranted(subscription !== null);
      }

      setLoadingPush(false);
    }
    
    checkPushSubscription();
  }, []);

  async function togglePush() {
    setLoadingPush(true);

    if (!pushGranted) {
      const permission = await Notification.requestPermission();
  
      if (permission !== 'denied') {
        const reg = await navigator.serviceWorker.getRegistration();
        
        if (reg) {
          const publicKey = await getVapidPublicKey();

          const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey
          });

          await addUserPushSubscription(JSON.stringify(subscription));

          setPushGranted(true);
        }
      }
    }
    else {
      const reg = await navigator.serviceWorker.getRegistration();

      if (reg) {
        const subscription = await reg.pushManager.getSubscription();

        if (subscription) {
          await subscription.unsubscribe();
          setPushGranted(false);
        }
      }
    }

    setLoadingPush(false);
  }

  return (
    <div className={`flex flex-col h-full items-center justify-start`}>
      {
        pushSupported &&
        <button
          className={`w-full px-4 py-2 border-2 rounded-md mb-3 border-white text-white text-center transition-all ${loadingPush ? 'animate-pulse' : ''}`}
          onClick={togglePush}
        >
          {
            loadingPush
            ? <Loader
                width={24}
                height={24}
                color="#FFF"
              />
            : pushGranted
              ? "Disable Push Notifications"
              : "Enable Push Notifications"
          }
        </button>
      }
    </div>
  );
}