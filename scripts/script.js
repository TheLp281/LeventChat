let chatContainer = null;
let userInput = null;;
let userList = null;
let settingsOverlay = null;
let channelInfo = null;
let selfNameButton = null;
let defaultImageUrl = null;
let microphoneButton = null;
let selfBubble = null;
let replyInfo = null;
let replyContainer = null;
const genel = 'genel';
const komut = 'komut';
const galeri = 'galeri';
let currentChannel = genel;



let userNick = "Reeyuki"

if (!userNick) {
    userNick = "Guest";
    selfNameButton.innerHTML = 'Guest';
    
}
function updateChannels(channels) {
    const channelList = document.getElementById('channel-list');
    const ul = channelList.querySelector('ul');
    channelList.style.marginTop = '45px';
    ul.innerHTML = ''; 

    channels.forEach(channel => {      
        const channelButton = document.createElement('channel-button');
        const hashtagSpan = document.createElement('span');
        hashtagSpan.textContent = '#';
        hashtagSpan.style.fontSize = "20px";
        hashtagSpan.style.color = 'gray'; 
        channelButton.appendChild(hashtagSpan);

        const channelSpan = document.createElement('span');
        channelButton.style.cursor = 'pointer';
 
        channelSpan.textContent = channel;
        channelSpan.style.color = 'white'; 
        let leftOffset = "15px";
        
        channelSpan.style.marginLeft = leftOffset;
        hashtagSpan.style.marginLeft = leftOffset;

        channelButton.appendChild(channelSpan);
        channelButton.className = 'channel-button';
        channelButton.onclick = () => changeChannel(channel);
        channelButton.style.width = "245px";
        channelButton.style.marginLeft= "-100px";

        ul.appendChild(channelButton);
    });
}

let isMicrophoneMuted = false;
function setMicrophone() {
    let imagePath = isMicrophoneMuted ? "static/images/icons/redmic.png" : "static/images/icons/whitemic.png";
    microphoneButton.src = imagePath;
    isMicrophoneMuted = !isMicrophoneMuted;
}

let isEarphonesMuted = false;
function setEarphones() {
    console.log("Earphones are not implemented");
    //let imagePath = isMicrophoneMuted ? "static/images/icons/redearphones.png" : "static/images/icons/whiteearphones.png";
    //microphoneButton.src = imagePath;
    isEarphonesMuted = !isEarphonesMuted;
}
// Example usage:
const newChannelList = ['genel','komut','galeri','genel','komut','galeri','genel','komut','galeri','genel','komut','galeri','genel','komut','galeri','genel','komut','galeri','genel','komut','galeri','genel','komut','galeri'];
window.onload = function() {
    
    chatContainer = document.getElementById('chat-container');
    userInput = document.getElementById('user-input');
    userList = document.getElementById('user-list');
    settingsOverlay = document.getElementById('settings-overlay');
    channelInfo = document.getElementById("channel-info");
    selfNameButton = document.getElementById("self-name");
    microphoneButton = document.getElementById("microphone-button");
    selfProfileImage = document.getElementById("self-profile-image");
    selfBubble = document.getElementById("self-bubble");
    replyInfo = document.getElementById("reply-info");
    replyContainer  = document.getElementById("reply-container");

    defaultImageUrl = 'static/profiles/guest.jpg';
    createScrollButton();
    updateChannels(newChannelList);
    for (let i = 1; i <= 40; i++) {
        displayMediaMessage({ nick: "TestNick", message: `${i}`, channel: genel, date: new Date() });
    }
    
    updateUserList(['User1','User2','User3','User4','User5','User6','User7','User8','User9']);
    channelInfo.textContent = currentChannel;

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });


    selfProfileImage.addEventListener("mouseover", function() {
        this.style.borderRadius = '0px';
        selfBubble.display = "none";
    });

    selfProfileImage.addEventListener("mouseout", function() {
        this.style.borderRadius = '25px';
        selfBubble.display = "flex";
    });



    changeChannel(genel);

}
let unreadStatus = {
    genel: 0,
    komut: 0,
    galeri: 0
};

