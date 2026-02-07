import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, User, Heart, AlertTriangle } from "lucide-react";

interface ProfileData {
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

interface ProfileOnboardingProps {
  onComplete: (profile: ProfileData) => void;
  initialData?: ProfileData | null;
}

const ProfileOnboarding = ({ onComplete, initialData }: ProfileOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ProfileData>(() => {
    if (initialData) {
      return initialData;
    }
    return {
      name: "",
      age: "",
      weight: "",
      height: "",
      allergies: [],
      conditions: [],
      preferences: [],
      customAllergies: "",
      customConditions: ""
    };
  });

  const commonAllergies = [
    "Dairy", "Eggs", "Fish", "Shellfish", "Tree nuts", 
    "Peanuts", "Wheat", "Soy", "Sesame"
  ];

  const commonConditions = [
    "Diabetes", "High blood pressure", "Heart disease", 
    "High cholesterol", "Celiac disease", "Food sensitivities"
  ];

  const dietaryPreferences = [
    "Vegetarian", "Vegan", "Gluten-free", "Keto", 
    "Low-sodium", "Low-sugar", "Organic only"
  ];

  const handleAllergyToggle = (allergy: string) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleConditionToggle = (condition: string) => {
    setProfile(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const handlePreferenceToggle = (preference: string) => {
    setProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return profile.name && profile.age;
      case 2:
        return true; // Health info is optional
      case 3:
        return true; // Preferences are optional
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepNumber
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Basic Info</span>
          <span>Health</span>
          <span>Preferences</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === 1 && <User className="w-5 h-5" />}
            {step === 2 && <Heart className="w-5 h-5" />}
            {step === 3 && <AlertTriangle className="w-5 h-5" />}
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Health information"}
            {step === 3 && "Dietary preferences"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Basic information to personalize your health scores"}
            {step === 2 && "Help us identify ingredients that might affect you"}
            {step === 3 && "Optional preferences for better recommendations"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (optional)</Label>
                  <Input
                    id="weight"
                    placeholder="70 kg"
                    value={profile.weight}
                    onChange={(e) => setProfile(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (optional)</Label>
                  <Input
                    id="height"
                    placeholder="175 cm"
                    value={profile.height}
                    onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Common allergies</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonAllergies.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={profile.allergies.includes(allergy)}
                        onCheckedChange={() => handleAllergyToggle(allergy)}
                      />
                      <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customAllergies">Other allergies</Label>
                  <Textarea
                    id="customAllergies"
                    placeholder="Any other allergies or food sensitivities..."
                    value={profile.customAllergies}
                    onChange={(e) => setProfile(prev => ({ ...prev, customAllergies: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Health conditions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={profile.conditions.includes(condition)}
                        onCheckedChange={() => handleConditionToggle(condition)}
                      />
                      <Label htmlFor={condition} className="text-sm">{condition}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customConditions">Other conditions</Label>
                  <Textarea
                    id="customConditions"
                    placeholder="Any other health conditions we should know about..."
                    value={profile.customConditions}
                    onChange={(e) => setProfile(prev => ({ ...prev, customConditions: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium">Dietary preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dietaryPreferences.map((preference) => (
                  <div key={preference} className="flex items-center space-x-2">
                    <Checkbox
                      id={preference}
                      checked={profile.preferences.includes(preference)}
                      onCheckedChange={() => handlePreferenceToggle(preference)}
                    />
                    <Label htmlFor={preference} className="text-sm">{preference}</Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                These preferences help us provide more personalized recommendations.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="ml-auto"
            >
              {step === 3 ? "Complete Setup" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOnboarding;