import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-display-xl font-display text-white">404</h1>
      <p className="mt-4 text-body text-fg-muted">This page could not be found.</p>
      <Link
        href="/"
        className="mt-6 inline-block text-label font-label text-electric-300 underline underline-offset-4 hover:text-white"
      >
        Return Home
      </Link>
    </div>
  );
}
