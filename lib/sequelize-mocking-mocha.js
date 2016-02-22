/**
 * Using SequelizeMocking with mocha easily
 *
 * @module lib/sequelize-mocking-mocha
 * @exports Function
 * @version 0.1.0
 * @since 0.1.0
 * @author Julien Roche
 */

'use strict';

// Imports
const Sequelize = require('sequelize');
const _ = Sequelize.Utils._;
const SequelizeMocking = require('./sequelize-mocking');

/**
 * @param {Sequelize} originalSequelize
 * @param {string} [fixtureFilePath]
 * @param {SequelizeMockingOptions} [options]
 */
module.exports = function (originalSequelize, fixtureFilePath, options) {
    let beforeEach = global.beforeEach ? global.beforeEach : null;
    let afterEach = global.afterEach ? global.afterEach : null;

    if (beforeEach && afterEach) {
        let mockedSequelize = null;

        beforeEach(function (done) {
            let createFunc = _.partialRight(fixtureFilePath ? SequelizeMocking.createAndLoadFixtureFile : SequelizeMocking.create, options);

            createFunc(originalSequelize, fixtureFilePath)
                .then(function (sequelizeInstance) {
                    mockedSequelize = sequelizeInstance;
                    done();
                })
                .catch(done);
        })

        afterEach(function (done) {
            SequelizeMocking
                .restore(mockedSequelize, options)
                .then(function () {
                    done();
                })
                .catch(done);
        });
    }
};