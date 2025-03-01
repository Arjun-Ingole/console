import { derived } from 'svelte/store';
import { page } from '$app/stores';
import type { Models } from '@aw-labs/appwrite-console';

export const webhook = derived(page, ($page) => $page.data.webhook as Models.Webhook);
