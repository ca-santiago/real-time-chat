
var socket = io("http://localhost:3000");

var chatContainer = document.getElementById("chat-container");
var chatInput = document.getElementById("input-chat");
var chatBtnSend = document.getElementById("btn-send");
var memberList = document.getElementById("connection-count");

// On events

socket.on("join", ({message}) => {
    console.log(message);
});

socket.on("message", ({message}) => {
    displayMessage(message)
});

socket.on("member-list-update", ({count}) => {
    displayMemberList(count);
});

// emiting methods

function sendMessage(message) {
    socket.emit("new-message", {message})
}

// DISPLAY

function displayMessage(msg) {
    const newEl = document.createElement("div");
    newEl.textContent = msg;
    chatContainer.append(newEl);
}

function displayMemberList(count = 0) {
    const newEl = document.createElement("p");
    newEl.textContent = count;
    memberList.append(newEl);
} 

// Capturing UI events

chatBtnSend.addEventListener("click", (e) => {
    e.preventDefault();
    handleMessageSend();
});

chatInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      chatBtnSend.click();
    }
}); 


// handlers

function handleMessageSend() {
    const msg = chatInput.value;
    sendMessage(msg);
    chatInput.value = "";
}

