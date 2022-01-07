'use strict';

///////////////////////////////////////
// Modal window

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const allSections = document.querySelectorAll('.section');

const lazyImgs = document.querySelectorAll('img[data-src]');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function(e) {
  /* const s1coords = section1.getBoundingClientRect();
   // console.log(s1coords);

   // console.log(e.target.getBoundingClientRect());
   // console.log(this.getBoundingClientRect());

   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

   console.log('height/width viewport',
     document.documentElement.clientHeight,
     document.documentElement.clientWidth
   );

   // Scrolling
   // window.scrollTo(s1coords.left, s1coords.top+window.pageYOffset);
   window.scrollTo({
     left: s1coords.left,
     top: s1coords.top + window.pageYOffset,
     behavior: 'smooth'

   });
 */
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
/*
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    const   seID = document.querySelector(id);
    seID.scrollIntoView({ behavior: 'smooth' });
    console.log(`section${i++}`);
    console.log(document.querySelector(id));
  });
});
*/

// 1. Add eventListener to common parent element
// 2. Determine what element originated the event

nav.addEventListener('click', function(e) {
  e.preventDefault();
  console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    console.log('Link');
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//// Tabbed component
tabsContainer.addEventListener('click', function(e) {

  const clicked = e.target.closest('button');

  // Guard clause
  if (!clicked) return;
  // if (clicked.classList.contains('btn')) {
  // console.log('Button', clicked.dataset.tab, e.target);

  const previousTab = [...tabs]
    .find(tab => tab.classList.contains('operations__tab--active'));

  previousTab.classList.remove('operations__tab--active');
  clicked.classList.add('operations__tab--active');

  tabsContent[previousTab.dataset.tab - 1].classList.remove('operations__content--active');
  tabsContent[clicked.dataset.tab - 1].classList.add('operations__content--active');

  /*
      tabsContent.forEach((tab) =>
        tab.classList.remove('operations__content--active'));
      tabsContent[e.target.dataset.tab - 1].classList.toggle('operations__content--active');

      tabs.forEach((tab) =>
        tab.classList.remove('operations__tab--active'));
      e.target.classList.add('operations__tab--active');
    */

  // }
});

//// Menu fade animation

// nav.addEventListener('mouseover', function(e) {
//   // console.log('mouseover');
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     /*const siblings = [...link.parentElement.parentElement.children];
//
//     siblings.forEach(l => l.style.opacity = '0.7');
//     link.parentElement.style.opacity = '1';*/
//
//     // const siblings=[...link.closest('ul')].children;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = '0.7';
//     });
//     logo.style.opacity = '0.7';
//     console.log(siblings);
//     console.log(e.target);
//   }
// });
/*nav.addEventListener('mouseover', function(e) {
  handleHover(e, 0.5);
});*/

// Passing an "argument" into handler
function handleHover(e) {

  // console.log(this,e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.7));
nav.addEventListener('mouseout', handleHover.bind(1));


//// Sticky nav-bar
/* Bad method
const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function() {
  // console.log(window.pageYOffset);
  console.log(window.scrollY);
  if (window.pageYOffset > initialCoords.top)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
});*/

// Intersection observer
/* Пример
const obsCallback = function(entries, observer) {
  entries.forEach(entry =>
    console.log(entry)
  );
};
const obsOptions = {
  root: null,
  threshold: [0, 0.2]
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav,
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
  });
headerObserver.observe(header);

//// Reveal elements on scroll
function revealSection(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionsObs = new IntersectionObserver(revealSection, {
  root: null,
  threshold: '0.15'
});

allSections.forEach(function(section) {
  sectionsObs.observe(section);
  // section.classList.add('section--hidden');
});

//// Lazy loading images
const loadImg = function(entries, observer) {
  const [entry] = entries;
  const fullImgSrc = entry.target.dataset.src;

  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.setAttribute('src', fullImgSrc);
  // entry.target.classList.remove('lazy-img'); // может снять фильтр до того,
  // как загрузится полная версия изображения, по этому делают так:
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  threshold: 0,
  rootMargin: '200px'
});

lazyImgs.forEach(img => imgObserver.observe(img));


//// Slider
const slider = function() {


  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.5)';
// slider.style.overflow = 'visible';

  let curSlide = 0;
  const maxSlide = slides.length - 1;

// Functions
  const createDots = function() {
    slides.forEach(function(_, i) {
      dotContainer.insertAdjacentHTML('beforeend',
        `<button class="dots__dot" data-slide = "${i}">
            </button>`);

    });
  };

  const activateDot = function(slide) {

    document.querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function(slide) {
    slides.forEach((s, i) =>
      s.style.transform = `translateX(${100 * (i - slide)}%)`);
  };

  const nextSlide = function() {
    if (curSlide === maxSlide)
      curSlide = 0;
    else
      curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function() {
    if (curSlide === 0)
      curSlide = maxSlide;
    else
      curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function() {
    createDots();
    goToSlide(0);
    activateDot(0);
  };
  init();
// Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function(e) {
    console.log(e);

    if (e.key === 'ArrowRight')
      nextSlide();
    e.key === 'ArrowLeft' && nextSlide();
  });

  dotContainer.addEventListener('click', function(e) {

    if (!e.target.classList.contains('dots__dot')) return;

    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  });
};
slider();

/*// LECTURES
////////////////////////////////////////////////

// 181 Selecting,creating,deleting el-ts
/!*
// Selecting el-ts
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

console.log(document.querySelector('.header'));
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementsById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
console.log(document.getElementsByClassName('btn'));

// Creating el-ts
//.insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies!';
message.innerHTML = 'We use cookies! <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Deleting

document.querySelector('.btn--close-cookie').addEventListener('click', function() {
  message.remove();
  message.parentElement.removeChild(message);
});
*!/

// 182 Styles Attributes Classes
/!*message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.width);

console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.querySelector(':root').style.setProperty('--color-primary','orange');
document.documentElement.style.setProperty('--color-primary', 'orange');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';
// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bank');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
logo.dataset.versionNumber = '4';
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');*!/

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function(e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log(this.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log('height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(s1coords.left, s1coords.top+window.pageYOffset);
  window.scrollTo({
    left: s1coords.left,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth'

  });

  section1.scrollIntoView({ behavior: 'smooth' });
});
// remove listener
const h1 = document.querySelector('h1');

const alertH1 = function(e) {
  alert('addEventListener: heading');

  // h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);
// h1.onmouseenter = alertH1;

setTimeout(function() {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000);

// Event propagation
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document.querySelector('.nav__link')
  .addEventListener('click', function(e) {
    this.style.backgroundColor = randomColor(0, 255);
    console.log('link', e.target, e.currentTarget);
    console.log(e.currentTarget === this);

    // Stop propagation
    e.stopI();
  });
document.querySelector('.nav__links')
  .addEventListener('click', function(e) {
    this.style.backgroundColor = randomColor(0, 255);
    console.log('link2', e.target, this);
  });
document.querySelector('.nav')
  .addEventListener('click', function(e) {
    this.style.backgroundColor = randomColor(0, 255);
    console.log('link3', e.target, this);
  });

// 188 DOM Traversing
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //только direct children
console.log(h1.children);  //только direct children
console.log(h1.firstElementChild);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orange';

// Going upwards: parents
console.log(h1.parentNode); //только direct parent
console.log(h1.parentElement); //только direct parent

h1.closest('.header').style.background = 'var(--gradient-secondary)'; // Важная штука (closest)

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling); // в js есть возможность увидеть только соседних сиблингов
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); // способ увидеть всех сиблингов
[...h1.parentElement.children].forEach(function(el) {
  if(el !==h1) el.style.transform='scale(0.5)'
})
*/


//// Lifecycle DOM events

document.addEventListener('DOMContentLoaded', function(e) {
  console.log('HTML is loaded and DOM tree is built', e);
});

window.addEventListener('load', function(e) {
  console.log('Page fully loaded (with external resources)', e);
});

// window.addEventListener('beforeunload', function(e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; // for historical reasons
// });