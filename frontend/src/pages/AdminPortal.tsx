import { Link } from "react-router-dom";
import { ShieldCheck, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminPortal() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Admin Portal"
        title="Choose your workspace"
        description="Access problem management or super admin controls from one secure entry point."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Admin Login</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Manage coding problems, update visibility, and keep the problem set
            ready for users.
          </p>
          <Link to="/admin/signin" className="mt-6 inline-flex">
            <Button>Open Admin Login</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Super Admin Login</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create admin accounts and control platform administration access.
          </p>
          <Link to="/superadmin/signin" className="mt-6 inline-flex">
            <Button variant="outline">Open Super Admin Login</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
