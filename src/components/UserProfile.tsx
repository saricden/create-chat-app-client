import nl2br from "react-nl2br";

interface UserProfileProps {
  user: any
}

export function UserProfile({ user }: UserProfileProps) {

  if (!user) {
    return null;
  }

  return (
    <>
      <div
        className={`w-32 h-32 border-2 border-white rounded-md bg-cover bg-center mb-4`}
        style={{
          backgroundImage: `url(${user.avatar})`
        }}
      />
      
      <h1 className={`text-2xl mb-4`}>@{user.username}</h1>

      <p>{nl2br(user.bio) || "(no bio yet)"}</p>
    </>
  );
}