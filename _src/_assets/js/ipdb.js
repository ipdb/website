/* global SmoothScroll */

// =include _dnt.js
// =include smooth-scroll/dist/js/smooth-scroll.js

document.addEventListener('DOMContentLoaded', () => {
    const scroll = new SmoothScroll('a[data-scroll]', {
        easing: 'easeOutQuint'
    })
})
