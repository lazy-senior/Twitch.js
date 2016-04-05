"use strict";

let net = require('net');
let Message = require("./Message");
let EventEmitter = require('events');

class Client {
	constructor(options){
		this.client = new net.Socket();
		this.client.setEncoding('utf8');
		this.commandListener = new EventEmitter();

		this.identity = {
			username : options.username,
			password : options.password 
		}
		this.channels = options.channels;
		
		this.connect();
	}

	connect(){	
		this.client.connect(6667, 'irc.twitch.tv', () => {
			this.client.write('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership\r\n');
			this.client.write('PASS ' + this.identity.password +'\r\n');
			this.client.write('NICK ' + this.identity.username + '\r\n');
			this.client.write('USER ' + this.identity.username + ' 8 * ' + this.identity.username + '\r\n');
		});

		this.client.on('data', (message) => {
			message.split(/\r\n/).forEach((message) => {
				this.handleMessage(message);
			});
		});

		this.commandListener.once('CONNECTION_READY', () => {
			this.channels.forEach((channel) => {
				this.join(channel);
			});
		});
	}
	
	handleMessage(raw){
		let message = new Message(raw);

		console.log(message);
		
		switch(message.command){
			case 'ROOMSTATE':
				this.commandListener.emit('ROOMSTATE', message.channel, message.tag);
				break;
			case 'PRIVMSG':
				this.commandListener.emit('MSG', message.channel, message.username, message.arguments.substr(1));
				break;
			case 'JOIN':
			case 'PART':
				this.commandListener.emit(message.command, message.channel, message.username);
				break;
			case '376':
				this.commandListener.emit('CONNECTION_READY');
				break;
			case '353':
				this.commandListener.emit('CHANNEL_READY');
				break;
		}
	}
	on(event,callback){
		this.commandListener.on(event,callback);
	}
	say(channel, message){
		this.client.write('PRIVMSG ' + channel + ' :' + message + '\r\n');
	} 
	join(channel){
		this.client.write('JOIN ' + channel + '\r\n' );
	}	
}
module.exports = Client;