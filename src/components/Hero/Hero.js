import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import './Hero.css';

/**
 * Hero Component for the landing page
 * Displays engaging title, subtitle, and call-to-action buttons
 */
const Hero = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero', 'hero--primary', 'hero-banner')}>
      <div className="container">
        <div className="hero__image-container">
          <img
            src="/img/hero-robotics-ai.jpg"
            alt="AI and Robotics illustration showing humanoid robots and artificial intelligence concepts"
            className="hero__image"
          />
        </div>
        <h1 className="hero__title">
          Physical AI & Humanoid Robotics
        </h1>
        <p className="hero__subtitle">
          Master the Future of AI and Robotics
        </p>
        <div className="hero__content">
          <p>
            Dive deep into the intersection of artificial intelligence and humanoid robotics with our comprehensive guide.
          </p>
        </div>
        <div className="hero__buttons">
          <Link
            className="button button--secondary button--lg hero-button"
            to="/docs/intro">
            Start Reading
          </Link>
          <Link
            className="button button--outline button--secondary button--lg hero-button hero-button--outline"
            to="https://github.com/your-username/Physical_AI_Humanoid_Robotics_Book">
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Hero;