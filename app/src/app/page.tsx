import { getSermons } from "@/lib/supabase";
import { HomeContent } from "@/components/HomeContent";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q: searchQuery } = await searchParams;
  const sermons = await getSermons(searchQuery);

  return <HomeContent sermons={sermons} searchQuery={searchQuery} />;
}
