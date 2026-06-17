import { Link } from "react-router-dom";
import { Search, ShoppingBag, Truck, ChefHat } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/ust/Card";
import { Button } from "@/components/ui/ust/Button";

const STEPS = [
  { icon: Search, title: "1. Browse", body: "Pick from 8 cafeteria restaurants on campus." },
  { icon: ShoppingBag, title: "2. Order", body: "Add dishes to cart, choose your floor and pay." },
  { icon: ChefHat, title: "3. We Prepare", body: "The cafeteria starts cooking your fresh meal." },
  { icon: Truck, title: "4. Delivered", body: "Track your order floor by floor — delivered to your desk." },
];

export default function HowItWorksPage() {
  return (
    <PageWrapper>
      <section className="bg-surface-soft border-b border-border-soft py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-amber font-semibold">How it works</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-foreground">From cafeteria to your floor in 4 steps</h1>
          <p className="mt-4 text-text-secondary">Skip the queue. Order in seconds. Eat at your desk.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-6">
              <div className="size-11 rounded-md bg-brand-amber-soft flex items-center justify-center text-brand-amber"><Icon className="size-5" /></div>
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="amber" size="lg"><Link to="/restaurants">Browse Restaurants</Link></Button>
        </div>
      </section>
    </PageWrapper>
  );
}
