/*
    reaction.js
    Handles all things related to reactions and emoji.

    Written by Adam "WaveParadigm" Gincel for the Icons: Combat Arena Discord Server.	
    Modified by Tyler "NFreak" Morrow for the NFreak Stream Discord Server.
*/

const fs = require("fs");
const misc = require("./misc.js");

let emojiNames = JSON.parse(fs.readFileSync("./info/roleEmoji.json", "utf8"));
let removeReacts = true;
const emojiRoleDict = {
	"nfreakLogo": "Notifications",
	"buttonRainbow": "Destiny 2 [Ping]",
	"buttonBlue": "Smash Ultimate [Ping]",
	"buttonRed": "Melee [Ping]",
	"buttonWhite": "UNIST [Ping]",
	"buttonGreen": "Minecraft [Ping]",
	"buttonYellow": "Tekken 7 [Ping]",
	"buttonPurple": "Borderlands [Ping]"
};
const pronounEmoji = {
	"🇭":"he/him",
	"🇸":"she/her",
	"🇹":"they/them"
};

function emojiToRole(emojiName, messageID) {
	let ret = emojiRoleDict[emojiName];
	console.log("Received " + emojiName + ", returning " + ret);
	return ret;
}

async function handleReactionAdd(messageReaction, user, DiscordBot) {
	if (messageReaction.message.channel.name === "role-assignment") {
		if (messageReaction.emoji.name === "nfW") {
			console.log("Received nfW react");
			//add role emotes
			removeReacts = false;
			for (let i = 0; i < emojiNames.length; i++) {
				console.log("reacting with " + DiscordBot.emojis.find("name", emojiNames[i]) + " emote");
				await messageReaction.message.react(DiscordBot.emojis.find("name", emojiNames[i]));
			}
			await messageReaction.remove(user); //remove the nfW emoji
			removeReacts = true;
		} else if (messageReaction.emoji.name === "nf4notes") {
			console.log("Received nf4notes react");
			//add pronoun emotes
			removeReacts = false;
			console.log("Setting pronoun role reactions");
			await messageReaction.message.react(🇭);
			await messageReaction.message.react(🇸);;
			await messageReaction.message.react(🇹);
			await messageReaction.remove(user); //remove the nf4notes emoji
			removeReacts = true;
		} else {
			console.log("Received something other than nfW or nf4notes");
			let guild = messageReaction.message.member.guild;
			let hasRole = false;
			try {
				hasRole = misc.roleInRoles(emojiToRole(messageReaction.emoji.name, messageReaction.message.id), guild.member(user).roles.array());
			} catch (e) {
				;
			}

			if (!hasRole) {
				console.log("Add role " + emojiToRole(messageReaction.emoji.name, messageReaction.message.id));
				await guild.member(user).addRole(guild.roles.find("name", emojiToRole(messageReaction.emoji.name, messageReaction.message.id)));
			} else {
				console.log("Remove role " + emojiToRole(messageReaction.emoji.name));
				await guild.member(user).removeRole(guild.roles.find("name", emojiToRole(messageReaction.emoji.name, messageReaction.message.id)));
			}

			if (removeReacts)
				await messageReaction.remove(user); //as per desired behavior, remove their reaction after they add it
		}
	}
}

async function handleReactionRemove(messageReaction, user, DiscordBot) {
	return null;
}

module.exports.handleReactionAdd = handleReactionAdd;
module.exports.handleReactionRemove = handleReactionRemove;
