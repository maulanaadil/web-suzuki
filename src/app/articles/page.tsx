import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-white min-h-screen">
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-suzuki">
            Artikel
          </p>
          <h1 className="mt-3 font-suzuki-pro-headline text-4xl text-foreground md:text-5xl">
            Berita & Insight Terbaru
          </h1>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Informasi terkini seputar produk, teknologi, dan tips otomotif dari
            Suzuki Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-video bg-gray-200">
                <Image
                  src={article.imageUrl}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <span className="text-sm text-primary-suzuki font-medium">
                  {article.category}
                </span>
                <h2 className="font-bold text-foreground text-lg leading-snug line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
                  {article.snippet}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(article.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
