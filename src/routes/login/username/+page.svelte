<script lang="ts">
    import { env } from "$env/dynamic/public";
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import pb from "$lib/pocketbase";
    import { onMount } from "svelte";
    let username = $state("");
    let loading = $state(false);
    let isAvailable = $state(false);
    let debounceTimer: ReturnType<typeof setTimeout>;
    let record = $state(null);
    onMount(async () => {
        try {
            record = await pb
                .collection("trees")
                .getFirstListItem(`user_id="${pb.authStore.record?.id}"`);
        } catch (error) {
            console.error("Error fetching record:", error);
        }
    });
    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    let isValid = $derived(
        username?.length > 2 && username.length < 16 && re.test(username),
    );
    let isTouched = $derived(username.length > 0);
    let isTaken = $derived(isValid && !isAvailable && !loading);

    async function checkAvailability() {
        isAvailable = false;
        clearTimeout(debounceTimer);
        if (!isValid) {
            loading = false;
            return;
        }
        loading = true;

        debounceTimer = setTimeout(async () => {
            console.log("checking availability of", username);

            try {
                const exists = await pb
                    .collection("trees")
                    .getFirstListItem(`username="${username}"`);
                isAvailable = !exists;
            } catch (err) {
                isAvailable = true;
                console.log(err);
            }
            loading = false;
        }, 500);
    }

    async function confirmUsername(e: SubmitEvent) {
        e.preventDefault();
        console.log("confirming username", username);

        try {
            const avatarUrl = pb.authStore.record?.avatar;

            if (!avatarUrl) {
                throw new Error("No avatar URL found");
            }

            // Fetch the image
            const response = await fetch(
                `${env.PUBLIC_PB_URI}/api/files/_pb_users_auth_/` +
                    `${pb.authStore.record?.id}/` +
                    avatarUrl,
            );
            const blob = await response.blob();

            // Create a File object from the blob
            const avatarFile = new File(
                [blob],
                `${pb.authStore.record?.id}_avatar.jpg`,
                {
                    type: "image/jpeg",
                },
            );

            // Create FormData
            const formData = new FormData();
            formData.append("user_id", pb.authStore.record?.id ?? "");
            formData.append("username", username);
            formData.append("published", "true");
            formData.append("photoURL", avatarFile);
            formData.append("bio", "I am the Walrus");
            formData.append(
                "links",
                JSON.stringify([
                    {
                        title: "Test Link",
                        url: "https://kung.foo",
                        icon: "custom",
                    },
                ]),
            );

            // Create record
            record = await pb.collection("trees").create(formData);
            username = "";
            isAvailable = false;
        } catch (err) {
            console.error("Error confirming username:", err);
        }
    }
</script>

<AuthCheck>
    {#if record?.username}
        <p class="text-lg">
            Your username is <span class="text-success font-bold"
                >@{record?.username}</span
            >
        </p>
        <p class="text-sm">(Usernames cannot be changed)</p>
        <a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
    {:else}
        <form class="w-2/5" onsubmit={confirmUsername}>
            <input
                type="text"
                placeholder="Username"
                class="input w-full"
                bind:value={username}
                oninput={checkAvailability}
                class:input-error={!isValid && isTouched}
                class:input-warning={isTaken}
                class:input-success={isAvailable && isValid && !loading}
            />
            <div class="my-4 min-h-16 px-8 w-full">
                {#if loading}
                    <p class="text-secondary">
                        Checking availability of @{username}...
                    </p>
                {/if}

                {#if !isValid && isTouched}
                    <p class="text-error text-sm">
                        must be 3-16 characters long, alphanumeric only
                    </p>
                {/if}

                {#if isValid && !isAvailable && !loading}
                    <p class="text-warning text-sm">
                        @{username} is not available
                    </p>
                {/if}

                {#if isAvailable}
                    <button class="btn btn-success"
                        >Confirm username @{username}</button
                    >
                {/if}
            </div>
        </form>
    {/if}
</AuthCheck>
