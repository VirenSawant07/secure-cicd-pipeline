'use strict';

const { Router } = require('express');
const _ = require('lodash');
const pkg = require('../../package.json');

const router = Router();

router.get('/', (_req, res) => {
  const fullInfo = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    internalSecret: 'should-not-be-exposed',
  };

  // Use lodash.pick to demonstrate the vulnerable dependency in action
  const safeInfo = _.pick(fullInfo, ['name', 'version', 'description', 'environment']);

  res.status(200).json(safeInfo);
});

module.exports = router;
