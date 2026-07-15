'use strict';

const express = require('express');

const health = require('./health');
const googleMaps = require('./googleMaps');
const screenshot = require('./screenshot');

/**
 * Every browser-automation capability Project Nexus adds in the future
 * (Yelp discovery, LinkedIn lookups, generic page-content extraction,
 * PDF export, etc.) becomes one more route module required here — a
 * single, obvious place for a new workflow author to plug into, sharing
 * the same Browserless connection, logging, and error handling as
 * everything else in this file.
 */
const router = express.Router();

router.use(health);
router.use(googleMaps);
router.use(screenshot);

module.exports = router;
