import { Button } from "@/components/ui/button";
import { Leaf, BookOpen } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-xl">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FoodScanAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/learn"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              Learn
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              AI Chat
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              Profile
            </NavLink>
          </div>

          {/* CTA Button */}
          <Link to="/" className="hidden md:flex">
            <Button variant="default">
              Get Started
            </Button>
          </Link>

          {/* Mobile Menu Button - simple link to home for now */}
          <Link to="/" className="md:hidden">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;