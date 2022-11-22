'use strict';




import tabs from './modules/tabs';
import modal from './modules/modal';
import timer from './modules/timer';
import cards from './modules/cards';
import forms from './modules/forms';
import slider from './modules/slider';
import calc from './modules/calc';
import { openModal } from './modules/modal';



document.addEventListener('DOMContentLoaded', () => {

   const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);


   tabs('.tabheader__item', '.tabcontent', '.tabheader', 'tabheader__item_active');
   modal('[data-modal]', '.modal', modalTimerId);
   timer('.timer', '2020-06-11');
   cards();
   calc();
   forms('form', modalTimerId);
   slider({
      container: '.offer__slider',
      nextArrow: '.offer__slider-next',
      prevArrow: '.offer__slider-prev',
      slide: '.offer__slide',
      totalCounter: '#total',
      currentCounter: '#current',
      wrapper: '.offer__slider-wrapper',
      field: '.offer__slide-inner',
   });

});