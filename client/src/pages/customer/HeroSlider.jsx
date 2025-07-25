import React, { useState, useEffect } from "react";
import "../../assets/css/customer/Home.css";

const slides = [
  {
    title: "Human ideas,",
    subtitle: "precision",
    description: "From sensors and power to safety and controls, BollentElectric offers a complete electronics ecosystem to bring your vision to life.",
    img: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Innovative solutions,",
    subtitle: "reliable performance",
    description: "Explore our wide range of electronic components designed for your success.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Quality parts,",
    subtitle: "trusted partners",
    description: "Partner with BollentElectric for quality and service you can count on.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  },
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="home-hero-slider">
      <div
        className="slides-container"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <div className="slide-text">
              <h1>
                <span className="highlight-red">{slide.title}</span>
                <br />
                {slide.subtitle}
              </h1>
              <p>{slide.description}</p>
              <button className="home-shop-btn">Shop now</button>
            </div>
            <div className="slide-img">
              <img src={slide.img} alt={slide.title} />
            </div>
          </div>
        ))}
      </div>
      <div className="dots-container">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot${idx === currentIndex ? " active" : ""}`}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
