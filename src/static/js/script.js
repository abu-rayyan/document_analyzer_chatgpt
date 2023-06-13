$(document).ready(function() {
    callEmptyRoute();
  });

// this will empty session data on reload
function callEmptyRoute() {
    $.ajax({
      url: '/empty',
      type: 'GET',
      success: function(response) {
        console.log(response);
        
      },
      error: function(xhr, status, error) {
        console.error('An error occurred while calling the empty route:', error);
        // Handle the error if needed
      }
    });
  }



// upload file
document.getElementById('file-input').addEventListener('change', function () {
    var formData = new FormData();
    formData.append('file', this.files[0]);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/parse');
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            document.getElementById('result').innerHTML = 'Successfully uploaded';
        }
    };
    xhr.send(formData);
});



// connect socketio on local server
const socket = io();
socket.on("connect", function() {
    console.log("Socket.IO connected");
   
  });

// get DOM elements
const chatBox = document.getElementById('chatbox');
const chatForm = document.getElementById('chat-form');
const userMessage = document.getElementById('user-message');


// submit form and send message to server on submit
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    //  Create element

    botMessageHTML = document.createElement('div');
    botMessageHTML.classList.add('bot-message');
    let message = userMessage.value.trim();
    if (message !== '') {
        socket.emit('message', message);
        var userMessageHTML = '<div class="user-message">' + message + '</div>';
        $(userMessageHTML).appendTo('#chatbox');
        var typingIndicator = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        $('#chatbox').append(typingIndicator);
        scrollToBottom();
        userMessage.value = '';
        textarea.style.height = '50px';
    }
});


// receive response from server through socket
let count = 0;
let count2 = 0;
let para;
let codeElement
socket.on('response', (message) => {

    // add bot message to chat box
    $('.typing-indicator').remove();
    if (message == "``" || message == "```") {
        count += 1;
        if (count == 1) {
            para = document.createElement("pre");

        }

    } else if (count == 1) {
        para.innerHTML += message;
        $(botMessageHTML).append(para);
        scrollToBottom();
    } else if (count == 2) {
        count = 0;

    } else {

        botMessageHTML.innerHTML += message;
        $(botMessageHTML).appendTo('#chatbox');
        scrollToBottom();
    }


});


function scrollToBottom() {
    const chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
}

const textarea = document.getElementById('user-message');

textarea.addEventListener('input', () => {
    const lines = textarea.value.split('\n').length;
    if (lines === 1) {
        textarea.style.height = '40px'; // set to minimum height
    } else {
        textarea.style.height = '70px'; // set to maximum height
    }
});

textarea.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
        // send the message here
        sendMessage();
        // prevent the form from submitting
        event.preventDefault();
      } else if (event.shiftKey && event.keyCode === 13) {
        // add a new line to the text area
        textarea.value += '\n';
        // adjust the height of the text area to fit the new line
        textarea.style.height = `${textarea.scrollHeight}px`;
        // prevent the form from submitting
        event.preventDefault();
      }

});

// use when hit enter for send
function sendMessage() {
    botMessageHTML = document.createElement('div');
    botMessageHTML.classList.add('bot-message');
    let message = textarea.value.trim();
    if (message !== '') {
      socket.emit('message', message);
      var userMessageHTML = '<div class="user-message">' + message + '</div>';
      $(userMessageHTML).appendTo('#chatbox');
      var typingIndicator = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
      $('#chatbox').append(typingIndicator);
      scrollToBottom();
      textarea.value = '';
      textarea.style.height = '50px';
    }
  }



