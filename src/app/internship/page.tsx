'use client';

import { useMemo, useState } from 'react';

type Role = {
  id: number;
  name: string;
  category: string;
  opportunity: number;
  demand: 'Very High' | 'High' | 'Medium';
  growth: number;
  competition: 'Low' | 'Medium' | 'High';
  internships: number;
  skills: string[];
};

const roles: Role[] = [
  {
    id: 1,
    name: 'AI / ML Engineer',
    category: 'Artificial Intelligence',
    opportunity: 92,
    demand: 'Very High',
    growth: 38,
    competition: 'Medium',
    internships: 1240,
    skills: ['Python', 'Machine Learning', 'PyTorch', 'SQL'],
  },
  {
    id: 2,
    name: 'Cloud Engineer',
    category: 'Cloud & DevOps',
    opportunity: 88,
    demand: 'Very High',
    growth: 31,
    competition: 'Medium',
    internships: 980,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Linux'],
  },
  {
    id: 3,
    name: 'Data Scientist',
    category: 'Data Science',
    opportunity: 84,
    demand: 'High',
    growth: 27,
    competition: 'High',
    internships: 860,
    skills: ['Python', 'Statistics', 'SQL', 'ML'],
  },
  {
    id: 4,
    name: 'Cybersecurity Analyst',
    category: 'Cybersecurity',
    opportunity: 81,
    demand: 'High',
    growth: 29,
    competition: 'Medium',
    internships: 740,
    skills: ['Networking', 'Linux', 'SIEM', 'Security'],
  },
  {
    id: 5,
    name: 'Software Engineer',
    category: 'Software Development',
    opportunity: 79,
    demand: 'Very High',
    growth: 18,
    competition: 'High',
    internships: 2150,
    skills: ['JavaScript', 'React', 'Node.js', 'Git'],
  },
  {
    id: 6,
    name: 'UI / UX Designer',
    category: 'Design',
    opportunity: 68,
    demand: 'High',
    growth: 16,
    competition: 'High',
    internships: 520,
    skills: ['Figma', 'UX Research', 'Prototyping'],
  },
  {
    id: 7,
    name: 'Digital Marketing',
    category: 'Marketing',
    opportunity: 64,
    demand: 'Medium',
    growth: 12,
    competition: 'High',
    internships: 430,
    skills: ['SEO', 'Analytics', 'Content', 'Ads'],
  },
  {
    id: 8,
    name: 'Blockchain Developer',
    category: 'Blockchain',
    opportunity: 73,
    demand: 'High',
    growth: 24,
    competition: 'Medium',
    internships: 390,
    skills: ['Solidity', 'Web3', 'JavaScript', 'Smart Contracts'],
  },
];

const categories = [
  'All',
  'Artificial Intelligence',
  'Software Development',
  'Data Science',
  'Cloud & DevOps',
  'Cybersecurity',
  'Blockchain',
  'Design',
  'Marketing',
];

function getOpportunityLabel(score: number) {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Strong';
  return 'Growing';
}

function getScoreBar(score: number) {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 80) return 'bg-green-500';
  if (score >= 70) return 'bg-lime-500';
  return 'bg-yellow-500';
}

