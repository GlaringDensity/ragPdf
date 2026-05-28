function MessageBubble({ msg }) {

  return (

    <div
      className={`flex ${
        msg.role === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-[90%] rounded-3xl px-7 py-6 ${
          msg.role === "user"
            ? "bg-blue-600"
            : "bg-[#111827] border border-gray-800"
        }`}
      >

        <p className="leading-8 whitespace-pre-wrap text-[16px]">
          {msg.content}
        </p>

        {msg.sources && (

          <div className="mt-8">

            <p className="text-sm font-semibold text-gray-300 mb-4">
              Retrieved Sources
            </p>

            <div className="space-y-4">

              {msg.sources.map((source, idx) => (

                <div
                  key={idx}
                  className="bg-[#0B1120] border border-gray-700 rounded-2xl p-4 text-sm text-gray-300"
                >

                  {source.snippet}

                </div>
              ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default MessageBubble;