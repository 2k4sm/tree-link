import * as dotenv from "dotenv";
import PocketBase from "pocketbase";

dotenv.config();

function initDb(): PocketBase {
  const uri = process.env.PB_URI;

  const pb_client = new PocketBase(uri);

  pb_client.autoCancellation(false);

  return pb_client;
}

const client = initDb();

export default client;
