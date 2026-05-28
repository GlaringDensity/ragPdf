import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import SuggestedQuestions from "./SuggestedQuestions";

function ChatSection({ uploaded }) {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages, loading]);

  async function askQuestion(customQuestion = null) {

    const finalQuestion = customQuestion || question;

    if (!finalQuestion.trim()) return;

    setQuestion("");

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: finalQuestion
      }
    ]);

    try {

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          question: finalQuestion
        }
      );

      const fullText = response.data.answer;

      let currentText = "";

      for (let i = 0; i < fullText.length; i++) {

        currentText += fullText[i];

        setStreamedText(currentText);

        await new Promise(resolve =>
          setTimeout(resolve, 8)
        );
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: fullText,
          sources: response.data.sources
        }
      ]);

      setStreamedText("");

    } catch (error) {

      console.log(error);

      alert("Question failed");
    }

    setLoading(false);
  }

  return (

    <div className="w-[42%] flex flex-col bg-[#020617]">

      <div className="border-b border-gray-800 p-8">

        <h2 className="text-4xl font-bold">
          Chat with your PDF
        </h2>

        <p className="text-gray-400 mt-2 text-lg">
          Ask intelligent questions grounded in document context
        </p>

      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">

        {messages.length === 0 && !loading && (
          <SuggestedQuestions
            askQuestion={askQuestion}
            uploaded={uploaded}
          />
        )}

        <div className="space-y-8">

          {messages.map((msg, index) => (

            <MessageBubble
              key={index}
              msg={msg}
            />

          ))}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-[#111827] border border-gray-800 rounded-3xl px-7 py-6 max-w-[90%]">

                <p className="leading-8 whitespace-pre-wrap text-[16px]">

                  {streamedText || "Thinking..."}

                </p>

              </div>

            </div>
          )}

          <div ref={messagesEndRef}></div>

        </div>

      </div>

      <div className="border-t border-gray-800 p-6">

        <div className="flex gap-4">

          <input
            type="text"
            placeholder={
              uploaded
                ? "Ask anything about the PDF..."
                : "Upload a PDF first..."
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!uploaded}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion();
              }
            }}
            className="flex-1 bg-[#111827] border border-gray-700 rounded-3xl px-6 py-5 outline-none focus:border-blue-500"
          />

          <button
            onClick={() => askQuestion()}
            disabled={!uploaded}
            className="bg-blue-600 hover:bg-blue-700 transition-all rounded-3xl px-10"
          >

            Send

          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatSection;