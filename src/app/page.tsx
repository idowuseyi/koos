import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="w-full sticky top-0 bg-surface border-b border-outline-variant/10 z-50">
        <div className="flex justify-between items-center h-20 px-5 md:px-16 max-w-[1440px] mx-auto">
          <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-primary">
            KO Platform
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a
              className="text-on-surface-variant font-medium text-base hover:text-primary transition-colors duration-200"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-on-surface-variant font-medium text-base hover:text-primary transition-colors duration-200"
              href="#"
            >
              Solutions
            </a>
            <a
              className="text-on-surface-variant font-medium text-base hover:text-primary transition-colors duration-200"
              href="#"
            >
              Pricing
            </a>
            <a
              className="text-on-surface-variant font-medium text-base hover:text-primary transition-colors duration-200"
              href="#"
            >
              Resources
            </a>
          </nav>
          <div className="flex gap-3 items-center">
            <Link
              className="hidden md:block text-sm font-bold uppercase tracking-wider text-primary hover:text-secondary px-6 py-3 transition-colors"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider px-6 py-3 rounded hover:bg-primary/90 transition-colors"
              href="/register"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="w-full flex-1">
        {/* Hero Section */}
        <section className="px-5 md:px-16 py-20 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-h-[70vh]">
          <div className="md:col-span-7 flex flex-col items-start gap-6 z-10">
            <h1 className="text-[48px] md:text-[72px] font-extrabold leading-[1.1] tracking-tight font-[family-name:var(--font-heading)]">
              Content that Captivates.{' '}
              <br />
              <span className="text-primary">Design that Delivers.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Elevate your creative production with AI-powered campaign planning
              and rigorous strategic logic. Structure, high-contrast aesthetics,
              and effortless authority.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full sm:w-auto">
              <Link
                className="bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm px-12 py-6 rounded hover:bg-primary/90 transition-colors text-center w-full sm:w-auto"
                href="/register"
              >
                Get Started
              </Link>
              <Link
                className="border border-primary text-primary font-bold uppercase tracking-wider text-sm px-12 py-6 rounded hover:bg-primary/10 transition-colors text-center w-full sm:w-auto"
                href="#features"
              >
                View Demo
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 h-[400px] md:h-[600px] w-full rounded-lg bg-surface-container overflow-hidden border border-outline-variant/20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-surface-container" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rotate-12 border-2 border-primary/20 rounded-xl" />
                <div className="absolute inset-4 -rotate-6 border border-primary/15 rounded-lg" />
                <div className="absolute inset-8 rotate-3 border border-primary/10 rounded-md" />
                <div className="absolute inset-12 bg-primary/5 rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    auto_awesome
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent md:hidden" />
          </div>
        </section>

        {/* Features Bento Grid */}
        <section
          className="px-5 md:px-16 py-20 max-w-[1440px] mx-auto bg-surface-container-lowest rounded-lg"
          id="features"
        >
          <div className="mb-12">
            <h2 className="text-[32px] md:text-[48px] font-bold leading-[1.2] font-[family-name:var(--font-heading)]">
              Platform Capabilities
            </h2>
            <p className="text-base text-on-surface-variant mt-3">
              Strategic precision meets creative expression.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1 - Brand Knowledge Base */}
            <div className="md:col-span-8 bg-surface-container border border-outline-variant/20 rounded-lg p-12 flex flex-col justify-between group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-[48px] text-primary">
                  database
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-on-surface mb-3">
                  Brand Knowledge Base
                </h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  Centralize your visual identity, voice guidelines, and
                  historic performance data in a structured, accessible neural
                  index.
                </p>
              </div>
            </div>

            {/* Card 2 - AI Strategist */}
            <div className="md:col-span-4 bg-surface-container border border-outline-variant/20 rounded-lg p-12 flex flex-col justify-between group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-[48px] text-secondary">
                  lightbulb
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-on-surface mb-3">
                  AI Strategist
                </h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  Generate data-backed campaign angles and audience targeting
                  matrices instantly.
                </p>
              </div>
            </div>

            {/* Card 3 - Automated Generation */}
            <div className="md:col-span-12 bg-surface-container border border-outline-variant/20 rounded-lg p-12 flex flex-col md:flex-row gap-12 items-center group hover:border-primary/50 transition-colors">
              <div className="flex-1">
                <span className="material-symbols-outlined text-[48px] text-primary mb-6 block">
                  auto_awesome
                </span>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-on-surface mb-3">
                  Automated Generation
                </h3>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  Deploy multi-channel assets with zero manual resizing. The
                  platform dynamically constructs layouts based on your core
                  aesthetic rules.
                </p>
              </div>
              <div className="flex-1 h-48 w-full rounded border border-outline-variant/30 bg-surface-variant overflow-hidden relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, var(--outline-variant) 0, var(--outline-variant) 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 bg-surface-container-low border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-5 md:px-16 max-w-[1440px] mx-auto gap-6 md:gap-0">
          <div className="font-[family-name:var(--font-heading)] text-2xl font-bold text-primary">
            KO Platform
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <a
              className="text-base text-on-surface-variant hover:underline hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-base text-on-surface-variant hover:underline hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-base text-on-surface-variant hover:underline hover:text-primary transition-colors"
              href="#"
            >
              Contact Us
            </a>
            <a
              className="text-base text-on-surface-variant hover:underline hover:text-primary transition-colors"
              href="#"
            >
              Security
            </a>
            <a
              className="text-base text-on-surface-variant hover:underline hover:text-primary transition-colors"
              href="#"
            >
              Status
            </a>
          </nav>
          <div className="text-xs text-on-surface-variant">
            &copy; 2024 KO Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
