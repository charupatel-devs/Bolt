import React from "react";
import Layout from "../../components/customer/layout/Layout.jsx";
import CategorySidebar from "../../components/customer/products/CategorySidebar.jsx";
import "../../assets/css/customer/Home.css";

const featuredCategories = [
  {
    title: "Automation & Control",
    desc: "Industrial automation, PLCs, sensors, and relays.",
    img: "/images/automation.svg", // Use SVGs or high-quality PNGs
    link: "/products/category/automation",
  },
  {
    title: "Connectors",
    desc: "Wide range of connectors for every application.",
    img: "/images/connectors.svg",
    link: "/products/category/connectors",
  },
  {
    title: "Semiconductors",
    desc: "ICs, microcontrollers, and logic devices.",
    img: "/images/semiconductors.svg",
    link: "/products/category/semiconductors",
  },
  {
    title: "Cables & Wires",
    desc: "Cables, wires, and cable assemblies.",
    img: "/images/cables.svg",
    link: "/products/category/cables",
  },
];

const Home = () => {
  return (
    <Layout>
      <div className="home-main-flex">
        <CategorySidebar />
        <div className="home-content-area">
          {/* Hero Section */}
          <section className="home-hero">
            <div className="home-hero-text">
              <h1>
                <span className="highlight-red">Human ideas,</span>
                <br />
               precision
              </h1>
              <p>
                From sensors and power to safety and controls, BollentElectric offers a complete electronics ecosystem to bring your vision to life.
              </p>
              <button className="home-shop-btn">Shop now</button>
            </div>
            <div className="home-hero-img">
              {/* <img src="" alt="Robotic Arm" /> */}
            </div>
          </section>

          {/* Animated Divider */}
          <div className="animated-divider">
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>

          {/* Featured Categories */}
          <section className="home-featured-section">
            <h2 className="featured-title">Featured Categories</h2>
            <div className="featured-grid">
              {featuredCategories.map((cat) => (
                <a href={cat.link} className="featured-card" key={cat.title}>
                  <img src={cat.img} alt={cat.title} className="featured-img" />
                  <div className="featured-info">
                    <h3>{cat.title}</h3>
                    <p>{cat.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Info Strip with Icons */}
          <section className="home-strip-section">
            <div className="strip-box">
              <div className="strip-icon">
                <img src="" alt="Tools" />
              </div>
              <h4>TOOLS</h4>
              <ul>
                <li>PCB Builder</li>
                <li>Conversion Calculators</li>
                <li>Scheme It</li>
                <li>Reference Design Library</li>
                <li>Cross Reference</li>
              </ul>
            </div>
            <div className="strip-box">
              <div className="strip-icon">
                <img src="/images/services-icon.svg" alt="Services" />
              </div>
              <h4>SERVICES</h4>
              <ul>
                <li>Part Tracing</li>
                <li>Digital Solutions</li>
                <li>Design & Integration</li>
                <li>Product Services</li>
              </ul>
            </div>
            <div className="strip-box">
              <div className="strip-icon">
                <img src="/images/content-icon.svg" alt="Content" />
              </div>
              <h4>CONTENT</h4>
              <ul>
                <li>New Products</li>
                <li>TechForum</li>
                <li>Maker.io</li>
                <li>Training Library</li>
                <li>Video Library</li>
              </ul>
            </div>
            
          </section>
       

        </div>
      </div>
    </Layout>
  );
};

export default Home;
