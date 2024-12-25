<script lang="ts">
    import pb from "$lib/pocketbase"
    import { user } from "$lib/userStore";
    async function signInWithGoogle() {
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
        console.log(authData)
        console.log(pb.authStore.record);
    }

    function signOut() {
        pb.authStore.clear();
    }
    
</script>


{#if $user}
  <h2 class="card-title">Welcome, {$user.name}</h2>
  <p class="text-center text-success">You are logged in</p>
  <button class="btn btn-warning" on:click={() => signOut()}>Sign out</button>
{:else}
  <button class="btn btn-primary" on:click={() => signInWithGoogle()}>Sign in with Google</button>
{/if}