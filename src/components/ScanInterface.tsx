import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScanInterfaceProps {
  onScanComplete?: (result: any) => void;
}

interface UserProfile {
  allergies?: string[];
  conditions?: string[];
  preferences?: string[];
}

const ScanInterface = ({ onScanComplete }: ScanInterfaceProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserProfile = (): UserProfile => {
    try {
      const stored = localStorage.getItem("userHealthProfile");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading user profile:", e);
    }
    return {};
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsProcessing(true);
    setAnalysisComplete(false);

    try {
      const userProfile = getUserProfile();
      
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { imageBase64, userProfile },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Failed to analyze image. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (data.error) {
        console.error("Analysis error:", data.error);
        toast.error(data.error);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
      setAnalysisComplete(true);
      onScanComplete?.(data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 4MB for base64 to work well with Gemini)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large. Please use an image under 4MB.");
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      setIsUploading(false);
      
      // Start AI analysis
      await analyzeImage(base64);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setUploadedImage(null);
    setIsProcessing(false);
    setAnalysisComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="border-2 border-dashed border-primary/20 bg-primary-light/30">
        <CardContent className="p-8">
          {!uploadedImage ? (
            <div className="text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                <Camera className="w-12 h-12 text-primary-foreground" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Scan Food Label</h3>
                <p className="text-muted-foreground">
                  Take a photo or upload an image of the ingredient list
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleCameraCapture}
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 mr-2" />
                  )}
                  Take Photo
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded food label" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearImage}
                  className="absolute top-2 right-2"
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {isProcessing ? (
                <div className="text-center space-y-2">
                  <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Reading ingredients with OCR...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Analyzing with Gemini AI
                  </p>
                </div>
              ) : analysisComplete ? (
                <div className="text-center space-y-2">
                  <CheckCircle className="w-8 h-8 mx-auto text-success" />
                  <p className="text-sm text-success font-medium">
                    Analysis complete!
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ScanInterface;
