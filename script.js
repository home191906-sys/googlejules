/**
 * Udaan Coaching - Main Dynamic Script
 * Managing sessions, courses, and global UI.
 */

document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. Global Session & Navbar Sync --- */
    function syncNavbarAuth() {
        const user = JSON.parse(localStorage.getItem('udaan-user-session') || 'null');
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        const loginBtn = navActions.querySelector('[href="login.html"]');
        const signupBtn = navActions.querySelector('[href="signup.html"]');

        if (user) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) {
                signupBtn.innerText = "Dashboard";
                signupBtn.setAttribute('data-i18n', 'btn-dashboard');
                signupBtn.href = "dashboard.html";
                signupBtn.classList.replace('btn-primary', 'btn-outline');
            }

            if (!navActions.querySelector('.logout-btn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = "javascript:void(0)";
                logoutBtn.innerText = "Logout";
                logoutBtn.setAttribute('data-i18n', 'btn-logout');
                logoutBtn.className = "btn btn-primary logout-btn";
                logoutBtn.onclick = () => {
                    localStorage.removeItem('udaan-user-session');
                    window.location.href = 'index.html';
                };
                navActions.appendChild(logoutBtn);
            }
        }
    }
    syncNavbarAuth();

    /* --- 2. Course Data Engine --- */
    const courseData = [
        {
            id: 'JEE',
            name: 'IIT-JEE Ranker Program',
            price: 'Rs 45000/yr',
            tag: 'TRENDING',
            icon: 'J',
            summary: 'Concept-first classes, daily DPP, weekly analytics and All India style test ladder.',
            meta: ['12 months', '5 days/week', 'Personal mentor']
        },
        {
            id: 'NEET',
            name: 'NEET Medical Achiever Program',
            price: 'Rs 42000/yr',
            tag: 'POPULAR',
            icon: 'N',
            summary: 'NCERT-driven Biology depth, assertion-reasoning drills and smart error tracking.',
            meta: ['12 months', 'Bio focus', 'Weekly grand tests']
        },
        {
            id: 'FND10',
            name: 'Class 10 Board + Olympiad Foundation',
            price: 'Rs 25000/yr',
            tag: 'BESTSELLER',
            icon: 'F',
            summary: 'Board mastery with early competitive prep through micro-batches and doubt labs.',
            meta: ['10 months', 'Board + Olympiad', 'Recorded revision']
        },
        {
            id: 'FND9',
            name: 'Class 9 Foundation Accelerator',
            price: 'Rs 22000/yr',
            tag: 'LIVE',
            icon: 'F',
            summary: 'Strong maths-science fundamentals with chapter tests and parent progress dashboard.',
            meta: ['10 months', 'Concept building', 'Parent reports']
        },
        {
            id: 'FND8',
            name: 'Class 8 Pre-Foundation',
            price: 'Rs 18000/yr',
            tag: 'NEW',
            icon: 'F',
            summary: 'Curiosity-driven learning track with reasoning, speed maths and confidence building.',
            meta: ['9 months', 'Reasoning + STEM', 'Activity sheets']
        },
        {
            id: 'CA_FND',
            name: 'CA Foundation Pro Track',
            price: 'Rs 35000/yr',
            tag: 'TOP RATED',
            icon: 'C',
            summary: 'Exam-oriented commerce track with mock papers, scanner practice and viva support.',
            meta: ['11 months', 'Paper strategy', 'Mentor guidance']
        }
    ];

    function injectDynamicCourses() {
        const homeCourseGrid = document.querySelector('.courses-grid');
        if (!homeCourseGrid) return;

        const trending = courseData.slice(0, 3);
        homeCourseGrid.innerHTML = trending.map(c => `
            <div class="course-card fade-up-anim visible" style="position: relative; overflow: visible;">
                <div class="course-badge">${c.tag}</div>
                <div class="course-icon">${c.icon}</div>
                <h3 class="course-name" style="font-weight:800; margin-bottom:0.5rem;">${c.name}</h3>
                <p class="course-desc">${c.summary}</p>
                <div class="course-highlights">
                    ${c.meta.map(item => `<span>${item}</span>`).join('')}
                </div>
                <div class="course-footer" style="margin-top:1.5rem; display:flex; justify-content:space-between; align-items:center;">
                    <span class="course-price" style="font-weight:700; color:var(--primary);">${c.price}</span>
                    <a href="signup.html?course=${c.id}" class="btn btn-sm btn-primary">Enroll Now</a>
                </div>
            </div>
        `).join('');

        setInterval(() => {
            const cards = document.querySelectorAll('.course-card');
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            if (randomCard) createFirework(randomCard);
        }, 3000);
    }

    function createFirework(parent) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const tx = (Math.random() - 0.5) * 150;
            const ty = (Math.random() - 0.5) * 150;
            const colors = ['#06b6d4', '#FF671F', '#22c55e', '#ffffff'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.left = '50%';
            particle.style.top = '50%';
            parent.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }

    injectDynamicCourses();

    /* --- 3. Tab Switching System --- */
    window.switchTab = function(tabId, event) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        const targetTab = document.getElementById(tabId);
        if (targetTab) targetTab.classList.add('active');
        if (event) event.currentTarget.classList.add('active');
    };

    /* --- 4. UI Interactions --- */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    const animElements = document.querySelectorAll('.fade-up-anim');
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    animElements.forEach(el => animObserver.observe(el));

    /* --- 5. Language Switching --- */
    const langEnBtn = document.getElementById('lang-en');
    const langHiBtn = document.getElementById('lang-hi');

    function setLanguage(lang) {
        const trans = window.translations ? window.translations[lang] : null;
        if (!trans) return;
        localStorage.setItem('udaan-lang', lang);
        if (langEnBtn && langHiBtn) {
            langEnBtn.classList.toggle('active', lang === 'en');
            langHiBtn.classList.toggle('active', lang === 'hi');
        }
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (trans[key]) el.innerText = trans[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (trans[key]) el.setAttribute('placeholder', trans[key]);
        });
        document.documentElement.lang = lang;
    }

    if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
    if (langHiBtn) langHiBtn.addEventListener('click', () => setLanguage('hi'));
    setLanguage(localStorage.getItem('udaan-lang') || 'en');

    /* --- 6. Global Helpers & Widgets --- */
    function initGlobalLiveInfo() {
        const heroTimeEl = document.getElementById('hero-live-time');
        if (!heroTimeEl) return;
        setInterval(() => {
            heroTimeEl.innerText = new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        }, 1000);
    }

    function injectAskWidget() {
        const widget = document.createElement('div');
        widget.className = 'ask-widget';
        widget.innerHTML = `
            <div class="ask-label">Ask us anything!</div>
            <a href="https://wa.me/919680141133" target="_blank" class="ask-button">
                <i class="fas fa-comment-dots"></i>
            </a>
        `;
        document.body.appendChild(widget);
    }

    injectAskWidget();
    initGlobalLiveInfo();

    if (typeof window.goToStep !== 'function') {
        window.goToStep = function(step) {
            document.querySelectorAll('.step-container').forEach(c => c.classList.remove('active'));
            const target = document.getElementById('step-' + step);
            if (target) target.classList.add('active');
        };
    }

    if (typeof window.moveNext !== 'function') {
        window.moveNext = function(curr, nextId) {
            if (curr.value.length === 1) {
                const next = document.getElementById(nextId);
                if (next) next.focus();
            }
        };
    }
});
