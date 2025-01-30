import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // ---> import for FontAwesomeIcon
import { faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // ---> import the icons

export default function Footer() {
  return (
    <div className="footer">
      <p>Don’t leave forever! Feel free to join me on my socials:</p>
      <br />
      {/* For the icons. I installed them ---> Check chatgpt */}
      <div className="social-icons">
        <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} size="2x" />
        </a>
        <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
        <a href="https://www.linkedin.com/in/marion-nabulobi-a7aa5b344?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </a>
      </div>
    </div>
  );
}