document.addEventListener('visibilitychange', function() {
    var favicon = document.getElementById('favicon');
    if (!document.hidden && isAnyChannelUnreaded()) {
        // User returned to the page and there are unread messages
        favicon.href = 'static/images/icons/faviconactive.png';
    } else {
        // User switched tabs or left the page or there are no unread messages
        favicon.href = 'static/images/icons/faviconunactive.png';
    }
});

function isAnyChannelUnreaded() {
    for (const channel in unreadStatus) {
        if (unreadStatus[channel] > 0) {
            return true;
        }
    }
    return false;
}


function changeChannel(newChannel) {
    if (currentChannel === newChannel) {
        return;
    }
    chatContainer.innerHTML = '';
    currentChannel = newChannel;

    displayMediaMessage({ nick: "Server", message: 'Hi from new channel', channel: newChannel,date :new Date()});  
    unreadStatus[newChannel] = 0; 

    
    userInput.placeholder = '#' + currentChannel + ' kanalına mesaj gönder';
    channelInfo.textContent = currentChannel;
    lastSenderNick = '1289038219321';
}


function createScrollButton()
{
    var scrollButton = document.createElement('button');
    scrollButton.textContent = 'En aşağıya git';
    scrollButton.id = 'scroll-to-bottom';
    scrollButton.style.position = 'fixed';
    scrollButton.style.bottom = '100px';
    scrollButton.style.right = '300px';
    scrollButton.style.backgroundColor = '#21315f5';
    scrollButton.style.width= '95px'; 
    scrollButton.style.height= '40px';
    scrollButton.style.fontSize = '16px';
    scrollButton.style.display = 'none';
    document.body.appendChild(scrollButton);

    chatContainer.addEventListener('scroll', function() {
        if (chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.clientHeight) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
        });


    scrollButton.addEventListener('click', function() {
        scrollButton.style.display = 'none';
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });

}
function LoadHistory() {
    fetch('/history')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.history.forEach(message => {

                displayMediaMessage({ nick: message.nick, message: message.message, channel: message.channel,date:message.date });
            });
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(error => console.error('Error fetching chat history:', error));
}












