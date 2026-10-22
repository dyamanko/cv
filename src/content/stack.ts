/*
  Technologies from the resume, the same in both languages.
  `key` marks the core stack: it is highlighted and repeated on the first screen.
  `lenses` says which target role the item matters for.
*/
export type LensId = 'backend' | 'bpm' | 'fullstack'
export type GroupId = 'backend' | 'bpm' | 'data' | 'infra' | 'frontend'

export interface Tech {
  name: string
  /** file name in src/assets/icons, without .svg; no icon falls back to a monogram */
  icon?: string
  group: GroupId
  key?: boolean
  lenses: LensId[]
}

export const LENSES: LensId[] = ['backend', 'bpm', 'fullstack']
export const GROUPS: GroupId[] = ['backend', 'bpm', 'data', 'infra', 'frontend']

const ALL: LensId[] = ['backend', 'bpm', 'fullstack']

export const STACK: Tech[] = [
  { name: 'Java 8–21', icon: 'java', group: 'backend', key: true, lenses: ALL },
  { name: 'Spring Boot 3', icon: 'springboot', group: 'backend', key: true, lenses: ALL },
  { name: 'Spring Security', icon: 'springsecurity', group: 'backend', lenses: ['backend', 'fullstack'] },
  { name: 'Spring Data JPA', icon: 'spring', group: 'backend', lenses: ['backend', 'fullstack'] },
  { name: 'Hibernate', icon: 'hibernate', group: 'backend', lenses: ['backend'] },
  { name: 'Apache Kafka', icon: 'apachekafka', group: 'backend', key: true, lenses: ['backend'] },
  { name: 'REST, OpenAPI', icon: 'swagger', group: 'backend', lenses: ALL },
  { name: 'JUnit, Mockito', icon: 'junit5', group: 'backend', lenses: ['backend'] },
  { name: 'Spring Boot Test', group: 'backend', lenses: ['backend'] },
  { name: 'MapStruct', group: 'backend', lenses: ['backend'] },
  { name: 'ShedLock', group: 'backend', lenses: ['backend', 'bpm'] },

  { name: 'Camunda 7', icon: 'camunda', group: 'bpm', key: true, lenses: ['backend', 'bpm'] },
  { name: 'BPMN', group: 'bpm', lenses: ['bpm'] },
  { name: 'Groovy', icon: 'apachegroovy', group: 'bpm', lenses: ['bpm'] },
  { name: 'JUEL', group: 'bpm', lenses: ['bpm'] },
  { name: 'bpmn-js', group: 'bpm', lenses: ['bpm', 'fullstack'] },
  { name: 'Dify, LLM', icon: 'dify', group: 'bpm', lenses: ['bpm'] },
  { name: 'Python', icon: 'python', group: 'bpm', lenses: ['bpm'] },

  { name: 'PostgreSQL', icon: 'postgresql', group: 'data', key: true, lenses: ALL },
  { name: 'Redis', icon: 'redis', group: 'data', lenses: ['backend'] },
  { name: 'Liquibase', icon: 'liquibase', group: 'data', lenses: ['backend', 'fullstack'] },
  { name: 'XML, XSD, JAXB', icon: 'xml', group: 'data', lenses: ['backend', 'bpm'] },

  { name: 'Docker', icon: 'docker', group: 'infra', lenses: ALL },
  { name: 'Portainer', icon: 'portainer', group: 'infra', lenses: ['backend'] },
  { name: 'TeamCity', icon: 'teamcity', group: 'infra', lenses: ['backend', 'fullstack'] },
  { name: 'GitLab CI', icon: 'gitlab', group: 'infra', lenses: ['backend', 'fullstack'] },
  { name: 'Nexus', icon: 'sonatype', group: 'infra', lenses: ['backend'] },
  { name: 'Maven', icon: 'apachemaven', group: 'infra', lenses: ['backend'] },
  { name: 'Git', icon: 'git', group: 'infra', lenses: ALL },

  { name: 'Vue.js 3 / 2', icon: 'vuedotjs', group: 'frontend', key: true, lenses: ['fullstack'] },
  { name: 'Vuex', group: 'frontend', lenses: ['fullstack'] },
  { name: 'Element UI', group: 'frontend', lenses: ['fullstack'] },
  { name: 'JavaScript', icon: 'javascript', group: 'frontend', lenses: ['fullstack'] },
]

/** practices and tools shown as one line under the grid */
export const PRACTICES = [
  { name: 'Scrum' },
  { name: 'Jira', icon: 'jira' },
  { name: 'Confluence', icon: 'confluence' },
  { name: 'Claude Code', icon: 'claude' },
]

export const KEY_STACK = STACK.filter((t) => t.key)
