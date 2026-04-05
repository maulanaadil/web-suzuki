import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      snippet: true,
      category: true,
      imageUrl: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ data: articles });
}
