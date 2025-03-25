document.getElementById("save").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value;
  chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
      alert("API Key Saved!");
  });
});
