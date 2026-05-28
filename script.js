gsap.registerPlugin(ScrollTrigger);
        // --- Custom Cursor Logic ---
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;
        // Use GSAP ticker for smooth cursor follow
        gsap.ticker.add(() => {
            posX += (mouseX - posX) / 6;
            posY += (mouseY - posY) / 6;
            
            gsap.set(cursor, { x: mouseX, y: mouseY });
            gsap.set(follower, { x: posX, y: posY });
        });
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        // Hover effects for cursor
        const hoverElements = document.querySelectorAll('a, button, video, .item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });
        });
        // --- 1. Initial Load Animations & Leaf Sequence ---
        const tlLoad = gsap.timeline();
        
        // UI elements fade in
        tlLoad.from(".nav-bar", { y: -50, opacity: 0, duration: 1.2, ease: "power4.out" })
              .from(".hero-tag", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
              .from(".hero-title", { y: 50, opacity: 0, duration: 1.2, ease: "power3.out", filter: "blur(10px)" }, "-=0.8")
              .from(".hero-subtitle", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
              .from(".main-leaf-svg", { opacity: 0, scale: 0.8, rotation: 15, duration: 2, ease: "power2.out" }, "-=1");
        // Small leaf initial animation: fades in on the main leaf, then drops slightly
        tlLoad.fromTo(".falling-leaf-svg", 
            { scale: 0, opacity: 0, y: -20, rotation: -45 },
            { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" },
            "-=1"
        )
        // Simulate a leaf detaching
        .to(".falling-leaf-svg", {
            y: 40,
            rotation: 15,
            duration: 0.8,
            ease: "power2.inOut"
        });
        // --- 2. Scroll-Linked Leaf Animation ---
        // As user scrolls the whole page, the small leaf travels downwards and wobbles
        const getTotalScroll = () => document.documentElement.scrollHeight - window.innerHeight;
        
        gsap.to(".falling-leaf-svg", {
            y: () => getTotalScroll() + 200, // Move it down the entire page height
            x: "random(-150, 150)", // Drift horizontally
            rotation: "random(-180, 180)", // Spin randomly
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5 // Smooth catch-up
            }
        });
        // Add a continuous gentle sway to the leaf while scrolling
        gsap.to(".falling-leaf-svg", {
            rotation: "+=45",
            x: "+=30",
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            duration: 3
        });
        // --- 3. Apple-Style Sticky Text Reveal ---
        const tlScroll = gsap.timeline({
            scrollTrigger: {
                trigger: ".explanation-section",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });
        tlScroll.to(".text-1", { opacity: 1, y: -20, duration: 1, filter: "blur(0px)" })
                .to(".text-1", { opacity: 0, scale: 1.1, y: -50, duration: 1, filter: "blur(10px)" }, "+=0.5")
                .to(".text-2", { opacity: 1, y: -20, duration: 1, filter: "blur(0px)" })
                .to(".text-2", { opacity: 0, scale: 1.1, y: -50, duration: 1, filter: "blur(10px)" }, "+=0.5")
                .to(".text-3", { opacity: 1, y: -20, duration: 1, filter: "blur(0px)" })
                .to(".text-3", { opacity: 0, scale: 1.1, y: -50, duration: 1, filter: "blur(10px)" }, "+=0.5");
        // --- 4. Cinematic About Section Reveal ---
        const tlAbout = gsap.timeline({
            scrollTrigger: {
                trigger: ".about-section",
                start: "top 60%",
            }
        });
        
        tlAbout.from(".about-content", {
            scale: 0.95,
            opacity: 0,
            y: 50,
            duration: 1.5,
            ease: "power4.out",
            filter: "blur(10px)"
        })
        .from(".about-title", {
            y: 20, opacity: 0, duration: 1
        }, "-=1")
        // Animate text line by line
        .from(".about-text-inner", {
            y: "100%",
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        }, "-=0.5");
        // --- 5. Reel and Gallery Section Parallax & Stagger ---
        gsap.from(".reel-copy-block, .reel-player", {
            scrollTrigger: {
                trigger: ".reel-section",
                start: "top 75%",
            },
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.18,
            ease: "power4.out",
            filter: "blur(6px)"
        });

        gsap.from(".gallery-header", {
            scrollTrigger: {
                trigger: ".gallery-section",
                start: "top 75%",
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
        // Staggered reveal for grid items
        gsap.from(".item", {
            scrollTrigger: {
                trigger: ".gallery",
                start: "top 80%",
            },
            y: 80,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
            filter: "blur(5px)"
        });
        // Inner image parallax effect on scroll to give 3D depth on larger screens
        const motionQuery = gsap.matchMedia();
        motionQuery.add("(min-width: 769px)", () => {
            gsap.utils.toArray('.item').forEach((item, i) => {
                const mediaElement = item.querySelector('img, .card-video-bg');
                if (!mediaElement) return;
                
                gsap.fromTo(mediaElement, 
                    { yPercent: -8 },
                    {
                        yPercent: 8,
                        ease: "none",
                        scrollTrigger: {
                            trigger: item,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            });
        });
        // --- 6. Footer Reveal ---
        gsap.from(".footer-content > *", {
            scrollTrigger: {
                trigger: "footer",
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        });
        // --- Modal Logic ---
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImg");
        const modalVideo = document.getElementById("modalVideo");
        const modalTitle = document.getElementById("modalTitle");
        const modalDesc = document.getElementById("modalDescription");
        const closeBtn = document.querySelector(".close-modal");
        const backBtn = document.getElementById("modalBackBtn");
        let typewriterTimer = null;

        document.querySelectorAll('.item').forEach(item => {
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.onclick = () => {
                const img = item.querySelector('img');
                const isVideo = item.classList.contains('video-card') || item.hasAttribute('data-video');
                
                let text = "";
                let title = "";
                let src = "";

                if (isVideo) {
                    src = item.getAttribute('data-video');
                    title = item.querySelector('.item-content h4').innerText;
                    text = item.getAttribute('data-blog') || "Unspoken Corners in motion. A compilation of quiet moments, light, and shadows captured across Kerala. From the misty roads of Munnar to the peaceful sunsets of Paruthumpara, this reel brings the silent stories of everyday spaces to life.";
                } else if (img) {
                    src = img.src;
                    title = img.alt;
                    text = img.getAttribute('data-blog') || "This moment was captured beautifully.";
                } else {
                    return; // nothing to show
                }

                // Clean up indentation formatting from HTML source
                text = text.split('\n').map(line => line.trim()).join('\n');

                if (typewriterTimer) {
                    clearTimeout(typewriterTimer);
                }

                const modalContainer = modal.querySelector('.modal-container');
                
                // GSAP Modal Open Animation
                gsap.killTweensOf([modal, modalContainer]);
                gsap.set(modal, { display: "block", opacity: 0 });
                gsap.set(modalContainer, { scale: 0.95, y: 30, opacity: 0 });

                gsap.timeline()
                    .to(modal, { opacity: 1, duration: 0.45, ease: "power2.out" })
                    .to(modalContainer, { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "power4.out" }, "-=0.25");
                
                if (isVideo) {
                    modalImg.style.display = "none";
                    modalVideo.style.display = "block";
                    modalVideo.src = src;
                    modalVideo.play();
                    
                    const modalBlog = document.querySelector(".modal-blog");
                    if (modalBlog) modalBlog.style.display = "none";
                    if (modalContainer) modalContainer.classList.add("no-blog");
                } else {
                    modalVideo.style.display = "none";
                    modalImg.style.display = "block";
                    modalImg.src = src;
                    
                    const modalBlog = document.querySelector(".modal-blog");
                    if (modalBlog) modalBlog.style.display = "block";
                    if (modalContainer) modalContainer.classList.remove("no-blog");
                    
                    modalTitle.innerText = title;
                    modalDesc.innerHTML = ""; // Using innerHTML to support <br>

                    let i = 0;
                    const typeWriter = () => {
                        if (i < text.length) {
                            const char = text.charAt(i);
                            if (char === '\n') {
                                modalDesc.innerHTML += "<br>";
                            } else {
                                modalDesc.innerHTML += char;
                            }
                            i++;
                            typewriterTimer = setTimeout(typeWriter, 12);
                        }
                    };
                    typeWriter();

                    gsap.fromTo(".modal-blog", 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
                    );
                }

                document.body.style.overflow = "hidden"; 
                modal.scrollTop = 0;
            }
            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    item.click();
                }
            });
        });
        const closeModal = () => {
            if (typewriterTimer) {
                clearTimeout(typewriterTimer);
                typewriterTimer = null;
            }
            
            const modalContainer = modal.querySelector('.modal-container');
            
            // Pause and reset video if it is playing
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.src = "";
            }

            gsap.timeline({
                onComplete: () => {
                    modal.style.display = "none";
                    document.body.style.overflow = "auto";
                    
                    // Restore modal blog visibility for image clicks
                    const modalBlog = document.querySelector(".modal-blog");
                    if (modalBlog) modalBlog.style.display = "";
                    if (modalContainer) modalContainer.classList.remove("no-blog");
                }
            })
            .to(modalContainer, { scale: 0.96, y: 20, opacity: 0, duration: 0.4, ease: "power3.in" })
            .to(modal, { opacity: 0, duration: 0.35, ease: "power2.inOut" }, "-=0.25");
        };
        closeBtn.onclick = closeModal;
        backBtn.onclick = closeModal;
        
        window.onclick = (event) => { if (event.target == modal) closeModal(); };
        document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); });