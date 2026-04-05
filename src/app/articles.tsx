import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ArticleItem = {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  category: string;
  imageUrl: string;
  createdAt: string;
};

export default function Articles() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((json) => setArticles(json.data ?? []))
      .catch(() => {});
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = 380;
    const offset = direction === "left" ? -step : step;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (articles.length === 0) return null;

  return (
    <section
      id="articles-section"
      className="w-full bg-white pt-16 pb-8 container mx-auto px-4"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold font-suzuki-pro-headline text-foreground">
          Artikel Terbaru
        </h2>
        <Link
          href="/articles"
          className="text-sm text-primary-suzuki hover:underline"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="flex flex-col gap-8">
        <div
          className="overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
          ref={scrollRef}
        >
          <div className="flex gap-6 pb-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200 w-full" aria-hidden />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-2 rounded text-gray-500 hover:text-foreground hover:bg-gray-100 transition-colors"
              aria-label="Previous articles"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-2 rounded text-gray-500 hover:text-foreground hover:bg-gray-100 transition-colors"
              aria-label="Next articles"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: ArticleItem }) {
  const date = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(article.createdAt));

  return (
    <Link href={`/articles/${article.slug}`}>
      <article className="shrink-0 w-[320px] sm:w-[360px] flex flex-col bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative w-full aspect-video bg-gray-200">
          <Image
            src={article.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 320px, 360px"
          />
        </div>
        <div className="p-4 flex flex-col gap-2">
          <span className="font-sans text-sm text-primary-suzuki font-medium">
            {article.category}
          </span>
          <h3 className="font-sans text-foreground font-bold text-base leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="font-sans text-gray-500 text-sm leading-relaxed line-clamp-3">
            {article.snippet}
          </p>
          <p className="font-sans text-gray-400 text-xs mt-1">{date}</p>
        </div>
      </article>
    </Link>
  );
}
