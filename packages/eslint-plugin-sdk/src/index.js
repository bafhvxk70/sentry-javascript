/**
 * @fileoverview eslint plugins for Beidou SDKs
 * @author Abhijeet Prasad
 */
'use strict';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
  rules: {
    'no-async-await': require('./rules/no-async-await'),
  },
};
