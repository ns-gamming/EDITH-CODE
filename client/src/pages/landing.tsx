import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center px-4 text-center transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur-sm px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">AI-Powered Development Platform</span>
        </div>

        <h1 className="mb-6 text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient">
          EDITH
        </h1>

        <p className="mb-4 text-2xl md:text-4xl font-semibold text-foreground max-w-4xl">
          Enhanced Development Interface for
          <br />
          Technology and Hacking
        </p>

        <p className="mb-12 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Build, deploy, and collaborate on projects with the power of AI.
          Experience intelligent code generation, real-time collaboration, and
          seamless deployment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button
            size="lg"
            onClick={() => setLocation("/auth")}
            className="gap-2 text-lg px-8 py-6"
            data-testid="button-get-started"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 text-lg px-8 py-6 bg-card/80 backdrop-blur-sm"
            data-testid="button-learn-more"
          >
            Learn More
            <Code2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="rounded-md border bg-card/80 backdrop-blur-sm p-6 hover-elevate">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">AI-Powered Coding</h3>
            <p className="text-muted-foreground">
              Intelligent code generation with Gemini AI that thinks before it codes
            </p>
          </div>

          <div className="rounded-md border bg-card/80 backdrop-blur-sm p-6 hover-elevate">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Live Preview</h3>
            <p className="text-muted-foreground">
              See your changes instantly with our advanced code editor and preview system
            </p>
          </div>

          <div className="rounded-md border bg-card/80 backdrop-blur-sm p-6 hover-elevate">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Community</h3>
            <p className="text-muted-foreground">
              Share projects, get feedback, and collaborate with developers worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
        <p>Powered by Gemini AI • Built with passion</p>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
