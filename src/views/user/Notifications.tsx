import novatar from '../../assets/novatar.jpg';
import { db } from '../../utils/appwrite';

interface NotificationsProps {
  user: any
  notifications: any[]
}

export function Notifications({ user, notifications }: NotificationsProps) {

  function dismissNotification(id: string) {
    db.deleteDocument('chat', 'notifications', id);
  }

  return (
    <div className={`flex flex-col`}>
      {
        notifications.length === 0 &&
        <p className={`text-full text-center`}>You will receive notifications when other users tag you by typing "@{user.username}"</p>
      }

      {
        notifications.map((n, i) => {

          return (
            <button
              className={`w-full flex flex-row items-start mb-4 border-2 border-white rounded-md p-2`}
              onClick={() => dismissNotification(n.$id)}
              key={`n_${i}`}
            >
              <div
                className={`mr-2 mt-1 w-9 h-9 bg-cover bg-center rounded-md border-2 border-white cursor-pointer`}
                style={{
                  backgroundImage: n.from_avatar_url && n.from_avatar_url.length > 0 ? `url(${n.from_avatar_url})` : `url(${novatar})`
                }}
              />
              
              <div className={`flex flex-col items-start cursor-pointer`}>
                <header className={`text-lg`}>@{n.from_username}</header>
                <p className={`text-sm`}>{n.message}</p>
              </div>
            </button>
          );
        })
      }
    </div>
  );
}