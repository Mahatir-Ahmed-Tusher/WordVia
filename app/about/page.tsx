import Link from "next/link";
import { ArrowLeft, Github, Linkedin, Mail, GraduationCap } from "lucide-react";
import Image from "next/image";
const wordviaLogo = "/wordvia-logo.png";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About WordVia - Our Story",
  description: "Learn about the origins of WordVia, a word game that started with pen and paper and evolved into a digital experience.",
};

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/" 
              className="p-2 rounded-xl bg-secondary hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <Image src={wordviaLogo} alt="WordVia Logo" width={48} height={48} />
              <h1 className="text-3xl font-display font-bold text-primary glow-text">
                About WordVia
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="glass-card p-6 md:p-8 space-y-6 animate-slide-up">
            <div className="prose prose-invert max-w-none space-y-5">
              <p className="text-foreground/90 leading-relaxed text-lg">
                <span className="text-primary font-semibold">WordVia</span> was one of my most cherished pastimes growing up. Back then, it wasn&apos;t an app; it was a simple game played with nothing but pen and paper in our notebooks. I spent hours playing it with my cousin, <span className="text-primary font-medium">Limon Ahmed</span>. To this day, I&apos;m not sure if he invented the game himself or learned it elsewhere, as he never mentioned its origins.
              </p>

              <p className="text-foreground/90 leading-relaxed text-lg">
                Regardless of where it came from, the game fundamentally shaped my lexical resources. As a child learning English as a second language, I struggled with spelling and made frequent errors, but WordVia turned learning into a challenge. We played almost every week, yet Limon Bhaia never gave the game an official name.
              </p>

              <p className="text-foreground/90 leading-relaxed text-lg">
                As I grew up, the game faded into memory until the <span className="text-primary font-medium">COVID-19 lockdown</span>. Stuck at home, I reintroduced the game to my younger siblings, <span className="text-primary font-medium">Punno</span> and <span className="text-primary font-medium">Nourin</span>, using the same old-fashioned notebooks. At the time, their English was limited; I often had to &quot;play dumb&quot; or act as their tutor to keep the game going.
              </p>

              <p className="text-foreground/90 leading-relaxed text-lg">
                Since then, WordVia has become the highlight of every family gathering. Six years have passed since my siblings first learned the rules, and frankly, the students have surpassed the teacher—they beat me in almost every match!
              </p>

              <p className="text-foreground/90 leading-relaxed text-lg">
                Inspired by these memories, I decided to evolve the game from the pages of a notebook into a mobile application. I named it &quot;<span className="text-primary font-semibold">WordVia</span>&quot; as a tribute to those childhood afternoons with Limon Bhaia and as a dedication to Punno and Nourin, the two people who loved this game as much as I did.
              </p>
            </div>

            {/* Developer Section */}
            <div className="border-t border-border/30 pt-6 mt-8">
              <p className="text-muted-foreground font-display text-lg mb-2">Developer,</p>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Mahatir Ahmed Tusher
              </h2>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/Mahatir-Ahmed-Tusher"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-accent transition-colors text-foreground"
                >
                  <Github className="w-5 h-5" />
                  <span className="font-medium">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/mahatir-ahmed-tusher-5a5524257/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-accent transition-colors text-foreground"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="font-medium">LinkedIn</span>
                </a>
                <a
                  href="https://scholar.google.com/citations?user=k8hhhx4AAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-accent transition-colors text-foreground"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-medium">Google Scholar</span>
                </a>
                <a
                  href="mailto:mahatirtusher@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-accent transition-colors text-foreground"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

