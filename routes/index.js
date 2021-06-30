'use strict';

const express = require('express');
const Sequelize = require('sequelize');
const { ceos } = require('../models');
const router = express.Router();
const slugify = require('slugify');

router.get('/:slug?', async (req, res) => {
    if (!!req.params.slug) {
        const { slug } = req.params;
        const theCeo = await ceos.findOne({where: { slug }});
        console.log(theCeo.name)
        res.render('template', {
            locals: {
                title: 'CEO Details',
                theCeo
            },
            partials: {
                body: 'partial-ceo_details'
            }
        })
    } else {
        const ceoData = await ceos.findAll();
        res.render('template', {
            locals: {
                title: 'Apple CEOs',
                data: ceoData
            },
            partials: {
                body: 'partial-index'
            }
        })
    }
    
})

router.post('/', async (req, res) => {
    const {ceo_name, ceo_year} = req.body;
    const ceo_slug = slugify(ceo_name, {
        replacement: '_',
        lower: true,
        strict: true
    });
    const response = await ceos.create({
        name: ceo_name,
        slug: ceo_slug,
        first_year_active: ceo_year
    });
    res.redirect('/');
})

router.post('/delete', async (req, res) => {
    const { id } = req.body;
    const response = await ceos.destroy({
        where: {id}
    })
    res.redirect('/');
})

module.exports = router;
