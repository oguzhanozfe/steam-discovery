import { notFound } from 'next/navigation';
import Home from '../page';
import { resolveRoute } from '../site-routes';

export default async function ResearchRoute({ params }: { params: Promise<{ research: string[] }> }) {
  const { research } = await params;
  const route = resolveRoute(`/${research.join('/')}/`);
  if (!route) notFound();
  return <Home initial={route.initial} />;
}
