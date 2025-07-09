import React from "react";
import "../../assets/css/customer/AboutUs.css"; // Ensure this CSS is customized
import Layout from "../../components/customer/layout/Layout"
const AboutUs = () => {
  return (
    <Layout>
    <div className="about-us-container">
      <section className="hero-section">
        <h1> <span className="highlight">Bollent Electric</span></h1>
        <p>
          Bollent Electric empowers innovation in the electrical and electronic space.
          We are committed to delivering quality components, unmatched customer support,
          and rapid delivery to engineers and manufacturers worldwide.
        </p>
      </section>

      {/* Timeline Section */}
      <section className="history-section">
        <h2 className="heading">Our History</h2>
        <div className="timeline">
          <div className="timeline-item">
            <img src="/resistorblurple2x.png" alt="Start" />
            <div className="timeline-content">
              <h3>1972</h3>
              <p>Bollent begins as a mail-order electrical components company driven by passion and precision.</p>
            </div>
          </div>
          <div className="timeline-item">
            <img src="/images/history-icon2.png" alt="Web" />
            <div className="timeline-content">
              <h3>1996</h3>
              <p>Our first website was launched, initiating our journey into global e-commerce.</p>
            </div>
          </div>
          <div className="timeline-item">
            <img src="/images/history-icon3.png" alt="International" />
            <div className="timeline-content">
              <h3>1997</h3>
              <p>First international presence was established, serving 20+ countries by the decade's end.</p>
            </div>
          </div>
          <div className="timeline-item">
            <img src="/images/history-icon4.png" alt="Expansion" />
            <div className="timeline-content">
              <h3>2022</h3>
              <p>Opened our 2.2 million sq. ft. warehouse—one of the largest in India.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Facts Section */}
      <section className="fast-facts-section">
        <h1><b>Fast Facts</b></h1>
        <div className="facts-grid">
          <div className="fact-box"><strong>180+</strong><span>Countries Reached</span></div>
          <div className="fact-box"><strong>4,700+</strong><span>Employees</span></div>
          <div className="fact-box"><strong>3 Million+</strong><span>Sq. Ft. Facilities</span></div>
          <div className="fact-box"><strong>15.9 Million+</strong><span>Products Available</span></div>
          <div className="fact-box"><strong>3,000+</strong><span>Suppliers</span></div>
          <div className="fact-box"><strong>5.7 Million+</strong><span>Online Orders / Yr</span></div>
          <div className="fact-box"><strong>3.2 Million+</strong><span>Phone Calls / Yr</span></div>
          <div className="fact-box"><strong>6.5 Million+</strong><span>Orders Processed / Yr</span></div>
          <div className="fact-box"><strong>674,000+</strong><span>Sites Served / Yr</span></div>
          <div className="fact-box"><strong>21</strong><span>Languages Supported</span></div>
          <div className="fact-box"><strong>24/7</strong><span>Customer Support</span></div>
          <div className="fact-box"><strong>1 Million</strong><span>Customers Serviced / Yr</span></div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="cta-section">
        <h2><b>Let’s Build the Future Together</b></h2>
        <p>
          Whether you're powering the next smart home or driving industrial automation,
          Bollent Electric stands beside you with trusted supply, deep inventory, and technical expertise.
        </p>
        <button className="cta-button">Contact Us</button>
      </section>
    </div>
    </Layout>
  );
};

export default AboutUs;
