const { LIMIT_PAGE } = require('../constants/limit-page.constants');
const { paginated } = require('../helpers/paginated');
const { uploadInBucket } = require('../helpers/uploadAWS-S3');
const db = require('../models');

module.exports = {
  list: async (req, res) => {
    try {
      const { page = 1 } = req.query;
      const { results, next, prev } = await paginated(db.Member, LIMIT_PAGE, +page, req);
      if (results.length === 0) {
        return res.status(200).json({
          ok: false,
          msg: 'There are no members created',
        });
      }
      return res.status(200).json({ prev, next, results });
    } catch (error) {
      return res.status(500).json({
        message: 'internal server error',
        data: error,
      });
    }
  },
  deleteMember: async (req, res) => {
    try {
      const { id } = req.params;
      const memberDeleted = await db.Member.destroy({
        where: {
          id,
        },
      });
      if (memberDeleted === 1) {
        res.status(200).json({
          del: true,
          message: `member with id ${id}, was deleted successfully`,
        });
      } else {
        res.status(404).json({
          del: false,
          message: `the id ${id} does not correspond to any member`,
        });
      }
    } catch (error) {
      res.status(500).json({
        del: false,
        data: error,
      });
    }
  },
  createMember: async (req, res) => {
    try {
      const { name } = req.body;
      let fileURL;
      if (req.files?.image) {
        const { Location } = await uploadInBucket(req.files.image);
        fileURL = Location;
      }
      const newMember = await db.Member.create({
        name,
        image: fileURL || 'https://www.designevo.com/res/templates/thumb_small/colorful-hand-and-warm-community.png',
      });
      return res.status(201).json({
        ok: true,
        msg: `Created ${newMember.name} member`,
      });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        msg: 'Contact to administrator',
      });
    }
  },
  updateMember: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    let fileURL;
    try {
      if (req.files?.image) {
        const { Location } = await uploadInBucket(req.files.image);
        fileURL = Location;
      }
      const member = await db.Member.update({
        name,
        image: fileURL && fileURL,
      }, {
        where: { id },
      });

      if (!member[0]) {
        return res.status(404).json({
          ok: false,
          msg: 'there is no member matching the specified id',
        });
      }
      return res.status(200).json({
        ok: true,
        msg: 'member updated successfully',
      });
    } catch (error) {
      return res.status(500).json({
        msg: 'an error occurred',
        data: error,
      });
    }
  },
};
