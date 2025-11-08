import React from "react";
import { Helmet } from "react-helmet-async";

const Privacy = () => {
  return (
    <div className="privacy-container">
        {/* ADD THIS SEO SECTION */}
      <Helmet>
        <title>Privacy Policy | TempMail Pro</title>
        <meta 
          name="description" 
          content="TempMail Pro privacy policy. We do not store your temporary emails permanently and your privacy is our priority." 
        />
        <link rel="canonical" href="https://tempmailpk.com/privacy" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy | TempMail Pro" />
        <meta property="og:description" content="TempMail Pro privacy policy. We protect your privacy with temporary email services." />
        <meta property="og:url" content="https://tempmailpk.com/privacy" />
        <meta property="og:type" content="website" />
      </Helmet>
      <h1>Privacy Policy</h1>
      <p>
        At <strong>TempMail Pro</strong>, your privacy is our priority. We do
        not store your temporary emails permanently. All generated emails are
        deleted after their expiry.
      </p>
      <p>
        We do not sell or share your personal information with third parties.
      </p>
      <p>
        For questions, please contact us at{" "}
        <a href="mailto:support@tempmailpro.com">support@tempmailpro.com</a>
      </p>
    </div>
  );
};

export default Privacy;
