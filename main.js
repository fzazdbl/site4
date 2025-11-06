const body = document.body;
const navLinks = document.querySelector('.nav__links');
const navToggle = document.querySelector('.nav__toggle');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-toggle__icon');
const tabs = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-content');
const accordionItems = document.querySelectorAll('.accordion__item');
const accordionPanels = document.querySelectorAll('.accordion__panel');
const paletteChips = document.querySelectorAll('.palette__color');

// Mobile navigation toggle
navToggle.addEventListener('click', () => {
  const expanded = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', expanded);
});

// Close mobile navigation when clicking a link
navLinks.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// Smooth scroll and active state for navigation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  },
  {
    threshold: 0.3,
  }
);

document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));

// Theme toggle handling
const storedTheme = localStorage.getItem('ios26-theme');
if (storedTheme) {
  body.setAttribute('data-theme', storedTheme);
  themeIcon.textContent = storedTheme === 'night' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const nextTheme = current === 'night' ? 'day' : 'night';
  body.setAttribute('data-theme', nextTheme);
  themeIcon.textContent = nextTheme === 'night' ? '☀️' : '🌙';
  localStorage.setItem('ios26-theme', nextTheme);
});

// Tabs behaviour
function deactivateTabs() {
  tabs.forEach((tab) => tab.classList.remove('active'));
  tabPanels.forEach((panel) => panel.classList.remove('active'));
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    deactivateTabs();
    tab.classList.add('active');
    document.getElementById(target)?.classList.add('active');
  });
});

// Accordion behaviour
accordionItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    const isExpanded = item.getAttribute('aria-expanded') === 'true';
    accordionItems.forEach((button, idx) => {
      button.setAttribute('aria-expanded', 'false');
      accordionPanels[idx].classList.remove('is-open');
      accordionPanels[idx].style.maxHeight = null;
      button.querySelector('.accordion__icon').textContent = '＋';
    });

    if (!isExpanded) {
      item.setAttribute('aria-expanded', 'true');
      accordionPanels[index].classList.add('is-open');
      accordionPanels[index].style.maxHeight = `${accordionPanels[index].scrollHeight}px`;
      item.querySelector('.accordion__icon').textContent = '－';
    }
  });
});

// Palette chip interaction
paletteChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const color = chip.dataset.color;
    navigator.clipboard
      .writeText(color)
      .then(() => {
        chip.classList.add('copied');
        chip.textContent = `${color} copié !`;
        setTimeout(() => {
          chip.classList.remove('copied');
          chip.textContent = colorNameFromHex(color);
        }, 1500);
      })
      .catch(() => {
        chip.textContent = color;
      });
  });
});

function colorNameFromHex(hex) {
  switch (hex) {
    case '#fef6f9':
      return 'Sakura';
    case '#e4002b':
      return 'Rouge Hinomaru';
    case '#1c1c1c':
      return 'Noir Encre';
    case '#9bb7d4':
      return 'Bleu Indigo';
    case '#f2f1ec':
      return 'Beige Washi';
    default:
      return hex;
  }
}

// Smooth scroll for anchor links
if ('scrollBehavior' in document.documentElement.style) {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        event.preventDefault();
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Apply fade-in animation when elements enter viewport
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.card, .timeline__item, .comparison__column, .notice').forEach((el) => {
  el.classList.add('will-reveal');
  revealObserver.observe(el);
});
