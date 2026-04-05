import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { prisma } from "../../../lib/prisma";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) return notFound();

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(article.createdAt);

  return (
    <main className="bg-white min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20 max-w-3xl">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-sm text-primary-suzuki hover:underline mb-8"
        >
          &larr; Kembali ke Artikel
        </Link>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm font-medium text-primary-suzuki">
            {article.category}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>

        <h1 className="font-suzuki-pro-headline text-3xl md:text-4xl text-foreground leading-tight mb-8">
          {article.title}
        </h1>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10">
          <Image
            src={article.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
          <Markdown>{article.content}</Markdown>
        </div>
      </article>
    </main>
  );
}
