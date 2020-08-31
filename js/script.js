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
    modalButtonClose = document.querySelector('[data-close]'),
    modalButtonsOpen = document.querySelectorAll('[data-modal]');

    const hideModal = function () {     
        modal.classList.remove('show', 'fade');
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
        if (target === modal || target.hasAttribute('data-close')) {
            hideModal();
        }
    });

    modalButtonClose.addEventListener('click', hideModal);
    modalButtonsOpen.forEach(item => item.addEventListener('click', showModal));

    document.addEventListener('keyup', event => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

    const modalTimerID = setTimeout(showModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //Menu

    const menuItems = document.querySelectorAll('.menu__item');

    class menuItem {
        constructor (
                imageSource, 
                imageAlternative,
                subtitle, 
                description, 
                price,
                parentSelector,
                ...classes
                ) {
            this.imageSource = imageSource;
            this.imageAlternative = imageAlternative;
            this.subtitle = subtitle;
            this.description = description;
            this.price = price;
            this.transfer = 27;
            this.changeToUAH();
            if (parentSelector === undefined) {parentSelector = '.menu .container';}
            this.parent = document.querySelector(parentSelector);
            if (classes.length>0){this.classes = classes;} else {this.classes = ['menu__item'];}
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        addToMenu() {
            const element = document.createElement('div');
            this.classes.forEach(className => element.classList.add(className));
            element.innerHTML = `
                <img src="${this.imageSource}" alt="${this.imageAlternative}">
                <h3 class="menu__item-subtitle">Меню "${this.subtitle}"</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    menuItems.forEach(item => item.remove());
    
    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could now fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => {
            new menuItem(img, altimg, title, descr, price).addToMenu();
        });
    });
    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: "Thanks, we'll call you back soon",
        failure: 'Something went wrong'
    };

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            
            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                statusMessage.remove();
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const previousModalDialog = document.querySelector('.modal__dialog');

        previousModalDialog.classList.add('hide');
        previousModalDialog.classList.remove('show');
        showModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modal.append(thanksModal);

        function hideThanksModal() {
            thanksModal.remove();
            previousModalDialog.classList.add('show');
            previousModalDialog.classList.remove('hide');
        }

        const timerThanksModalID = setTimeout(() => {
            hideThanksModal();
            hideModal();
        }, 4000);

        modal.addEventListener('click', event => {
            const target = event.target;
            if (target === modal || target.hasAttribute('data-close')) {
                hideThanksModal();
                clearTimeout(timerThanksModalID);
            }
        }, {once:true});
        
    }
    
    forms.forEach(item => {
        bindPostData(item);
    });

});