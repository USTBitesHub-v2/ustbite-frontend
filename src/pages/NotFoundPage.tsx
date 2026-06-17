import { Link } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/ust/Button";

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <p className="font-display text-6xl font-bold text-brand-amber">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-text-secondary">The page you're looking for doesn't exist on USTBite.</p>
        <Button asChild variant="amber" className="mt-8"><Link to="/">Back to home</Link></Button>
      </div>
    </PageWrapper>
  );
}