export default function InternshipPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const categoryMatch =
        selectedCategory === 'All' ||
        role.category === selectedCategory;

      const searchMatch =
        role.name.toLowerCase().includes(search.toLowerCase()) ||
        role.category.toLowerCase().includes(search.toLowerCase()) ||
        role.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        );

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, search]);

  return (
    <main className="min-h-screen bg-[#f5f7f6] text-slate-900">

      {/* HERO */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              CollegenZ Opportunity Intelligence
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Discover where your{' '}
              <span className="text-green-600">career</span> can go.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore career roles, understand market opportunity, discover
              high-growth fields and find internships aligned with your future.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-8 max-w-2xl">
            <div className="flex items-center rounded-2xl border bg-slate-50 px-4 py-3 shadow-sm focus-within:border-green-400 focus-within:bg-white">
              <span className="mr-3 text-lg">⌕</span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles, skills or fields..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-5 py-7 md:px-8">

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            icon="🌍"
            value="10K+"
            label="Roles tracked"
          />

          <StatCard
            icon="📈"
            value="2.4K+"
            label="High-growth roles"
          />

          <StatCard
            icon="🔥"
            value="680+"
            label="Rising opportunities"
          />

          <StatCard
            icon="🎓"
            value="3.2K+"
            label="Internships"
          />

        </div>

      </section>

      {/* OPPORTUNITY OVERVIEW */}
      <section className="mx-auto max-w-7xl px-5 pb-8 md:px-8">

        <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-7">

          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                Market intelligence
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Opportunity by career role
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Higher scores indicate stronger overall opportunity.
              </p>
            </div>

            <div className="rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
              Updated periodically
            </div>

          </div>

          <div className="space-y-5">

            {roles.map((role) => (

              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className="group block w-full text-left"
              >

                <div className="mb-2 flex items-center justify-between gap-4">

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-800 group-hover:text-green-600">
                      {role.name}
                    </h3>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {role.category}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">

                    <span className="hidden text-[11px] text-slate-400 sm:block">
                      {getOpportunityLabel(role.opportunity)}
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                      {role.opportunity}
                    </span>

                  </div>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getScoreBar(
                      role.opportunity
                    )}`}
                    style={{
                      width: `${role.opportunity}%`,
                    }}
                  />

                </div>

              </button>

            ))}

          </div>

        </div>

      </section>

      {/* FILTERS */}
      <section className="mx-auto max-w-7xl px-5 pb-5 md:px-8">

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'border bg-white text-slate-500 hover:border-green-300 hover:text-green-600'
              }`}
            >
              {category}
            </button>

          ))}

        </div>

      </section>

      {/* ROLE CARDS */}
      <section className="mx-auto max-w-7xl px-5 pb-12 md:px-8">

        <div className="mb-5 flex items-end justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Explore roles
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {filteredRoles.length} roles matching your search
            </p>
          </div>

        </div>

        {filteredRoles.length === 0 ? (

          <div className="rounded-3xl border bg-white p-10 text-center">
            <div className="text-3xl">🔎</div>
            <h3 className="mt-3 font-semibold">
              No roles found
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Try searching for another role or skill.
            </p>
          </div>

        ) : (

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {filteredRoles.map((role) => (

              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className="group rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-xl">
                    💼
                  </div>

                  <div className="rounded-xl bg-slate-50 px-2.5 py-1 text-xs font-bold">
                    {role.opportunity}/100
                  </div>

                </div>

                <h3 className="mt-5 font-bold group-hover:text-green-600">
                  {role.name}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {role.category}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">

                  <MiniMetric
                    label="Demand"
                    value={role.demand}
                  />

                  <MiniMetric
                    label="Growth"
                    value={`+${role.growth}%`}
                  />

                  <MiniMetric
                    label="Competition"
                    value={role.competition}
                  />

                  <MiniMetric
                    label="Internships"
                    value={role.internships.toLocaleString()}
                  />

                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">

                  {role.skills.slice(0, 3).map((skill) => (

                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </button>

            ))}

          </div>

        )}

      </section>

      {/* ROLE DETAIL MODAL */}
      {selectedRole && (

        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setSelectedRole(null)}
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 sm:max-w-xl sm:rounded-3xl"
          >

            <div className="flex items-start justify-between">

              <div>

                <div className="mb-3 inline-flex rounded-xl bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {selectedRole.category}
                </div>

                <h2 className="text-2xl font-bold">
                  {selectedRole.name}
                </h2>

              </div>

              <button
                onClick={() => setSelectedRole(null)}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm"
              >
                ✕
              </button>

            </div>

            {/* SCORE */}
            <div className="mt-6 rounded-2xl bg-green-50 p-5">

              <div className="flex items-end justify-between">

                <div>
                  <p className="text-xs font-medium text-green-700">
                    Opportunity score
                  </p>

                  <p className="mt-1 text-4xl font-bold text-green-700">
                    {selectedRole.opportunity}
                    <span className="text-lg">/100</span>
                  </p>
                </div>

                <div className="text-right">

                  <p className="text-xs text-green-600">
                    {getOpportunityLabel(selectedRole.opportunity)}
                  </p>

                  <p className="mt-1 text-xs text-green-600">
                    +{selectedRole.growth}% growth
                  </p>

                </div>

              </div>

              <div className="mt-4 h-2 rounded-full bg-white">

                <div
                  className="h-full rounded-full bg-green-600"
                  style={{
                    width: `${selectedRole.opportunity}%`,
                  }}
                />

              </div>

            </div>

            {/* METRICS */}
            <div className="mt-5 grid grid-cols-3 gap-2">

              <DetailMetric
                label="Demand"
                value={selectedRole.demand}
              />

              <DetailMetric
                label="Competition"
                value={selectedRole.competition}
              />

              <DetailMetric
                label="Internships"
                value={selectedRole.internships.toLocaleString()}
              />

            </div>

            {/* SKILLS */}
            <div className="mt-7">

              <h3 className="font-bold">
                Skills to build
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">

                {selectedRole.skills.map((skill) => (

                  <span
                    key={skill}
                    className="rounded-xl border bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            </div>

            {/* ACTION */}
            <button
              onClick={() => setSelectedRole(null)}
              className="mt-7 w-full rounded-2xl bg-green-600 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Explore internships →
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">

      <div className="text-xl">
        {icon}
      </div>

      <p className="mt-3 text-xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {label}
      </p>

    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-2.5">

      <p className="text-[9px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}

function DetailMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-3">

      <p className="text-[10px] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {value}
      </p>

    </div>
  );
                    }
