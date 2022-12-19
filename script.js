'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navigation = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// BLOCK PAGE NAVIGATION EVENT DELIGATION

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching to respond only to the links and nothing else within parent element
  if (e.target.classList.contains('nav__link')) {
    const el = e.target;
    const id = el.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    e.stopPropagation();
  }
});

// BLOCK SMOOTH SCRALLING LEARN MORE LINK

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// BLOCK TABBED COMPONENT

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', e => {
  e.stopPropagation();
  const clicked = e.target.closest('.operations__tab');

  // or use guard clause
  if (!clicked) return;
  else {
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');
    const dataTab = clicked.dataset.tab;
    tabsContent.forEach(t => {
      if (t.classList.contains(`operations__content--${dataTab}`))
        t.classList.add('operations__content--active');
    });
  }
});

// BLOCK MENU FADE ANIMATION

const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// passing 'argument' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// BLOCK STICKY NAVIGATION

const navHeight = nav.getBoundingClientRect();

const obsOptions = {
  root: null, // null for whole view port

  // 0.1 (10%) persentage of intersaction, how much needs to be visible to call callback, 0 means the item must be out of the view, 1 means 100% of target must be visible in viewport, may pass array [0, 1]
  threshold: 0,

  // 90px outside header element, allows sticky class to be added when the distance before brake line on the page is as big as the the height of the nav, that is a nice clean effect (adds margin)
  rootMargin: `-${navHeight.height}px`,
};

const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

// BLOCK REVEAL ON SCROLL

const obsOptionsSection = {
  root: null,
  threshold: 0.2,
};

// may use classList or className
const revealSections = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (
    entry.target.classList.contains('section--hidden') &&
    entry.isIntersecting
  ) {
    entry.target.classList.remove('section--hidden');
    // stop observing to improve performance
    observer.unobserve(entry.target);
  } else return;
};

const sectionObserver = new IntersectionObserver(
  revealSections,
  obsOptionsSection
);

sections.forEach(s => {
  sectionObserver.observe(s);
  s.classList.add('section--hidden');
});

// BLOCK LAZY IMG LOADING

const featureImgs = document.querySelectorAll('img[data-src]');

const obsImgOptions = {
  root: null,
  threshold: 0,
  // margin and threshold of 0 allow to load picture before it is in the view
  // threshold of 0 without margin will load picture right away
  // threshold of 10% by itself may affect user experience as user will witness loading
  rootMargin: '200px',
};

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    // once the image is loaded a load event will be emitted automatically, only then we unblur img
    entry.target.addEventListener('load', () =>
      entry.target.classList.remove('lazy-img')
    );

    observer.unobserve(entry.target);
  }
};

const imageObserver = new IntersectionObserver(loadImg, obsImgOptions);
featureImgs.forEach(img => imageObserver.observe(img));

// BLOCK SLIDER COMPONENT

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  slides.forEach((s, i) => {
    // 0%, 100%, 200%, 300% etc...
    s.style.transform = `translateX(${100 * i}%)`;
  });

  let curSlide = 0;

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  btnRight.addEventListener('click', () => {
    if (curSlide === slides.length - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activeDot(curSlide);
  });

  btnLeft.addEventListener('click', () => {
    if (curSlide === 0) curSlide = slides.length - 1;
    else curSlide--;
    goToSlide(curSlide);
    activeDot(curSlide);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      if (curSlide === 0) curSlide = slides.length - 1;
      else curSlide--;
      goToSlide(curSlide);
      activeDot(curSlide);
    }
    if (e.key === 'ArrowRight') {
      if (curSlide === slides.length - 1) curSlide = 0;
      else curSlide++;
      goToSlide(curSlide);
      activeDot(curSlide);
    }
  });

  // dots
  const createDots = function () {
    slides.forEach((s, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
    dotContainer.firstChild.classList.add('dots__dot--active');
  };

  createDots();

  const activeDot = function (slide) {
    [...dotContainer.children].forEach(c =>
      c.classList.remove('dots__dot--active')
    );
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', e => {
    e.stopPropagation();
    if (e.target.classList.contains('dots__dot')) {
      activeDot(e.target.dataset.slide);
    }
    goToSlide(e.target.dataset.slide);
  });
};

slider();
