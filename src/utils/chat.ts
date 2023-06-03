import { client, db, q } from "./appwrite";
import config from '../../jabberbase.config.json';

export async function getChannels() {
  try {
    const channelData = await db.listDocuments(config.databaseId, config.channelsCollectionId);
    const {documents: channels} = channelData;

    return channels;
  }
  catch (e) {
    console.warn(e);
  }

  return null;
}

export async function getLatestMessages(channelId: string) {
  try {
    const messagesData = await db.listDocuments(
      config.databaseId,
      config.messagesCollectionId,
      [
        q.equal('channel_id', [channelId]),
        q.orderAsc('posted_at'),
        q.limit(30)
      ]
    );
    const {documents: messages} = messagesData;

    return messages;
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}

export async function addMessageListener(callback: Function) {
  try {
    const event = `databases.${config.databaseId}.collections.${config.messagesCollectionId}.documents`;
    return client.subscribe(event, callback);
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}
