<template>
  <Contain isFiled :onToString="onToString" />
</template>
<script lang="ts" setup>
import { StoreValue } from "../components/storeContain";

function onToString(v: StoreValue) {
  return v.value.alias;
}
</script>



