<script lang="ts" setup>
const portfolio = usePortfolio();
const intro = computed(() => portfolio.value.hero.intro);
const name = computed(() => portfolio.value.meta.name);
</script>

<template>
  <span>
    {{ intro }}
    <span class="text-accent">{{ name }}</span>
  </span>
</template>
