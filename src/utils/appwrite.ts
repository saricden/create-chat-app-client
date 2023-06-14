import { Client, Account, Storage, Databases, Query, ID, Functions } from 'appwrite';

const client = new Client();
const account = new Account(client);
const storage = new Storage(client);
const functions = new Functions(client);
const db = new Databases(client);
const q = Query;

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_appwriteProjectId);

export {
  client,
  account,
  storage,
  functions,
  db,
  q,
  ID
};