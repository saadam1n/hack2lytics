import { ready } from '../util/ready';
ready(() => {
    const elem = document.getElementById('jstest');
    if (elem) {
        elem.innerHTML = 'JavaScript is working!';
    }
});