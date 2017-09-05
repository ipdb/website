/* global SmoothScroll, Autogrow, Cookiebanner */

/* eslint-disable spaced-comment */
//=include _dnt.js
//=include _newsletter.js
//=include smooth-scroll/dist/js/smooth-scroll.js
//=include textarea-autogrow/textarea-autogrow.js
//=include cookie-banner/src/cookiebanner.js
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

//
// Cookie banner
//
// this global variable name seem not smart, plugin requires it though
// https://github.com/dobarkod/cookie-banner
const options = {
    message: 'By using this website you agree to our <a>cookie policy</a>.',
    linkmsg: ' ',
    fontFamily: 'inherit',
    fontSize: '15px',
    bg: 'rgba(234, 243, 245, .7)',
    fg: 'inherit',
    link: '#cc6bb3',
    closeText: '&times;',
    closeStyle: 'font-size:1.1rem;float:right;padding:5px;margin:-5px;margin-top:-4px',
    minHeight: '18px',
    moreinfo: '/privacy/',
    effect: 'fade'
}

const cookiebanner = new Cookiebanner(options); cookiebanner.run()
