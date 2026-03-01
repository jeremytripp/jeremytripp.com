'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
});

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6">
      {/* Background image: top of image (Arch) at 3.5rem so it sits just below the fixed nav */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-stadium.png"
          alt=""
          fill
          className="object-cover opacity-70 [object-position:50%_3.5rem]"
          sizes="100vw"
          priority
        />
        {/* Gradient overlay: heavy at bottom, medium at center, moderate at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center">
        <motion.h1
          {...fade(0.1)}
          className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          Jeremy Tripp
        </motion.h1>

        <motion.p
          {...fade(0.3)}
          className="mt-4 text-lg font-medium text-zinc-300 sm:text-xl lg:text-2xl"
        >
          Sr. Director of Technology
        </motion.p>

        <motion.p
          {...fade(0.5)}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          I build digital products at the intersection of technology, design,
          and fan experience.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 z-10"
      >
        <motion.svg
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
