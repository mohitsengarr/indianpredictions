import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog-posts';
import { useSEO } from '@/hooks/useSEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import SocialShare from '@/components/SocialShare';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useSEO({
    title: post ? post.title : 'Post Not Found',
    description: post ? post.excerpt : 'This blog post could not be found.',
    keywords: post ? post.tags.join(', ') : undefined,
    canonical: post ? `/blog/${post.slug}` : undefined,
    schema: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          author: { '@type': 'Organization', name: post.author },
          datePublished: post.publishedAt,
        }
      : undefined,
  });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold">Post Not Found</h1>
          <p className="text-muted-foreground">This blog post doesn't exist or has been removed.</p>
          <Link to="/blog" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const goBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate('/blog');
  };

  // Simple markdown-to-HTML (handles ##, ###, -, **, |table|, and paragraphs)
  const renderMarkdown = (md: string) => {
    const lines = md.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="font-display font-bold text-lg mt-6 mb-3">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="font-display font-bold text-base mt-5 mb-2">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={i} className="font-display font-bold text-sm mt-4 mb-1.5 text-primary">
            {line.slice(5)}
          </h4>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground ml-2 my-1">
            <span className="text-primary mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} />
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\.\s/)?.[1];
        elements.push(
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground ml-2 my-1">
            <span className="text-primary font-bold mt-0.5">{num}.</span>
            <span dangerouslySetInnerHTML={{ __html: inlineMd(line.replace(/^\d+\.\s/, '')) }} />
          </li>
        );
      } else if (line.startsWith('|') && line.endsWith('|')) {
        // Table: collect all table rows
        const tableRows: string[] = [];
        while (i < lines.length && lines[i].startsWith('|') && lines[i].endsWith('|')) {
          tableRows.push(lines[i]);
          i++;
        }
        i--; // adjust for outer loop increment
        const header = tableRows[0];
        const dataRows = tableRows.slice(2); // skip separator
        const headerCells = header.split('|').filter(Boolean).map((c) => c.trim());
        elements.push(
          <div key={i} className="overflow-x-auto my-4">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  {headerCells.map((cell, ci) => (
                    <th key={ci} className="px-3 py-2 text-left font-semibold text-foreground border-b border-border">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, ri) => {
                  const cells = row.split('|').filter(Boolean).map((c) => c.trim());
                  return (
                    <tr key={ri} className="border-b border-border last:border-0">
                      {cells.map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 text-muted-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      } else if (line.trim() === '') {
        // skip blank lines
      } else {
        elements.push(
          <p
            key={i}
            className="text-sm text-muted-foreground leading-relaxed my-2"
            dangerouslySetInnerHTML={{ __html: inlineMd(line) }}
          />
        );
      }
      i++;
    }

    return elements;
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="paytm-header px-4 lg:px-8 pt-10 lg:pt-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-3">
              <Breadcrumbs
                dark
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Blog', href: '/blog' },
                  { label: post.title },
                ]}
              />
            </div>
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                <Tag className="w-3 h-3" /> {post.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-white/60">
                <Clock className="w-3 h-3" /> {post.readTime} min read
              </span>
            </div>

            <h1 className="font-display text-xl lg:text-2xl font-extrabold text-white leading-tight mb-3">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-white/50">
              <span className="inline-flex items-center gap-1">
                <User className="w-3 h-3" /> {post.author}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="mt-3">
              <SocialShare title={post.title} text={`${post.title} — India Predictions Blog`} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 mt-6">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          {renderMarkdown(post.content)}
        </motion.article>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mt-6"
        >
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </motion.div>

        {/* More Posts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8"
        >
          <h2 className="font-display font-bold text-sm mb-4">More Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BLOG_POSTS.filter((p) => p.id !== post.id)
              .slice(0, 2)
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="paytm-card p-4 group hover:border-primary/30 transition-colors"
                >
                  <p className="text-xs text-muted-foreground mb-1">{p.category}</p>
                  <h3 className="font-display font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.readTime} min read</p>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/** Convert **bold** to <strong> */
function inlineMd(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
}

export default BlogPostPage;
