export interface IconDemoMeta {
  displayName: string;
  tagline: string;
  personalNote: string;
  accentColor: string;
  yearsUsed: number;
}

export const iconDemos: Record<string, IconDemoMeta> = {
  react: {
    displayName: "React",
    tagline: "My primary weapon of choice since 2019.",
    personalNote: "I think in components. My brain has literally started rendering suspense boundaries.",
    accentColor: "#61dafb",
    yearsUsed: 6,
  },
  typescript: {
    displayName: "TypeScript",
    tagline: "Because `any` is a cry for help.",
    personalNote: "The moment TypeScript caught a prod bug at build time, I never looked back.",
    accentColor: "#3178c6",
    yearsUsed: 5,
  },
  "node-js": {
    displayName: "Node.js",
    tagline: "JavaScript, but it runs on a server and somehow that's fine.",
    personalNote: "Built my first REST API with Node in 2018. It had exactly zero error handling.",
    accentColor: "#68a063",
    yearsUsed: 7,
  },
  tailwindcss: {
    displayName: "Tailwind CSS",
    tagline: "Utility-first. Design-system-always.",
    personalNote: "Once you go Tailwind you can't go back. I tried. I went back.",
    accentColor: "#38bdf8",
    yearsUsed: 4,
  },
  javascript: {
    displayName: "JavaScript",
    tagline: "The language that started it all. Still does.",
    personalNote: "Wrote my first JS in a <script> tag in an HTML file circa 2016. No regrets. Some regrets.",
    accentColor: "#f7df1e",
    yearsUsed: 9,
  },
  sass: {
    displayName: "Sass",
    tagline: "CSS, but with superpowers and nested regrets.",
    personalNote: "Deep in enterprise Sass work — mixins, functions, complex theming. I know my way around a map and a loop.",
    accentColor: "#cc6699",
    yearsUsed: 8,
  },
  angular: {
    displayName: "Angular",
    tagline: "Enterprise front-end at scale.",
    personalNote: "My original front-end framework. Angular taught me about modules, dependency injection, foundation for all the others. Still love it and think the opinionatedness allows easier collaboration when joining teams.",
    accentColor: "#dd0031",
    yearsUsed: 4,
  },
  mongodb: {
    displayName: "MongoDB",
    tagline: "Flexible schemas for flexible problems.",
    personalNote: "Great for prototyping. My schema design has improved significantly since 2018.",
    accentColor: "#47a248",
    yearsUsed: 5,
  },
  express: {
    displayName: "Express",
    tagline: "Unopinionated. Dangerously so.",
    personalNote: "Built many an API layer with Express. Always start with middleware.",
    accentColor: "#ffffff",
    yearsUsed: 6,
  },
  figma: {
    displayName: "Figma",
    tagline: "Where design meets developer handoff.",
    personalNote: "I live in Figma. I've pixel-pushed UIs from Figma specs more times than I can count.",
    accentColor: "#f24e1e",
    yearsUsed: 5,
  },
  firebase: {
    displayName: "Firebase",
    tagline: "Real-time everything, Googled by Google.",
    personalNote: "Used Firebase for rapid-prototype auth and real-time sync. The free tier is very generous.",
    accentColor: "#ffca28",
    yearsUsed: 4,
  },
  github: {
    displayName: "GitHub",
    tagline: "Where code lives and pull requests are judged.",
    personalNote: "My contribution graph is my actual diary. You can tell exactly when I got into a side project.",
    accentColor: "#ffffff",
    yearsUsed: 8,
  },
  gitlab: {
    displayName: "GitLab",
    tagline: "CI/CD pipelines in enterprise land.",
    personalNote: "My iGaming work lived entirely in GitLab. Multi-stage pipelines, Docker, the whole thing.",
    accentColor: "#fc6d26",
    yearsUsed: 4,
  },
  jest: {
    displayName: "Jest",
    tagline: "Test everything. Except documentation.",
    personalNote: "Jest is how I sleep at night. The test suite is my safety net.",
    accentColor: "#c21325",
    yearsUsed: 5,
  },
  cypress: {
    displayName: "Cypress",
    tagline: "End-to-end: from button click to database write.",
    personalNote: "Cypress E2E tests on booking flows saved us from at least 3 production disasters.",
    accentColor: "#17202c",
    yearsUsed: 3,
  },
  jira: {
    displayName: "Jira",
    tagline: "Sprint planning in ticket form.",
    personalNote: "I've lived in Jira across multiple teams. My tickets are well-written and have acceptance criteria.",
    accentColor: "#0052cc",
    yearsUsed: 6,
  },
  postman: {
    displayName: "Postman",
    tagline: "API explorer, documenter, and life-saver.",
    personalNote: "Every API I've built has a Postman collection. It's non-negotiable.",
    accentColor: "#ef5b25",
    yearsUsed: 6,
  },
  puppeteer: {
    displayName: "Puppeteer",
    tagline: "Headless Chrome as a weapon.",
    personalNote: "Used Puppeteer for scraping and server-side PDF generation. Headless browsers are wild.",
    accentColor: "#00d8a2",
    yearsUsed: 3,
  },
  rxjs: {
    displayName: "RxJS",
    tagline: "Reactive streams for complex async brains.",
    personalNote: "RxJS in Angular was humbling. The marble diagrams make sense now. It took a while.",
    accentColor: "#b7178c",
    yearsUsed: 3,
  },
  storybook: {
    displayName: "Storybook",
    tagline: "Component-first development, visually.",
    personalNote: "Storybook changed how I think about components — isolated, documented, always shippable.",
    accentColor: "#ff4785",
    yearsUsed: 4,
  },
  stencil: {
    displayName: "StencilJS",
    tagline: "Web components that work everywhere.",
    personalNote: "Used StencilJS to build framework-agnostic component libraries. The future is web standards.",
    accentColor: "#4c50bf",
    yearsUsed: 2,
  },
  rust: {
    displayName: "Rust",
    tagline: "Systems programming with no garbage collector and no mercy.",
    personalNote: "Learning Rust to write WebAssembly modules. The borrow checker is a tough teacher.",
    accentColor: "#ce4a00",
    yearsUsed: 1,
  },
};
