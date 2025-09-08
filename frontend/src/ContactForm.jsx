import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    message: "",
    terms: false,
    newsletter: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="contact-container">
      <h1>Contact us</h1>
      <p>Get in touch and we’ll get back to you as soon as possible.</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label>First name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            required
          />
          <label>
            I accept the <a href="#">terms and conditions</a> and{" "}
            <a href="#">privacy policy</a>.
          </label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
          />
          <label>Keep me up to date with the latest Go Sitebuilder news</label>
        </div>

        <button type="submit" className="submit-btn">
          Submit your question
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
