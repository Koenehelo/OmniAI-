import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDwpOW8mktMaF8E5bQomWKeEC1GpQNerfo";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let messages = {
  history: [],
};

let mathMessages = {
  history: [
  ],
};

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", (event)=>{
  if (event.key === "Enter") sendMessage();
});

document.getElementById("solveMath").addEventListener("click", solveMath);
document.getElementById("mathInput").addEventListener("keypress", (event)=>{
  if (event.key === "Enter") solveMath();
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


async function solveMath() {
  let problem = document.getElementById("mathInput").value;
  try {
    await getAIResponseMath(problem)
     } catch {
    document.getElementById("mathSolution").innerText = "An issue has occurred!";
  }
}

async function getAIResponseMath(problem) {
  console.log("solving")
  const chat = model.startChat(mathMessages);
  let result = await chat.sendMessage(problem + "give me just the answer with no additional explanation");

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
  let response = responseText;

  // Use innerHTML to allow HTML formatting to render properly
  document.getElementById("mathSolution").innerHTML = "Solution: " + response;
}
