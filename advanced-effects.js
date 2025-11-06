const createMouseFollower = () => {
  const follower = document.createElement('div');
  follower.className = 'mouse-follower';
  document.body.appendChild(follower);

  document.addEventListener('mousemove', (e) => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  });
};

const smoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
};



const typewriterEffect = (element, text, speed = 50) => {
  let index = 0;
  element.textContent = '';
  
  const type = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  };
  
  type();
};

const createGradientText = (element) => {
  const text = element.textContent;
  element.innerHTML = '';
  
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.animation = `colorShift ${text.length * 0.1}s ease-in-out ${i * 0.05}s infinite`;
    element.appendChild(span);
  });
};

const counterAnimation = (element, target, duration = 2000) => {
  const start = parseInt(element.textContent);
  const increment = (target - start) / (duration / 16);
  let current = start;
  
  const counter = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
};

const navbarShadow = () => {
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 30px rgba(0, 255, 255, 0.15)';
    } else {
      header.style.boxShadow = '0 4px 30px rgba(0, 255, 255, 0.05)';
    }
  });
};

const createTooltips = () => {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = el.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    el.addEventListener('mouseenter', () => {
      const rect = el.getBoundingClientRect();
      tooltip.style.left = rect.left + 'px';
      tooltip.style.top = (rect.top - 40) + 'px';
      tooltip.style.display = 'block';
      tooltip.style.opacity = '1';
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.style.display = 'none', 300);
    });
  });
};

const activeNavLink = () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('header nav a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#0ff';
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  smoothScroll();
  navbarShadow();
  createTooltips();
  activeNavLink();
  createMouseFollower();
});
