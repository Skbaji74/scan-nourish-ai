import Navigation from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface UserProfile {
  name: string;
  age: string;
  weight: string;
  height: string;
  allergies: string[];
  conditions: string[];
  preferences: string[];
  customAllergies: string;
  customConditions: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    document.title = "Profile | FoodScanAI";
    const stored = localStorage.getItem("userProfile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const hasData = useMemo(() => !!profile, [profile]);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Health Profile</h1>
          <p className="text-muted-foreground">Review the details you provided</p>
        </header>

        {!hasData ? (
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                No profile found yet. Create your profile to get personalized results.
              </p>
              <Button asChild>
                <a href="/">Create Profile <ArrowRight className="w-4 h-4 ml-2" /></a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <section className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="text-xl font-semibold">Basic Info</h2>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Name</div>
                    <div className="font-medium">{profile!.name || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Age</div>
                    <div className="font-medium">{profile!.age || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Weight</div>
                    <div className="font-medium">{profile!.weight || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Height</div>
                    <div className="font-medium">{profile!.height || "-"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="text-xl font-semibold">Allergies</h2>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {profile!.allergies?.length ? (
                    profile!.allergies.map((a, i) => <Badge key={i}>{a}</Badge>)
                  ) : (
                    <span className="text-sm text-muted-foreground">None specified</span>
                  )}
                </div>
                {profile!.customAllergies && (
                  <p className="text-sm text-muted-foreground">Other: {profile!.customAllergies}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="text-xl font-semibold">Health Conditions</h2>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {profile!.conditions?.length ? (
                    profile!.conditions.map((c, i) => <Badge key={i}>{c}</Badge>)
                  ) : (
                    <span className="text-sm text-muted-foreground">None specified</span>
                  )}
                </div>
                {profile!.customConditions && (
                  <p className="text-sm text-muted-foreground">Other: {profile!.customConditions}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="text-xl font-semibold">Dietary Preferences</h2>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {profile!.preferences?.length ? (
                    profile!.preferences.map((p, i) => <Badge key={i}>{p}</Badge>)
                  ) : (
                    <span className="text-sm text-muted-foreground">None specified</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default Profile;
