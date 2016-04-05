"use strict";

let TwitchIo = require('./include/Client');

let chat = new TwitchIo({
	username : 'Papplebot', 
	password : 'oauth:',
	channels : ['#johnmcpineapple']
});

chat.on("JOIN", (channel, username) => {
	console.log(username + "->" + channel);
});
chat.on("MSG", (channel, username, message) => {
	console.log("MSG" + channel + " " + username + " " + message);
	chat.say(channel, message + " Kappa");
})
chat.on("ROOMSTATE", (channel, tag) => {
	console.log(tag);
})