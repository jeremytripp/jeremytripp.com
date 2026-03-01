'use client';

import Image from 'next/image';
import { useState } from 'react';
import { type Project } from '@/data/projects';
import { ScrollReveal } from './ScrollReveal';

interface ProjectCardProps {
  project: Project;
  layout: 'full' | 'split-left' | 'split-right';
  priority?: boolean;
}

function ProjectImage({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient}`}
    >
      {!imgError && (
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
          priority={priority}
          onError={() => setImgError(true)}
        />
      )}
      {imgError && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <span className="text-center text-2xl font-semibold text-white/80 sm:text-3xl lg:text-4xl">
            {project.title}
          </span>
        </div>
      )}
    </div>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="flex flex-col justify-center">
      <p className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {project.organization}
      </p>
      <h3 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {project.title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-500">
        <span>{project.role}</span>
        <span className="hidden sm:inline" aria-hidden="true">
          &middot;
        </span>
        <span>{project.period}</span>
      </div>
      {project.pressLinks && project.pressLinks.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {project.pressLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
            >
              {link.label}
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.5 1.5h7v7M10.5 1.5l-9 9" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectCard({ project, layout, priority }: ProjectCardProps) {
  if (layout === 'full') {
    return (
      <ScrollReveal className="w-full">
        <div className="space-y-8">
          <ProjectImage project={project} priority={priority} />
          <div className="mx-auto max-w-2xl">
            <ProjectMeta project={project} />
          </div>
        </div>
      </ScrollReveal>
    );
  }

  const imageFirst = layout === 'split-left';

  return (
    <ScrollReveal
      className="w-full"
      direction={imageFirst ? 'left' : 'right'}
    >
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
        <div className={imageFirst ? '' : 'md:order-2'}>
          <ProjectImage project={project} priority={priority} />
        </div>
        <div className={imageFirst ? '' : 'md:order-1'}>
          <ProjectMeta project={project} />
        </div>
      </div>
    </ScrollReveal>
  );
}
