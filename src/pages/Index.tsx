import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import ProfileOnboarding from "@/components/ProfileOnboarding";
import ScanInterface from "@/components/ScanInterface";
import ResultsDisplay from "@/components/ResultsDisplay";
import FoodChatModal from "@/components/FoodChatModal";
import { Scan, Brain, Shield, Zap, ArrowRight, Check } from "lucide-react";
import heroScanImage from "@/assets/hero-scan.jpg";
import healthyFoodsImage from "@/assets/healthy-foods.jpg";

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

interface ScanResult {
  score: number;
  ingredients: string[];
  highlights: string[];
  summary?: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'scan' | 'results'>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('userProfile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleGetStarted = () => {
    setCurrentView('onboarding');
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    // Persist locally so the Profile page can show details across routes
    try { localStorage.setItem('userProfile', JSON.stringify(profile)); } catch {}
    setCurrentView('scan');
  };

  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    setCurrentView('results');
  };

  const handleNewScan = () => {
    setScanResult(null);
    setCurrentView('scan');
  };

  const handleStartChat = () => {
    setChatOpen(true);
  };

  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Set Up Your Health Profile</h1>
            <p className="text-muted-foreground">
              Help us provide personalized health insights for your food choices
            </p>
          </div>
          <ProfileOnboarding onComplete={handleProfileComplete} initialData={userProfile} />
        </div>
      </div>
    );
  }

  if (currentView === 'scan') {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userProfile?.name}!
            </h1>
            <p className="text-muted-foreground">
              Ready to scan your next food product?
            </p>
          </div>
          <ScanInterface onScanComplete={handleScanComplete} />
        </div>
      </div>
    );
  }

  if (currentView === 'results' && scanResult) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Health Analysis Complete</h1>
            <p className="text-muted-foreground">
              Here's how this product matches your health profile
            </p>
          </div>
          <ResultsDisplay 
            result={scanResult}
            onStartChat={handleStartChat}
            onNewScan={handleNewScan}
          />
        </div>
        {/* Chat Modal */}
        {scanResult && (
          <FoodChatModal open={chatOpen} onOpenChange={setChatOpen} result={scanResult} />
        )}
      </div>
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Know What You're
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    {" "}Eating
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Get instant, personalized health scores for any packaged food. 
                  Just scan the ingredients and let AI guide your choices.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="text-lg px-8 py-6"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Start Scanning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Watch Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>Instant results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>Personalized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>Privacy-first</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroScanImage} 
                alt="Person scanning food label with smartphone" 
                className="rounded-2xl shadow-elegant w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-xl shadow-soft border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-excellent">85</div>
                  <div className="text-sm text-muted-foreground">Health Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How FoodScanAI Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and personalized food analysis in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-soft hover:shadow-elegant transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scan className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">1. Scan Ingredients</h3>
                <p className="text-muted-foreground">
                  Take a photo of any ingredient list or nutrition label with your camera
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-elegant transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">2. AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes ingredients against your health profile and preferences
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-elegant transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">3. Get Insights</h3>
                <p className="text-muted-foreground">
                  Receive instant health scores and personalized recommendations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={healthyFoodsImage} 
                alt="Fresh healthy foods" 
                className="rounded-2xl shadow-elegant w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Make Healthier Choices with Confidence
              </h2>
              <p className="text-xl text-muted-foreground">
                Stop guessing about nutrition labels. Get clear, personalized guidance 
                that considers your allergies, health conditions, and dietary goals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Allergy Protection</h4>
                    <p className="text-muted-foreground">
                      Instantly identify ingredients that could trigger your allergies
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Personalized Insights</h4>
                    <p className="text-muted-foreground">
                      Health scores tailored to your specific conditions and goals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Instant Results</h4>
                    <p className="text-muted-foreground">
                      Get answers in seconds while you're shopping in the store
                    </p>
                  </div>
                </div>
              </div>

              <Button size="lg" onClick={handleGetStarted} className="mt-8">
                Try FoodScanAI Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <Scan className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FoodScanAI</span>
          </div>
          <p className="text-muted-foreground">
            Making healthy food choices simple and accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;