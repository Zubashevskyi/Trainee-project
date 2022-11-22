function slider({ container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field }) {

  const slides = document.querySelectorAll(slide);
  const slider = document.querySelector(container);
  const prev = document.querySelector(prevArrow);
  const next = document.querySelector(nextArrow);
  const total = document.querySelector(totalCounter);
  const current = document.querySelector(currentCounter);
  const slidesWrapper = document.querySelector(wrapper);
  const slidesField = document.querySelector(field);
  const width = window.getComputedStyle(slidesWrapper).width;

  let offset = 0;
  let slideIndex = 1;

  slidesField.style.display = 'flex';
  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.transition = '0.5s All';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(slide => {
    slide.style.width = width;
  });


  slider.style.position = 'relative';

  const indicarots = document.createElement('ol');
  indicarots.classList.add('carousel-indicators');
  const dots = [];

  slider.append(indicarots);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('data-slide-to', i + 1);

    if (i == 0) {
      dot.style.opacity = 1;
    }
    indicarots.append(dot);
    dots.push(dot);
  }


  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
  }

  function checngeNumber() {
    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  }

  function chencgeOpacity() {
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;
  }

  function deleteNoteDigits(str) {
    return +str.replace(/\D/g, '');
  }

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = deleteNoteDigits(width) * (slides.length - 1);
    } else {
      offset -= deleteNoteDigits(width);
    }

    slidesField.style.transform = `translate(-${offset}px)`;



    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    checngeNumber();

    chencgeOpacity();
  });

  next.addEventListener('click', () => {
    if (offset == deleteNoteDigits(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += deleteNoteDigits(width);
    }

    slidesField.style.transform = `translate(-${offset}px)`;


    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    checngeNumber();

    chencgeOpacity();

  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');

      slideIndex = slideTo;

      offset = deleteNoteDigits(width) * (slideTo - 1);

      slidesField.style.transform = `translate(-${offset}px)`;

      checngeNumber();

      chencgeOpacity();
    });
  });
}

export default slider;