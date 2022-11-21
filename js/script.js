'use strict';








document.addEventListener('DOMContentLoaded', () => {


   // Tabs 


   const tabs = document.querySelectorAll('.tabheader__item');
   const tabContent = document.querySelectorAll('.tabcontent');
   const tabParent = document.querySelector('.tabheader');


   function hideTabContent() {
      tabContent.forEach(item => {
         item.classList.add('hide');
         item.classList.remove('show', 'fade');
      });

      tabs.forEach(item => {
         item.classList.remove('tabheader__item_active');
      });
   }

   function showTabContent(i = 0) {
      tabs[i].classList.add('tabheader__item_active');
      tabContent[i].classList.add('show', 'fade');
      tabContent[i].classList.remove('hide');
   }

   hideTabContent();
   showTabContent();

   tabParent.addEventListener('click', (event) => {
      const target = event.target;

      if (target && target.classList.contains('tabheader__item')) {
         tabs.forEach((item, i) => {
            if (target == item) {
               hideTabContent();
               showTabContent(i);
            }
         });
      }
   });


   // Timer

   const deadline = '2022-12-14';

   function getTimeRemaining(endtime) {
      const t = Date.parse(endtime) - Date.parse(new Date());
      const days = Math.floor(t / (1000 * 60 * 60 * 24));
      const hours = Math.floor((t / (1000 * 60 * 60) % 24));
      const minutes = Math.floor((t / 1000 / 60) % 60);
      const seconds = Math.floor((t / 1000) % 60);
      return {
         'total': t,
         'days': days,
         'hours': hours,
         'minutes': minutes,
         'seconds': seconds,
      };
   }

   function getZero(num) {
      if (num >= 0 && num < 10) {
         return `0${num}`;
      } else {
         return num;
      }
   }

   function setClock(selector, endtime) {
      const timer = document.querySelector(selector);
      const days = timer.querySelector('#days');
      const hours = timer.querySelector('#hours');
      const minutes = timer.querySelector('#minutes');
      const seconds = timer.querySelector('#seconds');
      const timeInterval = setInterval(updateClock, 1000);

      updateClock();

      function updateClock() {
         const t = getTimeRemaining(endtime);

         days.textContent = getZero(t.days);
         hours.textContent = getZero(t.hours);
         minutes.textContent = getZero(t.minutes);
         seconds.textContent = getZero(t.seconds);


         if (t.total <= 0) {
            clearInterval(timeInterval);
         }
      }


   }

   setClock('.timer', deadline);


   // Modal Window

   const modalTrigger = document.querySelectorAll('[data-modal]');
   const modal = document.querySelector('.modal');


   function openModal() {
      modal.classList.add('show');
      modal.classList.remove('hide');
      document.body.style.overflow = 'hidden';
      clearInterval(modalTimerId);
   }

   modalTrigger.forEach(btn => {
      btn.addEventListener('click', openModal);
   });

   function closeModal() {
      modal.classList.add('hide');
      modal.classList.remove('show');
      document.body.style.overflow = '';
   }


   modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.getAttribute('data-close') == '') {
         closeModal();
      }
   });

   document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && modal.classList.contains('show')) {
         closeModal();
      }
   });

   const modalTimerId = setTimeout(openModal, 50000);

   function showModalBySCroll() {
      if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
         openModal();
         window.removeEventListener('scroll', showModalBySCroll);
      }
   }

   window.addEventListener('scroll', showModalBySCroll);



   // Use class for card

   class MenuCard {
      constructor(src, alt, title, text, price, parentSelector, ...classes) {
         this.src = src;
         this.alt = alt;
         this.title = title;
         this.text = text;
         this.price = price;
         this.classes = classes;
         this.course = 41;
         this.parent = document.querySelector(parentSelector);
         this.toChangedUAH();
      }

      toChangedUAH() {
         this.price = Math.floor(+this.price * this.course);
      }

      render() {
         const element = document.createElement('div');
         if (this.classes.length < 1) {
            this.element = 'menu__item';
            element.classList.add(this.element);
         } else {
            this.classes.forEach(className => element.classList.add(className));
         }

         element.innerHTML = `
                  <img src=${this.src} alt=${this.alt}>
                  <h3 class="menu__item-subtitle">${this.title}</h3>
                  <div class="menu__item-descr">${this.text}!</div>
                  <div class="menu__item-divider"></div>
                  <div class="menu__item-price">
                     <div class="menu__item-cost">Цена:</div>
                     <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                  </div>
         `;

         this.parent.append(element);
      }
   }

   const getResource = async (url) => {
      const res = await fetch(url);

      if (!res.ok) {
         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }

      return await res.json();
   };


   getResource('http://localhost:3000/menu')
      .then(data => {
         data.forEach(({ img, altimg, title, descr, price }) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
         });
      });


   // Forms

   const forms = document.querySelectorAll('form');

   const message = {
      loading: 'img/form/spinner.svg',
      success: 'Thanks',
      failure: 'Ups...',
   };

   forms.forEach(item => {
      bindpostData(item);
   });

   const postData = async (url, data) => {
      const res = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json'
         },
         body: data
      });

      return await res.json();
   };

   function bindpostData(form) {
      form.addEventListener('submit', (e) => {
         e.preventDefault();

         const statusMessage = document.createElement('img');
         statusMessage.src = message.loading;
         statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
         `;
         form.insertAdjacentElement('afterend', statusMessage);


         const formData = new FormData(form);

         const json = JSON.stringify(Object.fromEntries(formData.entries()));



         postData('http://localhost:3000/requests', json)
            .then(data => {
               console.log(data);
               showThanksModal(message.success);
               statusMessage.remove();
            }).catch(() => {
               showThanksModal(message.failure);
            }).finally(() => {
               form.reset();
            });
      });
   }




   function showThanksModal(message) {
      const prevModalDialog = document.querySelector('.modal__dialog');

      prevModalDialog.classList.add('hide');
      openModal();

      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');
      thanksModal.innerHTML = `
         <div class="modal__content">
            <div data-close class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
         </div>
      `;

      document.querySelector('.modal').append(thanksModal);
      setTimeout(() => {
         thanksModal.remove();
         prevModalDialog.classList.add('show');
         prevModalDialog.classList.remove('hide');
         closeModal();
      }, 4000);
   }

   // Slider

   const slides = document.querySelectorAll('.offer__slide');
   const slider = document.querySelector('.offer__slider');
   const prev = document.querySelector('.offer__slider-prev');
   const next = document.querySelector('.offer__slider-next');
   const total = document.querySelector('#total');
   const current = document.querySelector('#current');
   const slidesWrapper = document.querySelector('.offer__slider-wrapper');
   const slidesField = document.querySelector('.offer__slide-inner');
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


   // Calc

   const result = document.querySelector('.calculating__result span');
   let sex = 'male';
   let height;
   let weight;
   let age;
   let ratio = 1.375;

   function calcTotal() {
      if (!sex || !height || !weight || !age || !ratio) {
         result.textContent = '____';
         return;
      }

      if (sex === 'female') {
         result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
      } else {
         result.textContent = Math.round((88.6 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
      }
   }

   calcTotal();


   function getStaticInformation(parentSelector, activeClass) {
      const elements = document.querySelectorAll(`${parentSelector} div`);

      elements.forEach(elem => {
         elem.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-ratio')) {
               ratio = +e.target.getAttribute('data-ratio');
            } else {
               sex = e.target.getAttribute('id');
            }

            elements.forEach(elem => {
               elem.classList.remove(activeClass);
            });

            e.target.classList.add(activeClass);

            calcTotal();
         });

      });
   }


   getStaticInformation('#gender', 'calculating__choose-item_active');
   getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');


   function getDinamicInformation(selector) {
      const input = document.querySelector(selector);

      input.addEventListener('input', () => {
         switch (input.getAttribute('id')) {
            case 'height':
               height = +input.value;
               break;
            case 'weight':
               weight = +input.value;
               break;
            case 'age':
               age = +input.value;
               break;
         }
         calcTotal();
      });
   }


   getDinamicInformation('#height');
   getDinamicInformation('#weight');
   getDinamicInformation('#age');

});
