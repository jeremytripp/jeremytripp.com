'use client';

import { ScrollReveal } from './ScrollReveal';

const highlights = [
  { stat: '16+', label: 'Years in Digital Product' },
  { stat: '$840M+', label: 'Annual Digital Revenue Managed' },
  { stat: '2', label: 'Iconic Brands — Panera & CITY SC' },
];

export function About() {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            About
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-16 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <div className="space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              <p>
                I&rsquo;m a digital product leader who blends technical depth with
                strategic thinking. My career has been defined by building products
                at scale — from voice ordering systems demoed at Google I/O to
                agentic AI assistants that serve tens of thousands of fans on
                matchday.
              </p>
              <p>
                I believe great products are born at the intersection of obsessive
                user focus, data-driven decision making, and teams that genuinely
                care about craft. I hold an MBA from Washington University in
                St.&nbsp;Louis and a BA in English from Truman State University.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-10">
              {highlights.map((item) => (
                <div key={item.label}>
                  <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {item.stat}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
