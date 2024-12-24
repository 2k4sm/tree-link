import { env } from "$env/dynamic/public";
import PocketBase from "pocketbase";

function initDb(): PocketBase {
  const url = env.PUBLIC_PB_URI;
  const pb_client = new PocketBase(url);

  pb_client.autoCancellation(false);

  return pb_client;
}

const client = initDb();

export default client;
