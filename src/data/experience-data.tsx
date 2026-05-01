import lighthouseImage from "../assets/about/header-lighthouse.png";
import betsson from "../assets/about/header-betsson.png";
import pokerstars from "../assets/about/header-pokerstars.png";
import roadooImage from "../assets/about/header-roadoo.png";

// TODO: Add Maslo logo image import when available
// import masloImage from "../assets/about/header-maslo.png";

export const experienceData = [
  {
    id: "2",
    name: "Lighthouse",
    title: "Senior Software Engineer",
    projectImage: lighthouseImage, // Imported image module
    link: "https://www.mylighthouse.com/",
    dates: "Feb 2023 – Feb 2025",
    // --- UPDATED: responsibilities is now an array ---
    responsibilities: [
      "Took end-to-end ownership of new feature development, from initial design and API proposals through deployment and post-launch monitoring (2-week sprint cycle).",
      "Engineered predictive pricing and analytics systems supporting over 70,000 hotel customers and 300,000 properties.",
      "Processed and analyzed massive datasets, handling 1.7 Billion daily price change events.",
      "Built interactive dashboards and custom data visualization components for data-driven pricing decisions, integrating historical data, AI-predicted trends, and real-time triggers.",
    ],
    // --- Existing keyFeatures array remains ---
    keyFeatures: [
      "Led the **TypeScript migration** from the legacy codebase, significantly improving type safety, IDE support, and overall code maintainability across the entire monolith.",
      "Architected and implemented the automated **visual regression testing pipeline** using Puppeteer, QUnit, and Mirage, drastically reducing production regressions and enhancing deployment confidence.",
    ],
  },
  {
    id: "3",
    name: "Betsson Group",
    title: "Software Engineer",
    projectImage: betsson,
    link: "https://betssongroup.com/",
    dates: "Oct 2020 – Jan 2023",
    // --- UPDATED: responsibilities is now an array ---
    responsibilities: [
      "Maintained and enhanced a multi-tenant iGaming platform serving 1.38 Million active users across 10+ international brands in regulated markets.",
      "Engineered a centralized time-handling component using Day.js to ensure timezone consistency and regional compliance across the distributed user base.",
    ],
    // --- Existing keyFeatures array remains ---
    keyFeatures: [
      "Optimized Terms & Conditions registration flow through UX refinement and progressive disclosure patterns, resulting in an **8% conversion rate improvement**.",
      "Developed responsible gaming UI compliance modules and white-label affiliate configuration systems meeting complex jurisdictional regulatory requirements.",
      "Contributed to the **Selenium-based UAT testing infrastructure**, establishing test structure, coverage standards, and CI integration.",
    ],
  },
  {
    id: "1",
    name: "Maslo / Roadoo Network",
    title: "Lead Frontend Developer",
    projectImage: roadooImage,
    link: "https://www.maslo.app/en",
    dates: "Apr 2018 – Oct 2020",
    responsibilities: [
      "Developed and maintained a SaaS gamification platform designed to inspire and engage workforces through social interaction and rewards.",
      "Built modular Angular 5 application integrated with PHP backend, delivering separate client and admin consoles supporting flexible configurations across multiple organizations.",
      "Set up continuous integration pipelines via Jenkins, improving deployment efficiency and code reliability.",
    ],
    keyFeatures: [
      "Designed and implemented a Facebook-style newsfeed, challenge system, and ranking system featuring an integrated rewards shop for prize redemption (trips, merchandise, etc.).",
      "Collaborated on UX design and feature development, blending gamification and social media principles to increase employee engagement and motivation.",
      "Architected modular frontend components enabling seamless multi-tenant support with customizable branding and feature configurations.",
    ],
  },
  {
    id: "4",
    name: "PokerStars",
    title: "Gaming Operator & Tournament Coordinator",
    projectImage: pokerstars,
    link: "https://www.pokerstarslive.com/",
    dates: "Jan 2003 – Jul 2016",
    responsibilities: [
      "Managed high-volume tournament operations and gaming floor efficiency for major poker events over 13+ years.",
      "Coordinated table layouts and optimized staffing models to maximize throughput during peak tournament seasons.",
    ],
    keyFeatures: [
      "Forecasted table availability and optimized event layouts, **increasing daily tournament capacity by ~20%**.",
      "Reduced operational resource overhead by **15–25%** through staffing optimization and process refinement.",
    ],
  },
];
