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
   const modalCloseBtn = document.querySelector('[data-close]');



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


   modalCloseBtn.addEventListener('click', closeModal);

   modal.addEventListener('click', (e) => {
      if (e.target === modal) {
         closeModal();
      }
   });

   document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && modal.classList.contains('show')) {
         closeModal();
      }
   });

   const modalTimerId = setTimeout(openModal, 10000);

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


   new MenuCard(
      'img/tabs/vegy.jpg',
      'vegy',
      'Меню "Фитнес"',
      `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих
      овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной
      ценой и высоким качеством!`,
      6,
      '.menu .container',


   ).render();

   new MenuCard(
      'img/tabs/elite.jpg',
      'elite',
      'Меню “Премиум”',
      `В меню “Премиум” мы используем не только красивый дизайн упаковки, но
      и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода
      в ресторан!`,
      14,
      '.menu .container',


   ).render();

   new MenuCard(
      'img/tabs/post.jpg',
      'post',
      'Меню "Постное""',
      `Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие
      продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное
      количество белков за счет тофу и импортных вегетарианских стейков. `,
      10.5,
      '.menu .container',


   ).render();


   // Forms

   const forms = document.querySelectorAll('form');

   const message = {
      loading: 'Loading...',
      success: 'Thanks',
      failure: 'Ups...',
   };

   forms.forEach(item => {
      postData(item);
   });

   function postData(form) {
      form.addEventListener('submit', (e) => {
         e.preventDefault();

         const statusMessage = document.createElement('div');
         statusMessage.classList.add('status');
         statusMessage.textContent = message.loading;
         form.append(statusMessage);

         const request = new XMLHttpRequest();
         request.open('POST', 'server.php');
         request.setRequestHeader('Content-type', 'application/json');

         const formData = new FormData(form);

         const object = {};

         formData.forEach((key, value) => {
            object[key] = value;
         });

         const json = JSON.stringify(object);

         request.send(json);

         request.addEventListener('load', () => {
            if (request.status === 200) {
               console.log(request.response);
               statusMessage.textContent = message.success;
               form.reset();
               setTimeout(() => {
                  statusMessage.remove();
               }, 2000);

            } else {
               statusMessage.textContent = message.failure;
            }
         });
      });
   }

});


