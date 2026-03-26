import { Star } from "lucide-react";

const testimonialData = [
  {
    id: "featured",
    name: "Emma Rodriguez",
    title: "Digital Marketer at SocialLift",
    quote:
      "It's not just about followers—it's about building a real community that supports each other.",
    rating: 4.9,
    featured: true,
  },
  {
    id: "1",
    name: "Michael Grant",
    title: "Content Creator",
    quote:
      "I've grown my audience faster here than on any other social platform I've tried.",
    rating: 4.9,
    featured: false,
  },
  {
    id: "2",
    name: "David Kim",
    title: "Social Media Strategist",
    quote:
      "User-friendly, engaging, and built for growth. Every connection I make here is meaningful.",
    rating: 4.9,
    featured: false,
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    title: "Digital Marketer at SocialLift",
    quote:
      "It's not just about followers—it's about building a real community that supports each other.",
    rating: 4.9,
    featured: false,
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    title: "Digital Marketer at SocialLift",
    quote:
      "It's not just about followers—it's about building a real community that supports each other.",
    rating: 4.9,
    featured: false,
  },
];

export default function Testimonials() {
  const featured = testimonialData.find((t) => t.featured);
  const gridItems = testimonialData.filter((t) => !t.featured);

  return (
    <section
      id="testimonials-section"
      className="w-full container mx-auto py-16 bg-white"
    >
      <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground mb-8">
        Our beloved customers
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr">
        {featured && (
          <div className="sm:row-span-2 min-h-[280px]">
            <TestimonialCard {...featured} className="h-full" />
          </div>
        )}
        {gridItems.map((item) => (
          <div key={item.id} className="min-h-[200px]">
            <TestimonialCard {...item} className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  title,
  quote,
  rating,
  featured,
  className = "",
}: (typeof testimonialData)[number] & { className?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`p-6 flex flex-col gap-4 ${
        featured
          ? "bg-foreground text-white"
          : "bg-gray-100 text-foreground border border-gray-200"
      } ${className}`.trim()}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-sm font-semibold ${
            featured ? "bg-white/20 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          {initials}
        </div>
        <span
          className={`font-sans text-sm font-medium flex items-center gap-1.5 ${
            featured ? "text-white" : "text-foreground"
          }`}
        >
          {rating}
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          Rating
        </span>
      </div>
      <p
        className={`font-sans ${
          featured
            ? "text-lg font-bold leading-snug"
            : "text-base font-normal text-gray-700"
        }`}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-auto pt-2">
        <p
          className={`font-sans font-semibold ${featured ? "text-white" : "text-foreground"}`}
        >
          {name}
        </p>
        <p
          className={`font-sans text-sm ${featured ? "text-white/80" : "text-gray-500"}`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
