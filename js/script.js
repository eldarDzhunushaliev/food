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
        tabsContent[i].classList.add('show');
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('fade');

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

    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds');

        function updateClock() {
            
        }
    }
});