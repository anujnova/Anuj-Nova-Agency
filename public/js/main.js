/**
 * Anuj Nova Agency - Interactive Client Script
 * Built with modern vanilla JavaScript (Zero dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. THEME TOGGLE (DAY / NIGHT MODE)
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('anuj_nova_theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Night' : 'Day'} mode`);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('anuj_nova_theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Day' : 'Night'} mode`);
      themeToggle.setAttribute('title', `Switch to ${theme === 'dark' ? 'Day' : 'Night'} mode`);
    }
  }

  // =========================================================================
  // 2. MOBILE HAMBURGER MENU & DRAWER
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-hire-btn');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // =========================================================================
  // 3. ACTIVE NAV LINK SCROLLSPY
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.scrollY + 100;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // =========================================================================
  // 4. PORTFOLIO FILTER TABS
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab UI
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      // Filter cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 5. PROJECT DETAILS MODAL
  // =========================================================================
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalSecondaryCloseBtn = document.getElementById('modalSecondaryCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalCategoryVal = document.getElementById('modalCategoryVal');
  const modalDescription = document.getElementById('modalDescription');
  const modalTimeline = document.getElementById('modalTimeline');
  const modalTechStack = document.getElementById('modalTechStack');
  const modalWhatsAppCta = document.getElementById('modalWhatsAppCta');
  const modalPreviewBox = document.getElementById('modalPreviewBox');

  // Detailed Project Database
  const projectDetails = {
    '1': {
      title: 'DevFolio Pro — Creator & Engineer Portfolio',
      category: 'Portfolio Website',
      timeline: '3 - 5 Days',
      stack: 'HTML5, Modern CSS, ES6+, Responsive Design',
      desc: 'Engineered for high-performing software developers, creators, and freelancers. Features clean code, zero bloated frameworks, Lighthouse 99+ performance score, smooth dark/light mode toggle, dynamic skill categorization, and frictionless direct contact hooks via WhatsApp and email.',
      previewBg: 'linear-gradient(135deg, #18122B, #393053)',
      whatsappMsg: 'Hi Anuj, I saw your DevFolio Pro project and I am interested in getting a similar Portfolio Website for myself.'
    },
    '2': {
      title: 'TrendCart — Modern Lifestyle Store UI',
      category: 'E-Commerce Website',
      timeline: '7 - 14 Days',
      stack: 'JavaScript, CSS Grid, LocalStorage Store, WhatsApp Order API',
      desc: 'A modern, lightweight e-commerce storefront designed for fast conversions. Features real-time client-side search, category filter chips, an interactive sliding cart drawer, product detail popups, and a seamless 1-click WhatsApp order generator that formats checkout items into instant chat orders.',
      previewBg: 'linear-gradient(135deg, #0B2447, #19376D)',
      whatsappMsg: 'Hi Anuj, I saw your TrendCart project and I am interested in building an E-Commerce Website with Anuj Nova Agency.'
    },
    '3': {
      title: 'Apex Fit Studio — Local Fitness Club',
      category: 'Business Website',
      timeline: '5 - 10 Days',
      stack: 'HTML5, CSS Variables, Lead Funnel, Google Maps Embed',
      desc: 'A commercial lead-generation website designed for local service businesses and gyms. Engineered to drive memberships through high-contrast pricing tables, trainer credential highlights, timetable schedule tabs, and prominent tap-to-call and WhatsApp consultation buttons.',
      previewBg: 'linear-gradient(135deg, #2C1810, #4A2810)',
      whatsappMsg: 'Hi Anuj, I saw your Apex Fit Studio project and I want to build a Business Website for my company.'
    },
    '4': {
      title: 'Zenith Academy — Coaching & Institute Portal',
      category: 'Education Website',
      timeline: '7 - 12 Days',
      stack: 'JavaScript, Form Validation, Accessible UX, SEO Schema',
      desc: 'An organized educational institute portal built to simplify admissions and parent communication. Features modular course catalogs, batch timing schedules, downloadable syllabus PDFs, and an integrated student lead intake system.',
      previewBg: 'linear-gradient(135deg, #1B1A55, #070F2B)',
      whatsappMsg: 'Hi Anuj, I saw your Zenith Academy project and I am interested in an Education Website for my school/coaching institute.'
    },
    '5': {
      title: 'NovaCorp Advisory — Professional Services',
      category: 'Business Website',
      timeline: '5 - 9 Days',
      stack: 'HTML5, Modern CSS, Python/Django, SEO Optimization',
      desc: 'Designed for corporate agencies, legal firms, and consultancies requiring an authoritative digital footprint. Features clear practice area overviews, team bio cards, appointment consultation booking triggers, and structured data for local search visibility.',
      previewBg: 'linear-gradient(135deg, #151520, #22223b)',
      whatsappMsg: 'Hi Anuj, I saw your NovaCorp Advisory project and would like to discuss a professional corporate website.'
    },
    '6': {
      title: 'ByteCamp — Coding Bootcamp Platform',
      category: 'Education Website',
      timeline: '6 - 11 Days',
      stack: 'JavaScript, CSS Flex/Grid, Interactive UI, Mobile First',
      desc: 'Interactive platform for training academies and tech mentors. Features curriculum module expanders, beginner to advanced track pathways, transparent fee structures, and direct student registration inquiries.',
      previewBg: 'linear-gradient(135deg, #1e1b4b, #312e81)',
      whatsappMsg: 'Hi Anuj, I saw your ByteCamp project and I need an educational portal for courses and student training.'
    }
  };

  const viewProjectButtons = document.querySelectorAll('.view-project-btn');
  viewProjectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-id');
      const data = projectDetails[projectId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalCategoryVal.textContent = data.category;
      modalTimeline.textContent = data.timeline;
      modalTechStack.textContent = data.stack;
      modalDescription.textContent = data.desc;

      // Update WhatsApp link
      const encodedMsg = encodeURIComponent(data.whatsappMsg);
      modalWhatsAppCta.href = `https://wa.me/919794030388?text=${encodedMsg}`;

      // Update Preview visual inside modal
      modalPreviewBox.style.background = data.previewBg;
      modalPreviewBox.innerHTML = `
        <div style="padding: 30px 20px; text-align: center; color: #fff;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🚀</div>
          <h4 style="font-size: 1.15rem; margin-bottom: 4px; font-weight: 700;">${data.title}</h4>
          <p style="font-size: 0.85rem; opacity: 0.85;">Built by Anuj Nova Agency &bull; Production Ready</p>
        </div>
      `;

      openModal();
    });
  });

  function openModal() {
    if (!projectModal) return;
    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  modalSecondaryCloseBtn?.addEventListener('click', closeModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.classList.contains('open')) {
      closeModal();
    }
  });

  // =========================================================================
  // 6. WHATSAPP BUSINESS GREETING COPY HELPER
  // =========================================================================
  const copyGreetingBtn = document.getElementById('copyGreetingBtn');
  const copyGreetingLabel = document.getElementById('copyGreetingLabel');
  const waMessageText = document.getElementById('waMessageText');

  if (copyGreetingBtn && waMessageText) {
    copyGreetingBtn.addEventListener('click', async () => {
      const textToCopy = waMessageText.innerText.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
        copyGreetingLabel.textContent = 'Copied to Clipboard!';
        showToast('Greeting template copied! Ready to paste into WhatsApp Business.');
        setTimeout(() => {
          copyGreetingLabel.textContent = 'Copy Greeting Template';
        }, 3000);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyGreetingLabel.textContent = 'Copied to Clipboard!';
        showToast('Greeting template copied!');
        setTimeout(() => {
          copyGreetingLabel.textContent = 'Copy Greeting Template';
        }, 3000);
      }
    });
  }

  // =========================================================================
  // 7. INQUIRY FORM VALIDATION & SECURE BACKEND SUBMISSION
  // =========================================================================
  const inquiryForm = document.getElementById('inquiryForm');
  const submitInquiryBtn = document.getElementById('submitInquiryBtn');
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const formErrorAlert = document.getElementById('formErrorAlert');
  const formErrorMessage = document.getElementById('formErrorMessage');
  const inquiryIdDisplay = document.getElementById('inquiryIdDisplay');

  // Input Elements
  const nameInput = document.getElementById('clientName');
  const emailInput = document.getElementById('clientEmail');
  const phoneInput = document.getElementById('clientPhone');
  const serviceInput = document.getElementById('clientService');
  const messageInput = document.getElementById('clientMessage');

  // Error Elements
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const serviceError = document.getElementById('serviceError');
  const messageError = document.getElementById('messageError');

  // Clear single error on input
  [nameInput, emailInput, phoneInput, serviceInput, messageInput].forEach(input => {
    input?.addEventListener('input', () => {
      input.classList.remove('input-error');
      const errEl = document.getElementById(`${input.name}Error`);
      if (errEl) errEl.textContent = '';
      formErrorAlert.style.display = 'none';
    });
  });

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset alert states
      formSuccessAlert.style.display = 'none';
      formErrorAlert.style.display = 'none';

      // Validate Fields
      let isValid = true;

      // 1. Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal || nameVal.length < 2) {
        showFieldError(nameInput, nameError, 'Please enter your full name (minimum 2 characters).');
        isValid = false;
      }

      // 2. Validate Email
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showFieldError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      }

      // 3. Validate Phone
      const phoneVal = phoneInput.value.trim();
      const phoneDigits = phoneVal.replace(/\D/g, '');
      if (!phoneVal || phoneDigits.length < 7 || phoneDigits.length > 15) {
        showFieldError(phoneInput, phoneError, 'Please enter a valid phone number (at least 7 digits).');
        isValid = false;
      }

      // 4. Validate Service
      const serviceVal = serviceInput.value.trim();
      if (!serviceVal) {
        showFieldError(serviceInput, serviceError, 'Please select the service you are looking for.');
        isValid = false;
      }

      // 5. Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal || messageVal.length < 10) {
        showFieldError(messageInput, messageError, 'Please describe your project (minimum 10 characters).');
        isValid = false;
      }

      if (!isValid) {
        formErrorMessage.textContent = 'Please correct the highlighted fields above.';
        formErrorAlert.style.display = 'flex';
        return;
      }

      // Prevent local double-click spam
      const submissionFingerprint = `${emailVal}_${phoneDigits}_${messageVal.slice(0, 30)}`;
      const lastSent = sessionStorage.getItem('last_sub_' + submissionFingerprint);
      if (lastSent && Date.now() - parseInt(lastSent, 10) < 60000) {
        formErrorMessage.textContent = 'You have recently sent this exact inquiry. Anuj has already received it and will contact you shortly.';
        formErrorAlert.style.display = 'flex';
        return;
      }

      // Set Loading State
      setButtonLoading(true);

      const payload = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        service: serviceVal,
        message: messageVal,
        submittedAt: new Date().toISOString()
      };

      try {
        const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Record successful submission to prevent duplicate spam
          sessionStorage.setItem('last_sub_' + submissionFingerprint, Date.now().toString());

          // Show exact required success message
          formSuccessAlert.style.display = 'flex';
          inquiryIdDisplay.innerHTML = `
            <span>Reference ID: <strong>${result.inquiryId}</strong></span> &bull; 
            <span>Saved &amp; Dispatched to Anuj Nova</span>
          `;
          
          // Reset form fields
          inquiryForm.reset();

          showToast("Your inquiry has been sent successfully!");

          // Smoothly scroll to the success alert
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } else {
          // Server returned validation or rate limit error
          const errMsg = result.error || "Unable to deliver inquiry. Please try again or reach out on WhatsApp.";
          formErrorMessage.textContent = errMsg;
          formErrorAlert.style.display = 'flex';
          showToast(errMsg, 5000);
        }

      } catch (err) {
        console.error('Submission network error:', err);
        // Fallback message when server is unreachable or offline
        formErrorMessage.textContent = "Unable to connect to the server. You can also chat directly with Anuj on WhatsApp: +91 9794030388.";
        formErrorAlert.style.display = 'flex';
        showToast("Connection error. Please try WhatsApp directly.", 5000);
      } finally {
        setButtonLoading(false);
      }
    });
  }

  function showFieldError(inputEl, errorEl, message) {
    inputEl.classList.add('input-error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function setButtonLoading(isLoading) {
    if (!submitInquiryBtn) return;
    const btnText = submitInquiryBtn.querySelector('.btn-text');
    const spinner = submitInquiryBtn.querySelector('.spinner');
    const btnArrow = submitInquiryBtn.querySelector('.btn-arrow');

    if (isLoading) {
      submitInquiryBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending Inquiry...';
      if (spinner) spinner.style.display = 'inline-block';
      if (btnArrow) btnArrow.style.display = 'none';
    } else {
      submitInquiryBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Inquiry';
      if (spinner) spinner.style.display = 'none';
      if (btnArrow) btnArrow.style.display = 'inline-block';
    }
  }

  // =========================================================================
  // 8. TOAST NOTIFICATION UTILITY
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, duration = 3500) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }

});
