import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocsShell } from '@/components/docs/docs-shell'
import { getAllArticles, getArticle, pick } from '@/lib/docs'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) {
    return { title: 'Not found' }
  }
  return {
    title: pick(article.title, 'en'),
    description: pick(article.description, 'en'),
    alternates: {
      canonical: `/docs/${article.slug}`,
    },
    openGraph: {
      title: `${pick(article.title, 'en')} — Agentication Docs`,
      description: pick(article.description, 'en'),
      url: `/docs/${article.slug}`,
      type: 'article',
    },
  }
}

export default async function DocsArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()
  return <DocsShell article={article} />
}
