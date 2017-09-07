---
layout: page
sitemap: false

title: Style Guide
subtitle: Look sharp and stay consistent
description: Look sharp and stay consistent

css: page-styleguide
narrow: true
---

# Colors

<div class="colors">
{% for color in site.data.colors %}
<div class="color color--{{ color.name }}" style="background-color: #{{ color.hex }}">
    <span class="color__meta color-name">${{ color.name }}</span>
    <span class="color__meta color-hex">#{{ color.hex }}</span>
</div>
{% endfor %}
</div>

# Typography

## The blockchain database network for the decentralized stack

IPDB is a planetary-scale blockchain database built on [BigchainDB](https://www.bigchaindb.com). It’s a ready-to-use public network with a focus on **strong governance**. It shares _all the features_ of BigchainDB to make developers’ lives easier.

### Maecenas sed diam eget risus

Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.

* Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
* Est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
* Maecenas sed diam eget risus varius blandit sit amet non magna.

1. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
2. Est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
3. Maecenas sed diam eget risus varius blandit sit amet non magna.

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5


# Logo

Logo can be used with a base class and modifier classes for size & color:

<svg class="logo logo--lg" aria-labelledby="title"><title>Logo IPDB</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>
`logo--lg`: large version

<svg class="logo" aria-labelledby="title"><title>Logo IPDB</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>
`logo`: default logo

<svg class="logo logo--sm" aria-labelledby="title"><title>Logo IPDB</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>
`logo--sm`: small version

<svg class="logo logo--dark" aria-labelledby="title"><title>Logo IPDB</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>
`logo--dark`: dark version

<svg class="logo logo--white" aria-labelledby="title"><title>Logo IPDB</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>
`logo--white`: white version


# Components

## Buttons

<a class="button" href="#">Button</a> <a class="button button--small" href="#">Button</a> <a class="button button--large" href="#">Button</a>

<a class="button button--primary" href="#">Button</a> <a class="button button--primary button--small" href="#">Button</a> <a class="button button--primary button--large" href="#">Button</a>

<a class="button button--dark" href="#">Button</a> <a class="button button--dark button--small" href="#">Button</a> <a class="button button--dark button--large" href="#">Button</a>

<a class="button button--text" href="#">Button</a> <a class="button button--small button--text" href="#">Button</a> <a class="button button--large button--text" href="#">Button</a>

## Forms

All `form__control` elements require an empty placeholder to make browser validation look properly.

<form class="form" action="#">
    <div class="form__group required">
        <label class="form__label" for="name">Your Name</label>
        <input class="form__control" type="text" id="name" name="name" required placeholder=" ">
        <span class="form__help">
            You know your name, I suppose.
        </span>
    </div>
    <div class="form__group">
        <label class="form__label" for="email">Your Email</label>
        <input class="form__control" type="email" id="email" name="email" placeholder="hello@whatever.com">
    </div>
    <div class="form__group">
        <label class="form__label" for="phone">Your Phone</label>
        <input class="form__control" type="tel" id="phone" name="phone" placeholder=" ">
    </div>
    <div class="form__group required">
        <label class="form__label" for="industry">Industry</label>
        <select class="form__control" id="select" name="select" required data-required="true">
            <option value="">&nbsp;</option>
            <option value="Automotive">Automotive</option>
            <option value="Banking">Banking</option>
            <option value="Consulting">Consulting</option>
            <option value="Data">Data</option>
            <option value="Automotive">Automotive</option>
            <option value="Banking">Banking</option>
            <option value="Consulting">Consulting</option>
            <option value="Data">Data</option>
            <option value="Automotive">Automotive</option>
            <option value="Banking">Banking</option>
            <option value="Consulting">Consulting</option>
            <option value="Data">Data</option>
        </select>
    </div>
    <div class="form__group">
        <label class="form__label" for="comment">Autogrowing textarea</label>
        <textarea class="form__control" id="comment" name="comment" rows="1" placeholder=" "></textarea>
    </div>
    <p class="form__group form__help">
        Fields marked with an <span class="required">*</span> are required.
    </p>
    <div class="form__group">
        <input class="button button-primary" type="submit" value="Submit">
    </div>
</form>

<br>

<form class="form" action="#">
    <p>Combined form control & button input group.</p>
    <div class="form__group required">
        <label class="form__label" for="email2">Your Email</label>
        <div class="input-group">
            <input class="form__control" type="email" id="email2" name="email2" required placeholder=" ">
            <input class="button button-primary button--small" type="submit" value="Subscribe">
        </div>
    </div>
</form>

## Alerts

<div class="alert alert--info">
    <p>
        <strong class="alert__title">Great to hear from  you!</strong>
        We’ll get in touch soon.
    </p>
</div>

<div class="alert alert--success">
    <p>
        <strong class="alert__title">Great to hear from  you!</strong>
        We’ll get in touch soon.
    </p>
</div>

<div class="alert alert--danger">
    <p>
        <strong class="alert__title">Oops, there was an error</strong>
        Would you mind trying again?
    </p>
</div>

## Section header

<header class="section__header">
    <h1 class="section__title">A planetary-scale blockchain database</h1>
    <p class="section__description">IPDB relies on caretakers to run the BigchainDB nodes that store and validate transactions. The IPDB Caretakers are the members of the IPDB Foundation.</p>
</header>
