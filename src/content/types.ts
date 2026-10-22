import type { Scenario } from '../components/process/timeline'
import type { GroupId, LensId } from './stack'

export type Lang = 'ru' | 'en'

export interface Contact {
  id: 'telegram' | 'whatsapp' | 'email' | 'linkedin' | 'phone'
  label: string
  value: string
  href: string
  /** phone numbers and emails get a copy button */
  copyable?: boolean
}

export interface Fact {
  label: string
  value: string
}

export type CaseId = 'recovery' | 'events' | 'editor' | 'services'

export interface CaseItem {
  id: CaseId
  title: string
  /** company and context in a few words */
  where: string
  lenses: LensId[]
  task: string
  did: string[]
  result: string
  tags: string[]
}

export interface Job {
  company: string
  role: string
  period: string
  domain: string
  points: string[]
  stack: string
}

export interface Content {
  meta: { title: string; description: string }
  nav: { label: string; stack: string; cases: string; experience: string; contacts: string }
  langSwitch: string
  skip: string
  hero: {
    name: [string, string]
    role: string
    summary: string
    facts: Fact[]
    keyStack: string
    cv: string
    cvRu: string
    cvEn: string
    moreContacts: string
  }
  stack: {
    title: string
    lead: string
    lensLabel: string
    lenses: Record<LensId, string>
    groups: Record<GroupId, string>
    keyLegend: string
    lensLegend: string
    practices: string
    architecture: { label: string; text: string }
    learning: { label: string; text: string }
  }
  cases: {
    title: string
    lead: string
    labels: { task: string; did: string; result: string; forRole: string; order: string; change: string }
    items: CaseItem[]
    recovery: { scenarioLabel: string; scenarios: Record<Scenario, string>; caption: string; mechanism: string }
    events: {
      flowLabel: string
      flows: { id: 'notify' | 'courier' | 'search' | 'idea'; label: string; caption: string }[]
      core: string
      nodes: Record<'kafka' | 'push' | 'courier' | 'idea' | 'redis' | 'postgres', { name: string; note: string }>
    }
    editor: {
      versionLabel: string
      roleLabel: string
      roles: { edit: string; view: string }
      versions: string
      published: string
      draft: string
      publish: string
      readOnly: string
      caption: string
    }
    services: {
      viewLabel: string
      views: { before: string; after: string }
      monolith: string
      modules: string[]
      oneC: string
      ci: string
      caption: string
    }
    incidents: {
      failed: string
      queue: string
      scheduler: string
      known: string
      retry: string
      limit: string
      admin: string
      yes: string
      no: string
    }
    more: { title: string; items: { title: string; text: string; metric?: string }[] }
  }
  process: {
    label: string
    start: string
    approval: string
    gateway: string
    yes: string
    no: string
    rejected: string
    service: string
    fulfil: string
    end: string
    incident: string
    retry: string
    resolved: string
    escalated: string
    limit: string
  }
  experience: {
    title: string
    lead: string
    work: string
    study: string
    now: string
    jobs: Job[]
    degrees: { year: number; label: string }[]
  }
  education: {
    title: string
    degrees: { title: string; place: string; year: string }[]
    languagesTitle: string
    languages: { name: string; level: string }[]
  }
  contacts: {
    title: string
    lead: string
    items: Contact[]
    terms: Fact[]
    copy: string
    copied: string
    vcard: string
    cvTitle: string
  }
  footer: { updated: string }
}
