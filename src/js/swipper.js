import Swiper from 'swiper';
import 'swiper/css';

const swiperConfigs = [
  {
    selector: '.faq-swiper',
    slideClass: 'faq-swiper-slide',
    wrapperClass: 'faq-swiper-wrapper',
    paginationItemSelector: '.faq-pagination-item',
  },
  {
    selector: '.features-swiper',
    slideClass: 'features-swiper-slide',
    wrapperClass: 'features-swiper-wrapper',
    paginationItemSelector: '.pagination-item',
  }
];

const swiperInstances = {};

function initSwipers() {
  const screenWidth = window.innerWidth;

  swiperConfigs.forEach(config => {
    const container = document.querySelector(config.selector);
    if (!container) return;

    const id = config.selector;

    if (swiperInstances[id]) {
      swiperInstances[id].destroy(true, true);
      delete swiperInstances[id];
      clearPagination(config.paginationItemSelector);
    }

    if (screenWidth < 1439) {
      const swiper = new Swiper(id, {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        slideClass: config.slideClass,
        wrapperClass: config.wrapperClass,
        direction: 'horizontal',
        on: {
          init: function () {
            updatePagination(config.paginationItemSelector, this.realIndex);
            if (id === '.faq-swiper') initFaqAccordion(this);
          },
          slideChange: function () {
            updatePagination(config.paginationItemSelector, this.realIndex);
            if (id === '.faq-swiper') initFaqAccordion(this);
          },
        },
      });

      swiperInstances[id] = swiper;

      const paginationItems = document.querySelectorAll(config.paginationItemSelector);
      paginationItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          swiper.slideToLoop(index);
        });
      });
    } else {
      // Swiper не використовується на великих екранах
      if (id === '.faq-swiper') {
        initStaticAccordions();
      }

      if (swiperInstances[id]) {
        swiperInstances[id].destroy(true, true);
        delete swiperInstances[id];
        clearPagination(config.paginationItemSelector);
      }
    }
  });
}

function updatePagination(paginationSelector, activeIndex) {
  const items = document.querySelectorAll(paginationSelector);
  items.forEach((item, index) => {
    item.classList.toggle('active', index === activeIndex);
  });
}

function clearPagination(paginationSelector) {
  const items = document.querySelectorAll(paginationSelector);
  items.forEach(item => item.classList.remove('active'));
}

// ========================
// Accordion for Swiper slides
// ========================
function initFaqAccordion(swiperInstance) {
  const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
  if (!activeSlide) return;

  const triggers = activeSlide.querySelectorAll('.faq-acc-el-trigger');
  triggers.forEach(trigger => {
    trigger.removeEventListener('click', handleAccordionClick);
    trigger.addEventListener('click', handleAccordionClick);
  });
}

// ========================
// Accordion for Static (non-swiper) layout
// ========================
function initStaticAccordions() {
  const triggers = document.querySelectorAll('.faq-swiper .faq-acc-el-trigger');
  triggers.forEach(trigger => {
    trigger.removeEventListener('click', handleAccordionClick);
    trigger.addEventListener('click', handleAccordionClick);
  });
}

function handleAccordionClick(e) {
  const trigger = e.currentTarget;
  const parentElement = trigger.closest('.faq-acc-el');
  const panel = parentElement.querySelector('.faq-acc-el-descr-frame');
  const arrow = parentElement.querySelector('.faq-img');
  const isOpen = parentElement.classList.contains('open');

  if (isOpen) {
    parentElement.classList.remove('open');
    if (arrow) arrow.classList.remove('rotated');
    if (panel) panel.style.maxHeight = '0';
  } else {
    parentElement.classList.add('open');
    if (arrow) arrow.classList.add('rotated');
    if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
  }
}

// ========================
// Init
// ========================
document.addEventListener('DOMContentLoaded', initSwipers);
window.addEventListener('resize', initSwipers);