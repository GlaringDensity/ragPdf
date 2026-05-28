const express = require('express');

const axios = require('axios');

const {
  findSimilarChunks
} = require('../utils/embeddings');

const router = express.Router();

router.post('/', async (req, res) => {

  try {

    const { question } = req.body;

    if (!question) {

      return res.status(400).json({
        error: 'Question required'
      });
    }

    // Dynamic retrieval depth
    let topK = 6;

    if (
      question.toLowerCase().includes("summary") ||
      question.toLowerCase().includes("overview") ||
      question.toLowerCase().includes("explain this pdf") ||
      question.toLowerCase().includes("summarize") ||
      question.toLowerCase().includes("explain the pdf") ||
      question.toLowerCase().includes("describe this pdf")
    ) {

      topK = 12;
    }

    // Semantic retrieval
    const similarChunks = await findSimilarChunks(
      question,
      topK
    );

    if (similarChunks.length === 0) {

      return res.json({
        answer: "No relevant content found.",
        sources: []
      });
    }

    // Remove duplicate chunks
    const uniqueChunks = [
      ...new Set(
        similarChunks.map(c => c.chunk)
      )
    ];

    // Build context
    const context = uniqueChunks.join('\n\n');

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
You are an intelligent PDF assistant.

You MUST answer ONLY using the provided context.

IMPORTANT RULES:

1. If the user asks for:
- summary
- overview
- explain this PDF
- explain the document

Then:
- identify ALL major sections/topics
- explain each section separately
- do NOT skip sections
- preserve titles and headings if available

2. If the question is specific:
answer ONLY from the relevant retrieved context.

3. NEVER invent information.

4. If information is missing, say:
"I could not find this information in the uploaded PDF."

5. If multiple unrelated topics exist in the PDF,
clearly separate them.

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

      temperature: 0.3,

      max_tokens: 700
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