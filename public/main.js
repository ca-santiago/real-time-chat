
var socket = io("http://localhost:3000");

var chatContainer = document.getElementById("chat-container");
var chatInput = document.getElementById("input-chat");
var chatBtnSend = document.getElementById("btn-send");
var memberList = document.getElementById("connection-count");
var memberName = document.getElementById("member-name");

// Default messages
var memberPrefix = "Signed as ";
var myId = "";

// On events

socket.on("join", ({ userName, userId }) => {
    displayMemberName(userName);
    console.log('Self registering: ', userId, userName);
    myId = userId;
});

socket.on("message", ({message, userName, userId}) => {
    displayMessage(message, userName, userId)
});

socket.on("member-list-update", ({count}) => {
    console.log("List being updated: ", count);
    displayMemberList(count);
});

// emiting methods

function sendMessage(message) {
    socket.emit("new-message", {message})
}

// Sanitizer
function createSanitizedHtmlContent(text) {
    var el = document.createElement('p');
    el.textContent = text;
    return el.innerHTML;
}

// DISPLAY

const displayMessage = (content, userName, userId) => {
    var msg = document.createElement("div");
    msg.textContent = `${userName}: ${content}`;
    msg.classList.add('chat-message');
    
    console.log('Message: ', userId, myId);
    if(myId === userId) {
        msg.classList.add('self-message');
    }

    var msgContainer = document.createElement("li");
    msgContainer.classList.add('single-message-container');
    msgContainer.append(msg);
    chatContainer.append(msgContainer);
}

function displayMemberList(count = 0) {
    memberList.innerHTML = createSanitizedHtmlContent(count);
}

function displayMemberName(name = '') {
    memberName.innerHTML = createSanitizedHtmlContent(memberPrefix + name);
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

