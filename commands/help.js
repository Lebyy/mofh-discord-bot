var Discord = require('discord.js');
const config = require('../config.json');
exports.run = async(client, msg, args) => {
let prefix = config.prefix;
let embed = new Discord.MessageEmbed()
.setTitle(`👋 | Here are my commands`)
.setDescription(`**\`${prefix}createaccount [username] [password] [email] [domain] [plan]\` - Create's an account**\n**\`${prefix}getuserdomains [username]\` - Gets a list of the specified user's domains**\n**\`${prefix}getavailability [domain]\` - Gets the availability of the specified domain**\n**\`${prefix}resetpassword [username] [newpassword]\` - Reset's the specified User's Password**\n**\`${prefix}suspendaccount [username] [reason]\` - Suspends the specified users Account**\n**\`${prefix}unsuspendaccount [username]\` - Unsuspends the specified users Account**`)
.setFooter(`${client.user.username} | 2020 (C) | Made by Lebyy_Dev#0899`)
.setTimestamp()
.setColor(`#44a6e3`)
msg.channel.send(embed)
}