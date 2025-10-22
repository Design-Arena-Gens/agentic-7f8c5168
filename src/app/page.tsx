'use client';

import {
  Activity,
  ArrowDownRight,
  BarChart3,
  Bell,
  CalendarClock,
  ChevronDown,
  LayoutDashboard,
  Grid3X3,
  LineChart,
  Menu,
  PieChart,
  Settings,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as LineChartPrimitive,
  Pie,
  PieChart as PieChartPrimitive,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type WidgetId =
  | 'pipelineVelocity'
  | 'revenueInsights'
  | 'conversionBreakdown'
  | 'channelMix'
  | 'engagementTimeline';

type WidgetConfig = {
  id: WidgetId;
  title: string;
  description: string;
  accessibilityLabel: string;
  size: string;
  render: () => JSX.Element;
};

const kpiSeeds = [
  {
    label: 'Net Revenue',
    prefix: '$',
    suffix: 'M',
    base: 4.2,
    delta: 8.6,
    caption: 'vs. previous quarter',
  },
  {
    label: 'Active Users',
    prefix: '',
    suffix: 'k',
    base: 128,
    delta: 5.3,
    caption: 'daily active growth',
  },
  {
    label: 'Net Promoter',
    prefix: '',
    suffix: '',
    base: 71,
    delta: 2.1,
    caption: 'customer satisfaction',
  },
  {
    label: 'Churn Rate',
    prefix: '',
    suffix: '%',
    base: 1.9,
    delta: -0.8,
    caption: 'month-over-month',
  },
];

const channelPalette = ['#6200EE', '#00BCD4', '#26d4e9', '#8C9BC0'];

const gradientStops = [
  { offset: '5%', color: '#6200EE', opacity: 0.6 },
  { offset: '35%', color: '#7a1eff', opacity: 0.45 },
  { offset: '95%', color: '#00BCD4', opacity: 0.35 },
];

const generateInitialTimeline = () =>
  Array.from({ length: 12 }, (_, index) => ({
    month: new Date(0, index).toLocaleString('default', { month: 'short' }),
    engagement: 60 + Math.random() * 30,
    velocity: 45 + Math.random() * 25,
    sentiment: 40 + Math.random() * 20,
  }));

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [widgetControlsOpen, setWidgetControlsOpen] = useState(false);
  const [kpis, setKpis] = useState(() =>
    kpiSeeds.map((kpi) => ({ ...kpi, value: kpi.base }))
  );
  const [timeline, setTimeline] = useState(generateInitialTimeline);
  const [pipeline, setPipeline] = useState(() =>
    Array.from({ length: 5 }, (_, i) => ({
      stage: ['Discover', 'Evaluate', 'Decide', 'Adopt', 'Expand'][i],
      value: Math.round(40 + Math.random() * 30),
    }))
  );
  const [channelMix, setChannelMix] = useState(() => [
    { name: 'Product Led', value: 38 },
    { name: 'Enterprise', value: 27 },
    { name: 'Partner', value: 19 },
    { name: 'Community', value: 16 },
  ]);
  const [visibleWidgets, setVisibleWidgets] = useState<Record<WidgetId, boolean>>({
    pipelineVelocity: true,
    revenueInsights: true,
    conversionBreakdown: true,
    channelMix: true,
    engagementTimeline: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setKpis((prev) =>
        prev.map((kpi) => {
          const drift = (Math.random() - 0.45) * (kpi.label === 'Churn Rate' ? 0.15 : 0.35);
          const nextValue = Math.max(
            kpi.label === 'Churn Rate' ? 1.2 : kpi.base * 0.75,
            parseFloat((kpi.value + drift).toFixed(2))
          );
          return { ...kpi, value: nextValue };
        })
      );

      setTimeline((prev) =>
        prev.map((entry) => ({
          ...entry,
          engagement: Math.min(98, Math.max(35, entry.engagement + (Math.random() - 0.5) * 6)),
          velocity: Math.min(92, Math.max(25, entry.velocity + (Math.random() - 0.5) * 5)),
          sentiment: Math.min(88, Math.max(18, entry.sentiment + (Math.random() - 0.45) * 4)),
        }))
      );

      setPipeline((prev) =>
        prev.map((stage) => ({
          ...stage,
          value: Math.max(22, Math.min(90, stage.value + (Math.random() - 0.5) * 4)),
        }))
      );

      setChannelMix((prev) => {
        const adjustments = prev.map(() => (Math.random() - 0.5) * 2.2);
        const updated = prev.map((channel, i) => ({
          ...channel,
          value: Math.max(10, channel.value + adjustments[i]),
        }));
        const total = updated.reduce((acc, channel) => acc + channel.value, 0);
        return updated.map((channel) => ({
          ...channel,
          value: parseFloat(((channel.value / total) * 100).toFixed(1)),
        }));
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const widgets: WidgetConfig[] = useMemo(
    () => [
      {
        id: 'pipelineVelocity',
        title: 'Pipeline Velocity',
        description: 'Stage distribution and acceleration insights',
        accessibilityLabel: 'Bar chart showing opportunity velocity per pipeline stage',
        size: 'md:col-span-1 xl:col-span-1',
        render: () => (
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm text-slate-200">
                <Activity className="h-4 w-4 text-aqua" aria-hidden="true" />
                Momentum Score <strong className="text-white">82</strong>
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Boost
              </button>
            </header>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipeline} barCategoryGap="20%">
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6200EE" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#00BCD4" stopOpacity="0.75" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 8" stroke="#1f2752" vertical={false} />
                  <XAxis dataKey="stage" stroke="#8C9BC0" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8C9BC0" tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(98, 0, 238, 0.08)' }}
                    contentStyle={{
                      backgroundColor: '#111633',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F5F7FF',
                    }}
                  />
                  <Bar dataKey="value" radius={[14, 14, 14, 14]} fill="url(#barGradient)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <footer className="mt-4 flex items-center justify-between text-xs text-slate-300">
              <span>Lead score uplift: <strong className="text-aqua">+12%</strong></span>
              <span>Cycle time: <strong className="text-aurora">36h</strong></span>
            </footer>
          </div>
        ),
      },
      {
        id: 'revenueInsights',
        title: 'Revenue Trajectory',
        description: 'Projected growth vs. actualized revenue',
        accessibilityLabel: 'Line chart showing projected versus actual revenue trajectory over the past 12 months',
        size: 'md:col-span-2 xl:col-span-2',
        render: () => (
          <div className="flex h-full flex-col">
            <header className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-aurora/20 px-3 py-1 text-xs text-aqua">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                Forecast accuracy 94%
              </span>
              <span className="text-xs text-slate-200">Live recalibration • {new Date().toLocaleTimeString()}</span>
            </header>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChartPrimitive data={timeline}>
                  <defs>
                    <linearGradient id="engagement" x1="0" y1="0" x2="0" y2="1">
                      {gradientStops.map((stop) => (
                        <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />
                      ))}
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1f2752" strokeDasharray="4 6" />
                  <XAxis dataKey="month" stroke="#8C9BC0" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8C9BC0" tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ stroke: '#6200EE', strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: '#111633',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F5F7FF',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ color: '#8C9BC0' }}
                  />
                  <Line type="monotone" dataKey="engagement" name="Actualized" stroke="#00BCD4" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="velocity" name="Projected" stroke="#6200EE" strokeWidth={2} strokeDasharray="8 6" />
                  <Area type="monotone" dataKey="sentiment" name="Sentiment" stroke="#8C9BC0" fill="url(#engagement)" strokeWidth={1.6} />
                </LineChartPrimitive>
              </ResponsiveContainer>
            </div>
            <footer className="mt-4 grid grid-cols-1 gap-3 text-xs text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">ARR</p>
                <p className="mt-1 text-lg font-semibold text-white">$12.8M</p>
                <p className="text-aqua">+18% YoY</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Runway</p>
                <p className="mt-1 text-lg font-semibold text-white">19.4 mo</p>
                <p className="text-aurora">+4.2 mo saved</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Confidence</p>
                <p className="mt-1 text-lg font-semibold text-white">97.2%</p>
                <p className="text-slate-300">AI-adjusted</p>
              </div>
            </footer>
          </div>
        ),
      },
      {
        id: 'conversionBreakdown',
        title: 'Conversion Echelons',
        description: 'Point-in-time conversion ratios with anomaly detection',
        accessibilityLabel: 'Stacked bar chart visualizing conversion rates across experimentation cohorts',
        size: 'md:col-span-1 xl:col-span-1',
        render: () => (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs text-slate-200">
                <Grid3X3 className="h-4 w-4 text-aurora" aria-hidden="true" />
                Optimization cycles • 24h
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                Cohort View
              </span>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="velocity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6200EE" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#00BCD4" stopOpacity={0.15} />
                    </linearGradient>
                    <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#26d4e9" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#6200EE" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 5" stroke="#1f2752" />
                  <XAxis dataKey="month" tickLine={false} stroke="#8C9BC0" />
                  <YAxis stroke="#8C9BC0" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111633',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F5F7FF',
                    }}
                  />
                  <Area type="monotone" dataKey="velocity" stroke="#6200EE" fill="url(#velocity)" strokeWidth={2} />
                  <Area type="monotone" dataKey="engagement" stroke="#00BCD4" fill="url(#engagementGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <footer className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-200">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">Test Velocity</p>
                <p className="mt-1 text-lg font-semibold text-white">+32%</p>
                <p className="text-aqua">Experimental lift</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">Anomaly Risk</p>
                <p className="mt-1 text-lg font-semibold text-white">2.4%</p>
                <p className="text-aurora">Contained</p>
              </div>
            </footer>
          </div>
        ),
      },
      {
        id: 'channelMix',
        title: 'Acquisition Mix',
        description: 'Channel contribution to net new ARR',
        accessibilityLabel: 'Donut chart showing acquisition channel distribution',
        size: 'md:col-span-1 xl:col-span-1',
        render: () => (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs text-slate-200">
                <PieChart className="h-4 w-4 text-aqua" aria-hidden="true" />
                Weighted mix, auto-balanced
              </span>
              <span className="rounded-full bg-aurora/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-aurora">
                43 Segments
              </span>
            </div>
            <div className="relative mt-6 flex h-64 flex-1 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChartPrimitive>
                  <Pie
                    data={channelMix}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {channelMix.map((entry, index) => (
                      <Cell key={entry.name} fill={channelPalette[index % channelPalette.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{
                      backgroundColor: '#111633',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F5F7FF',
                    }}
                  />
                </PieChartPrimitive>
              </ResponsiveContainer>
              <div className="absolute inset-0 m-auto flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white/5 text-center text-xs text-slate-200">
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Primary</span>
                <span className="mt-1 text-lg font-semibold text-white">Product Led</span>
                <span className="text-aqua">38%</span>
              </div>
            </div>
            <footer className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-200">
              {channelMix.map((channel, index) => (
                <div
                  key={channel.name}
                  className="group flex items-center justify-between rounded-xl bg-white/5 px-4 py-2 transition hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: channelPalette[index % channelPalette.length] }}
                    />
                    {channel.name}
                  </span>
                  <span className="font-semibold text-white group-hover:text-aqua">
                    {channel.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </footer>
          </div>
        ),
      },
      {
        id: 'engagementTimeline',
        title: 'Engagement Timeline',
        description: 'User energy across lifecycle points',
        accessibilityLabel: 'Line chart tracking engagement timeline across user lifecycle checkpoints',
        size: 'md:col-span-2 xl:col-span-3',
        render: () => (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs text-slate-200">
                <LineChart className="h-4 w-4 text-aurora" aria-hidden="true" />
                Adaptive cadence map
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300 transition hover:border-aqua hover:text-white"
              >
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                Export
              </button>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="timeline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00BCD4" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#6200EE" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 7" stroke="#1f2752" />
                  <XAxis dataKey="month" stroke="#8C9BC0" tickLine={false} />
                  <YAxis stroke="#8C9BC0" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111633',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F5F7FF',
                    }}
                  />
                  <Area type="monotone" dataKey="engagement" stroke="#26d4e9" fill="url(#timeline)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <footer className="mt-4 flex flex-wrap gap-3 text-xs text-slate-200">
              <div className="rounded-full border border-white/10 px-4 py-2">Resonance 9.4</div>
              <div className="rounded-full border border-white/10 px-4 py-2">Retention +14%</div>
              <div className="rounded-full border border-white/10 px-4 py-2">Signal: High fidelity</div>
            </footer>
          </div>
        ),
      },
    ],
    [channelMix, pipeline, timeline]
  );

  const toggleWidget = (id: WidgetId) => {
    setVisibleWidgets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-[-10%] h-64 w-64 rounded-full bg-aurora/30 blur-3xl" />
        <div className="absolute right-1/3 top-1/2 h-80 w-80 rounded-full bg-aqua/30 blur-3xl" />
        <div className="absolute bottom-[-15%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-aurora/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col overflow-hidden px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-2xl" aria-hidden />
        <div className="relative z-10 flex flex-1">
          <aside
            className={`glass-panel relative hidden w-72 flex-col px-6 py-8 transition-all duration-300 lg:flex`}
            aria-label="Primary navigation"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora to-aqua text-white shadow-glow">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-white">Nebula Metrics</h1>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Command</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/10 p-2 text-slate-200 transition hover:border-aqua hover:text-white"
                aria-label="Open settings"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-10 space-y-6 text-sm text-slate-200">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Overview</p>
                <ul className="mt-3 space-y-2">
                  {[
                    { name: 'Mission Control', icon: LayoutDashboard },
                    { name: 'Intelligence Feed', icon: Activity },
                    { name: 'Revenue Lab', icon: BarChart3 },
                    { name: 'Experience Grid', icon: Grid3X3 },
                  ].map((item) => (
                    <li key={item.name}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-left transition hover:border-aqua/40 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
                        aria-label={item.name}
                      >
                        <item.icon className="h-[18px] w-[18px] text-aqua" aria-hidden="true" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Streams</p>
                <ul className="mt-3 space-y-2">
                  {[
                    { name: 'Lifecycle Intelligence', icon: LineChart },
                    { name: 'Acquisition Orbit', icon: PieChart },
                    { name: 'Forecast Studio', icon: TrendingUp },
                  ].map((item) => (
                    <li key={item.name}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-left transition hover:border-aurora/40 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora"
                        aria-label={item.name}
                      >
                        <item.icon className="h-[18px] w-[18px] text-aurora" aria-hidden="true" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="mt-auto space-y-4 rounded-3xl bg-white/5 p-4 text-xs text-slate-200">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">System Status</p>
              <div className="flex items-center justify-between">
                <span>AI Copilot</span>
                <span className="rounded-full bg-aqua/20 px-2.5 py-1 text-[11px] font-medium text-aqua">Live</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Latency</span>
                <span className="text-white">82ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data Sync</span>
                <span className="text-white">99.9%</span>
              </div>
            </div>
          </aside>

          <div className="flex flex-1 flex-col">
            <header className="glass-panel relative z-10 mb-6 flex flex-col gap-6 rounded-[32px] px-5 py-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua lg:hidden"
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  aria-expanded={sidebarOpen}
                  aria-controls="mobile-navigation"
                  aria-label="Toggle navigation menu"
                >
                  {sidebarOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Live mission feed</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">Experience Intelligence Dashboard</h2>
                </div>
              </div>

              <div className="flex flex-1 flex-wrap items-center justify-end gap-4">
                <div className="relative flex max-w-sm flex-1 items-center">
                  <input
                    type="search"
                    placeholder="Search cosmic insights"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/60"
                    aria-label="Search dashboard"
                  />
                  <Sparkles className="absolute right-3 h-4 w-4 text-aurora" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="relative rounded-2xl border border-white/10 p-3 text-white transition hover:border-aqua hover:bg-white/5"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" aria-hidden="true" />
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-aurora text-[11px] font-semibold text-white">5</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:border-aqua"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-aurora via-aurora to-aqua text-sm font-semibold text-white">
                      <Image src="https://i.pravatar.cc/160?img=13" alt="Nova Quinn" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="text-left">
                      <span className="block text-sm font-semibold text-white">Nova Quinn</span>
                      <span className="text-xs text-slate-300">Chief Insight Officer</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-300" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </header>

            {/* mobile nav */}
            <div
              id="mobile-navigation"
              className={`glass-panel pointer-events-auto fixed left-0 top-0 z-40 h-full w-72 translate-x-[-110%] overflow-y-auto px-6 py-6 transition-transform duration-300 ease-out lg:hidden ${sidebarOpen ? 'translate-x-0' : ''}`}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Nebula Metrics</h2>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Command</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-white/10 p-2 text-slate-200 transition hover:border-aqua hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-10 space-y-6 text-sm text-slate-200">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Overview</p>
                  <ul className="mt-3 space-y-2">
                    {[
                      { name: 'Mission Control', icon: LayoutDashboard },
                      { name: 'Intelligence Feed', icon: Activity },
                      { name: 'Revenue Lab', icon: BarChart3 },
                      { name: 'Experience Grid', icon: Grid3X3 },
                    ].map((item) => (
                      <li key={item.name}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-left transition hover:border-aqua/40 hover:bg-white/5 hover:text-white"
                          aria-label={item.name}
                        >
                          <item.icon className="h-[18px] w-[18px] text-aqua" aria-hidden="true" />
                          <span>{item.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Streams</p>
                  <ul className="mt-3 space-y-2">
                    {[
                      { name: 'Lifecycle Intelligence', icon: LineChart },
                      { name: 'Acquisition Orbit', icon: PieChart },
                      { name: 'Forecast Studio', icon: TrendingUp },
                    ].map((item) => (
                      <li key={item.name}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-left transition hover:border-aurora/40 hover:bg-white/5 hover:text-white"
                          aria-label={item.name}
                        >
                          <item.icon className="h-[18px] w-[18px] text-aurora" aria-hidden="true" />
                          <span>{item.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                role="presentation"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
            )}

            <main className="relative z-0 flex-1">
              <section className="rounded-[32px] border border-white/5 bg-white/[0.03] px-5 py-6 shadow-inner shadow-black/20">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Signal Overview</p>
                    <h3 className="mt-2 max-w-xl text-3xl font-semibold leading-tight text-white">
                      Orchestrate data-rich journeys with live intelligence and adaptive decisioning
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setWidgetControlsOpen((prev) => !prev)}
                      className="relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aurora to-aqua px-4 py-3 text-sm font-medium text-white shadow-glow transition hover:shadow-glow-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-expanded={widgetControlsOpen}
                      aria-controls="widget-control-panel"
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                      Configure Widgets
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:border-aqua hover:text-aqua focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
                    >
                      Export Report
                    </button>
                  </div>
                </div>

                <div className="relative mt-8">
                  {widgetControlsOpen && (
                    <div
                      id="widget-control-panel"
                      className="absolute right-0 top-0 z-20 w-full max-w-sm rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-slate-200 shadow-glow backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold text-white">Widget Canvas</h4>
                        <button
                          type="button"
                          className="rounded-full border border-white/10 p-2 text-slate-200 transition hover:border-aqua hover:text-white"
                          onClick={() => setWidgetControlsOpen(false)}
                          aria-label="Close widget controls"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-3 text-xs text-slate-300">
                        Toggle modules to personalize your dashboard canvas. Changes persist for this session.
                      </p>
                      <ul className="mt-5 space-y-3">
                        {widgets.map((widget) => (
                          <li key={widget.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">{widget.title}</p>
                              <p className="text-xs text-slate-300">{widget.description}</p>
                            </div>
                            <label className="inline-flex cursor-pointer items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-white/20 bg-white/10 text-aurora focus:ring-aurora"
                                checked={visibleWidgets[widget.id]}
                                onChange={() => toggleWidget(widget.id)}
                                aria-label={`Toggle ${widget.title} widget`}
                              />
                              <span className="text-xs text-slate-300">Show</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid gap-4 pt-0 lg:grid-cols-4">
                    {kpis.map((kpi) => {
                      const DeltaIcon = kpi.delta >= 0 ? TrendingUp : ArrowDownRight;
                      return (
                      <article
                        key={kpi.label}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.01] p-5 text-white shadow-inner transition hover:-translate-y-1 hover:shadow-glow"
                      >
                        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-aurora/20 blur-2xl" aria-hidden />
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{kpi.label}</p>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-200">
                            {kpi.caption}
                          </span>
                        </div>
                        <p className="mt-4 text-3xl font-semibold">
                          {kpi.prefix}
                          {kpi.value.toFixed(1)}
                          {kpi.suffix}
                        </p>
                        <p className={`mt-2 inline-flex items-center gap-2 text-sm ${kpi.delta >= 0 ? 'text-aqua' : 'text-aurora'}`}>
                          <DeltaIcon className="h-4 w-4" aria-hidden="true" />
                          {kpi.delta > 0 ? '+' : ''}
                          {kpi.delta.toFixed(1)}%
                        </p>
                      </article>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {widgets
                  .filter((widget) => visibleWidgets[widget.id])
                  .map((widget) => (
                    <article
                      key={widget.id}
                      className={`widget-surface relative col-span-1 flex h-full flex-col overflow-hidden p-6 ${widget.size}`}
                      aria-label={widget.accessibilityLabel}
                    >
                      <header className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{widget.title}</h4>
                          <p className="text-xs text-slate-300">{widget.description}</p>
                        </div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                          Live
                        </span>
                      </header>
                      <div className="mt-6 flex-1">{widget.render()}</div>
                    </article>
                  ))}
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
