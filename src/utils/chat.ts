import { client, db, q, storage } from "./appwrite";
import { RealtimeResponseEvent } from "appwrite";

export async function getChannels(archived = false) {
  try {
    const channelData = await db.listDocuments(
      'chat',
      'channels',
      [
        q.equal('archived', [archived])
      ]
    );
    const {documents: channels} = channelData;

    return channels;
  }
  catch (e) {
    console.warn(e);
  }

  return null;
}

export async function getLatestMessages(channelId: string, page: number = 0) {
  try {
    const messagesData = await db.listDocuments(
      'chat',
      'messages',
      [
        q.equal('channel_id', [channelId]),
        q.orderDesc('posted_at'),
        q.offset(page * 30),
        q.limit(30)
      ]
    );
    const {documents: messages} = messagesData;

    return messages.reverse();
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}

export function addMessageListener(callback: (payload: RealtimeResponseEvent<unknown>) => void) {
  try {
    const event = `databases.${'chat'}.collections.${'messages'}.documents`;
    return client.subscribe(event, callback);
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}

export async function findByUsername(username: string) {
  try {
    const profilesData = await db.listDocuments(
      'chat',
      'profiles',
      [
        q.search('username', username)
      ]
    );
    let profiles = profilesData.documents;

    for (let i in profiles) {
      const p = profiles[i];

      if (p.avatar_id) {
        const avatarURL = await storage.getFileView(
          'profile_pictures',
          p.avatar_id
        );

        profiles[i].avatar = avatarURL.href;
      }
    }

    return profiles;
  }
  catch (e) {
    console.warn(e);
  }

  return [];
}