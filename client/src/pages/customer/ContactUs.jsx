import React, { useState } from "react";
import "../../assets/css/customer/ContactUs.css";
import Layout from "../../components/customer/layout/Layout" 

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
    <div className="contact-us-container">
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Whether you have a question or need support, we're here to help.</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p><strong>Email:</strong> support@bollentelectric.com</p>
          <p><strong>Phone:</strong> +91 99999 99999</p>
          <p><strong>Address:</strong> Bollent Electric, Industrial Area, Bengaluru, India</p>

          <div className="map-container">
            <iframe
              title="Bollent Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.2876905224797!2d77.5945625!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c3a5b5fb%3A0x7db63d34d8c67649!2sBangalore!5e0!3m2!1sen!2sin!4v1615970244909!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>

          {submitted && <p className="thank-you">Thanks for contacting us!</p>}
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default ContactUs;
