import { Suspense } from "react";
import SearchContent from "./search-content";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white pt-28 pb-16">
          <section className="container mx-auto px-4">
            <p className="text-sm text-gray-500">Memuat pencarian…</p>
          </section>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
