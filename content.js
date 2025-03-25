document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.code === "Space" && !event.shiftKey) {
    event.preventDefault();

    // Get the selected text
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      console.log("No text selected");
      return;
    }

    console.log("Selected Text:", selectedText);

    // Send selected text to the background script
    chrome.runtime.sendMessage({ action: "fetchGeminiResponse", text: selectedText }, (response) => {
      if (response && response.text) {
        console.log("Gemini Response:", response.text);
        showModal(response.text);
        // insertText(response.text);
      }
    });
  } else if (event.ctrlKey && event.shiftKey && event.code === "Space") {
    event.preventDefault();
    const selectedText = window.getSelection().toString().trim();

    openPromptModal(selectedText);
  }
});

// Function to insert text into the active input field
// function insertText(text) {
//   console.log("response from gemini", text);
//   const activeElement = document.activeElement;
//   if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
//       activeElement.value = text;
//   } else {
//       console.warn("No input field selected to insert the text.");
//   }
// }

// Function to fetch response from Gemini
function fetchGeminiResponse(selectedText, extraPrompt, isRaw) {
  let finalPrompt = extraPrompt ? `${selectedText}. \n \n ${extraPrompt}` : selectedText;

  chrome.runtime.sendMessage({ action: "fetchGeminiResponse", text: finalPrompt, raw: isRaw }, (response) => {
    if (response && response.text) {
      console.log("Gemini Response:", response.text);
      showModal(response.text);
    } else {
      alert("No response received from Gemini.");
    }
  });
}

// Function to open a modal for adding extra input
function openPromptModal(selectedText) {
  let modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px";
  modal.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.2)";
  modal.style.borderRadius = "8px";
  modal.style.zIndex = "10000";
  modal.style.minWidth = "400px";
  modal.style.textAlign = "center";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";

  // Create Cancel (x) Button
  // let xBtn = document.createElement("button");
  // closeBtn.innerText = "❌";
  // closeBtn.style.position = "absolute";
  // closeBtn.style.top = "8px";
  // closeBtn.style.right = "8px";
  // closeBtn.style.background = "none";
  // closeBtn.style.border = "none";
  // closeBtn.style.fontSize = "16px";
  // closeBtn.style.cursor = "pointer";
  // closeBtn.onclick = function () {
  //   document.body.removeChild(modal);
  // };

  let textArea = document.createElement("textarea");
  textArea.placeholder = "Add extra prompt here...";
  textArea.style.width = "100%";
  textArea.style.height = "80px";
  textArea.style.marginBottom = "10px";
  textArea.style.resize = "both";
  textArea.style.borderRadius = "8px";
  textArea.style.padding = "4px";

  // Create radio button (no label)
  let radioContainer = document.createElement("div");
  radioContainer.style = "position:absolute;bottom:5px;left:5px;";
  let radioButton = document.createElement("input");
  radioButton.type = "radio";
  radioButton.id = "rawFlag";
  radioButton.style = "width:16px;height:16px;cursor:pointer;opacity:1;pointer-events:unset;outline:none;box-shadow:none;border:none;";
  radioContainer.appendChild(radioButton);

  let actionBtn = document.createElement("div");

  let submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit";
  submitBtn.style.padding = "8px 12px";
  submitBtn.style.backgroundColor = "#28a745";
  submitBtn.style.color = "#fff";
  submitBtn.style.border = "none";
  submitBtn.style.cursor = "pointer";
  submitBtn.style.borderRadius = "8px";
  submitBtn.onclick = function () {
    let extraPrompt = textArea.value.trim();
    let isRaw = radioButton.checked;
    document.body.removeChild(modal);
    fetchGeminiResponse(selectedText, extraPrompt, isRaw);
  };

  let closeBtn = document.createElement("button");
  closeBtn.innerText = "Cancel";
  closeBtn.style.marginLeft = "10px";
  closeBtn.style.padding = "8px 12px";
  closeBtn.style.backgroundColor = "#dc3545";
  closeBtn.style.color = "#fff";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.borderRadius = "8px";
  closeBtn.onclick = function () {
    document.body.removeChild(modal);
  };

  actionBtn.appendChild(submitBtn);
  actionBtn.appendChild(closeBtn);
  modal.appendChild(textArea);
  modal.appendChild(radioContainer);
  modal.appendChild(actionBtn);
  document.body.appendChild(modal);
}

// Function to create a copyable modal
function showModal(responseText) {
  let modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "#fff";
  modal.style.padding = "20px";
  modal.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.2)";
  modal.style.borderRadius = "8px";
  modal.style.zIndex = "10000";
  modal.style.minWidth = "400px";
  modal.style.textAlign = "center";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";

  let textArea = document.createElement("textarea");
  textArea.value = responseText;
  textArea.style.width = "100%";
  textArea.style.height = "100px";
  textArea.style.marginBottom = "10px";
  textArea.style.resize = "both";
  textArea.style.borderRadius = "8px";
  textArea.style.padding = "4px";
  // textArea.readOnly = true;

  let actionBtn = document.createElement("div");

  let copyBtn = document.createElement("button");
  copyBtn.innerText = "Copy";
  copyBtn.style.padding = "8px 12px";
  copyBtn.style.backgroundColor = "#007bff";
  copyBtn.style.color = "#fff";
  copyBtn.style.border = "none";
  copyBtn.style.cursor = "pointer";
  copyBtn.style.borderRadius = "8px";
  copyBtn.onclick = function () {
    textArea.select();
    document.execCommand("copy");
    alert("Copied to clipboard!");
  };

  let closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  closeBtn.style.marginLeft = "10px";
  closeBtn.style.padding = "8px 12px";
  closeBtn.style.backgroundColor = "#dc3545";
  closeBtn.style.color = "#fff";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.borderRadius = "8px";
  closeBtn.onclick = function () {
    document.body.removeChild(modal);
  };

  actionBtn.appendChild(copyBtn);
  actionBtn.appendChild(closeBtn);
  modal.appendChild(textArea);
  modal.appendChild(actionBtn);

  document.body.appendChild(modal);
}
