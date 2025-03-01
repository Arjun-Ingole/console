<script lang="ts">
    import { base } from '$app/paths';
    import {
        Button,
        Form,
        FormItem,
        FormList,
        InputEmail,
        InputPassword
    } from '$lib/elements/forms';
    import { addNotification } from '$lib/stores/notifications';
    import { sdkForConsole } from '$lib/stores/sdk';
    import { Unauthenticated } from '$lib/layout';
    import { trackEvent } from '$lib/actions/analytics';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let email: string;
    let userId: string;
    let secret: string;

    let password: string;
    let confirmPassword: string;

    onMount(() => {
        userId = $page.url.searchParams.get('userId');
        secret = $page.url.searchParams.get('secret');
    });

    async function recover() {
        try {
            await sdkForConsole.account.createRecovery(email, window.location.toString());
            addNotification({
                type: 'success',
                message: 'We have sent you an email with a password reset link'
            });
            trackEvent('submit_account_recover');
        } catch (error) {
            addNotification({
                type: 'error',
                message: error.message
            });
        }
    }

    async function setPassword() {
        try {
            await sdkForConsole.account.updateRecovery(userId, secret, password, confirmPassword);
            await goto(`${base}/login`);
            addNotification({
                type: 'success',
                message: 'Password has been updated successfully'
            });
        } catch (error) {
            addNotification({
                type: 'error',
                message: error.message
            });
        }
    }
</script>

<svelte:head>
    <title>Recover - Appwrite</title>
</svelte:head>

<Unauthenticated>
    <svelte:fragment slot="title">Password Recovery</svelte:fragment>
    <svelte:fragment>
        {#if userId && secret}
            <Form on:submit={setPassword}>
                <FormList>
                    <InputPassword
                        label="New password"
                        placeholder="Enter password"
                        id="password"
                        autofocus={true}
                        required={true}
                        showPasswordButton={true}
                        bind:value={password} />
                    <InputPassword
                        label="Confirm password"
                        placeholder="Confirm password"
                        id="confirm-password"
                        required={true}
                        showPasswordButton={true}
                        bind:value={confirmPassword} />

                    <FormItem>
                        <Button fullWidth submit>Update</Button>
                    </FormItem>
                </FormList>
            </Form>
        {:else}
            <Form on:submit={recover}>
                <FormList>
                    <InputEmail
                        id="email"
                        label="Email"
                        placeholder="Email"
                        autofocus={true}
                        required={true}
                        bind:value={email} />

                    <FormItem>
                        <Button fullWidth submit>Recover</Button>
                    </FormItem>
                </FormList>
            </Form>
        {/if}
    </svelte:fragment>
    <svelte:fragment slot="links">
        <li class="inline-links-item">
            <a href={`${base}/login`}><span class="text">Sign in</span></a>
        </li>
        <li class="inline-links-item">
            <a href={`${base}/register`}><span class="text">Sign Up</span></a>
        </li>
    </svelte:fragment>
</Unauthenticated>
