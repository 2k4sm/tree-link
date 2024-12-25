<script lang="ts">
    import { user } from "$lib/userStore";

    const {children} = $props();
</script>

{#if $user}
    {@render children()}
{:else}
    <p class="text-error flex flex-col items-center justify-center gap-2">
        Login to view this page.
        <a class="btn btn-primary w-[50%]" href="/login">Sign in</a>
    </p>
{/if}