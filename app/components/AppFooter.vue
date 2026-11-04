<script setup lang="ts">
const { t } = useI18n()
const portfolio = usePortfolio()
const contact = computed(() => portfolio.value.contact)
const meta = computed(() => portfolio.value.meta)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line bg-card/60">
    <div class="container-page py-8">
      <ul class="flex flex-col items-start gap-3 text-sm font-medium text-ink sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8">
        <li>
          <a :href="`mailto:${contact.email}`" class="inline-flex items-center gap-2 hover:text-brand">
            <Icon name="lucide:mail" class="size-5 text-accent" /> {{ contact.email }}
          </a>
        </li>
        <li>
          <a :href="`tel:${contact.phone}`" class="inline-flex items-center gap-2 hover:text-brand">
            <Icon name="lucide:phone" class="size-5 text-accent" /> {{ contact.phoneDisplay }}
          </a>
        </li>
        <li class="inline-flex items-center gap-2">
          <Icon name="lucide:map-pin" class="size-5 text-accent" /> {{ contact.location }}
        </li>
      </ul>

      <div class="mt-5 flex flex-col items-center gap-4">
        <SocialLinks :links="contact.socialLinks" />
        <p class="text-xs text-soft">{{ t('footer.rights', { year, name: meta.fullName }) }}</p>
      </div>
    </div>
  </footer>
</template>
