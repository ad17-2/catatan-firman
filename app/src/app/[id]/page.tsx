import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSermonById } from "@/lib/db";
import { SermonDetail } from "@/components/SermonDetail";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) return {};

  const sermon = await getSermonById(id);
  if (!sermon) return {};

  return {
    title: `${sermon.title} — Catatan Firman`,
    description: sermon.summary.slice(0, 160),
    openGraph: {
      title: sermon.title,
      description: sermon.summary.slice(0, 160),
      type: "article",
    },
  };
}

export default async function SermonDetailPage({ params }: DetailPageProps) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  if (!id) notFound();

  const sermon = await getSermonById(id);
  if (!sermon) notFound();

  return <SermonDetail sermon={sermon} />;
}
