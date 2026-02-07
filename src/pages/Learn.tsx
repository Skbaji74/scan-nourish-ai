import Navigation from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Info, Utensils } from "lucide-react";
import { useEffect } from "react";

const Learn = () => {
  useEffect(() => {
    document.title = "Learn – Balanced Diet & Nutrition Facts | FoodScanAI";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Learn About a Balanced Diet</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quick, science-backed tips to help you make informed choices.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">The Plate Method</h2>
              </div>
              <Separator />
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Fill half your plate with non-starchy vegetables.</li>
                <li>One quarter with lean protein (fish, tofu, legumes).</li>
                <li>One quarter with whole grains or starchy vegetables.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Nutrition Facts at a Glance</h2>
              </div>
              <Separator />
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Prioritize fiber (aim for 25–35g/day).</li>
                <li>Limit added sugars; watch for aliases like dextrose or syrup.</li>
                <li>Prefer unsaturated fats; minimize trans fats.</li>
                <li>Check sodium: under 140mg/serving is considered low.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Smart Shopping Tips</h2>
              </div>
              <Separator />
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Choose items with shorter, recognizable ingredient lists.</li>
                <li>Compare per-100g values for a fair comparison.</li>
                <li>Be mindful of portion sizes vs. serving sizes.</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Learn;
