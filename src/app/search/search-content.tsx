"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
};

type SearchArticle = {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  category: string;
};

const searchablePages = [
  { label: "Home", href: "/", description: "Halaman utama Suzuki" },
  { label: "Cars", href: "/cars", description: "Lihat semua produk mobil Suzuki" },
  { label: "Contact", href: "/contact", description: "Hubungi sales Suzuki" },
  { label: "Reviews", href: "/reviews", description: "Testimoni pelanggan Suzuki" },
  { label: "Articles", href: "/articles", description: "Artikel dan berita terbaru Suzuki" },
  { label: "Credit Calculator", href: "/credit-calculator", description: "Simulasi kredit kendaraan Suzuki" },
  { label: "Order", href: "/order", description: "Form pemesanan kendaraan Suzuki" },
];

export default function SearchContent() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [articles, setArticles] = useState<SearchArticle[]>([]);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((json) => setProducts(json.data ?? []))
      .catch(() => {});

    fetch("/api/articles")
      .then((res) => res.json())
      .then((json) => setArticles(json.data ?? []))
      .catch(() => {});
  }, []);

  const normalizedQuery = query.toLowerCase();

  const matchedPages = useMemo(() => {
    if (!normalizedQuery) return [];
    return searchablePages.filter(
      (page) =>
        page.label.toLowerCase().includes(normalizedQuery) ||
        page.description.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const matchedProducts = useMemo(() => {
    if (!normalizedQuery) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, products]);

  const matchedArticles = useMemo(() => {
    if (!normalizedQuery) return [];
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.snippet.toLowerCase().includes(normalizedQuery) ||
        article.category.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, articles]);

  return (
    <main className="min-h-screen bg-white pt-28 pb-16">
      <section className="container mx-auto px-4">
        <h1 className="text-3xl font-suzuki-pro-headline text-foreground">
          Hasil pencarian: {query || "-"}
        </h1>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Halaman</h2>
            <div className="mt-3 space-y-3">
              {matchedPages.length === 0 && (
                <p className="text-sm text-gray-500">Tidak ada halaman yang cocok.</p>
              )}
              {matchedPages.map((page) => (
                <Link
                  href={page.href}
                  key={page.href}
                  className="block rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50"
                >
                  <p className="font-medium text-foreground">{page.label}</p>
                  <p className="text-sm text-gray-500">{page.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Produk</h2>
            <div className="mt-3 space-y-3">
              {matchedProducts.length === 0 && (
                <p className="text-sm text-gray-500">Tidak ada produk yang cocok.</p>
              )}
              {matchedProducts.map((product) => (
                <Link
                  href={`/cars/${product.slug}`}
                  key={product.id}
                  className="block rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50"
                >
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-gray-500">Lihat detail produk</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Artikel</h2>
            <div className="mt-3 space-y-3">
              {matchedArticles.length === 0 && (
                <p className="text-sm text-gray-500">Tidak ada artikel yang cocok.</p>
              )}
              {matchedArticles.map((article) => (
                <Link
                  href={`/articles/${article.slug}`}
                  key={article.id}
                  className="block rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50"
                >
                  <span className="text-xs font-medium text-primary-suzuki">
                    {article.category}
                  </span>
                  <p className="font-medium text-foreground">{article.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {article.snippet}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
