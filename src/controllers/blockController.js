const multer = require('multer');
const DxfParser = require('dxf-parser');
const fs = require('fs');
const { Op } = require('sequelize');
const File = require('../models/File');
const Block = require('../models/Block');

const upload = multer({ dest: 'uploads/' });

exports.uploadFile = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      const parser = new DxfParser();
      const fileContent = fs.readFileSync(req.file.path, 'utf-8');
      const dxf = parser.parseSync(fileContent);

      const file = await File.create({ name: req.file.originalname });
      const blocks = Object.keys(dxf.blocks).map(key => {
        const block = dxf.blocks[key];
        return {
          name: block.name,
          x: block.position ? block.position.x : 0,
          y: block.position ? block.position.y : 0,
          type: block.type || 'unknown',
          FileId: file.id,
        };
      });
      await Block.bulkCreate(blocks);

      fs.unlinkSync(req.file.path); // Clean up
      res.status(201).json({ message: 'File processed', fileId: file.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

exports.getBlocks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const blocks = await Block.findAndCountAll({
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    res.json({
      total: blocks.count,
      pages: Math.ceil(blocks.count / limit),
      data: blocks.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlockDetails = async (req, res) => {
  try {
    const block = await Block.findByPk(req.params.id);
    if (!block) return res.status(404).json({ error: 'Block not found' });
    res.json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchBlocks = async (req, res) => {
  const { name, type } = req.query;
  try {
    const blocks = await Block.findAll({
      where: {
        ...(name && { name: { [Op.iLike]: `%${name}%` } }),
        ...(type && { type }),
      },
    });
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};