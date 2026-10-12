# Anuj Nova Agency — Official Freelance Web Agency Website

> **Building Modern Digital Experiences**  
> A premium, high-converting, fully responsive personal branding and freelancing website for **Anuj Nova Agency**.

---

## 🌟 Brand Profile & Overview
- **Brand Name**: Anuj Nova Agency
- **Founder / Developer**: Anuj Nova
- **Tagline**: Building Modern Digital Experiences
- **Contact Number / WhatsApp**: [+91 9794030388](https://wa.me/919794030388)
- **Email**: [akp07092007@gmail.com](mailto:akp07092007@gmail.com)
- **LinkedIn**: [linkedin.com/in/anuj-nova-0a4a98385/](https://www.linkedin.com/in/anuj-nova-0a4a98385/)

---

## 🎯 Key Capabilities & Features

### 1. Premium Visual & Brand Design
- **Dark Mode by Default**: High-contrast, sleek charcoal aesthetic with vibrant Purple & Pink gradients.
- **Day / Night Mode Switcher**: Fully functional theme toggle located in the sticky navigation bar, transitioning smoothly and persisting the user's preference in `localStorage`.
- **Minimal, Modern, & Fast**: Pure vanilla HTML5, CSS3, and ES6+ architecture for instant sub-second load times with zero heavy framework bloat.
- **Developer / Web-Design Showcase**: Interactive live code preview and performance badge cards in the hero section.

### 2. High-Converting Lead Channels
- **Direct WhatsApp Funnels**:
  - Hero primary CTA opens WhatsApp with a pre-filled client inquiry.
  - Floating WhatsApp button with pulsing beacon for effortless access while scrolling.
  - Dedicated pre-filled WhatsApp links for each service category.
- **WhatsApp Business Auto-Response Greeting Template**:
  - Interactive template card with 1-click clipboard copy for direct WhatsApp visitors.
- **Direct Phone & Email Actions**:
  - Click-to-call (`tel:+919794030388`)
  - Direct mailto with pre-formatted inquiry subject line (`mailto:akp07092007@gmail.com?subject=Website%20Project%20Inquiry%20-%20Anuj%20Nova%20Agency`)
  - Direct LinkedIn connection button.

### 3. Four Core Services
1. **Portfolio Website** — For Developers, Students, Freelancers, Creators, and Professionals.
2. **E-Commerce Website** — Modern online stores with product catalogs, responsive design, and cart integration.
3. **Business Website** — High-credibility web presence for Startups, Local Businesses, Agencies, Gyms, and Shops.
4. **Education Website** — Comprehensive portals for Schools, Colleges, Coaching Institutes, and Online Courses.

### 4. Authentic Project Showcase (No Fake Clients or Testimonials)
- Interactive category filter tabs: `All`, `Portfolio`, `Business`, `E-Commerce`, `Education`.
- Deep-dive Project Details Modal with architecture breakdown, timeline, technology stack, and direct WhatsApp quote request.

### 5. Secure Backend & Persistent Inquiry Management
- **Zero-Dependency Native Node.js Server (`server.js`)**:
  - Input validation (Name, Email, Phone, Service, Message).
  - Rate limiting and duplicate submission prevention (fingerprint hash checking).
  - Multi-format data persistence:
    - `data/inquiries.json` (Structured JSON records)
    - `data/inquiries.csv` (Spreadsheet-ready CSV log)
  - Inquiry status tracking with reference ID (e.g. `ANA-MUWKQG6T-7390`).

---

## 🚀 Running the Project Locally

### 1. Start the Server
Run the Node.js server from the project directory:
```bash
node server.js
```

### 2. Open in Your Browser
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Run Automated Tests
Execute the end-to-end verification suite:
```bash
node test-inquiry.js
```

---

## 📁 Project Structure

```text
anuj-nova-agency/
├── public/
│   ├── index.html           # Semantic, SEO-optimized markup & JSON-LD
│   ├── css/
│   │   └── style.css        # Responsive CSS custom properties, dark/light themes
│   └── js/
│       └── main.js          # Theme toggle, filter tabs, modal, form validation
├── data/
│   ├── inquiries.json       # Persisted client inquiries (JSON)
│   └── inquiries.csv        # Persisted client inquiries (CSV)
├── server.js                # High-performance native HTTP & API server
├── test-inquiry.js          # Automated end-to-end test suite
├── verify-links.js          # Internal anchor integrity verification
└── package.json             # NPM metadata and scripts
```

---

## 🛡️ WhatsApp Business Greeting Recommended Configuration
In WhatsApp Business (`Settings > Business Tools > Greeting message`), paste the following greeting:
```text
Hi! Welcome to Anuj Nova Agency. I build modern and responsive websites for:
• Portfolio Websites
• E-Commerce Websites
• Business Websites
• Education Websites
Please tell me which type of website you are looking for, and let's discuss your project.
```

---

## © License & Attribution
&copy; 2026 Anuj Nova Agency. Handcrafted with modern web standards by Anuj Nova.
