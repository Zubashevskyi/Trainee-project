'use strict';


document.addEventListener('DOMContentLoaded', () => {

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
});