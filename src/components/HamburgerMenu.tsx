"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Info, BookOpen, Settings, Volume2, VolumeX } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import { Slider } from "@/components/ui/slider";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();
  const { isMuted, volume, toggleMute, setVolume } = useMusic();

  const menuItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/rules", label: "Rules", icon: BookOpen },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-40 p-3 hover:opacity-70 transition-opacity"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-secondary/95 backdrop-blur-xl border-l border-border/30 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Menu Content */}
        <nav className="pt-20 px-4 pb-24">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            
            {/* Settings Button */}
            <li>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-display font-medium transition-all duration-200 ${
                  showSettings
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </li>
          </ul>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/30 space-y-4 animate-slide-up">
              <h3 className="font-display font-semibold text-foreground mb-3">Audio Settings</h3>
              
              {/* Mute/Unmute Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-primary" />
                  )}
                  <span className="font-display text-sm text-foreground">
                    Background Music
                  </span>
                </div>
                <button
                  onClick={toggleMute}
                  className={`px-4 py-2 rounded-lg font-display text-sm font-medium transition-colors ${
                    isMuted
                      ? "bg-muted text-muted-foreground hover:bg-muted/80"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-foreground">Volume</span>
                  <span className="font-display text-sm text-muted-foreground">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={(values) => setVolume(values[0])}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                  disabled={isMuted}
                />
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <p className="text-center text-muted-foreground text-sm font-display">
            WordVia
          </p>
        </div>
      </div>
    </>
  );
}

export default HamburgerMenu;
