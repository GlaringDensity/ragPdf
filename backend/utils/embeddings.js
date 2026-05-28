const axios = require('axios');

let vectorStore = [];

// Generate embeddings
async function generateEmbedding(text) {

  const response = await axios.post(

    'https://openrouter.ai/api/v1/embeddings',

    {
      model: 'text-embedding-3-small',
      input: text
    },

    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.data[0].embedding;
}

// Store embeddings
async function storeEmbeddings(chunks, filename) {

  // Clear old embeddings
  vectorStore = [];

  for (let i = 0; i < chunks.length; i++) {

    const chunk = chunks[i];

    const embedding = await generateEmbedding(chunk);

    vectorStore.push({
      id: `${filename}_chunk_${i}`,
      filename,
      chunk,
      embedding
    });
  }

  console.log(`Stored ${chunks.length} embeddings`);
}

// Cosine similarity
function cosineSimilarity(vecA, vecB) {

  const dotProduct = vecA.reduce(
    (sum, val, i) => sum + val * vecB[i],
    0
  );

  const magnitudeA = Math.sqrt(
    vecA.reduce((sum, val) => sum + val * val, 0)
  );

  const magnitudeB = Math.sqrt(
    vecB.reduce((sum, val) => sum + val * val, 0)
  );

  return dotProduct / (magnitudeA * magnitudeB);
}

// Find relevant chunks
async function findSimilarChunks(query, topK = 4) {

  const queryEmbedding = await generateEmbedding(query);

  const similarities = vectorStore.map(item => ({

    ...item,

    similarity: cosineSimilarity(
      queryEmbedding,
      item.embedding
    )

  }));

  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, topK);
}

module.exports = {
  generateEmbedding,
  storeEmbeddings,
  findSimilarChunks
};