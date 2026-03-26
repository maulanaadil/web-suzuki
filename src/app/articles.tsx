import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const articlesData = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=260&fit=crop",
    category: "News",
    title:
      "Suzuki Indonesia Launches New Ertiga Hybrid with Enhanced Fuel Efficiency",
    snippet:
      "Suzuki Indonesia today announced the launch of the all-new Ertiga Hybrid, featuring improved fuel economy and lower emissions for families looking for a practical and eco-friendly choice...",
    date: "5 Feb, 2026",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=260&fit=crop",
    category: "Events",
    title: "Growing The Future Together: Suzuki Jimny Experience 2026",
    snippet:
      "Suzuki Indonesia and its dealer network are pleased to announce the Jimny Experience 2026, an off-road adventure series that lets customers experience the capability of the Jimny...",
    date: "20 Jan, 2026",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=260&fit=crop",
    category: "Technology",
    title: "Suzuki Announces Smart Hybrid Technology for Next-Gen Models",
    snippet:
      "Suzuki Motor Corporation today unveiled its latest Smart Hybrid technology at an event in Jakarta, presenting a bold vision for more efficient and connected vehicles across the lineup...",
    date: "7 Jan, 2026",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=260&fit=crop",
    category: "Global",
    title: "Suzuki Global and Indonesian Market Expansion Plans",
    snippet:
      "Suzuki continues to strengthen its presence in Southeast Asia with new investments in Indonesia, connecting local manufacturing with Suzuki's worldwide audience in new ways...",
    date: "28 Dec, 2025",
  },
];

export default function Articles() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = 380;
    const offset = direction === "left" ? -step : step;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section
      id="articles-section"
      className="w-full bg-white py-16 container mx-auto px-4"
    >
      <h2 className="text-2xl font-semibold font-suzuki-pro-headline text-foreground mb-8">
        Articles
      </h2>
      <div className="flex flex-col gap-8">
        <div
          className="overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
          ref={scrollRef}
        >
          <div className="flex gap-6 pb-4">
            {articlesData.map((article) => (
              <ArticleCard key={article.id} {...article} />
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

function ArticleCard({
  image,
  category,
  title,
  snippet,
  date,
}: (typeof articlesData)[number]) {
  return (
    <article className="shrink-0 w-[320px] sm:w-[360px] flex flex-col bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
      <div className="relative w-full aspect-video bg-gray-200">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 320px, 360px"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <span className="font-sans text-sm text-primary-suzuki font-medium">
          {category}
        </span>
        <h3 className="font-sans text-foreground font-bold text-base leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="font-sans text-gray-500 text-sm leading-relaxed line-clamp-3">
          {snippet}
        </p>
        <p className="font-sans text-gray-400 text-xs mt-1">{date}</p>
      </div>
    </article>
  );
}
