<script lang="ts">
    import { FormItem, Helper } from '.';

    export let label: string;
    export let showLabel = true;
    export let id: string;
    export let group: string;
    export let value: string;
    export let name: string;
    export let required = false;
    export let disabled = false;

    let element: HTMLInputElement;
    let error: string;

    const handleInvalid = (event: Event) => {
        event.preventDefault();

        if (element.validity.valueMissing) {
            error = 'This field is required';
            return;
        }
        error = element.validationMessage;
    };

    $: if (value) {
        error = null;
    }
</script>

<FormItem>
    <div class="input-text-wrapper">
        <input
            {id}
            {name}
            {disabled}
            {required}
            {value}
            type="radio"
            bind:group
            bind:this={element}
            on:invalid={handleInvalid} />
        <label class:u-hide={!showLabel} class="label" for={id}>{label}</label>
    </div>
    {#if error}
        <Helper type="warning">{error}</Helper>
    {/if}
</FormItem>
