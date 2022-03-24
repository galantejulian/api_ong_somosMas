const { uploadInBucket } = require('../helpers/uploadAWS-S3');
const db = require('../models');

const createTestimony = async (req, res) => {
  const { name, content } = req.body;

  try {
    const { Location: fileURL } = await uploadInBucket(req.files?.image);
    const testimonyCreated = await db.Testimony.create({
      name,
      content,
      image: fileURL || 'https://www.designevo.com/res/templates/thumb_small/colorful-hand-and-warm-community.png',
    });
    res.status(201).json({
      meta: {
        status: 201,
        ok: true,
      },
      data: testimonyCreated,
      errors: null,
    });
  } catch (error) {
    res.status(503).json({
      meta: {
        status: 503,
        ok: false,
      },
      data: null,
      errors: { msg: 'Server no disponible' },
    });
  }
};

const updateTestimony = async (req, res) => {
  const { name, content, image } = req.body;
  const { id } = req.params;
  try {
    const { Location: fileURL } = await uploadInBucket(req.files?.image);
    const testimonyDb = await db.Testimony.update(
      {
        name,
        content,
        image: fileURL && fileURL,
      },
      {
        where: { id },
      },
    );

    if (!testimonyDb) {
      return res.status(404).json({
        message: 'Testimony not found',
      });
    }
    return res.status(200).json({
      message: 'Testimony updated',
      testimonyDb,
    });
  } catch (error) {
    res.status(503).json({
      meta: {
        status: 503,
        ok: false,
      },
      data: null,
      errors: { msg: 'Server no disponible' },
    });
  }
};

module.exports = {
  createTestimony,
  updateTestimony,
};
