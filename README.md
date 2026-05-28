

# PDF AI Assistant (RAG-based PDF Chat Application)


---

# 🎥 Demo Video

## Compressed Preview Video
[https://github.com/user-attachments/assets/YOUR-UPLOADED-ASSET-ID](https://github.com/user-attachments/assets/a47d23e4-66ea-4f08-be74-1a0c24bb5278)

## High Quality Full Demo
https://drive.google.com/file/d/10EY62SVitzXroulcqetwSNfudxiOVF4I/view?usp=drive_link

---


## Overview

PDF AI Assistant is a Retrieval-Augmented Generation (RAG) web application that allows users to upload PDF documents and interact with them using natural language.

The system extracts text from PDFs, generates semantic embeddings, retrieves the most relevant chunks, and uses an LLM to answer user queries intelligently.

---

# Features

* Upload PDF documents
* Real-time PDF preview
* Chat with uploaded PDFs
* Semantic search using embeddings
* Context-aware AI answers
* Retrieved chunk/source display
* Responsive UI
* Supports long documents
* Multi-section summarization
* RAG pipeline implementation

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React-PDF

## Backend

* Node.js
* Express.js
* Multer
* pdf-parse
* OpenRouter API

## AI / RAG

* Embeddings-based retrieval
* Cosine similarity search
* Chunking strategy
* LLM-powered response generation


# How It Works

## Step 1: Upload PDF

The user uploads a PDF document.

## Step 2: Text Extraction

The backend extracts text using `pdf-parse`.

## Step 3: Chunking

The text is divided into smaller overlapping chunks.

## Step 4: Embedding Generation

Embeddings are generated using OpenRouter embedding models.

## Step 5: Semantic Retrieval

Relevant chunks are retrieved using cosine similarity.

## Step 6: LLM Response Generation

The retrieved context is sent to the LLM to generate answers.

---










