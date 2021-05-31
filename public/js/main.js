const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from url suing qs parse
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom from qs parse
socket.emit("joinRoom", { username, room });

// Get room and users for sidebar
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server sending it to outPuMessage function
socket.on("message", (message) => {
  outPutMessage(message);

  // Scroll down to most current message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Listen for message submittion in the chat-form
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Retrieve message text and store in msg
  const msg = e.target.elements.msg.value;

  // Emitting a message to the server
  socket.emit("chatMessage", msg);

  // Clear out input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM function
function outPutMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
