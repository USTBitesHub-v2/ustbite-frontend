import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Receipt, Settings, Plus, Trash2 } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/ust/Card";
import { Avatar } from "@/components/ui/ust/Avatar";
import { Button } from "@/components/ui/ust/Button";
import { Field, TextField } from "@/components/ui/ust/Input";
import { Skeleton } from "@/components/ui/ust/Skeleton";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { User, SavedFloor } from "@/types";

type Tab = "orders" | "floors" | "settings";

export default function ProfilePage() {
  const setUser = useAuthStore((s) => s.setUser);
  const [user, setLocalUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => {
    document.title = "My Profile — USTBite";
    userService.me().then((u) => { setLocalUser(u); setUser(u); setLoading(false); }).catch((err) => { toast.error(err?.response?.data?.message || err.message || 'Failed to load profile'); setLoading(false); });
  }, [setUser]);

  if (loading || !user) {
    return <PageWrapper><div className="max-w-4xl mx-auto px-4 py-10"><Skeleton className="h-48 w-full" /></div></PageWrapper>;
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Card className="p-6 flex items-center gap-4">
          <Avatar name={user.fullName} size="lg" />
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{user.fullName}</h1>
            <p className="text-sm text-text-secondary">{user.email} • {user.department}</p>
          </div>
        </Card>

        <div className="mt-6 flex gap-1 border-b border-border-soft" role="tablist">
          {([
            { k: "orders", label: "My Orders", icon: Receipt },
            { k: "floors", label: "Saved Floors", icon: MapPin },
            { k: "settings", label: "Account Settings", icon: Settings },
          ] as { k: Tab; label: string; icon: typeof Receipt }[]).map(({ k, label, icon: Icon }) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2 border-b-2 -mb-px",
                tab === k ? "border-brand-amber text-foreground" : "border-transparent text-text-secondary hover:text-foreground",
              )}>
              <Icon className="size-4" />{label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "orders" && (
            <Card className="p-6 text-center">
              <p className="text-text-secondary mb-4">View all your past USTBite orders.</p>
              <Button asChild variant="amber"><Link to="/orders">Go to Order History</Link></Button>
            </Card>
          )}
          {tab === "floors" && <SavedFloorsTab user={user} onUpdate={(u) => { setLocalUser(u); setUser(u); }} />}
          {tab === "settings" && <SettingsTab user={user} />}
        </div>
      </div>
    </PageWrapper>
  );
}

const SavedFloorsTab = ({ user, onUpdate }: { user: User; onUpdate: (u: User) => void }) => {
  const [floors, setFloors] = useState<SavedFloor[]>(user.savedFloors ?? []);
  const [draft, setDraft] = useState<SavedFloor>({ id: "", label: "", floor: "", wing: "" });

  const save = (next: SavedFloor[]) => {
    setFloors(next);
    userService.update({ savedFloors: next }).then(onUpdate).catch((err) => toast.error('Failed to update address'));
  };

  const add = () => {
    if (!draft.label || !draft.floor) { toast.error("Label and floor are required"); return; }
    save([...floors, { ...draft, id: `f${Date.now()}` }]);
    setDraft({ id: "", label: "", floor: "", wing: "" });
    toast.success("Floor saved");
  };

  return (
    <div className="space-y-4">
      <Card className="p-5 space-y-3">
        <h2 className="font-semibold text-foreground">Add a saved floor</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Label"><TextField value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="My Desk" /></Field>
          <Field label="Floor"><TextField value={draft.floor} onChange={(e) => setDraft({ ...draft, floor: e.target.value })} placeholder="5" /></Field>
          <Field label="Wing"><TextField value={draft.wing} onChange={(e) => setDraft({ ...draft, wing: e.target.value })} placeholder="A" /></Field>
        </div>
        <Button variant="amber" onClick={add}><Plus className="size-4" />Add floor</Button>
      </Card>
      {floors.length === 0 ? (
        <Card className="p-6 text-center text-sm text-text-secondary">No saved floors yet.</Card>
      ) : (
        <div className="space-y-2">
          {floors.map((f) => (
            <Card key={f.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-md bg-brand-amber-soft text-brand-amber flex items-center justify-center"><MapPin className="size-5" /></div>
                <div>
                  <p className="font-semibold text-foreground">{f.label}</p>
                  <p className="text-sm text-text-secondary">Floor {f.floor}{f.wing && `, Wing ${f.wing}`}</p>
                </div>
              </div>
              <button onClick={() => save(floors.filter((x) => x.id !== f.id))} className="text-text-secondary hover:text-accent-red" aria-label="Remove floor"><Trash2 className="size-4" /></button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const SettingsTab = ({ user }: { user: User }) => {
  const [name, setName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone ?? "");

  const save = async () => {
    await userService.update({ fullName: name, phone });
    toast.success("Profile updated");
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-semibold text-foreground">Account Settings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name"><TextField value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Phone"><TextField value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." /></Field>
        <Field label="Department" hint="Managed by HR"><TextField value={user.department} disabled /></Field>
        <Field label="Employee ID" hint="Managed by HR"><TextField value={user.employeeId} disabled /></Field>
      </div>
      <Button variant="amber" onClick={save}>Save changes</Button>
    </Card>
  );
};
