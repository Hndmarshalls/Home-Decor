// ===== NAVBAR & NAVIGATION LOGIC =====
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");

  // 1. Scroll Effect
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Check initial state

  // 2. Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    const toggleMenu = () => {
      const isActive = mobileToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      if (navOverlay) navOverlay.classList.toggle("active");
      document.body.style.overflow = isActive ? "hidden" : "";
    };

    mobileToggle.addEventListener("click", toggleMenu);
    if (navOverlay) navOverlay.addEventListener("click", toggleMenu);

    // 3. Mobile Dropdown (Accordion) - RE-IMPLEMENTED ROBUST LOGIC
    const mobileDropdowns = document.querySelectorAll('.dropdown-trigger');
    
    mobileDropdowns.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        
        // Active if width is mobile OR if navMenu is active (fallback check)
        const isMobile = window.innerWidth <= 992 || document.getElementById('navMenu').classList.contains('active');

        if (isMobile) {
          e.preventDefault();
          e.stopPropagation();

          const parent = this.parentElement; // The <li.nav-item>
          const submenu = this.nextElementSibling; // The <div.dropdown-menu>

          // 1. Close ALL other dropdowns to keep it clean (Accordion style)
          document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            if (menu !== submenu) {
              menu.classList.remove('show');
              menu.parentElement.classList.remove('active');
            }
          });

          // 2. Toggle THIS dropdown
          if (submenu) {
            submenu.classList.toggle('show');
            parent.classList.toggle('active'); // Rotates arrow
          }
        }
      });
    });

    // 4. Close menu when clicking ANY link (except dropdown triggers)
    document.addEventListener('click', (e) => {
       const isLink = e.target.matches('.nav-link:not(.dropdown-trigger)') || e.target.closest('.dropdown-menu a');
       
       if (isLink && window.innerWidth <= 992) {
          const navMenu = document.getElementById("navMenu");
          const mobileToggle = document.getElementById("mobileToggle");
          const navOverlay = document.getElementById("navOverlay");
          
          if(navMenu) navMenu.classList.remove("active");
          if(mobileToggle) mobileToggle.classList.remove("active");
          if(navOverlay) navOverlay.classList.remove("active");
          document.body.style.overflow = "";
       }
    });
  }

  // 5. Smooth Scroll for Logo
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("click", (e) => {
      const isHomePage = window.location.pathname.endsWith('index.html') || 
                         window.location.pathname.endsWith('/') || 
                         window.location.pathname === '';
      if (isHomePage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
});

// ===== PAGE NAVIGATION =====
function goToPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));

  // Show selected page
  const selectedPage = document.getElementById(pageName);
  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  // Close mobile menu
  navMenu.classList.remove("active");

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== CLOSE MENU WHEN CLICKING OUTSIDE =====
document.addEventListener("click", function (event) {
  const navbar = document.querySelector(".navbar");
  if (!navbar.contains(event.target)) {
    navMenu.classList.remove("active");
  }
});

// Scroll Reveal with Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".scroll-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.setProperty("--delay", delay);
          entry.target.classList.add("revealed");
          // Unobserve after reveal for performance gain (Reduces Lag)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Trigger almost immediately
      rootMargin: "0px 0px 0px 0px", // Trigger exactly when it enters view
    }
  );

  reveals.forEach((el) => observer.observe(el));
});

