import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import OrderForm from "./order-form";

function OrderFormFallback() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] pt-28 pb-16">
      <section className="container mx-auto px-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white py-24 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#123C82]" />
          <p className="text-sm text-gray-600">Memuat form…</p>
        </div>
      </section>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderFormFallback />}>
      <OrderForm />
    </Suspense>
  );
}
