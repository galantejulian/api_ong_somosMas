const db = require('../models');

const isExistCategory = async (name) => {
  const searchCategory = await db.category.findOne({
    where: { name },
  });
  if (searchCategory) throw new Error('This category was registered');
};

module.exports = {
  isExistCategory,
};
