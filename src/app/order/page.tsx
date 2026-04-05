"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";

import { WHATSAPP_NUMBER } from "../../constants/whatsapp";

type CarModel = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  vehicleType: string | null;
};

type OrderFormState = {
  jenisKendaraan: string;
  produk: string;
  modelSlug: string;
  namaLengkap: string;
  noKtp: string;
  nomorHp: string;
  kotaDomisili: string;
  email: string;
};

const initialState: OrderFormState = {
  jenisKendaraan: "",
  produk: "Mobil Suzuki",
  modelSlug: "",
  namaLengkap: "",
  noKtp: "",
  nomorHp: "",
  kotaDomisili: "",
  email: "",
};

export default function OrderPage() {
  const params = useSearchParams();
  const initialModel = params.get("model") ?? "";

  const [form, setForm] = useState<OrderFormState>({
    ...initialState,
    modelSlug: initialModel,
  });
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((json) =>
        setCarModels(
          (json.data ?? []).map((c: CarModel) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            category: c.category,
            vehicleType: c.vehicleType,
          })),
        ),
      )
      .catch(() => {});
  }, []);

  const filteredModels = useMemo(() => {
    if (!form.jenisKendaraan) return carModels;
    return carModels.filter(
      (c) =>
        c.vehicleType?.toUpperCase() ===
        form.jenisKendaraan.toUpperCase(),
    );
  }, [carModels, form.jenisKendaraan]);

  const selectedModel = carModels.find((c) => c.slug === form.modelSlug);

  const isSubmitDisabled = useMemo(() => {
    return (
      submitting ||
      !(
        form.jenisKendaraan &&
        form.produk &&
        form.modelSlug &&
        form.namaLengkap &&
        form.noKtp &&
        form.nomorHp &&
        form.kotaDomisili
      )
    );
  }, [form, submitting]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelSlug: form.modelSlug,
          name: form.namaLengkap,
          idCardNumber: form.noKtp,
          phone: form.nomorHp,
          email: form.email || undefined,
          city: form.kotaDomisili,
          vehicleType: form.jenisKendaraan,
        }),
      });
    } catch {
      // still redirect to WhatsApp even if DB save fails
    }

    const modelName = selectedModel?.name ?? form.modelSlug;

    const message = [
      "Halo Suzuki, saya ingin order kendaraan dengan data berikut:",
      "",
      `- Jenis Kendaraan: ${form.jenisKendaraan}`,
      `- Produk: ${form.produk}`,
      `- Model: ${modelName}`,
      `- Nama Lengkap: ${form.namaLengkap}`,
      `- No KTP: ${form.noKtp}`,
      `- Nomor HP: ${form.nomorHp}`,
      `- Kota Domisili: ${form.kotaDomisili}`,
      `- Email: ${form.email || "-"}`,
      "",
      "Mohon dibantu untuk informasi promo, simulasi cicilan, dan proses selanjutnya. Terima kasih.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] pt-28 pb-16">
      <section className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-[#123C82] px-6 py-5 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">
              Suzuki Finance
            </p>
            <h1 className="mt-1 text-3xl font-suzuki-pro-headline">
              Form Pemesanan Kendaraan
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 px-6 py-7 md:px-10"
          >
            <FormSelect
              label="Pilih jenis kendaraan"
              value={form.jenisKendaraan}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  jenisKendaraan: value,
                  modelSlug: "",
                }))
              }
              options={[
                { label: "Passenger", value: "PASSENGER" },
                { label: "Commercial", value: "COMMERCIAL" },
              ]}
              placeholder="Pilih jenis kendaraan"
            />

            <FormInput
              label="Produk"
              value={form.produk}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, produk: value }))
              }
              placeholder="Pilih Produk"
            />

            <FormSelect
              label="Model"
              value={form.modelSlug}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, modelSlug: value }))
              }
              options={filteredModels.map((c) => ({
                label: c.name,
                value: c.slug,
              }))}
              placeholder="Pilih Model"
            />

            <FormInput
              label="Nama Lengkap (Sesuai KTP)"
              value={form.namaLengkap}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, namaLengkap: value }))
              }
              placeholder="Masukan Nama Lengkap"
            />

            <FormInput
              label="No KTP"
              value={form.noKtp}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, noKtp: value }))
              }
              placeholder="Masukan Nomor KTP"
            />

            <FormInput
              label="Nomor HP"
              value={form.nomorHp}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, nomorHp: value }))
              }
              placeholder="Masukan Nomor HP"
            />

            <FormInput
              label="Kota Domisili"
              value={form.kotaDomisili}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, kotaDomisili: value }))
              }
              placeholder="Masukan Kota Domisili"
            />

            <FormInput
              label="Email"
              value={form.email}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, email: value }))
              }
              placeholder="Masukan Email (opsional)"
              required={false}
            />

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#123C82] px-10 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Kirim ke WhatsApp
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function FormInput({
  label,
  value,
  placeholder,
  onChange,
  required = true,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}{" "}
        {required && <span className="text-red-600">*</span>}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-13 w-full rounded-md border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition-colors focus:border-[#123C82]"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label} <span className="text-red-600">*</span>
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-13 w-full appearance-none rounded-md border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition-colors focus:border-[#123C82]"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
      </div>
    </label>
  );
}
