import { account, storage, ID, db, q, functions } from "./appwrite";
import config from '../../chat.config.json';

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
        // @ts-ignore
        q.equal('auth_id', [auth_id])
      ]
    );
  
    if (userData.documents.length > 0) {
      const profileData = await db.listDocuments(
        config.databaseId,
        config.profilesCollectionId,
        [
          // @ts-ignore
          q.equal('auth_id', [auth_id])
        ]
      );

      if (profileData.documents.length > 0) {
        const [profile] = profileData.documents;
        const [user] = userData.documents;
        let avatar = null;

        if (profile.avatar_id) {
          const avatarURL = await storage.getFileView(config.profilePicturesBucketId, profile.avatar_id);
          avatar = avatarURL.href;
        }
  
        return {
          ...user,
          ...profile,
          avatar
        };
      }
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
    const profileData = await db.listDocuments(
      config.databaseId,
      config.profilesCollectionId,
      [
        q.equal('auth_id', [auth_id])
      ]
    );
  
    if (profileData.documents.length > 0) {
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
    let avatar_id = null;

    if (avatarFile) {
      const file = await storage.createFile(config.profilePicturesBucketId, ID.unique(), avatarFile);
      avatar_id = file.$id;
    }

    const promiseUser = db.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        auth_id
      }
    );

    const promiseProfile = db.createDocument(
      config.databaseId,
      config.profilesCollectionId,
      ID.unique(),
      {
        auth_id,
        username,
        avatar_id
      }
    );

    await Promise.all([
      promiseUser,
      promiseProfile
    ]);
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

      // @ts-ignore
      const { avatar_id: oldAvatarId } = userData;

      await storage.deleteFile(config.profilePicturesBucketId, oldAvatarId);

      const file = await storage.createFile(config.profilePicturesBucketId, ID.unique(), avatarFile);

      patch = {
        ...patch,
        avatar_id: file.$id
      };
    }

    const profileData = await db.listDocuments(
      config.databaseId,
      config.profilesCollectionId,
      [
        q.equal('auth_id', [authId])
      ]
    );
    const [profile] = profileData.documents;
    const {$id: profileId} = profile;

    await db.updateDocument(
      config.databaseId,
      config.profilesCollectionId,
      profileId,
      patch
    );

    return true;
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}

export async function getVapidPublicKey() {
  try {
    const results = await functions.createExecution('getVapidPublicKey');
    const json = JSON.parse(results.response);
    const {vapidPublicKey} = json;

    return vapidPublicKey;
  }
  catch (e) {
    console.warn(e);
  }

  return null;
}

export async function addUserPushSubscription(push_subscription: string) {
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
    const [user] = userData.documents;

    if (user) {
      const {$id: userId, push_subscriptions} = user;
      const subscriptions = [
        ...push_subscriptions,
        push_subscription
      ];

      await db.updateDocument(
        config.databaseId,
        config.usersCollectionId,
        userId,
        {
          push_subscriptions: subscriptions
        }
      );

      return true;
    }
  }
  catch (e) {
    console.warn(e);
  }

  return false;
}