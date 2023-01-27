//import { SplitVendorChunkCache } from 'vite';
import './style.css'


// IMAGE SLIDER //
const slideBtns = document.querySelectorAll('[data-slideBtn]');
const slideContainer = document.querySelector('[data-slideContainer]');
const slides = [...document.querySelectorAll('[data-slide]')];

let  currentIndex = 0;
let isMoving = false;

// btn handle function
function handleSlideBtnClick(e){
    if(isMoving) return;
    isMoving = true;
    e.currentTarget.id === "prev"
     ? currentIndex--
     : currentIndex++;
    slideContainer.dispatchEvent(new Event("sliderMove"));
}

// remove/add attribute functions
const removeDisabledAttribute = (els) => els.forEach(el => el.removeAttribute('disabled'));
const addDisabledAttribute = (els) => els.forEach(el => el.setAttribute('disabled', 'true'));


// event  listeners
slideBtns.forEach(btn => btn.addEventListener('click', handleSlideBtnClick));

slideContainer.addEventListener('sliderMove', () => {
    // 1. translate the container to the right/left
    slideContainer.style.transform = `translateX(-${currentIndex * slides[0].clientWidth}px)`;
    // 2. remove disabled attributes
    removeDisabledAttribute(slideBtns);
    // 3. reenable disabled atributes if needed
    currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
})

// transition end event
slideContainer.addEventListener('transitionend', () => isMoving = false);

// disable image drag events
document.querySelectorAll('[data-slide] img').forEach(img => img.ondragstart = () => false);

// intersection abserver for slider
const slideObserver = new IntersectionObserver((slide) =>{
    if(slide[0].isIntersecting){
        addDisabledAttribute([slideBtns[1]]);
    }
}, {threshold: .75});

slideObserver.observe(slides[slides.length - 1]);

// FORM HANDLE //
const contactForm = document.querySelector('#contact-form');
const contactBtn = document.querySelector('#contact-btn');
const contactInput = document.querySelector('#email');

// fake sending email to api endpoint
function postEmailToDatabase(email){
    console.info(`Your email is ${email}`);
    return new Promise(resolve => setTimeout(resolve, 2000));
}

// options for submit button
const contactBtnOptions = {
    pending:`
        <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M168,40.7a96,96,0,1,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>
        <span class="uppercase tracking-wide animate-pulse">
        Sending ...
        </span>

    `,
    succes:`
        <span class="uppercase tracking-wide">
        Thank you!
        </span>
        <span class="uppercase tracking-wide">
        🤙
        </span>
    `,
}

async function handleFormSubmit(e){
    e.preventDefault(); //doesn't refresh the page
    addDisabledAttribute([contactForm, contactBtn]);
    contactBtn.innerHTML = contactBtnOptions.pending;
    const userEmail = contactInput.value;
    contactInput.style.display = "none";
    await postEmailToDatabase(userEmail);
    contactBtn.innerHTML = contactBtnOptions.succes;

}

// event listener form submit
contactForm.addEventListener('submit', handleFormSubmit);

// FACE UP OBSERVER //
function fadeUpObserverCallback(elsToWatch){
    elsToWatch.forEach((el) => {
      if(el.isIntersecting){
        el.target.classList.add('faded');
        fadeUpObserver.unobserve(el.target);
        el.target.addEventListener("transitionend", () => {
          el.target.classList.remove('fade-up', 'faded');
        }, { once: true })
      }
    })
  }
  
  const fadeUpObserverOptions = {
    threshold: .6,
  }
  
  const fadeUpObserver = new IntersectionObserver(
    fadeUpObserverCallback,
    fadeUpObserverOptions
  );
  
  document.querySelectorAll('.fade-up').forEach((item) => {
    fadeUpObserver.observe(item);
  })