import { Link } from "react-router-dom";
import "../../../assets/css/customer/Footer.css";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <img src="/bollent-logo-footer.png" alt="BollentElectric" />
        <p className="footer-desc">
          Distributor of electronic components worldwide. Find parts, datasheets, and more.
        </p>
      </div>

      <div className="footer-links">
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Support</a></li>
            <li><a href="#">Knowledge Base</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Blogs</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Compliance</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/login" target="_blank" rel="noopener noreferrer" title="Facebook Login">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com/login" target="_blank" rel="noopener noreferrer" title="X Login">
              <FaXTwitter />
            </a>
            <a href="https://www.instagram.com/accounts/login" target="_blank" rel="noopener noreferrer" title="Instagram Login">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer" title="LinkedIn Login">
              <FaLinkedinIn />
            </a>
            <a href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank" rel="noopener noreferrer" title="YouTube Login">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      © {new Date().getFullYear()} BollentElectric. All rights reserved.
    </div>
  </footer>
);

export default Footer;
