/* global SmoothScroll */
/* global Autogrow */

/* eslint-disable spaced-comment */
//=include _dnt.js
//=include _newsletter.js
//=include smooth-scroll/dist/js/smooth-scroll.js
//=include textarea-autogrow/textarea-autogrow.js
/* eslint-enable spaced-comment */

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
