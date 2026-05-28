function SuggestedQuestions({
  askQuestion,
  uploaded
}) {

  const questions = [
    "Summarize this PDF",
    "Explain this document simply",
    "What are the key points?",
    "Give an overview of this PDF"
  ];

  return (

    <div className="h-full flex flex-col items-center justify-center text-center">

      <h1 className="text-5xl font-bold tracking-tight">
        AI PDF Assistant
      </h1>

      <p className="mt-5 text-gray-400 text-xl max-w-xl leading-8">

        Upload a PDF and start asking intelligent questions.

      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">

        {questions.map((q, index) => (

          <button
            key={index}
            disabled={!uploaded}
            onClick={() => askQuestion(q)}
            className={`px-5 py-4 rounded-2xl text-sm transition-all border ${
              uploaded
                ? "bg-[#111827] border-gray-700 hover:border-blue-500"
                : "bg-[#111827] border-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >

            {q}

          </button>

        ))}

      </div>

    </div>
  );
}

export default SuggestedQuestions;