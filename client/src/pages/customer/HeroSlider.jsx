import React, { useState, useEffect } from "react";
import "../../assets/css/customer/Home.css";



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
