document.getElementById("save").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value;
  chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
      alert("API Key Saved!");
  });
});
