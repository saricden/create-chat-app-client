import { ID, db } from "./appwrite";
import config from '../../chat.config.json';

export async function createChannel(title: string, slug: string, icon: string) {
  try {
    await db.createDocument(
      config.databaseId,
      config.channelsCollectionId,
      ID.unique(),
      {
        title,
        slug,
        icon,
        archived: false
      }
    );
  }
  catch (e) {
    console.warn(e);
  }
}

export async function updateChannel(id: string, title: string, slug: string, icon: string) {
  try {
    await db.updateDocument(
      config.databaseId,
      config.channelsCollectionId,
      id,
      {
        title,
        slug,
        icon
      }
    );
  }
  catch (e) {
    console.warn(e);
  }
}

export async function archiveChannel(id: string) {
  try {
    await db.updateDocument(
      config.databaseId,
      config.channelsCollectionId,
      id,
      {
        archived: true
      }
    );
  }
  catch (e) {
    console.warn(e);
  }
}

export async function restorehannel(id: string) {
  try {
    await db.updateDocument(
      config.databaseId,
      config.channelsCollectionId,
      id,
      {
        archived: false
      }
    );
  }
  catch (e) {
    console.warn(e);
  }
}

export async function getAllUsers() {
  try {
    const usersData = await db.listDocuments(
      config.databaseId,
      config.usersCollectionId
    );
    const {documents: users} = usersData;

    return users;
  }
  catch (e) {
    console.warn(e);
  }
}