<script lang="ts">
    import { WizardStep } from '$lib/layout';
    import { createFunction } from './store';
    import Create from '../createVariable.svelte';
    import { DropList, DropListItem, Secret, Empty } from '$lib/components';
    import type { Models } from '@aw-labs/appwrite-console';
    import {
        Table,
        TableBody,
        TableCell,
        TableCellHead,
        TableCellText,
        TableHeader,
        TableRow
    } from '$lib/elements/table';
    import { Button } from '$lib/elements/forms';

    let showCreate = false;

    let selectedVar: Partial<Models.Variable> = null;
    let showDropdown = [];

    function handleCreated(dispatchEvent: CustomEvent) {
        createFunction.update((n) => {
            if (n.vars.length) {
                n.vars.map((v) => {
                    if (v.key !== dispatchEvent.detail.key) {
                        n.vars.push(dispatchEvent.detail);
                    }
                });
            } else {
                n.vars.push(dispatchEvent.detail);
            }

            return n;
        });
    }
    function handleUpdated(dispatchEvent: CustomEvent) {
        createFunction.update((n) => {
            n.vars = n.vars.map((v) => (v.key === selectedVar.key ? dispatchEvent.detail : v));
            return n;
        });
    }
</script>

<WizardStep>
    <svelte:fragment slot="title">Variables</svelte:fragment>
    <svelte:fragment slot="subtitle">
        Create a variable (or secret key) that will be passed to your function at runtime.
    </svelte:fragment>
    {#if $createFunction.vars.length}
        <Table noStyles>
            <TableHeader>
                <TableCellHead>Key</TableCellHead>
                <TableCellHead>Value</TableCellHead>
                <TableCellHead width={30} />
            </TableHeader>

            <TableBody>
                {#each $createFunction.vars as variable, i}
                    <TableRow>
                        <TableCellText title="key">
                            {variable.key}
                        </TableCellText>
                        <TableCell showOverflow title="value">
                            <Secret value={variable.value} />
                        </TableCell>
                        <TableCell showOverflow title="options">
                            <DropList bind:show={showDropdown[i]} placement="bottom-start" noArrow>
                                <button
                                    class="button is-text is-only-icon"
                                    aria-label="more options"
                                    on:click|preventDefault={() =>
                                        (showDropdown[i] = !showDropdown[i])}>
                                    <span class="icon-dots-horizontal" aria-hidden="true" />
                                </button>
                                <svelte:fragment slot="list">
                                    <DropListItem
                                        icon="pencil"
                                        on:click={() => {
                                            selectedVar = $createFunction.vars[i];
                                            showDropdown[i] = false;
                                            showCreate = true;
                                        }}>
                                        Edit
                                    </DropListItem>
                                    <DropListItem
                                        icon="trash"
                                        on:click={() => {
                                            $createFunction.vars.splice(i, 1);
                                            $createFunction = $createFunction;
                                            showDropdown[i] = false;
                                        }}>
                                        Delete
                                    </DropListItem>
                                </svelte:fragment>
                            </DropList>
                        </TableCell>
                    </TableRow>
                {/each}
            </TableBody>
        </Table>
        <div class="u-flex u-margin-block-start-16">
            <Button text noMargin on:click={() => (showCreate = !showCreate)}>
                <span class="icon-plus" aria-hidden="true" />
                <span class="u-text">Create variable</span>
            </Button>
        </div>
    {:else}
        <Empty on:click={() => (showCreate = !showCreate)}>Create a variable to get started</Empty>
    {/if}
</WizardStep>

{#if showCreate}
    <Create
        bind:selectedVar
        bind:showCreate
        on:created={handleCreated}
        on:updated={handleUpdated} />
{/if}
