const router = require('express').Router();
const { createTestimony, updateTestimony } = require('../controllers/testimony');

const {
  verifyToken,
  checkAdminRole,
  validationsTestimony,
  validateErrors,
} = require('../middlewares');

// Create testimony
router.post(
  '/',
  verifyToken,
  checkAdminRole,
  validationsTestimony,
  validateErrors,
  createTestimony,
);

// update testimony
router.put(
  '/:id',
  verifyToken,
  checkAdminRole,
  validationsTestimony,
  validateErrors,
  updateTestimony,
);

module.exports = router;