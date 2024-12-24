<script lang="ts">
    import pb from "$lib/pocketbase"
    async function signInWithGoogle() {
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
        console.log(authData)
        console.log(pb.authStore.record);
        pb.authStore.clear();
    }
    
</script>

<div>
<button class="btn btn-primary" onclick={signInWithGoogle}>Sign in with Google</button></div>