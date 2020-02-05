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
	"BACO": "LFG General",
	"DoubleDeckerTaco": "LFG Raids",
	"BeanBurrito": "LFG PVP",
	"Titan": "Titan Main",
	"Warlock": "Warlock Main",
	"Hunter": "Hunter Main",
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
	if (messageReaction.message.channel.name === "rules-and-links") {
		if (messageReaction.emoji.name === "Tricorn") {
			console.log("Received Tricorn react");
			//add role emotes
			removeReacts = false;
			for (let i = 0; i < emojiNames.length; i++) {
				console.log("reacting with " + DiscordBot.emojis.find("name", emojiNames[i]) + " emote");
				await messageReaction.message.react(DiscordBot.emojis.find("name", emojiNames[i]));
			}
			await messageReaction.remove(user); //remove the Tricorn emoji
			removeReacts = true;
		} else if (messageReaction.emoji.name === "Dorito") {
			console.log("Received Dorito react");
			//add pronoun emotes
			removeReacts = false;
			console.log("Setting pronoun role reactions");
			await messageReaction.message.react("🇭");
			await messageReaction.message.react("🇸");
			await messageReaction.message.react("🇹");
			await messageReaction.remove(user); //remove the Dorito emoji
			removeReacts = true;
		} else {
			console.log("Received something other than Tricorn or Dorito");
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
