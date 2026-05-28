const express = require('express');

const axios = require('axios');

const { findSimilarChunks } = require('../utils/embeddings');

const router = express.Router();

router.post('/', async (req, res) => {

  try {

    const { question } = req.body;

    if (!question) {

      return res.status(400).json({
        error: 'Question required'
      });
    }

    // Semantic retrieval
    const similarChunks = await findSimilarChunks(
      question,
      4
    );

    if (similarChunks.length === 0) {

      return res.json({
        answer: "No relevant content found.",
        sources: []
      });
    }

    // Build context
    const context = similarChunks
      .map(c => c.chunk)
      .join('\n\n');

    // Source snippets
    const sources = similarChunks.map(c => ({
      id: c.id,
      snippet:
        c.chunk.substring(0, 150) + '...'
    }));

    // Generate answer
    const answer = await callLLM(
      context,
      question
    );

    res.json({
      answer,
      sources
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Chat failed'
    });
  }
});

async function callLLM(context, question) {

  const prompt = `
You are a PDF assistant.

Answer ONLY from the provided context.

If the answer is not available in the context, say:
"I could not find this information in the uploaded PDF."

Do not hallucinate.

Context:
${context}

Question:
${question}

Answer:
`;

  const response = await axios.post(

    'https://openrouter.ai/api/v1/chat/completions',

    {
      model: 'meta-llama/llama-3-8b-instruct',

      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],

      temperature: 0.2,

      max_tokens: 500
    },

    {
      headers: {
        Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = router;