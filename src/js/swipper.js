import Swiper from 'swiper';
import 'swiper/css';

const swiperConfigs = [
  {
    selector: '.benefits-swiper',
    slideClass: 'benefits-swiper-slide',
    wrapperClass: 'benefits-swiper-wrapper',
    paginationItemSelector: '.pagination-item',
  },
  {
    selector: '.features-swiper',
    slideClass: 'features-swiper-slide',
    wrapperClass: 'features-swiper-wrapper',
    paginationItemSelector: '.pagination-item',
  },
  {
    selector: '.gallery-swiper',
    slideClass: 'gallery-swiper-slide',
    wrapperClass: 'gallery-swiper-wrapper',
    paginationItemSelector: '.gallery-pagination-item',
  },
  {
    selector: '.key-swiper',
    slideClass: 'key-swiper-slide',
    wrapperClass: 'key-swiper-wrapper',
    paginationItemSelector: '.key-pagination-item',
  },
  {
    selector: '.reviews-swiper',
    slideClass: 'reviews-swiper-slide',
    wrapperClass: 'reviews-swiper-wrapper',
    paginationItemSelector: '.reviews-pagination-item',
  }
];

const swiperInstances = {};

function initSwipers() {
  const screenWidth = window.innerWidth;

  swiperConfigs.forEach(config => {
    const container = document.querySelector(config.selector);
    if (!container) return;

    const id = config.selector;

    // Destroy existing swiper if exists
    if (swiperInstances[id]) {
      swiperInstances[id].destroy(true, true);
      delete swiperInstances[id];
      clearPagination(config.paginationItemSelector);
    }

    const isProgressSwiper = ['.gallery-swiper', '.reviews-swiper'].includes(config.selector);

    if (isProgressSwiper) {
      // Progress bar swipers (Gallery and Reviews)
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
            },
            slideChange: function () {
              updatePagination(config.paginationItemSelector, this.realIndex);
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
        const swiper = new Swiper(id, {
          slidesPerView: config.selector === '.reviews-swiper' ? 2 : 3, // ← тут ключове
          spaceBetween: 20,
          loop: true,
          slideClass: config.slideClass,
          wrapperClass: config.wrapperClass,
          direction: 'horizontal',
          allowTouchMove: true,
          on: {
            init: function () {
              updateProgressBar(this);
            },
            slideChange: function () {
              updateProgressBar(this);
            },
          },
        });

        swiperInstances[id] = swiper;
      }
    } else {
      // Other swipers (benefits, extra, key)
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
            },
            slideChange: function () {
              updatePagination(config.paginationItemSelector, this.realIndex);
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
        // Destroy swiper on desktop for non-progress ones
        if (swiperInstances[id]) {
          swiperInstances[id].destroy(true, true);
          delete swiperInstances[id];
          clearPagination(config.paginationItemSelector);
        }
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

function updateProgressBar(swiper) {
  let progressBar;

  if (swiper.el.classList.contains('gallery-swiper')) {
    progressBar = document.querySelector('.pag_bar');
  } else if (swiper.el.classList.contains('reviews-swiper')) {
    progressBar = document.querySelector('.reviews-pag_bar');
  }

  if (!progressBar || !swiper) return;

  const total = swiper.slides.length - (swiper.loopedSlides * 0.1);
  const currentIndex = swiper.realIndex;
  const percent = ((currentIndex + 1) / total) * 100;
  progressBar.style.width = `${percent}%`;
}

// Init
document.addEventListener('DOMContentLoaded', initSwipers);
window.addEventListener('resize', initSwipers);