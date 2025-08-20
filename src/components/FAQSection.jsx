import React, { useState } from "react";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      q: "What is a temporary email address?",
      a: "A temporary email address (also called temp mail, burner mail, or disposable email) is a free service that provides you with a short-lived inbox. You can receive emails without using your real email address.",
      icon: "📧"
    },
    {
      q: "Is temp mail safe to use?",
      a: "Yes. Temp mail protects your personal inbox from spam, data leaks, ads, and hackers. However, avoid using it for banking, government, or sensitive accounts.",
      icon: "🔒"
    },
    {
      q: "How long do temp mail addresses last?",
      a: "Most temporary email addresses last from 10 minutes to 24 hours, depending on the service. With TempMail Pro, your address works until you refresh or delete it.",
      icon: "⏱️"
    },
    {
      q: "Can I use temp mail for Facebook, Instagram, or Twitter?",
      a: "Yes, you can use temporary email for registering accounts, but some platforms may block disposable domains. For long-term access, use a permanent email.",
      icon: "📱"
    },
    {
      q: "Do I need to sign up to use temp mail?",
      a: "No. You can instantly create and use a temp mail address without registration, passwords, or personal details.",
      icon: "🚀"
    },
    {
      q: "Can I send emails from a temporary address?",
      a: "Most disposable email services only allow receiving messages, not sending. This ensures privacy and prevents abuse.",
      icon: "📤"
    },
    {
      q: "Is using temp mail legal?",
      a: "Yes, temp mail is 100% legal. It's simply a privacy tool to keep your personal inbox clean. Illegal activities are the responsibility of the user, not the service.",
      icon: "⚖️"
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="faq-section">
      <div className="container">
        <div className="faq-header text-center">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Find answers to common questions about our temporary email service</p>
          
          <div className="faq-search">
            <div className="search-container">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="faq-container">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                >
                  <div className="question-content">
                    <span className="faq-icon">{item.icon}</span>
                    <span className="question-text">{item.q}</span>
                  </div>
                  <span className="faq-toggle">
                    <i className={`bi ${activeIndex === index ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                  </span>
                </button>
                <div className="faq-answer">
                  <div className="answer-content">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className="bi bi-search"></i>
              <p>No results found for "{searchTerm}"</p>
              <button 
                className="btn btn-primary"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="faq-footer text-center">
          <p>Still have questions?</p>
          <a href="#contact" className="btn btn-outline-primary">
            Contact Support <i className="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;