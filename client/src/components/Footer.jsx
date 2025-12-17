import { Link } from "react-router-dom";
import { Music, Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">ChordBase</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link
              href="/songs"
              className="text-sm text-muted-foreground hover:text-foreground">
              Songs
            </Link>
            <Link
              href="/upload"
              className="text-sm text-muted-foreground hover:text-foreground">
              Upload
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ChordBase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
