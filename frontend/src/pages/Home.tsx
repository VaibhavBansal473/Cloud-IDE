import { ArrowRight, Code2, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-16 h-full w-full">
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Master Your Coding Skills
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Practice coding, prepare for interviews, and improve your problem-solving skills
          with our collection of programming challenges.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/problems">
            <Button size="lg">
              Start Coding
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <Code2 className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-xl font-semibold">Diverse Problems</h3>
          <p className="mt-2 text-muted-foreground">
            From easy to hard, covering various topics and algorithms
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <Users className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-xl font-semibold">Active Community</h3>
          <p className="mt-2 text-muted-foreground">
            Learn from others and share your solutions
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <Trophy className="h-12 w-12 text-primary" />
          <h3 className="mt-4 text-xl font-semibold">Track Progress</h3>
          <p className="mt-2 text-muted-foreground">
            Monitor your improvement and earn achievements
          </p>
        </div>
      </section>
    </div>
  );
}