// ===== IMAGE MODAL FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const closeBtn = document.querySelector(".modal-close");
  const prevBtn = document.querySelector(".modal-prev");
  const nextBtn = document.querySelector(".modal-next");
  const galleryItems = document.querySelectorAll(".gallery-item");
  
  let currentIndex = 0;

  function updateModal(index) {
    if (!galleryItems.length) return;
    
    // Handle wrapping
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    
    currentIndex = index;
    
    const item = galleryItems[currentIndex];
    const img = item.querySelector("img");
    
    if (img) {
      // Get higher resolution image
      const imgSrc = img.src.replace("w=600&h=700", "w=1920&h=1080");
      
      // Update content
      modalImg.src = imgSrc;
      modalImg.alt = img.alt || "Gallery Image";
      const altText = img.alt || `Gallery Image ${index + 1}`;
      modalCaption.textContent = altText;
    }
  }

  // Open modal when clicking on gallery images
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      currentIndex = index;
      updateModal(currentIndex); // Set content
      
      modal.style.display = "flex";
      // Force reflow
      modal.offsetHeight;
      modal.classList.add("active");
      
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal function
  function closeModal() {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
      modalImg.src = "";
      document.body.style.overflow = "auto";
    }, 400); 
  }

  // Close buttons
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Close when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("active")) return;
    
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") updateModal(currentIndex + 1);
    if (e.key === "ArrowLeft") updateModal(currentIndex - 1);
  });

  // Button navigation
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateModal(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateModal(currentIndex + 1);
    });
  }

  // Touch/Swipe navigation
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50;

  modal.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});

  modal.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});

  function handleSwipe() {
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped Left -> Next
      updateModal(currentIndex + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped Right -> Prev
      updateModal(currentIndex - 1);
    }
  }
});

// ===== DOWNLOAD ITEM INTERACTION (MOBILE) =====
document.addEventListener("DOMContentLoaded", () => {
  const downloadItems = document.querySelectorAll(".download-item");
  
  downloadItems.forEach(item => {
    item.addEventListener("click", function(e) {
      if (window.innerWidth <= 768) {
        // If clicking the action buttons themselves, don't toggle
        if (e.target.closest(".download-actions")) return;
        
        // Toggle active class on the item
        const isActive = this.classList.contains("active");
        
        // Remove active class from all other items
        downloadItems.forEach(i => i.classList.remove("active"));
        
        // Toggle this item
        if (!isActive) {
          this.classList.add("active");
          // Prevent default only if we're opening the overlay
          e.preventDefault();
        }
      }
    });
  });

  // Close overlay when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".download-item")) {
      downloadItems.forEach(item => item.classList.remove("active"));
    }
  });

  // ===== DYNAMIC FILE SIZE DETECTION (Lazy Loaded) =====
  function setupFileSizeObserver() {
    const fileSizeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          updateSingleFileSize(item);
          fileSizeObserver.unobserve(item);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('.download-item').forEach(item => {
      fileSizeObserver.observe(item);
    });
  }

  async function updateSingleFileSize(item) {
    const downloadBtn = item.querySelector('.action-btn.download');
    if (!downloadBtn) return;
    
    const fileUrl = downloadBtn.getAttribute('href');
    const sizeTag = item.querySelector('.download-info p:last-child');
    
    if (!sizeTag) return;

    if (sizeTag.textContent.includes('...')) {
      sizeTag.textContent = 'PDF • Calculating...';
    }
    
    try {
      const response = await fetch(fileUrl, { method: 'HEAD' });
      const size = response.headers.get('content-length');
      
      if (size) {
        const mb = (size / (1024 * 1024)).toFixed(1);
        sizeTag.textContent = `PDF • ${mb} MB`;
        sizeTag.classList.add('size-loaded');
      } else {
        sizeTag.textContent = 'PDF • View Catalog';
      }
    } catch (err) {
      sizeTag.textContent = 'PDF • Click to Open';
    }
  }

  // Run on load
  setupFileSizeObserver();

  // ===== CATALOG SEARCH FUNCTIONALITY =====
  const searchInput = document.getElementById('catalogSearch');
  const noResults = document.querySelector('.no-results');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      const items = document.querySelectorAll('.download-item');
      let visibleCount = 0;
      
      items.forEach(item => {
        const title = item.querySelector('.download-info p:first-child').textContent.toLowerCase();
        if (title.includes(query)) {
          item.style.display = 'flex';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  }
});

// ===== HERO SLIDER AUTOMATION =====
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 5000; // Increased to 5s for better reading time
    let slideTimer;

    function updateSlider(index) {
        if (index === currentSlide) return;

        // Wrap around index if out of bounds
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        // Remove exiting class from all
        slides.forEach(slide => slide.classList.remove('exiting'));
        
        // Mark current as exiting
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('exiting');
        
        // Add active to new
        slides[index].classList.add('active');
        
        // Update Dots
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        updateSlider(next);
    }

    function startTimer() {
        slideTimer = setInterval(nextSlide, slideInterval);
    }

    function resetTimer() {
        clearInterval(slideTimer);
        startTimer();
    }

    // Set interval for automatic sliding
    startTimer();

    // Dot Click Event
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            resetTimer(); // Reset timer so it doesn't auto-slide immediately after click
        });
    });
});

