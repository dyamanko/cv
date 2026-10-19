export type Lang = 'ru' | 'en'

export interface Contact {
  id: 'telegram' | 'whatsapp' | 'phone' | 'email' | 'email-alt'
  label: string
  value: string
  href: string
  /** phone numbers and emails get a copy button */
  copyable?: boolean
}

export interface Fact {
  value: string
  label: string
}

export interface CaseItem {
  id: 'editor' | 'incidents' | 'pipeline' | 'integrations'
  title: string
  text: string
  tags: string[]
}

export interface Job {
  company: string
  role: string
  period: string
  project?: string
  facts?: Fact[]
  points: string[]
  stack: string
}

export interface StackLayer {
  name: string
  items: string[]
}

export interface Content {
  meta: { title: string; description: string }
  nav: { label: string; cases: string; experience: string; stack: string; format: string; contacts: string }
  langSwitch: string
  hero: {
    name: [string, string]
    role: string
    pitch: string
    status: string
    location: string
    telegram: string
    resume: string
  }
  process: {
    label: string
    caption: string
    replay: string
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
    steps: { title: string; text: string }[]
  }
  cases: {
    title: string
    intro: string
    items: CaseItem[]
    editor: { versions: string; published: string; draft: string; role: string; tools: string }
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
    pipeline: { steps: string[] }
    chart: {
      title: string
      manual: string
      automated: string
      generation: string
      refinement: string
      manualValue: string
      automatedValue: string
      generationValue: string
      refinementValue: string
      manualHint: string
      note: string
      tableCaption: string
      colStage: string
      colTime: string
    }
    integrations: { core: string; coreNote: string; nodes: { name: string; note: string }[] }
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
  stack: { title: string; lead: string; layers: StackLayer[]; acrossTitle: string; across: StackLayer[] }
  format: {
    title: string
    terms: Fact[]
    zones: {
      title: string
      note: string
      cities: { name: string; tz: string }[]
      self: string
      shared: string
      overlap: string
      nowIn: string
    }
  }
  education: {
    title: string
    degrees: { title: string; place: string; year: string }[]
    languagesTitle: string
    languages: { name: string; level: string; cefr: number }[]
  }
  contacts: {
    title: string
    lead: string
    items: Contact[]
    copy: string
    copied: string
    resumeTitle: string
    resumeRu: string
    resumeEn: string
  }
  footer: { built: string; source: string; updated: string }
}
