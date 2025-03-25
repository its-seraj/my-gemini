
function getGeminiApiKeyAsync() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("geminiApiKey", (result) => {
      if (result.geminiApiKey) {
        resolve(result.geminiApiKey);
      } else {
        reject("Gemini API Key not found!");
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchGeminiResponse") {
    fetchGeminiResponse(message.text, message?.raw)
      .then((response) => {
        console.log("Gemini API Response:", response);
        sendResponse({ text: response });
      })
      .catch((error) => {
        console.error("Error fetching response:", error);
        sendResponse({ text: "Error fetching response" });
      });

    return true; // Required for async response
  }
});

async function fetchGeminiResponse(label, raw = false) {
  try {
    const GEMINI_API_KEY = await getGeminiApiKeyAsync();
    let finalPrompt = label;
    if (!raw) {
      finalPrompt = `Provide a professional response for \n \n "${finalPrompt}" \n in a job application.`;
    }
    const prompt = {
      contents: [
        {
          parts: [
            {
              text: finalPrompt,
            },
          ],
        },
      ],
    };

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prompt),
    });

    const data = await response.json();
    console.log(data.candidates?.[0]?.content);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
  } catch (e) {
    return `Error: ${e}`;
  }
}
