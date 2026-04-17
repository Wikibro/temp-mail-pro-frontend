import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import { Helmet } from 'react-helmet-async';
import 'highlight.js/styles/github.css';
import { articles } from '../content/articlesData';
import { getRelatedArticles } from '../utils/relatedArticles';

const markdownFiles = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function formatFallbackTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      const filePath = `../content/articles/${slug}.md`;
      const text = markdownFiles[filePath];

      if (!text) {
        throw new Error('Post not found');
      }

      const frontmatterEnd = text.indexOf('---', 3);
      if (frontmatterEnd !== -1) {
        const frontmatter = text.substring(3, frontmatterEnd).trim();
        const contentText = text.substring(frontmatterEnd + 3).trim();

        const titleMatch = frontmatter.match(/title: "([^"]+)"/);
        const dateMatch = frontmatter.match(/date: "([^"]+)"/);
        const descriptionMatch = frontmatter.match(/description: "([^"]+)"/);
        const imageMatch = frontmatter.match(/image: "([^"]+)"/);

        setTitle(titleMatch ? titleMatch[1] : formatFallbackTitle(slug));
        setDate(dateMatch ? dateMatch[1] : '');
        setDescription(descriptionMatch ? descriptionMatch[1] : '');
        setImage(imageMatch ? imageMatch[1] : '');
        setContent(contentText);
      } else {
        setTitle(formatFallbackTitle(slug));
        setDate('');
        setDescription('');
        setImage('');
        setContent(text);
      }
    } catch (loadError) {
      console.error('Error loading markdown:', loadError);
      setError('Failed to load the blog post. Please try again later.');
      setContent('');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-post-container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-post-container">
        <div className="alert alert-danger text-center my-5">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  const defaultImage = `${window.location.origin}/images/temp-mail-promo.png`;
  const metaImage = image ? `${window.location.origin}${image}` : defaultImage;
  const canonicalUrl = `${window.location.origin}/blog/${slug}`;
  const relatedArticles = getRelatedArticles(slug, articles, 3);
  const estimatedReadTime = Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

  return (
    <div className="blog-post-container">
      <Helmet>
        <title>{title ? `${title} | TempMail Pro Blog` : 'Blog Post | TempMail Pro'}</title>
        <meta
          name="description"
          content={description || 'Read the latest article on TempMail Pro Blog about email privacy and security.'}
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title || 'TempMail Pro Blog'} />
        <meta
          property="og:description"
          content={description || 'TempMail Pro Blog article about email privacy and security'}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:site_name" content="TempMail Pro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || 'TempMail Pro Blog'} />
        <meta
          name="twitter:description"
          content={description || 'TempMail Pro Blog article about email privacy and security'}
        />
        <meta name="twitter:image" content={metaImage} />
        <meta name="twitter:site" content="@tempmailpro" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description,
            image: metaImage,
            datePublished: date,
            dateModified: date,
            author: {
              '@type': 'Organization',
              name: 'TempMail Pro Team',
            },
            publisher: {
              '@type': 'Organization',
              name: 'TempMail Pro',
              logo: {
                '@type': 'ImageObject',
                url: `${window.location.origin}/favicon-32x32.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
          })}
        </script>
      </Helmet>

      <div className="bg-light border-bottom py-2">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/blog" className="text-decoration-none">Blog</Link>
              </li>
              <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '320px' }}>
                {title || 'Article'}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="blog-post container my-5">
        <article>
          <header className="mb-4">
            <h1 className="display-4 fw-bold mb-3">{title}</h1>
            <div className="text-muted d-flex align-items-center gap-3 flex-wrap">
              {date && (
                <small>
                  <i className="bi bi-calendar me-1"></i>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </small>
              )}
              <small>
                <i className="bi bi-clock me-1"></i>
                {estimatedReadTime} min read
              </small>
            </div>
            {description && <p className="lead mt-3">{description}</p>}
          </header>

          <div className="d-flex align-items-center my-4 p-3 bg-light rounded">
            <div className="flex-shrink-0 me-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px' }}
              >
                <i className="fas fa-user-shield"></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold">TempMail Pk Team</h6>
              <p className="mb-0 small text-muted">
                Email privacy and security experts focused on reducing spam, tracking, and identity exposure online.
              </p>
            </div>
          </div>

          {image && (
            <div className="text-center mb-4">
              <img
                src={image}
                alt={title}
                className="img-fluid rounded"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="blog-content">
            <ReactMarkdown rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings, rehypeRaw]}>
              {content}
            </ReactMarkdown>
          </div>

          <div className="card border-primary mt-5 mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h4 className="card-title mb-3">Try Our Free Temporary Email Service</h4>
                  <p className="card-text mb-0">
                    This guide was created by <strong>TempMail Pk</strong>. Put the advice into practice with a disposable inbox right now.
                  </p>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <Link to="/app" className="btn btn-primary btn-lg">
                    <i className="fas fa-envelope me-2"></i>
                    Generate Free Email
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <section className="mt-5" aria-labelledby="related-articles-heading">
              <h4 id="related-articles-heading" className="fw-bold mb-4">Related Articles</h4>
              <div className="row g-3">
                {relatedArticles.map((article) => (
                  <div key={article.slug} className="col-md-4">
                    <Link to={`/blog/${article.slug}`} className="text-decoration-none">
                      <div className="card h-100 border-0 shadow-sm p-3 related-card">
                        <div
                          className={`bg-${article.categoryColor} mb-3`}
                          style={{ height: '3px', borderRadius: '2px' }}
                        />
                        <span className={`badge bg-${article.categoryColor} bg-opacity-10 text-${article.categoryColor} mb-2 align-self-start`}>
                          <i className={`bi ${article.icon} me-1`}></i>
                          {article.category}
                        </span>
                        <h6 className="text-dark fw-semibold mb-1">{article.title}</h6>
                        <p className="text-muted small mb-0">{article.readTime}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="mt-5 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <span className="text-muted">Published on TempMail Pro</span>
              </div>
              <div className="d-flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bi bi-twitter me-1"></i>
                  Tweet
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bi bi-linkedin me-1"></i>
                  Share
                </a>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}