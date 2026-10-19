import type { Content } from './types'

export const en: Content = {
  meta: {
    title: 'Dmitrii Iamanko, Senior Java Backend Developer',
    description:
      'Java backend developer working with Spring Boot and Camunda. 6+ years of commercial experience, three years on the Service Desk portal of a large bank. Open to remote roles.',
  },
  nav: {
    label: 'Sections',
    cases: 'Projects',
    experience: 'Experience',
    stack: 'Stack',
    format: 'Terms',
    contacts: 'Contact',
  },
  langSwitch: 'Site language',
  hero: {
    name: ['Dmitrii', 'Iamanko'],
    role: 'Senior Java Backend Developer',
    pitch:
      'I build backends for business processes with Java, Spring Boot and Camunda. For three years I have been developing the Service Desk portal of a large bank, used by every one of its employees. I take features from requirements to production, on the backend and the frontend.',
    status: 'Open to remote, full-time roles',
    location: 'Tbilisi, UTC+4',
    telegram: 'Message me on Telegram',
    resume: 'Resume as PDF',
  },
  process: {
    label: 'BPMN diagram: how a request moves through the portal from creation to completion',
    caption:
      'This is how a request moves through a process in the portal. I built the executed-path highlighting and the automatic retry of failed jobs.',
    replay: 'Run again',
    start: 'Request created',
    approval: 'Approval',
    gateway: 'Approved?',
    yes: 'yes',
    no: 'no',
    rejected: 'Rejected',
    service: 'Call external system',
    fulfil: 'Fulfilment',
    end: 'Done',
    incident: 'Incident: timeout',
    retry: 'Auto retry, attempt 2',
    resolved: 'Retry succeeded',
    steps: [
      {
        title: 'Approval',
        text: 'Several approvers work in parallel: multi-instance, timers and listeners in Camunda 7.',
      },
      {
        title: 'Routing',
        text: 'I write transition conditions and process scripts in JUEL and Groovy.',
      },
      {
        title: 'External system',
        text: 'When a call fails, the incident subsystem retries it by error pattern and keeps it out of a loop.',
      },
      {
        title: 'Fulfilment',
        text: 'The assignee works in a form made with the dynamic form builder in Vue.',
      },
    ],
  },
  cases: {
    title: 'What I built in the portal',
    intro:
      'The bank’s Service Desk: service catalog, requests with approval and fulfilment through BPM processes, incidents, reporting. A team of 20+ people, 5+ of them developers.',
    items: [
      {
        id: 'editor',
        title: 'A BPMN editor inside the portal',
        text: 'I designed and built a process editor on bpmn-js and Camunda 7, from requirements to production, on the frontend and the backend. People view and edit diagrams in it and see how a request is progressing. Access depends on the role, and every diagram keeps its version and publication history.',
        tags: ['bpmn-js', 'Camunda 7', 'Vue 2', 'Spring Boot'],
      },
      {
        id: 'incidents',
        title: 'Automatic retry of failed jobs',
        text: 'I built the Camunda incident subsystem. Failed jobs go to a queue in the database, a ShedLock scheduler retries them by error pattern, and loop protection stops endless retries. Admins see the incident history and troubleshooting guides.',
        tags: ['Camunda 7', 'ShedLock', 'PostgreSQL'],
      },
      {
        id: 'pipeline',
        title: 'From a service description to a process in a couple of hours',
        text: 'I built a Dify pipeline that reads a service description document and generates Camunda 7 BPMN. A static analyzer and an LLM audit check the diagram, and the output is a report for review. A second pipeline moves form field specifications from Confluence into the portal’s XML forms.',
        tags: ['Dify', 'Python', 'Prompt engineering', 'Camunda 7'],
      },
      {
        id: 'integrations',
        title: 'Integrations and speed',
        text: 'Notifications through Kafka and push. A courier service API: cost calculation, tracking and scheduled status updates. REST integrations with the Idea Platform low-code system. Redis caching and request search on native SQL with indexes. Build and delivery through TeamCity, GitLab CI and Nexus.',
        tags: ['Kafka', 'Redis', 'PostgreSQL', 'REST'],
      },
    ],
    editor: {
      versions: 'Versions',
      published: 'published',
      draft: 'draft',
      role: 'Role: process admin',
      tools: 'Element palette',
    },
    incidents: {
      failed: 'Job failed',
      queue: 'Queue in DB',
      scheduler: 'ShedLock scheduler',
      known: 'Known error?',
      retry: 'Retry',
      limit: 'retry limit',
      admin: 'Incident to admin',
      yes: 'yes',
      no: 'no',
    },
    pipeline: {
      steps: ['Service description, .docx', 'LLM drafts BPMN', 'Static analysis', 'LLM audit', 'Review report'],
    },
    chart: {
      title: 'Designing one process, hours',
      manual: 'By hand',
      automated: 'With the pipeline',
      generation: 'generation, ~10 min',
      refinement: 'refinement, ~2 h',
      hours: 'h',
      note: 'A working day counts as 8 hours, so 1–2 days is 8–16 hours.',
      tableCaption: 'Time to design one process',
      colStage: 'Approach',
      colTime: 'Time',
    },
    integrations: {
      core: 'Portal',
      nodes: ['Kafka: notifications', 'Push', 'Courier service', 'Idea Platform', 'Redis: cache', 'PostgreSQL: search'],
    },
  },
  experience: {
    title: 'Experience',
    lead: 'In commercial development since August 2020, which makes {tenure}.',
    work: 'Work',
    study: 'Study',
    now: 'now',
    jobs: [
      {
        company: 'IT_One',
        role: 'Java Developer (full-stack)',
        period: 'Nov 2023 — present',
        project: 'Service Desk portal of a large bank',
        facts: [
          { value: '190+', label: 'tasks' },
          { value: '770+', label: 'commits' },
          { value: '~140', label: 'Liquibase migrations' },
        ],
        points: [
          'I deliver features from requirements to production: Spring Boot on the backend, Vue 2 and Vuex on the frontend (dynamic form builder, admin console, incident pages).',
          'Built the BPMN process editor and the Camunda incident subsystem, automated process design with LLMs.',
          'Kafka and REST integrations, Redis caching, request search optimization, builds in TeamCity and GitLab CI.',
        ],
        stack: 'Java 21, Spring Boot 3.5, Camunda 7, PostgreSQL, Liquibase, Kafka, Redis, Docker, Vue 2, bpmn-js, Dify, Python',
      },
      {
        company: 'Astelit',
        role: 'Software Engineer (Java Backend)',
        period: 'Aug 2020 — Sep 2023',
        points: [
          'Built Spring Boot backends for three projects across the full lifecycle: an electronic document management system, a Telegram bot and a retail mobile app.',
          'Took part in splitting a monolith into microservices: notifications, data sync with external systems, bots. Designed REST APIs between services and integrated with 1C.',
          'Set up CI/CD on my own: build and test pipelines for backend and frontend, artifacts in Nexus, Docker images, docker-compose and Portainer.',
          'Designed PostgreSQL schemas and optimized queries, ran Liquibase migrations, implemented LDAP authentication, wrote tests with JUnit and Mockito.',
        ],
        stack: 'Java, Spring Boot, PostgreSQL, Liquibase, Redis, LDAP, Docker, Portainer, Nexus, JUnit, Mockito',
      },
    ],
    degrees: [
      { year: 2021, label: 'B.Sc., Donetsk National University' },
      { year: 2024, label: 'M.Sc., ITMO University' },
    ],
  },
  stack: {
    title: 'Stack',
    lead: 'The layers of the system I work with every day, from the interface down to delivery.',
    layers: [
      { name: 'Interface', items: ['Vue 2', 'Vuex', 'Element UI', 'bpmn-js', 'JavaScript'] },
      { name: 'API and logic', items: ['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'Hibernate', 'MapStruct', 'OpenAPI', 'LDAP'] },
      { name: 'Processes', items: ['Camunda 7', 'BPMN', 'Groovy', 'JUEL', 'timers', 'multi-instance', 'listeners'] },
      { name: 'Integration', items: ['Kafka', 'REST', '1C', 'XML and XSD', 'JAXB'] },
      { name: 'Data', items: ['PostgreSQL', 'Liquibase', 'Redis', 'ShedLock'] },
      { name: 'Build and delivery', items: ['Docker', 'TeamCity', 'GitLab CI', 'Nexus', 'Maven', 'Gradle'] },
    ],
    across: [
      { name: 'Testing', items: ['JUnit', 'Mockito', 'Spring Boot Test'] },
      { name: 'AI and LLM', items: ['Dify', 'Python', 'Prompt engineering', 'Claude Code'] },
      { name: 'Reporting', items: ['JasperReports', 'Apache POI', 'DOCX'] },
    ],
  },
  format: {
    title: 'How I work',
    terms: [
      { label: 'Format', value: 'Remote, full-time' },
      { label: 'Contract', value: 'B2B, ready to register as a Georgian individual entrepreneur. EOR works too.' },
      { label: 'Location', value: 'Tbilisi, UTC+4. Russian citizen.' },
    ],
    zones: {
      title: 'Shared hours with your team',
      note: 'A 9:00–18:00 working day in local time. The scale is Tbilisi time.',
      cities: [
        { name: 'Moscow', tz: 'Europe/Moscow' },
        { name: 'Limassol', tz: 'Asia/Nicosia' },
        { name: 'Berlin', tz: 'Europe/Berlin' },
        { name: 'London', tz: 'Europe/London' },
      ],
      self: 'Tbilisi, my day',
      overlap: '{h} h shared',
      nowIn: 'It is {time} in Tbilisi now',
    },
  },
  education: {
    title: 'Education',
    degrees: [
      {
        title: 'M.Sc. in Software Engineering, Web Technologies program',
        place: 'ITMO University, Saint Petersburg. Apostilled diploma.',
        year: '2024',
      },
      {
        title: 'B.Sc. in Informatics and Computer Engineering',
        place: 'Donetsk National University',
        year: '2021',
      },
    ],
    languagesTitle: 'Languages',
    languages: [
      { name: 'Russian', level: 'native', cefr: 0 },
      { name: 'English', level: 'B2, Upper-Intermediate', cefr: 4 },
    ],
  },
  contacts: {
    title: 'Get in touch',
    lead: 'Open to a full-time remote role. Tell me about the work and let’s set up a call.',
    items: [
      { id: 'telegram', label: 'Telegram', value: '@dyamanko', href: 'https://t.me/dyamanko' },
      { id: 'whatsapp', label: 'WhatsApp', value: '+995 595 301 353', href: 'https://wa.me/995595301353', copyable: true },
      { id: 'phone', label: 'Phone', value: '+7 909 439-16-23', href: 'tel:+79094391623', copyable: true },
      { id: 'email', label: 'Email', value: 'iamankodmitrii@gmail.com', href: 'mailto:iamankodmitrii@gmail.com', copyable: true },
      { id: 'email-alt', label: 'Email', value: 'yamankodmitry@gmail.com', href: 'mailto:yamankodmitry@gmail.com', copyable: true },
    ],
    copy: 'Copy',
    copied: 'Copied',
    resumeTitle: 'Resume as PDF',
    resumeRu: 'На русском',
    resumeEn: 'In English',
  },
  footer: {
    built: 'Built with Vue 3 and Vite.',
    source: 'Source on GitHub',
    updated: 'Updated October 2026',
  },
}
