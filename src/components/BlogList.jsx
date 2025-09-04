// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const articles = [
//   { 
//     slug: "tech-behind-disposable-emails",
//     excerpt: "Discover the technology that powers temporary email services and how they protect your privacy online.",
//     readTime: "5 min read"
//   },
//   { 
//     slug: "receive-sms-otp-online",
//     excerpt: "Learn how to receive SMS verification codes online without using your personal phone number.",
//     readTime: "4 min read"
//   },
//   { 
//     slug: "private-domains-temp-email",
//     excerpt: "Explore how private domains enhance the security and functionality of temporary email services.",
//     readTime: "6 min read"
//   },
//   { 
//     slug: "burner-email-for-social-media",
//     excerpt: "Find out why using burner emails for social media accounts can protect your digital identity.",
//     readTime: "3 min read"
//   }
// ];

// const slugToTitle = (slug) => {
//   return slug
//     .split("-")
//     .map((word) => word[0].toUpperCase() + word.slice(1))
//     .join(" ");
// };

// export default function BlogList() {
//   const [isHovered, setIsHovered] = useState(null);

//   return (
//     <section className="blog-section py-5">
//       <div className="container">
//         <div className="text-center mb-5">
//           <h2 className="section-title">Latest Articles</h2>
//           <p className="section-subtitle">Discover insights about privacy, security, and technology</p>
//         </div>
        
//         <div className="row">
//           {articles.map((article, index) => (
//             <div key={article.slug} className="col-lg-6 mb-4">
//               <div 
//                 className={`blog-card card h-100 border-0 shadow-sm ${isHovered === index ? 'card-hovered' : ''}`}
//                 onMouseEnter={() => setIsHovered(index)}
//                 onMouseLeave={() => setIsHovered(null)}
//               >
//                 <div className="card-body">
//                   <div className="d-flex align-items-center mb-3">
//                     <div className="blog-icon me-3">
//                       <i className="bi bi-file-earmark-text"></i>
//                     </div>
//                     <span className="read-time text-muted">{article.readTime}</span>
//                   </div>
                  
//                   <h3 className="card-title h5">
//                     <Link 
//                       to={`/blog/${article.slug}`} 
//                       className="stretched-link text-decoration-none text-dark"
//                     >
//                       {slugToTitle(article.slug)}
//                     </Link>
//                   </h3>
                  
//                   <p className="card-text text-muted">{article.excerpt}</p>
                  
//                   <div className="d-flex align-items-center mt-3">
//                     <span className="read-more text-primary fw-semibold">
//                       Read Article
//                       <i className="bi bi-arrow-right ms-2"></i>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <div className="text-center mt-5">
//           <Link to="/blog" className="btn btn-outline-primary btn-lg">
//             View All Articles
//             <i className="bi bi-arrow-right ms-2"></i>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }






import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would typically come from an API or static import
    // For now, we'll use a static list
    const articleData = [
      { 
        slug: "tech-behind-disposable-emails",
        title: "The Tech Behind Disposable Emails",
        description: "Understand how disposable email services work under the hood.",
        date: "2025-08-17",
        readTime: "5 min read"
      },
      { 
        slug: "receive-sms-otp-online",
        title: "How to Receive SMS OTP Verification Online",
        description: "Discover safe and reliable methods to receive OTPs online without using your personal number.",
        date: "2025-08-17",
        readTime: "4 min read"
      },
      { 
        slug: "private-domains-temp-email",
        title: "Private Domains: How to Get Your Own Temporary Email",
        description: "Learn how to set up a private domain for disposable email and protect your online identity.",
        date: "2025-08-15",
        readTime: "6 min read"
      },
      { 
        slug: "burner-email-for-social-media",
        title: "Why You Need a Burner Email for Social Media",
        description: "Protect your privacy by using burner emails when signing up on social platforms.",
        date: "2025-08-17",
        readTime: "3 min read"
      }
    ];
    
    setArticles(articleData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="blog-list py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="blog-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Latest Articles</h2>
          <p className="section-subtitle">Discover insights about privacy, security, and technology</p>
        </div>
        
        <div className="row">
          {articles.map((article, index) => (
            <div key={article.slug} className="col-lg-6 mb-4">
              <div className="blog-card card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="blog-icon me-3">
                      <i className="bi bi-file-earmark-text"></i>
                    </div>
                    <span className="read-time text-muted">{article.readTime}</span>
                  </div>
                  
                  <h3 className="card-title h5">
                    <Link 
                      to={`/blog/${article.slug}`} 
                      className="stretched-link text-decoration-none text-dark"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="card-text text-muted">{article.description}</p>
                  
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="text-muted small">
                      {new Date(article.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="read-more text-primary fw-semibold">
                      Read Article
                      <i className="bi bi-arrow-right ms-2"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
