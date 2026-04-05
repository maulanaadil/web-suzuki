import React from "react";

export default function CreditCalculatorPage() {
  return (
    <main className="min-h-screen bg-white pt-8">
      <section className="container mx-auto px-4">
        <iframe
          src="https://www.sfi.co.id/credit_simulation"
          className="w-full min-h-screen"
        />
      </section>
    </main>
  );
}