function updateUserList(users) {

    const tableWrapper = document.createElement('div'); // Wrapper for the table
    tableWrapper.classList.add('user-table-wrapper'); // Add CSS class for styling

    const table = document.createElement('table');
    table.classList.add('user-table'); // Add CSS class for styling
    const tbody = document.createElement('tbody');

    users.forEach(user => {
        const tr = document.createElement('tr');

        // Profil fotoğrafı ve kullanıcı adını içeren td oluştur
        const profileTd = document.createElement('td');
        const nameTd = document.createElement('td');

        // Kullanıcı adını içerecek div oluştur
        const userDiv = document.createElement('div');
        userDiv.textContent = user;

        // Profil fotoğrafı ve baloncuk için bir konteyner oluştur
        const profileContainer = document.createElement('div');
        profileContainer.style.position = 'relative'; // Set position

        // Profil fotoğrafı ekle
        const profileImg = document.createElement('img');
        const imageUrl = 'static/profiles/' + user + '.jpg';
        function doesFileExist(urlToFile)
        {
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', urlToFile, false);
            xhr.send();

            if (xhr.status == "404") {
                console.log("File doesn't exist");
                return false;
            } else {
                console.log("File exists");
                return true;
            }
        }


        const img = new Image();
        img.onload = function() {
            profileImg.src = imageUrl;

            profileImg.style.width = (user.length * 8) + 'px'; 
        };
        

        img.onerror = function() {
            // Image does not exist, set default image source
            console.log("Default guest image used");
            profileImg.src = defaultImageUrl;
            // Dynamically set width based on username length
            profileImg.style.width = (user.length * 8) + 'px'; 
        };

        img.src = imageUrl; 
        const bubble = document.createElement('span');
        profileImg.style.borderRadius = '50%';

        

        profileImg.style.transition = 'border-radius 0.5s ease-out';
        bubble.style.transition = "opacity 0.5s ease-in-out";



        profileImg.addEventListener("mouseover", function() {
            this.style.borderRadius = '0px';
            bubble.style.opacity = 0; // Directly set opacity to 0
        });

        profileImg.addEventListener("mouseout", function() {
            this.style.borderRadius = '25px';
            bubble.style.opacity = 1; // Directly set opacity to 1
        });


        profileContainer.appendChild(profileImg); 
        // Kullanıcı baloncuk ekle
        
        bubble.style.backgroundColor = '#23a55a';
        bubble.style.color = 'white';
        bubble.style.padding = '6px 6px'; 
        bubble.style.borderRadius = '20px'; 
        bubble.style.position = 'absolute';
        bubble.style.bottom = '0'; 
        bubble.style.right = '0'; 
        bubble.style.border = '5.5px solid #2f3136';

        profileContainer.appendChild(bubble); 

        profileTd.appendChild(profileContainer); 

        nameTd.appendChild(userDiv);

        // Satıra ekle
        tr.appendChild(profileTd);
        tr.appendChild(nameTd);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    userList.appendChild(tableWrapper); 
}

const customEmojis = {
    ":yes:": "static/images/yes.png",
    ":no:": "static/images/no.png",
    ":slap:": "static/images/slap.png",
    ":unrelated:": "static/images/unrelated.png",
    ":ekmek:": "static/images/ekmek.png",
    ":trash:": "static/images/trash.png"
};



const channels = {
    general: [],
    command: [],
    suggestions: []
};


let lastSenderNick = null;

function displayMediaMessage(data) {
    if (!data) { return; }
    var { nick, message ,channel,date} = data;

    if(currentChannel !== channel)
    {
        console.log("Returned");
        return;
    }
    // Yeni bir ileti oluşturun
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');
    const messageContentElement = document.createElement('span');
    // Eğer bu iletiyi atan kişi son iletiyi atan kişiyle aynı değilse, profil resmi ve kullanıcı adını ekle
    if (nick !== lastSenderNick) {
        newMessage.style.marginBottom = '15px';

        const profilePic = document.createElement('img');
        const imageUrl = 'static/profiles/' + nick + '.jpg';

        const img = new Image();
        img.onload = function() {
            profilePic.src = imageUrl;
        };
        img.onerror = function() {
            profilePic.src = defaultImageUrl;
        };
        img.src = imageUrl; 


        
        
        
        profilePic.style.width = (nick.length * 8) + 'px'; 
        profilePic.style.width = '40px';
        profilePic.style.height = '40px';
        profilePic.style.borderRadius = '25px'
        profilePic.style.transition = 'border-radius 0.5s ease-out';

        profilePic.addEventListener("mouseover", function() {
            this.style.borderRadius = '0px'; 
        });
        
        profilePic.addEventListener("mouseout", function() {
            this.style.borderRadius = '25px'; 
        });
        
        profilePic.style.float = 'left';
        profilePic.style.marginRight = '15px';

        
        newMessage.appendChild(profilePic);
        const authorAndDate = document.createElement('div');
        authorAndDate.style.display = 'flex';
        authorAndDate.style.alignItems = 'center';
        const nickElement = document.createElement('span');
        nickElement.textContent = nick;
        nickElement.style.fontWeight = 'bold';
        nickElement.style.color = 'white';
        authorAndDate.appendChild(nickElement);
        const messageDate = new Date(date);
        const dateElement = document.createElement('span');
        dateElement.textContent = getFormattedDate(messageDate);
        dateElement.style.fontSize = '0.7em';
        dateElement.style.color = 'grey';
        authorAndDate.appendChild(dateElement);
        newMessage.appendChild(authorAndDate);
    } else { messageContentElement.style.left = '55px'; }

    newMessage.style.marginBottom = '0px';
    const messageWrapper = document.createElement('div');
    const formattedMessage = replaceCustomEmojis(message);
    messageContentElement.innerHTML = formattedMessage;
    messageContentElement.style.position = 'relative';
    messageWrapper.appendChild(messageContentElement);


    newMessage.appendChild(messageWrapper);
    newMessage.style.marginTop = '2px';
    

    let linksProcessed = 0;

    const links = extractLinks(message);
    links.forEach(link => {
        if (linksProcessed >= 4) return;
        let mediaElement;
        if (isImageURL(link)) {
            mediaElement = createImageElement(link);
        } else if (isYouTubeURL(link)) {
            mediaElement = createYouTubeElement(link);
        } else if (isTenorURL(link)) {
            mediaElement = createTenorElement(link);
        }

        if (mediaElement) {
            messageWrapper.appendChild(mediaElement);
        }
    });
    
    // Reply Butto
    const replyButton = document.createElement('button');
    replyButton.textContent = '↪';
    replyButton.style.fontSize = '22px';
    replyButton.style.width = '35px';
    replyButton.style.height = '25px';
    replyButton.style.marginTop = '-22px';
    replyButton.style.border = 'none';
    replyButton.style.outline = '1px solid #232428'; // Set outline to 2px solid black
    replyButton.style.borderRadius = '10%';
    replyButton.style.backgroundColor = '#313338';
    replyButton.style.color = '#b5bac1';

    
    replyButton.addEventListener("mousedown", function() {
        // Set the border style when the mouse button is pressed
        replyButton.style.border = "2px solid #000000";
    });
    
    // Add mouseup event listener to remove border
    replyButton.addEventListener("mouseup", function() {
        // Remove the border style when the mouse button is released
        replyButton.style.border = "none";
    });

    replyButton.addEventListener("mouseover", function() {
        // Remove the border style when the mouse button is released
        replyButton.style.background = '#393a3b';
    });
    replyButton.addEventListener("mouseout", function() {
        // Remove the border style when the mouse button is released
        replyButton.style.background = '#313338';
    });
 




    messageWrapper.addEventListener('mouseover', function() {
        
        replyButton.style.display = 'table';
        messageWrapper.style.backgroundColor = '#535353';
        
    });
    messageWrapper.addEventListener('mouseout', function() {
        
        replyButton.style.display = 'none';
        messageWrapper.style.backgroundColor = '#313338';
        
    });

    replyButton.addEventListener('mouseover', function() {
        
        replyButton.style.display = 'table';
        messageWrapper.style.backgroundColor = '#535353';
        
    });
    replyButton.addEventListener('mouseout', function() {
        
        replyButton.style.display = 'none';
        messageWrapper.style.backgroundColor = '#313338';
        
    });
    replyButton.onclick = function(event) {
        event.stopPropagation();
        showReplyMenu();
    };
    replyButton.style.display = 'none';
    
    replyButton.style.float = 'right';
    newMessage.appendChild(replyButton);

    
    // Nick bilgisini dataset'e ekle
    newMessage.dataset.senderNick = nick;



    // İletiyi ekrana ekleyin
    chatContainer.appendChild(newMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Son gönderenin nick'ini güncelleyin
    lastSenderNick = nick;


}

// Function to extract links from the message
function extractLinks(message) {
    const urlRegex = /(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*/g;
    return message.match(urlRegex) || [];
}
function showReplyMenu() {
    replyContainer.style.display = "block";
}
function closeReplyMenu() {
    replyContainer.style.display = "none";
}

window.sendMessage = function () {
    let message = userInput.value.trim();
    if (message !== '') {
        displayMediaMessage({ message: message, nick: userNick, channel: currentChannel,date : new Date() });
        userInput.value = '';
    }
};


window.openSettings = function () {
    settingsOverlay.style.zIndex = 10;
    settingsOverlay.style.display = 'flex';
};

window.closeSettings = function () {
    settingsOverlay.style.display = 'none';
};

window.changeNickname = function () {
    const newNicknameInput = document.getElementById('new-nickname');
    const newNickname = newNicknameInput.value.trim();

    if (newNickname !== '') {
        console.log("Changed your nickname to: " + (newNickname.length > 29 ? newNickname.slice(0, 29) + '...' : newNickname));
        // Update the userNick variable locally
        userNick = newNickname;

        selfNameButton.innerText = newNickname;

        // Clear the input field
        newNicknameInput.value = '';
    }
};
function changeNickname() {
    const newNicknameInput = document.getElementById('new-nickname');
    const newNickname = newNicknameInput.value.trim();

    if (newNickname !== '') {
        console.log("Changed your nickname to: " + (newNickname.length > 29 ? newNickname.slice(0, 29) + '...' : newNickname));
        // Update the userNick variable locally
        userNick = newNickname;

        selfNameButton.innerText = newNickname;

        // Clear the input field
        newNicknameInput.value = '';
    }
}






function playNotification() {
    var audio = document.getElementById("notificationSound");
    audio.play();
}

function getFormattedDate(messageDate) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
        return "ㅤBugün saat " + messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return "ㅤDün saat " + messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else {
        return messageDate.toLocaleDateString('tr-TR') + ' ' + messageDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }
}

function isImageURL(url) {
    return /\.(gif|jpe?g|png)$/i.test(url);
}

function isYouTubeURL(url) {
    return /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(url);
}

function getYouTubeEmbedURL(url) {
    const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1];
    return `https://www.youtube.com/embed/${videoId}`;
}

function isTenorURL(url) {
    return /tenor\.com\/(?:[^\/]+\/)+[^\/]+-\d+/.test(url);
}
function createImageElement(src) {
    // Eğer src boş ise (yani URL yoksa) null döndür
    if (!src) return null;

    const imgElement = document.createElement('img');
    


    // Eğer resim yüklenemezse, oluşturulan elemanı yok et
    imgElement.onerror = function() {
        imgElement.remove();
    };
    imgElement.src = src;

    return imgElement;
}

function createTenorElement(url) {
    let tenorURL = '';
    if (url.includes("media1.tenor.com/m/") || url.includes("c.tenor.com/")) {
        tenorURL = url;
    } else if (url.startsWith("tenor.com") || url.startsWith("https://tenor.com")) {
        tenorURL = url.includes(".gif") ? url : url + ".gif";
    }
    const imgElement = document.createElement('img');
    imgElement.onerror = function() {
        imgElement.remove();
    };
    imgElement.src = tenorURL;

    return imgElement;
}
// özel emojileri yerine göre değiştirir
function replaceCustomEmojis(message) {
    // Regular expression to match URLs
    const urlRegex = /(?:https?|ftp):\/\/[\n\S]+/g;
    
    // Remove all URLs from the message
    message = message.replace(urlRegex, '');

    // Replace custom emojis
    for (const emoji in customEmojis) {
        if (customEmojis.hasOwnProperty(emoji)) {
            const emojiId = emoji.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(emojiId, 'g');
            message = message.replace(regex, `<img src="${customEmojis[emoji]}" alt="${emoji}" style="width: 80px; height: 48px; vertical-align: middle;">`);
        }
    }
    return message;
}



function createYouTubeElement(url) {
    const youtubeURL = getYouTubeEmbedURL(url);
    const iframeElement = document.createElement('iframe');
    iframeElement.width = '560';
    iframeElement.height = '315';
    iframeElement.src = youtubeURL;
    iframeElement.title = 'YouTube video player';
    iframeElement.frameborder = '0';
    iframeElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframeElement.allowfullscreen = true;
    return iframeElement;
}

