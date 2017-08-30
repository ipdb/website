/* global SmoothScroll */
/* global Autogrow */

// =include _dnt.js
// =include smooth-scroll/dist/js/smooth-scroll.js
// =include textarea-autogrow/textarea-autogrow.js

document.addEventListener('DOMContentLoaded', () => {
    //
    // init smooth scroll
    //
    const scroll = new SmoothScroll('a[data-scroll]', {
        easing: 'easeOutQuint'
    })

    //
    // init textarea autogrow
    //
    const textarea = document.querySelector('textarea')

    if (textarea) {
        const growingTextarea = new Autogrow(textarea)
    }
})
