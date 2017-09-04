/* global jQuery */

/* eslint-disable spaced-comment */
//=include ajaxchimp/jquery.ajaxchimp.js
/* eslint-enable spaced-comment */

jQuery(($) => {
    const form = $('.form--newsletter')
    const formInput = form.find('.form__control')
    const formLabel = form.find('.form__label')

    form.ajaxChimp({
        callback: formCallback
    })

    function formCallback(resp) {
        if (resp.result === 'success') {
            form.find('.input-group').css('display', 'none')
            form.find('.form__help').css('display', 'none')
        }
        if (resp.result === 'error') {
            form.find('.button')
                .removeClass('disabled')
                .text('Subscribe')
        }
    }

    form.on('change', formInput, () => {
        if (formInput.hasClass('error')) {
            formInput.keypress(() => {
                $(this).removeClass('error')
                formLabel.removeClass('error').text('Your Email')
            })
        }
    })
}); // eslint-disable-line semi
