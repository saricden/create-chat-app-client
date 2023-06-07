// @ts-ignore
import { Client, Account, Storage, Databases, Query, ID } from 'appwrite';
import config from '../../chat.config.json';

const client = new Client();
const account = new Account(client);
const storage = new Storage(client);
const db = new Databases(client);
const q = Query;

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(config.appwriteProjectId);

export {
  client,
  account,
  storage,
  db,
  q,
  ID
};