<script>
  export let errors;

  $: errorKeys = errors && Object.keys(errors);
</script>

{#if errors}
  <ul class="error-messages">
    {#each errorKeys as errorKey (errorKey)}
      {#each errors[errorKey] as errorMessage}
        <li>{errorKey} {errorMessage}</li>
      {/each}
    {/each}
  </ul>
{/if}
