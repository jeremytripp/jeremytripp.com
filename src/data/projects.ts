export type ProjectLayout = 'full' | 'split-left' | 'split-right';

export interface Project {
  id: string;
  title: string;
  organization: string;
  role: string;
  period: string;
  description: string;
  image: string;
  imageAlt: string;
  gradient: string;
  /** Display as full-width (large) or split layout. Configurable per project for content management. */
  layout: ProjectLayout;
  pressLinks?: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    id: 'ace',
    title: 'Ace',
    organization: 'St. Louis CITY SC',
    role: 'Director of Digital Experience',
    period: 'Launched 2025',
    description:
      'Built an agentic AI matchday assistant from scratch — multilingual, ADA-compliant, and integrated across ticketing, concessions, and stadium systems.',
    image: '/images/projects/ace.png',
    imageAlt: 'Ace AI assistant conversation in the CITY SC app',
    gradient: 'from-violet-600 via-indigo-600 to-purple-800',
    layout: 'split-left',
    pressLinks: [
      {
        label: 'Sports Business Journal',
        url: 'https://www.sportsbusinessjournal.com/Articles/2025/11/06/st-louis-city-sc-launches-agentic-ai-tool-ace-to-personalize-fan-experience/',
      },
      {
        label: 'stlcitysc.com',
        url: 'https://www.stlcitysc.com/news/st-louis-city-sc-elevates-the-fan-experience-with-the-launch-of-ace-an-ambient-ai-engine-built-specifically-for-city-sc-fans',
      },
    ],
  },
  {
    id: 'city-pay',
    title: 'CITY Pay',
    organization: 'St. Louis CITY SC',
    role: 'Director of Digital Experience',
    period: 'Launched 2023',
    description:
      'Designed a closed-loop virtual currency powering every point of sale at Energizer Park — with cashback rewards that drive fan loyalty.',
    image: '/images/projects/city-pay.png',
    imageAlt: 'CITY Pay virtual wallet and QR payment interface',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    layout: 'split-right',
    pressLinks: [
      {
        label: 'CITY Pay',
        url: 'https://stlcitysc.com/app/city-pay/index',
      },
    ],
  },
  {
    id: 'city-app',
    title: 'CITY App',
    organization: 'St. Louis CITY SC',
    role: 'Director of Digital Experience',
    period: 'Launched 2021',
    description:
      'Launched the official CITY SC app 18 months before the club\'s first match — and evolved it into the connective tissue for every fan touchpoint.',
    image: '/images/projects/city-app.png',
    imageAlt: 'St. Louis CITY SC mobile app screens',
    gradient: 'from-red-500 via-rose-600 to-red-800',
    layout: 'split-left',
    pressLinks: [
      {
        label: 'App Store',
        url: 'https://apps.apple.com/us/app/stl-city-sc/id1577607877',
      },
      {
        label: 'stlcitysc.com',
        url: 'https://stlcitysc.com/app',
      },
    ],
  },
  {
    id: 'panera-ecommerce',
    title: 'eCommerce Platform',
    organization: 'Panera Bread',
    role: 'Senior Product Manager',
    period: 'Launched 2018',
    description:
      'Led the migration to an integrated eCommerce platform powering $840M+ in annual digital revenue across web, mobile, kiosk, and voice.',
    image: '/images/projects/panera-ecommerce.png',
    imageAlt: 'Panera Bread eCommerce website on desktop and mobile',
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    layout: 'split-right',
  },
  {
    id: 'panera-voice',
    title: 'Voice Ordering',
    organization: 'Panera Bread',
    role: 'Product Manager',
    period: 'Launched 2017',
    description:
      'Shipped voice ordering on Google Assistant — demoed at Google I/O 2017 — making Panera one of the first restaurant chains on the platform.',
    image: '/images/projects/panera-voice.webp',
    imageAlt: 'Panera voice ordering on Google Assistant',
    gradient: 'from-blue-500 via-sky-500 to-cyan-500',
    layout: 'split-left',
    pressLinks: [
      {
        label: 'Google I/O 2017',
        url: 'https://www.globenewswire.com/news-release/2017/10/04/1140903/0/en/Panera-Bread-is-One-of-the-First-National-Restaurant-Concepts-to-Offer-Voice-Ordering-Through-the-Google-Assistant-on-Mobile-Devices-for-Delivery-and-Rapid-Pick-Up.html',
      },
    ],
  },
  {
    id: 'panera-apple-pay',
    title: 'Apple Pay',
    organization: 'Panera Bread',
    role: 'Product Manager',
    period: 'Launched 2014',
    description:
      'Partnered directly with Apple as a launch-day partner for Apple Pay — featured alongside the iPhone 6 announcement.',
    image: '/images/projects/apple-pay.png',
    imageAlt: 'Apple Pay integration on Panera Bread iOS app',
    gradient: 'from-zinc-400 via-slate-500 to-zinc-700',
    layout: 'split-right',
    pressLinks: [
      {
        label: 'NBC News',
        url: 'https://www.nbcnews.com/tech/mobile/beyond-wallet-apple-pay-cements-future-mobile-payments-n229821',
      },
      {
        label: 'Bloomberg',
        url: 'https://www.bloomberg.com/news/videos/2014-10-16/why-panera-breads-using-apple-pay',
      },
    ],
  },
];
