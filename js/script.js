'use strict';

document.addEventListener('DOMContentLoaded', () => {

    //Tabs
    const tabsContent = document.querySelectorAll('.tabcontent'),
          tabs = document.querySelectorAll('.tabheader__item'),
          tabParent = document.querySelector('.tabheader__items');

    function hideAllTabs() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show');
        });

        tabs.forEach(item => item.classList.remove('tabheader__item_active'));
    }

    const pickTab = function (i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');

        tabs[i].classList.add('tabheader__item_active');
    };

    hideAllTabs();
    pickTab();

    tabParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach ((item, index) => {
                if (item == target) {
                    hideAllTabs();
                    pickTab(index);
                }
            });
        }
    });

    //Timer

    const deadLine = '2020-08-31';

    function getTimeRemaining(endTime) {
        const curTime = new Date(),
            zoneOffset = curTime.getTimezoneOffset() * 60 * 1000,
            total = Date.parse(endTime) - Date.parse(curTime) + zoneOffset,
            days = Math.floor(total / (1000 * 60 * 60 * 24)),
            hours = Math.floor((total / (1000 * 60 *60)) % 24),
            minutes = Math.floor((total / (1000 * 60)) % 60),
            seconds = Math.floor((total / 1000) % 60);

        return {total, days, hours, minutes, seconds};
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        }
        return num;
    }

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const timeContainer = getTimeRemaining(endTime);

            days.innerHTML = getZero(timeContainer.days);
            hours.innerHTML = getZero(timeContainer.hours);
            minutes.innerHTML = getZero(timeContainer.minutes);
            seconds.innerHTML = getZero(timeContainer.seconds);

            if (timeContainer.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    //Modal

    const modal = document.querySelector('.modal'),
    modalInputs = modal.querySelectorAll('input'),
    modalName = modalInputs[0],
    modalPhone = modalInputs[1],
    modalButtonClose = document.querySelector('[data-close]'),
    modalButtonsOpen = document.querySelectorAll('[data-modal]'),
    modalButtonSubmit = modal.querySelector('button');
    
    const hideModal = function () {     
        modal.classList.remove('show');
        modalInputs.forEach(item => item.value = '');
        document.body.style.overflow = '';
    };

    const showModal = function () {
        modal.classList.add('show', 'fade');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerID);
    };

    modal.addEventListener('click', event => {
        const target = event.target;

        if (target && target.classList.contains('modal')) {
            hideModal();
        }
    });

    modalButtonClose.addEventListener('click', hideModal);
    modalButtonsOpen.forEach(item => item.addEventListener('click', showModal));
    modalButtonSubmit.addEventListener('click', event => {
        event.preventDefault();
        alert(`${modalName.value}, thanks, we'll call you back on your phone number: ${modalPhone.value}`);
        hideModal();
    });

    document.addEventListener('keyup', event => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

    const modalTimerID = setTimeout(showModal, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
});