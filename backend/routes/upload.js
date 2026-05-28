const express = require('express');

const multer = require('multer');

const fs = require('fs');

const pdfParse = require('pdf-parse');

const { chunkText } = require('../utils/chunking');

const { storeEmbeddings } = require('../utils/embeddings');

const router = express.Router();

const upload = multer({
  dest: 'uploads/'
});

router.post('/', upload.single('pdf'), async (req, res) => {

  try {

    const pdfBuffer = fs.readFileSync(req.file.path);

    const data = await pdfParse(pdfBuffer);

    const text = data.text;

    const chunks = chunkText(text);

    await storeEmbeddings(
      chunks,
      req.file.originalname
    );

    res.json({
      message: 'PDF processed successfully',
      chunks: chunks.length
    });

  } catch (err) {

    console.error("FULL ERROR:", err);

    res.status(500).json({
      error: 'Failed to process PDF'
    });
  }
});

module.exports = router;