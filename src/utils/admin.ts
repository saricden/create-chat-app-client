import { ID, db, q } from "./appwrite";
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
    const profilesData = await db.listDocuments(
      config.databaseId,
      config.profilesCollectionId
    );
    const {documents: users} = usersData;
    const {documents: profiles} = profilesData;
    const usersWithProfiles = users.map((u) => {
      const p = profiles.find((profile) => profile.auth_id === u.auth_id);

      return ({
        ...u,
        ...p
      });
    });

    return usersWithProfiles;
  }
  catch (e) {
    console.warn(e);
  }
}

export async function muteUser(auth_id: string, mutePeriod: number) {
  try {
    const userData = await db.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [
        q.equal('auth_id', [auth_id])
      ]
    );

    if (userData && userData.documents.length === 1) {
      const [user] = userData.documents;
      const {$id: userId} = user;
      const mutedUntilMS = (Date.now() + mutePeriod);
      const muted_until = new Date(mutedUntilMS);

      await db.updateDocument(
        config.databaseId,
        config.usersCollectionId,
        userId,
        {
          muted_until
        }
      );
    }
  }
  catch (e) {
    console.warn(e);
  }
}