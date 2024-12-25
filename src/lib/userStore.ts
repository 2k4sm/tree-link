import pb from "$lib/pocketbase";
import { writable } from "svelte/store";

function userStore() {
  const { subscribe, set } = writable(pb.authStore.record);

  pb.authStore.onChange(() => {
    set(pb.authStore.record);
  });

  return {
    subscribe,
  };
}

export const user = userStore();
