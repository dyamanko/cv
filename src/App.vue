<script setup lang="ts">
import CasesSection from './components/cases/CasesSection.vue'
import ExperienceSection from './components/experience/ExperienceSection.vue'
import FormatSection from './components/format/FormatSection.vue'
import HeroSection from './components/HeroSection.vue'
import SiteHeader from './components/SiteHeader.vue'
import StackSection from './components/StackSection.vue'
</script>

<template>
  <SiteHeader />
  <main>
    <HeroSection />
    <CasesSection />
    <ExperienceSection />
    <StackSection />
    <FormatSection />
  </main>
</template>
