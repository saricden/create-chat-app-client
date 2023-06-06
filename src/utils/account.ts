import { account, storage, ID, db, q } from "./appwrite";
import config from '../../jabberbase.config.json';

/** Gets useful data for the currently logged in user, or the user provided by Id
 * Returns null if something goes wrong, or:
 * 
 * {
 *   avatar: string - URL of profile picture
 *   username: string - Current username
 * }
 *
*/
export async function getUserData(userId: string | null = null) {
  try {
    let auth_id = userId;

    if (userId === null) {
      const accountData = await account.get();
      auth_id = accountData.$id;
    }
    
    const userData = await db.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [
        q.equal('auth_id', [auth_id])
      ]
    );
  
    if (userData.documents.length > 0) {
      const [user] = userData.documents;
      const avatarURL = await storage.getFileView(config.profilePicturesBucketId, user.avatar_id);
      const { href: avatar } = avatarURL;

      return {
        ...user,
        avatar
      };
    }
  }
  catch (e) {
    console.warn(e);
  }

  return null;
}

/** Returns true if there is a currently logged in user (regardless of if they have finished registration).
*/
export async function userIsLoggedIn() {
  try {
    const session = await account.getSession('current');

    if (session) {
      return true;
    }
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}

/** Returns true if the current user has completed their profile registration (has a username).
*/
export async function userHasProfile() {
  try {
    const accountData = await account.get();
    const {$id: auth_id} = accountData;
    const userData = await db.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [
        q.equal('auth_id', [auth_id])
      ]
    );
  
    if (userData.documents.length > 0) {
      return true;
    }
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}

export async function logout() {
  try {
    await account.deleteSession('current');
  }
  catch (e) {
    console.warn(e);
  }
}

export async function register(username: string, avatarFile: any) {
  try {
    const accountData = await account.get();
    const {$id: auth_id} = accountData;
    const now = new Date();
    let avatar_id = '';

    if (avatarFile) {
      const file = await storage.createFile(config.profilePicturesBucketId, ID.unique(), avatarFile);
      avatar_id = file.$id;
    }

    await db.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        username,
        avatar_id,
        last_active: now,
        register_date: now,
        auth_id
      }
    );
  }
  catch (e) {
    console.warn(e);
  }
}

export async function updateUser(authId: string, username: string, bio: string | null = null, avatarFile: any = null) {
  try {
    // Probs need to refactor this as a server function... Safety third.
    let patch: any = {
      username,
      bio
    };

    if (avatarFile) {
      const userData = await getUserData(authId);

      const { avatar_id: oldAvatarId } = userData;

      await storage.deleteFile(config.profilePicturesBucketId, oldAvatarId);

      const file = await storage.createFile(config.profilePicturesBucketId, ID.unique(), avatarFile);

      patch = {
        ...patch,
        avatar_id: file.$id
      };
    }

    const userData = await db.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [
        q.equal('auth_id', [authId])
      ]
    );
    const [user] = userData.documents;
    const {$id: userId} = user;

    await db.updateDocument(
      config.databaseId,
      config.usersCollectionId,
      userId,
      patch
    );

    return true;
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}