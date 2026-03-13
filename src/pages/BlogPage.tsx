import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog-posts';
import { useSEO } from '@/hooks/useSEO';

const BlogPage = () => {
  useSEO({
    title: 'Blog – Prediction Market Insights & Analysis',
    description:
      'Expert analysis on Indian prediction markets, cricket, elections, economy, and geopolitics. Stay informed with India Predictions blog.',
    keywords:
      'prediction markets blog, India prediction analysis, cricket prediction, election prediction, RBI analysis',
    canonical: '/blog',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'India Predictions Blog',
      description: 'Expert analysis on Indian prediction markets',
      url: 'https://indianpredictions.lovable.app/blog',
    },
  });

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="paytm-header px-4 lg:px-8 pt-10 lg:pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-white">Blog</h1>
            <p className="text-sm text-white/65 mt-1">Prediction market insights, analysis & education</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              className="paytm-card p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <Tag className="w-3 h-3" /> {post.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" /> {post.readTime} min read
                </span>
              </div>

              <h2 className="font-display font-bold text-base leading-snug line-clamp-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>

              <div className="flex flex-wrap gap-1.5 mt-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Read More <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
