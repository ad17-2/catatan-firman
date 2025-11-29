import { notFound } from "next/navigation";
import { getSermonById } from "@/lib/supabase";
import { SermonDetail } from "@/components/SermonDetail";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SermonDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const sermon = await getSermonById(id);

  if (!sermon) {
    notFound();
  }

  return <SermonDetail sermon={sermon} />;
}
