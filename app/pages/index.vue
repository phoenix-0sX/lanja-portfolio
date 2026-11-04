<script setup lang="ts">
// Same key for every language so switching EN/FR keeps the page mounted
// (open "Show details" panels are preserved), and no jump to the top on switch.
definePageMeta({ key: 'home', scrollToTop: false })
</script>

<template>
  <div>
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ExperienceSection />
    <ProjectsSection />
    <ContactSection />
  </div>
</template>
