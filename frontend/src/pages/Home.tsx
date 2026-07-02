import {
  ArrowRight,
  BadgeCheck,
  Code2,
  Gauge,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  ServerCog,
  TerminalSquare,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { InfoCard } from "@/components/shared/InfoCard";

const features = [
  {
    icon: TerminalSquare,
    title: "Online Code Editor",
    description: "Write and run solutions in a focused browser-based editor.",
  },
  {
    icon: Languages,
    title: "Multiple Programming Languages",
    description: "Practice with popular languages supported by the judge flow.",
  },
  {
    icon: ServerCog,
    title: "Judge0 Integration",
    description: "Submit code through the existing Judge0 execution pipeline.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Authentication",
    description: "OTP, admin, and super admin access stay separated by role.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description: "Manage problem content from a cleaner operational workspace.",
  },
  {
    icon: Gauge,
    title: "Fast Problem Solving",
    description: "Move quickly from problem discovery to coding and feedback.",
  },
];

const stats = [
  { label: "Problems", value: "50+" },
  { label: "Languages", value: "7" },
  { label: "Users", value: "1k+" },
  { label: "Admin Panel", value: "Live" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-16">
      <section className="overflow-hidden rounded-lg border bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_32%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] px-6 py-16 sm:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-sm text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Production-ready coding practice
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Build sharper problem-solving habits in CloudIDE.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Practice coding challenges, submit solutions, and manage problem
              content from a cleaner, faster platform experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/problems">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Solving
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          <Card className="bg-background/75 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Code2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">CloudIDE Workspace</p>
                <p className="text-sm text-muted-foreground">
                  Code, submit, review, repeat
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-md bg-zinc-950 p-4 font-mono text-sm text-zinc-100">
              <p className="text-emerald-300">function solve(input) {"{"}</p>
              <p className="pl-4 text-zinc-300">return optimize(input);</p>
              <p className="text-emerald-300">{"}"}</p>
              <p className="mt-4 text-sky-300">Status: Accepted</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            Platform features
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Everything needed for a focused coding workflow.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <InfoCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
}
