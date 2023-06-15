import { ID, db, q } from "./appwrite";

export async function createChannel(title: string, slug: string, icon: string) {
  try {
    await db.createDocument(
      'chat',
      'channels',
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
      'chat',
      'channels',
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
      'chat',
      'channels',
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
      'chat',
      'channels',
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
      'chat',
      'users'
    );
    const profilesData = await db.listDocuments(
      'chat',
      'profiles'
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
      'chat',
      'users',
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
        'chat',
        'users',
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

export async function unmuteUser(auth_id: string) {
  try {
    const userData = await db.listDocuments(
      'chat',
      'users',
      [
        q.equal('auth_id', [auth_id])
      ]
    );

    if (userData && userData.documents.length === 1) {
      const [user] = userData.documents;
      const {$id: userId} = user;

      await db.updateDocument(
        'chat',
        'users',
        userId,
        {
          muted_until: null
        }
      );
    }
  }
  catch (e) {
    console.warn(e);
  }
}