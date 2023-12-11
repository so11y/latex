<template>
  <Contain :onCanAddChildren="onCanAddChildren" v-slot="{ source }">
    <MoreInput :labels="labels" :source="source" @handle="onActiveFocus" />
  </Contain>
</template>
<script lang="ts" setup>
import { useSingle } from "../use/useSingle"

import MoreInput from "../components/moreInput.vue";
const { labels, onCanAddChildren, onActiveFocus } = useSingle();
</script>


