'use client';

import { Hero } from './Hero';
import { SelectedWork } from './SelectedWork';
import { About } from './About';
import { PortfolioFooter } from './Footer';

export function Portfolio() {
  return (
    <div className="-mt-14">
      <Hero />
      <SelectedWork />
      <About />
      <PortfolioFooter />
    </div>
  );
}
