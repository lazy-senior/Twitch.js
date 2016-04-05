"use strict";

class Message{
	constructor(message){
		this.hasTag = false;
		this.hasPrefix = false;
		this.hasChannel = false;
		this.hasUsername = false;

		this.tag = "";
		this.prefix = "";
		this.channel = "";
		this.username = "";

		this.command = "";
		this.arguments = "";

		this.formatTag(message);
	}

	formatTag(message){
		if(message.charAt(0) === "@"){
			this.hasTag = true;
			this.tag = message.substr(0,message.indexOf(' '));
			this.formatPrefix(message.substr(message.indexOf(' ')+1));
		}
		else{
			this.formatPrefix(message);
		}
	}

	formatPrefix(message){
		if(message.charAt(0).match(/[^A-Za-z0-9]/)){
			this.hasPrefix = true;
			this.prefix = message.substr(1,message.indexOf(' '));

			if(this.prefix.indexOf("!") != -1){
				this.hasUsername = true;
				this.username = this.prefix.split("!")[0];
			}

			this.formatMessage(message.substr(message.indexOf(' ')+1));
		}
		else{
			this.formatMessage(message);
		}
	}

	formatMessage(message){
		this.command = message.substr(0,message.indexOf(' '));
		this.arguments = message.substr(message.indexOf(' ')+1);
		if(this.arguments.charAt(0) === "#"){
				this.hasChannel = true;
				if(this.arguments.indexOf(' ') === -1){
					this.channel = this.arguments;
					this.arguments = "";
				}
				else{					
					this.channel = this.arguments.substr(0,this.arguments.indexOf(' '));
					this.arguments = this.arguments.substr(this.arguments.indexOf(' ')+1);
				}
		}
	}

	toString(){
		let output = "";
		output += this.hasTag ? this.tag + " " : "";
		output += this.hasUsername ? "Username:" + this.username + " " : "";
		output += this.hasPrefix ? this.prefix + " " : "";
		output += this.hasChannel ? "Channel" + this.channel + " " : "";
		output += this.command + " " + this.arguments;
		return output;
	}
}

module.exports = Message;