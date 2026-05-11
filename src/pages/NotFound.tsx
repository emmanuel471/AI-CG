import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <span className="text-2xl">🤖</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Go home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition"
          >
            Go back
          </button>
        </div>

      </div>
    </div>
  );
}