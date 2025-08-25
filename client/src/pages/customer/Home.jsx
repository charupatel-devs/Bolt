import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../../components/customer/layout/Layout.jsx";
import CategorySidebar from "../../components/customer/products/CategorySidebar.jsx";
import { fetchFeaturedProducts as fetchFeaturedProductsAction } from "../../store/customer/productSlice";
import { addToCartAction } from "../../store/customer/cartAction";
import { FaChevronDown } from "react-icons/fa";
import "../../assets/css/customer/Home.css";

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Industrial Automation Solutions",
    subtitle: "Advanced PLCs, sensors, and control systems",
    cta: "Explore Automation"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Power Distribution Systems",
    subtitle: "Reliable electrical infrastructure solutions",
    cta: "View Power Systems"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Semiconductor Excellence",
    subtitle: "High-quality ICs and microcontrollers",
    cta: "Browse Semiconductors"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Connectors & Cables",
    subtitle: "Premium connectivity solutions for every application",
    cta: "Shop Connectors"
  }
];

const featuredCategories = [
  {
    title: "Automation & Control",
    desc: "Industrial automation, PLCs, sensors, and relays.",
    img: "/images/automation.svg",
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

const toolsAndServices = [
  {
    title: "PCB Builder",
    description: "Design and order custom PCBs",
    icon: "🔧",
    link: "/tools/pcb-builder"
  },
  {
    title: "Conversion Calculator",
    description: "Electrical unit conversions",
    icon: "🧮",
    link: "/tools/calculator"
  },
  {
    title: "Scheme It",
    description: "Online schematic editor",
    icon: "📐",
    link: "/tools/scheme-it"
  },
  {
    title: "Reference Design Library",
    description: "Circuit design examples",
    icon: "📚",
    link: "/tools/reference-designs"
  }
];

// Sample FAQs for the frontend
const sampleFAQs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for business accounts. All payments are processed securely through our encrypted payment gateway."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days within the continental US. Express shipping (1-2 days) and overnight shipping are also available. International shipping typically takes 7-14 business days depending on the destination."
  },
  {
    question: "Do you offer technical support?",
    answer: "Yes! We provide comprehensive technical support for all our products. Our team of engineers is available via phone, email, and live chat during business hours. We also offer installation and troubleshooting guides for most products."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be in original condition and packaging. Some items like custom PCBs and software licenses may have different return terms. Please contact our customer service for specific return instructions."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Some products may be restricted in certain countries due to export regulations. Please check our international shipping page for details."
  },
  {
    question: "Can I get a quote for bulk orders?",
    answer: "Absolutely! We offer special pricing for bulk orders and business customers. Please contact our sales team with your requirements, and we'll provide a custom quote with volume discounts and expedited processing."
  }
];

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, featuredLoading, error } = useSelector((state) => state.product);
  const { userToken } = useSelector((state) => state.userAuth);
  const { cartItems, loading: cartLoading } = useSelector((state) => state.cart);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // State for dynamic content
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState(null);

  // Fetch featured products using Redux action
  useEffect(() => {
    if (userToken) {
      const timer = setTimeout(() => {
        dispatch(fetchFeaturedProductsAction());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [dispatch, userToken]);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      setTestimonialsLoading(true);
      setTestimonialsError(null);
      try {
        // Skip API call since /api/reviews doesn't exist on backend
        // Use sample testimonials directly
        setTestimonials([
          {
            id: 1,
            rating: 5,
            comment: "Excellent product! Works perfectly for my Arduino projects. Fast shipping and great quality.",
            customerName: "John D.",
            date: "2024-01-15"
          },
          {
            id: 2,
            rating: 5,
            comment: "Amazing service and product quality. Will definitely order again!",
            customerName: "Sarah M.",
            date: "2024-01-10"
          },
          {
            id: 3,
            rating: 4,
            comment: "Good components, fast delivery. Very satisfied with the purchase.",
            customerName: "Mike R.",
            date: "2024-01-08"
          }
        ]);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonialsError('Failed to load testimonials');
        // Set sample testimonials as fallback
        setTestimonials([
          {
            id: 1,
            rating: 5,
            comment: "Excellent product! Works perfectly for my Arduino projects. Fast shipping and great quality.",
            customerName: "John D.",
            date: "2024-01-15"
          },
          {
            id: 2,
            rating: 5,
            comment: "Amazing service and product quality. Will definitely order again!",
            customerName: "Sarah M.",
            date: "2024-01-10"
          },
          {
            id: 3,
            rating: 4,
            comment: "Good components, fast delivery. Very satisfied with the purchase.",
            customerName: "Mike R.",
            date: "2024-01-08"
          }
        ]);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.category-sidebar') && !event.target.closest('.mobile-menu-toggle')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddToCart = (productId) => {
    if (!userToken) {
      toast.error("Please log in to add items to cart");
      return;
    }
    dispatch(addToCartAction(productId, 1));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <Layout>
      <div className="home-main-flex">
        <CategorySidebar className={sidebarOpen ? 'open' : ''} />
        <div className="home-content-area">
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Hero Slideshow Section */}
          <section className="hero-slideshow">
            <div className="slideshow-container">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="slide-content">
                    <h1 className="slide-title">{slide.title}</h1>
                    <p className="slide-subtitle">{slide.subtitle}</p>
                    <button className="slide-cta">{slide.cta}</button>
                  </div>
                </div>
              ))}
              
              {/* Navigation Arrows */}
              <button className="slide-nav prev" onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}>
                <span>❮</span>
              </button>
              <button className="slide-nav next" onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}>
                <span>❯</span>
              </button>
              
              {/* Slide Indicators */}
              <div className="slide-indicators">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Featured Products Section */}
          <section className="featured-products">
            <div className="section-header">
              <h2>Featured Products</h2>
              <a href="/products" className="view-all-btn">View All Products</a>
            </div>
            
            {featuredLoading ? (
              <div className="loading-container">
                <div className="dot-loader">
    <span></span><span></span><span></span>
  </div>
                <p>Loading featured products...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>Error loading products: {error}</p>
                <button 
                  className="retry-btn"
                  onClick={() => dispatch(fetchFeaturedProductsAction())}
                >
                  Retry
                </button>
              </div>
            ) : featuredProducts && featuredProducts.length > 0 ? (
              <div className="products-grid">
                {featuredProducts.map((product) => (
                  <div key={product._id || product.id} className="product-card">
                    <div className="product-image">
                      <img 
                        src={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} 
                        alt={product.name} 
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-category">{product.category?.name || product.category}</p>
                      <div className="product-rating">
                        <span className="stars">{renderStars(product.rating || 0)}</span>
                        <span className="rating-text">
                          {product.rating || 0} ({product.reviewCount || 0} reviews)
                        </span>
                      </div>
                      <div className="product-price">${product.price || 0}</div>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product._id || product.id)}
                        disabled={cartLoading}
                      >
                        {cartLoading ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No featured products available at the moment.</p>
              </div>
            )}
          </section>

          {/* Tools & Services Section */}
          <section className="tools-services">
            <div className="section-header">
              <h2>Tools & Services</h2>
              <p>Professional tools to help you succeed</p>
            </div>
            <div className="tools-grid">
              {toolsAndServices.map((tool, index) => (
                <a key={index} href={tool.link} className="tool-card">
                  <div className="tool-icon">{tool.icon}</div>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Featured Categories Section */}
          <section className="featured-categories">
            <div className="section-header">
              <h2>Popular Categories</h2>
              <a href="/categories" className="view-all-btn">Browse All Categories</a>
            </div>
            <div className="categories-grid">
              {featuredCategories.map((cat) => (
                <a href={cat.link} className="category-card" key={cat.title}>
                  <div className="category-image">
                    <img src={cat.img} alt={cat.title} />
                  </div>
                  <div className="category-info">
                    <h3>{cat.title}</h3>
                    <p>{cat.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Customer Testimonials Section */}
          <section className="testimonials-section">
            <div className="section-header">
              <h2>What Our Customers Say</h2>
              <p>Real feedback from satisfied customers</p>
            </div>
            
            {testimonialsLoading ? (
              <div className="loading-container">
                <div className="dot"></div>
                <p>Loading testimonials...</p>
              </div>
            ) : testimonialsError ? (
              <div className="error-container">
                <p>{testimonialsError}</p>
                <button 
                  className="retry-btn"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : testimonials.length > 0 ? (
              <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="testimonial-card">
                    <div className="testimonial-rating">
                      <span>{renderStars(testimonial.rating || 5)}</span>
                    </div>
                    <p className="testimonial-text">"{testimonial.comment}"</p>
                    <div className="testimonial-author">
                      <strong>{testimonial.customerName || testimonial.author}</strong>
                      <span>{testimonial.date || testimonial.company}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-testimonials">
                <p>Customer testimonials will appear here.</p>
              </div>
            )}
          </section>

          {/* FAQ Section */}
          <section className="faq-section">
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
              <p>Find answers to common questions</p>
            </div>
            
            <div className="faq-grid">
              {sampleFAQs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className="faq-question"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    {faq.question}
                    <FaChevronDown className={`faq-toggle ${expandedFaq === index ? 'expanded' : ''}`} />
                  </button>
                  <div className={`faq-answer ${expandedFaq === index ? 'expanded' : ''}`}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Info Strip Section */}
          <section className="info-strip">
            <div className="strip-container">
              <div className="strip-item">
                <div className="strip-icon">🚚</div>
                <div className="strip-content">
                  <h4>Free Shipping</h4>
                  <p>On orders over $50</p>
                </div>
              </div>
              <div className="strip-item">
                <div className="strip-icon">🛡️</div>
                <div className="strip-content">
                  <h4>Quality Guarantee</h4>
                  <p>30-day return policy</p>
                </div>
              </div>
              <div className="strip-item">
                <div className="strip-icon">💬</div>
                <div className="strip-content">
                  <h4>24/7 Support</h4>
                  <p>Expert assistance</p>
                </div>
              </div>
              <div className="strip-item">
                <div className="strip-icon">⚡</div>
                <div className="strip-content">
                  <h4>Fast Delivery</h4>
                  <p>Same day shipping</p>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="newsletter-section">
            <div className="newsletter-content">
              <h2>Stay Updated</h2>
              <p>Get the latest product updates, technical articles, and industry news</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email address" />
                <button className="subscribe-btn">Subscribe</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
