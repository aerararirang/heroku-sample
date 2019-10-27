//Client JS File


var socket = io.connect(),
    userEnterDiv = document.getElementById('userEnterDiv'),
    userNameErrorMsg = document.getElementById('userNameErrorMsg'),
    userNameInput = document.getElementById('userNameInput'),
    enterBtn = document.getElementById('enterBtn'),
    mainDiv = document.getElementById('mainDiv'),
    usersDivContainer = document.getElementById('usersDivContainer'),
    displayUsers = document.getElementById('displayUsers'),
    chatDivContainer = document.getElementById("chatDivContainer"),
    chatOutput = document.getElementById('chatOutput'),
    typingOutput = document.getElementById('typingOutput'),
    msg = document.getElementById('messageTextArea'),
    chatBtn = document.getElementById('chatButton');


//Enter to Chat
enterBtn.addEventListener('click', function(e){
    e.preventDefault();
    socket.emit('new user', userNameInput.value, function(data){
        if(data) {
            userEnterDiv.style.display = "none";
            mainDiv.style.display = "block";
        } else {
            userNameErrorMsg.innerHTML = 'Error: try again';
        }
    });
});
//display usernames on chat inside div displayUsers
// socket.on('usernames', function(data){
//     displayUsers.innerHTML = '';
//     for(var i=0; i<data.length; i++){
//       displayUsers.innerHTML += `${`<div id="nameOnDisplay-${data[i]}">${data[i]}</div>`}`;    // '<div id="nameOnDisplay-data[i]">' + data[i] + '</div>';
//       //var htmlStr = `${`<h2>${nameX}</h2>`}`;		//using Template Literal concept
//   }
// });


//choose a person to chat with
var div_ele = displayUsers.childNodes;
socket.on('usernames', function(data){
    displayUsers.innerHTML = '';
    var htmlStr = '';
    for(var i=0; i<data.length; i++){
      htmlStr = '<p>' + data[i]+'</p>';
      var innerDisplayUsers = document.createElement('div');
      innerDisplayUsers.id = data[i];// + '-innerDisplayUser';
      innerDisplayUsers.innerHTML = htmlStr;
      displayUsers.appendChild(innerDisplayUsers);
    }
    for (var i=0; i<div_ele.length; i++) {
         //console.log(div_ele[i]);
         div_ele[i].addEventListener('click', chooseUserToChatWith(div_ele[i]));
    }
});
function chooseUserToChatWith(data){
    return function(){
      console.log(data);       console.log(data.id);
      chatDivContainer.style.display = "block";
      sendMessageToUser(data.id);
    };
}


//send message to chosen client
function sendMessageToUser(client) {
  console.log(client);
  chatBtn.addEventListener('click', function(e) {  e.preventDefault();
    socket.emit('send message',  {  'client': client, 'msg': msg.value} );
    msg.value = '';
  });
}


//add event listener on msg typing
msg.addEventListener('keypress', function(){
    socket.emit('typing message', userNameInput.value);
});

//message output
socket.on('new message', function(data){
  chatDivContainer.style.display = "block";
    typingOutput.innerHTML="";
    var htmlStr = '';
    htmlStr += '<p>' + data.sender +': '+ data.message + '</p>';
    var innerChatOutput = document.createElement('div');
    innerChatOutput.id = data.client;
    innerChatOutput.innerHTML = htmlStr;
    chatOutput.appendChild(innerChatOutput);

    //keep scroll on bottom
    var xH = chatMessagesContainer.scrollHeight;
    chatMessagesContainer.scrollTo(0, xH);
});

//Listen on events
// socket.on('new message', function(data){
//   chatDivContainer.style.display = "block";
//     typingOutput.innerHTML="";
//     chatOutput.innerHTML += '<p>' + data.sender +': '+ data.message + '</p>';
//     //keep scroll on bottom
//     var xH = chatMessagesContainer.scrollHeight;
//     chatMessagesContainer.scrollTo(0, xH);
// });

socket.on('typing message', function(data){
    console.log(data + '  typing message')
    typingOutput.innerHTML = '<p>' + data + ' is typing message...</p>';
});