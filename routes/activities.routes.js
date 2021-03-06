const router = require('express').Router();
// Middleware validations required
const {
  validationsActivities,
  indexValidation,
} = require('../middlewares/index.validations');
const { checkAdminRole, verifyToken } = require('../middlewares');

// Controller Api required
const { store, update } = require('../controllers/activity');

// Routes
// Create activity
router.post(
  '/',
  verifyToken,
  checkAdminRole,
  validationsActivities,
  indexValidation,
  store,
);

// Update activity
router.put(
  '/:id',
  verifyToken,
  checkAdminRole,
  validationsActivities,
  indexValidation,
  update,
);

module.exports = router;
