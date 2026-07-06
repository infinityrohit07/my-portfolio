export const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    hero: {
      statusText: 'Available for Full-time Roles & Internships',
      greeting: "Hi, I'm",
      name: 'Alex Carter',
      subtitle: 'Frontend Engineer specializing in building beautiful, performant, and responsive web experiences.',
      description: 'A self-taught enthusiast and fresh graduate with solid fundamentals in JavaScript, React, and CSS architectures. Turning UI designs into semantic, accessible, and high-performance production code.',
      location: 'San Francisco Bay Area, CA',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'alexcarter.dev@gmail.com'
      },
      resumeUrl: ''
    },
    about: {
      title: 'A curious mind crafting digital interfaces.',
      bioLines: [
        "Hello! I'm Alex Carter, a fresh graduate in Computer Science who discovered a deep passion for the visual and interactive aspects of programming. I specialize in frontend engineering, blending analytical coding logic with the design considerations of a UI developer.",
        "My journey began building simple layouts, which quickly evolved into crafting complex client-side applications with modern frameworks. I focus on developing clean, modular component structures, state management architectures, and interactive components that bring websites to life.",
        "I am constantly learning new design systems and modern frameworks (like React, Tailwind, and Next.js) to stay at the cutting edge of modern web guidelines. My goal is to build web apps that are as beautiful under the hood as they are in the browser."
      ],
      traits: [
        { iconName: 'Code', title: 'Clean & Semantic HTML', description: 'I write highly readable, maintainable, and SEO-friendly semantic markup that forms a solid base for complex apps.' },
        { iconName: 'Zap', title: 'Performance Optimized', description: 'Minimizing render cycles, optimizing bundles, and maintaining smooth 60fps animations are core to my work.' },
        { iconName: 'Smartphone', title: 'Responsive Design', description: 'Providing a seamless, fluid experience across all screen sizes, from mobile screens to large desktop monitors.' },
        { iconName: 'Sparkles', title: 'Attention to Detail', description: 'Converting Figma mockups into pixel-perfect components, respecting grid structures, line heights, and micro-interactions.' }
      ]
    },
    skills: {
      categories: [
        { title: 'Languages', iconName: 'Braces', skills: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Python', 'SQL'] },
        { title: 'Libraries & Frameworks', iconName: 'Layers', skills: ['React', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Express.js', 'Jest / React Testing Library'] },
        { title: 'Tools & Ecosystem', iconName: 'Terminal', skills: ['Git & GitHub', 'Vite / Webpack', 'npm / Yarn', 'Postman', 'Chrome DevTools', 'Vercel / Netlify'] },
        { title: 'Design & UI/UX Principles', iconName: 'Compass', skills: ['Figma', 'Responsive Web Design', 'Web Accessibility (a11y)', 'CSS Grid & Flexbox', 'Framer Motion', 'UI/UX Prototypes'] }
      ],
      learningSummary: 'Always learning. Current exploration: React Compiler & WebGPU.'
    }
  },
  projects: [
    {
      title: 'DevFlow Workspace',
      description: 'A productivity dashboard for developer teams featuring real-time project boards, task management, document sharing, and keyboard shortcut navigation.',
      tech: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Framer Motion'],
      github: 'https://github.com',
      live: 'https://example.com',
      iconName: 'Compass',
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'group-hover:border-brand-indigo/50',
      tagColor: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20'
    },
    {
      title: 'CryptoTracker Dashboard',
      description: 'Real-time cryptocurrency analytics tracking over 100+ tokens. Built with interactive price charting, portfolio simulations, and news aggregation.',
      tech: ['Next.js', 'Chart.js', 'Tailwind CSS', 'CoinGecko API'],
      github: 'https://github.com',
      live: 'https://example.com',
      iconName: 'BarChart3',
      color: 'from-cyan-500/20 to-teal-500/20',
      borderColor: 'group-hover:border-brand-cyan/50',
      tagColor: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
    },
    {
      title: 'OmniChat Interface',
      description: 'A beautiful glassmorphic messaging interface utilizing mock servers for chat simulation. Features responsive threads, media sharing, and dark mode customization.',
      tech: ['React', 'CSS Variables', 'Framer Motion', 'Tailwind CSS'],
      github: 'https://github.com',
      live: 'https://example.com',
      iconName: 'MessageSquare',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'group-hover:border-purple-400/50',
      tagColor: 'bg-purple-400/10 text-purple-300 border-purple-400/20'
    }
  ],
  experiences: [
    {
      role: 'Frontend Developer Intern',
      company: 'DevFlow Tech Solutions',
      duration: 'May 2026 - Present',
      iconName: 'Briefcase',
      bullets: [
        'Migrated legacy codebase (HTML/CSS) to React component structures, improving page load speed by 25%.',
        'Collaborated closely with UI/UX designers to translate Figma frames into fully responsive components using Tailwind CSS.',
        'Developed utility functions in JavaScript (ES6) for filtering and sorting database results within dashboards.'
      ],
      tech: ['React', 'Tailwind CSS', 'Git', 'Figma']
    },
    {
      role: 'Open Source Contributor',
      company: 'FreeCodeCamp & Dev Communities',
      duration: 'Nov 2025 - Apr 2026',
      iconName: 'Globe',
      bullets: [
        'Contributed documentation patches and layout accessibility fixes to popular community projects.',
        'Resolved CSS layout alignment issues across multiple browsers (Firefox, Safari, Chrome) in response to GitHub issues.',
        'Collaborated on code reviews, focusing on clean semantic markup and structural styling.'
      ],
      tech: ['Semantic HTML', 'CSS Flexbox/Grid', 'Markdown', 'GitHub Actions']
    },
    {
      role: 'Frontend Hackathon Lead',
      company: 'TechNovation Hackathon',
      duration: 'Oct 2025',
      iconName: 'Award',
      bullets: [
        'Led a 3-member team to construct a real-time web mock prototype inside a 36-hour sprint.',
        'Developed the core landing page layout, side navigations, and dynamic interactive chart views.',
        'Won "Best UI Design" award for aesthetics, interactive elements, and layout consistency.'
      ],
      tech: ['React', 'Chart.js', 'Framer Motion', 'Vite']
    }
  ],
  educations: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'State University of Technology',
      duration: '2022 - 2026',
      gpa: '3.8 / 4.0 GPA',
      highlights: [
        'Focus areas: Modern Web Systems, User Interface Design, Algorithms, Database Management.',
        'Active member of the Student Web Development Club (built responsive templates for campus events).',
        'Completed graduation project: "A collaborative Kanban workspace for campus hackathons".'
      ]
    }
  ],
  certifications: [
    {
      title: 'Meta Frontend Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      date: 'Dec 2025',
      credentialId: 'CRED-META-7829'
    },
    {
      title: 'Responsive Web Design Certification',
      issuer: 'freeCodeCamp',
      date: 'Aug 2025',
      credentialId: 'CRED-FCC-9382'
    }
  ],
  testimonials: [
    {
      _id: 'testi_1',
      name: 'Sarah Jenkins',
      role: 'Tech Lead',
      company: 'DevFlow Tech Solutions',
      text: 'Alex is an exceptional developer who is incredibly detail-oriented. He translated our complex Figma designs into responsive React code effortlessly. Highly recommended!',
      avatarUrl: '',
      rating: 5,
      order: 0
    },
    {
      _id: 'testi_2',
      name: 'Michael Chen',
      role: 'Senior Project Manager',
      company: 'TechNovation',
      text: 'During the hackathon, Alex demonstrated high efficiency and stellar UI design skills. He worked under pressure and delivered an award-winning layout.',
      avatarUrl: '',
      rating: 5,
      order: 1
    }
  ]
};
