'use client';

import { projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { ScrollReveal } from './ScrollReveal';

export function SelectedWork() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Selected Work
          </p>
        </ScrollReveal>

        <div className="mt-16 space-y-28 sm:mt-20 sm:space-y-36 lg:space-y-44">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              layout={project.layout}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
