<script lang="ts">
  let count = $state(0);
</script>

<button id="dec" type="button" onclick={() => count--}>-</button>
<output id="count">{count}</output>
<button id="inc" type="button" onclick={() => count++}>+</button>
