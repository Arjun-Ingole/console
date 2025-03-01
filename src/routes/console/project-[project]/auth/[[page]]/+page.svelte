<script lang="ts">
    import { page } from '$app/stores';
    import {
        Empty,
        EmptySearch,
        Pagination,
        Copy,
        SearchQuery,
        AvatarInitials
    } from '$lib/components';
    import { Button } from '$lib/elements/forms';
    import {
        Table,
        TableHeader,
        TableBody,
        TableCellHead,
        TableCell,
        TableCellText,
        TableRowLink
    } from '$lib/elements/table';
    import { Pill } from '$lib/elements';
    import { toLocaleDateTime } from '$lib/helpers/date';
    import { Container } from '$lib/layout';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import { PAGE_LIMIT } from '$lib/constants';
    import Create from '../createUser.svelte';
    import type { Models } from '@aw-labs/appwrite-console';
    import type { PageData } from './$types';

    export let data: PageData;

    let showCreate = false;
    const projectId = $page.params.project;
    const userCreated = async (event: CustomEvent<Models.User<Record<string, unknown>>>) => {
        await goto(`${base}/console/project-${projectId}/auth/user-${event.detail.$id}`);
    };
</script>

<Container>
    <SearchQuery search={data.search} placeholder="Search by name, email, phone, or ID">
        <Button on:click={() => (showCreate = true)} event="create_user">
            <span class="icon-plus" aria-hidden="true" /> <span class="text">Create user</span>
        </Button>
    </SearchQuery>
    {#if data.users.total}
        <Table>
            <TableHeader>
                <TableCellHead>Name</TableCellHead>
                <TableCellHead>Identifiers</TableCellHead>
                <TableCellHead width={130}>Status</TableCellHead>
                <TableCellHead width={100}>ID</TableCellHead>
                <TableCellHead>Joined</TableCellHead>
            </TableHeader>
            <TableBody>
                {#each data.users.users as user}
                    <TableRowLink
                        href={`${base}/console/project-${projectId}/auth/user-${user.$id}`}>
                        <TableCell title="Name">
                            <div class="u-flex u-gap-12 u-cross-center">
                                {#if user.email || user.phone}
                                    {#if user.name}
                                        <AvatarInitials size={32} name={user.name} />
                                        <span class="text u-trim">{user.name}</span>
                                    {:else}
                                        <div class="avatar is-size-small ">
                                            <span class="icon-minus-sm" aria-hidden="true" />
                                        </div>
                                    {/if}
                                {:else}
                                    <div class="avatar is-size-small ">
                                        <span class="icon-anonymous" aria-hidden="true" />
                                    </div>
                                    <span class="text u-trim">{user.name}</span>
                                {/if}
                            </div>
                        </TableCell>
                        <TableCellText title="Identifiers">
                            {user.email && user.phone
                                ? [user.email, user.phone].join(',')
                                : user.email || user.phone}
                        </TableCellText>
                        <TableCell title="Status">
                            {#if user.status}
                                <Pill success={user.emailVerification || user.phoneVerification}>
                                    {user.emailVerification && user.phoneVerification
                                        ? 'verified'
                                        : user.emailVerification
                                        ? 'verified email'
                                        : user.phoneVerification
                                        ? 'verified phone'
                                        : 'unverified'}
                                </Pill>
                            {:else}
                                <Pill danger>blocked</Pill>
                            {/if}
                        </TableCell>
                        <TableCell showOverflow title="ID">
                            <Copy value={user.$id} event="user">
                                <Pill button>
                                    <span class="icon-duplicate" aria-hidden="true" />
                                    <span class="text">User ID</span>
                                </Pill>
                            </Copy>
                        </TableCell>
                        <TableCellText title="Joined">
                            {toLocaleDateTime(user.registration)}
                        </TableCellText>
                    </TableRowLink>
                {/each}
            </TableBody>
        </Table>
        <div class="u-flex u-margin-block-start-32 u-main-space-between">
            <p class="text">Total results: {data.users.total}</p>
            <Pagination
                offset={data.offset}
                limit={PAGE_LIMIT}
                sum={data.users.total}
                path={`/console/project-${projectId}/auth`} />
        </div>
    {:else if data.search}
        <EmptySearch>
            <div class="u-text-center">
                <b>Sorry, we couldn't find '{data.search}'</b>
                <p>There are no users that match your search.</p>
            </div>
            <Button href={`/console/project-${projectId}/auth`} secondary>Clear Search</Button>
        </EmptySearch>
    {:else}
        <Empty
            single
            href="https://appwrite.io/docs/server/users"
            target="user"
            on:click={() => (showCreate = true)} />
    {/if}
</Container>

<Create bind:showCreate on:created={userCreated} />
