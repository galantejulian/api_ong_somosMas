const validateErrors = require('./validateErrors');
const validationAuth = require('./auth');
const validationsCategories = require('./categories');
const validationRoles = require('./roles');
const verifyToken = require('./authJWT');
const checkRole = require('./check.role');

module.exports = {
    ...validateErrors,
    ...validationAuth,
    ...validationsCategories,
    ...validationRoles,
    verifyToken,
    ...checkRole,
};
