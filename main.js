import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDwpOW8mktMaF8E5bQomWKeEC1GpQNerfo";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let messages = {
  history: [],
};

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", (event)=>{
  if (event.key === "Enter") sendMessage();
});
// Function for Chatbot AI Interaction
async function sendMessage() {
  const input = document.getElementById("userInput").value;
  if (input.length) {
    addChatMessage("User", input);
  await getAIResponse(input), 1000;
  document.getElementById('userInput').value = "";

    // const botResponse = document.createElement("div");
    // botResponse.classList.add("chat-message", "omni-message");
    // botResponse.innerHTML = responseText;
    // chatWindow.appendChild(botResponse);

    // document.getElementById("message").value = "";
    // chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}



function addChatMessage(sender, message) {
  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function getAIResponse(input) {
  let response;
  if (input.toLowerCase().includes("who made you")) {
    response = "All the way, Koenehelo Mats'aba created me!";
  } else {
    const chat = model.startChat(messages);
    let result = await chat.sendMessage(input);

    let responseText = result.response.text();

    // Replace **text** with <strong>text</strong>
    responseText = responseText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Split the text into lines
    const lines = responseText.split("\n");
    const processedLines = [];
    let inList = false;

    lines.forEach((line) => {
      if (line.trim().startsWith("* ")) {
        if (!inList) {
          inList = true;
          processedLines.push("<ul>");
        }
        processedLines.push("<li>" + line.trim().substring(2) + "</li>");
      } else {
        if (inList) {
          processedLines.push("</ul>");
          inList = false;
        }
        processedLines.push(line);
      }
    });

    if (inList) {
      processedLines.push("</ul>");
    }

    responseText = processedLines.join("\n");
    response = responseText
  }
  addChatMessage("OmniAI", response);
}

function handleKey(event) {
  if (event.key === "Enter") sendMessage();
}
