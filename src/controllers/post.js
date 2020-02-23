/* eslint-disable camelcase */
const { checkSchema } = require('express-validator/check');
const Promise = require('bluebird');
const _ = require('lodash');

const { InputValidator } = require('../interceptors');

exports.create = [
    checkSchema({
        title: {
            in: 'body',
            trim: true,
            isEmpty: {
                negated: true,
                errorMessage: (value, { req }) => req.__('VAL_ERRORS.POST_TITLE_EMPTY'),
            },
            isInt: {
                negated: true,
                errorMessage: (value, { req }) => req.__('VAL_ERRORS.POST_TITLE_INVALID'),
            },
        },
        content: {
            in: 'body',
            trim: true,
            isEmpty: {
                negated: true,
                errorMessage: (value, { req }) => req.__('VAL_ERRORS.POST_CONTENT_EMPTY'),
            },
            isInt: {
                negated: true,
                errorMessage: (value, { req }) => req.__('VAL_ERRORS.POST_CONTENT_INVALID'),
            },
        }
    }),
    // validation interceptor
    InputValidator(),
    // controller
    (req, res, next) => {
        // host element from which params will be acquired
        const params = req.body;
        // begin process
        new Promise(async (resolve, reject) => {
            try {
                const post = await res.locals.db.post.create({
                    title: params.title,
                    content: params.content,
                });
                // conclude
                resolve(post);

            } catch (e) {
                reject(e);
            }
        }).asCallback((err, response) => {
            if (err) {
                next(err);
            } else {
                res.json(response);
            }
        });
    },
];

exports.read = [
    (req, res, next) => {
        new Promise(async (resolve, reject) => {
            try {
                const posts = await res.locals.db.post.find({}, null, { sort: { created_at: -1 } });
                resolve(posts);
            } catch (err) {
                reject(err);
            }
        }).asCallback((err, response) => {
            if (err) {
                next(err);
            } else {
                res.json(response);
            }
        });
    },
]
exports.upvote = [
    checkSchema({
        id: {
            in: 'body',
            trim: true,
            isEmpty: {
                negated: true,
                errorMessage: (value, { req }) => req.__('VAL_ERRORS.POST_ID_EMPTY'),
            },
            isInt: {
                negated: true,
                errorMessage: (value, { req }) => req.__('VAL_ERRORS.POST_ID_INVALID'),
            },
        },
    }),
    // validation interceptor
    InputValidator(),

    (req, res, next) => {
        const params = req.body;
        new Promise(async (resolve, reject) => {
            try {
                const post = await res.locals.db.post.findByIdAndUpdate(params.id, { $inc: { votes: 1 } }, { new: true });
                resolve(post);
            } catch (err) {
                reject(err);
            }
        }).asCallback((err, response) => {
            if (err) {
                next(err);
            } else {
                res.json(response);
            }
        });
    }
]