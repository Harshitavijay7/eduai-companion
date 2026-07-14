import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — IntelliLearn AI" }] }),
});

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <Card className="glass p-6">
      <h3 className="font-semibold">{title}</h3>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, preferences, and privacy." icon={SettingsIcon} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Profile" desc="Update your public profile.">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16"><AvatarFallback className="gradient-bg text-lg font-bold text-white">AK</AvatarFallback></Avatar>
            <Button variant="outline">Change photo</Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Name</Label><Input defaultValue="Alex Kumar" /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="alex@intellilearn.ai" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label>Institution</Label><Input defaultValue="IIT Delhi" /></div>
          </div>
          <Button className="mt-5 gradient-bg text-white glow">Save changes</Button>
        </Section>

        <Section title="Appearance" desc="Customize the look and feel.">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Theme</Label>
              <div className="flex gap-2">
                {(["dark", "light"] as const).map((t) => (
                  <button key={t} onClick={() => setTheme(t)} className={`rounded-lg border px-4 py-1.5 text-sm capitalize transition ${theme === t ? "gradient-bg text-white border-transparent glow" : "border-border hover:bg-accent"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        <Section title="Notifications" desc="Choose what you want to hear about.">
          {[
            { l: "Email — weekly study report", d: true },
            { l: "Push — new features & tips", d: false },
            { l: "Email — quiz reminders", d: true },
          ].map((n) => (
            <div key={n.l} className="flex items-center justify-between py-2">
              <Label className="font-normal">{n.l}</Label>
              <Switch defaultChecked={n.d} />
            </div>
          ))}
        </Section>

        <Section title="Privacy" desc="Control how your data is used.">
          {[
            { l: "Allow anonymous analytics", d: true },
            { l: "Save chat history", d: true },
            { l: "Personalize recommendations", d: false },
          ].map((n) => (
            <div key={n.l} className="flex items-center justify-between py-2">
              <Label className="font-normal">{n.l}</Label>
              <Switch defaultChecked={n.d} />
            </div>
          ))}
        </Section>

        <Card className="glass border-destructive/30 p-6 lg:col-span-2">
          <h3 className="font-semibold text-destructive">Danger Zone</h3>
          <p className="mt-1 text-sm text-muted-foreground">Permanently delete your account and all your data. This cannot be undone.</p>
          <Button variant="destructive" className="mt-4"><Trash2 className="mr-1 h-4 w-4" />Delete account</Button>
        </Card>
      </div>
    </div>
  );
}
