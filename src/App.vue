<script setup lang="ts">
import CasesSection from './components/cases/CasesSection.vue'
import ExperienceSection from './components/experience/ExperienceSection.vue'
import HeroSection from './components/HeroSection.vue'
import SiteHeader from './components/SiteHeader.vue'
</script>

<template>
  <SiteHeader />
  <main>
    <HeroSection />
    <CasesSection />
    <ExperienceSection />
  </main>
</template>