// ===== CATEGORY HEADER SLIDER AUTOMATION =====
document.addEventListener("DOMContentLoaded", () => {
  const sliderContainers = document.querySelectorAll('.category-slider-container');
  if (sliderContainers.length === 0) return;

  sliderContainers.forEach((container) => {
    const slides = container.querySelectorAll('.category-slide');

    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 4000; // 4 seconds

    function updateSlider(index) {
      if (index === currentSlide) return;

      slides.forEach((slide) => slide.classList.remove('exiting'));
      
      slides[currentSlide].classList.remove('active');
      slides[currentSlide].classList.add('exiting');

      slides[index].classList.add('active');

      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      updateSlider(next);
    }

    let slideTimer = setInterval(nextSlide, slideInterval);
  });
});

// ===== SEE MORE TOGGLE (ABOUT SECTION) =====
document.addEventListener("DOMContentLoaded", () => {
    const seeMoreBtn = document.getElementById("seeMoreBtn");
    const moreContent = document.getElementById("moreAbout");
    const moreImage = document.getElementById("moreAboutImage");

    if (seeMoreBtn) {
        // Initial button state with icon
        seeMoreBtn.innerHTML = '<span>See More</span><i class="fas fa-chevron-down"></i>';
        
        seeMoreBtn.addEventListener("click", () => {
            const isActive = moreContent.classList.contains("active");
            
            if (isActive) {
                moreContent.classList.remove("active");
                if (moreImage) moreImage.classList.remove("active");
                seeMoreBtn.innerHTML = '<span>See More</span><i class="fas fa-chevron-down"></i>';
                // Optional: scroll back to about section top
                document.querySelector('.about').scrollIntoView({ behavior: 'smooth' });
            } else {
                moreContent.classList.add("active");
                if (moreImage) moreImage.classList.add("active");
                seeMoreBtn.innerHTML = '<span>See Less</span><i class="fas fa-chevron-up"></i>';
            }
        });
    }
});

// ===== STATS NUMBER COUNTING ANIMATION =====
document.addEventListener("DOMContentLoaded", () => {
    const statsNumbers = document.querySelectorAll(".stat-number");
    
    const countUp = (element) => {
        const target = parseInt(element.getAttribute("data-target"));
        const duration = 2000; // 2 seconds
        let current = 0;
        const increment = target / (duration / 16); // ~60fps
        
        const updateCount = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + "+";
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target + "+";
            }
        };
        
        updateCount();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsNumbers.forEach(num => statsObserver.observe(num));
});
// ===== SCROLL PROGRESS INDICATOR =====
document.addEventListener("DOMContentLoaded", () => {
    // Check if it already exists to avoid duplicates on re-renders if applicable
    if (document.querySelector('.scroll-progress-container')) return;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    progressContainer.innerHTML = `
        <svg class="scroll-progress-circle" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30"></circle>
        </svg>
        <i class="fas fa-arrow-up scroll-icon"></i>
    `;
    document.body.appendChild(progressContainer);

    const circle = progressContainer.querySelector('circle');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference}`;

    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Handle case where scrollHeight is 0
        if (scrollHeight <= 0) {
            progressContainer.style.display = 'none';
            return;
        } else {
            progressContainer.style.display = 'flex';
        }

        // Show/hide based on scroll position (e.g., hide when very close to top)
        if (scrollTop < 100) {
            progressContainer.style.opacity = '0';
            progressContainer.style.pointerEvents = 'none';
        } else {
            progressContainer.style.opacity = '1';
            progressContainer.style.pointerEvents = 'all';
        }

        const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
        const dashoffset = circumference - (progress * circumference);
        
        circle.style.strokeDashoffset = dashoffset;
    }

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    
    // Initial call
    updateProgress();

    // Click to scroll to top
    progressContainer.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
