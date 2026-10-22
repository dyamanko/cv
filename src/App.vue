<script setup lang="ts">
import CasesSection from './components/cases/CasesSection.vue'
import ContactsSection from './components/ContactsSection.vue'
import EducationSection from './components/EducationSection.vue'
import ExperienceSection from './components/experience/ExperienceSection.vue'
import HeroSection from './components/HeroSection.vue'
import SiteHeader from './components/SiteHeader.vue'
import StackSection from './components/StackSection.vue'
import StickyBar from './components/StickyBar.vue'
import { useLang } from './composables/useLang'

const { t } = useLang()
</script>

<template>
  <a class="skip-link" href="#main">{{ t.skip }}</a>
  <SiteHeader />
  <StickyBar />
  <!-- in the order a recruiter's questions come: who, what stack, what was done, where, how to reach -->
  <main id="main" tabindex="-1">
    <HeroSection />
    <StackSection />
    <CasesSection />
    <ExperienceSection />
    <EducationSection />
    <ContactsSection />
  </main>
</template>
