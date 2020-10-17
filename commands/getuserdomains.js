var Discord = require('discord.js');
const config = require('../config.json');
const dotenv = require('dotenv').config();
if (dotenv.error) {
    throw dotenv.error;
}

//Plan to make it more secure in the future, might be a problem on mofh's end though
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const axios = require('axios');
const querystring = require('querystring');
const parseXMLFunc = require('xml2js').parseString;
function parseXML(xml) {
    var res = '';
    parseXMLFunc(xml, function (err, result) {
        res = result;
    });
    return res;
}
function isNullUnd(data) {
    var res;
    if (data == null || data == undefined) {
        res = true;
    } else {
        res = false;
    }
    return res;
}
function isset(accessor) {
    try {
        // Note we're seeing if the returned value of our function is not
        // undefined
        return typeof accessor() !== 'undefined'
    } catch (e) {
        // And we're able to catch the Error it would normally throw for
        // referencing a property of undefined
        return false
    }
}
exports.run = async(client, msg, args) => {
let prefix = config.prefix;
let username = args[0]
if (!username){
  return msg.channel.send(`**:x: | Please follow this format** **\`${prefix}getuserdomains [username]\` - Example \`${prefix}getuserdomains lebyydev\`**`)
}


    var list = [];
    var res = {};
    try {
        const response = await axios.post('https://panel.myownfreehost.net:2087/xml-api/getuserdomains.php', querystring.stringify({
            api_user: process.env.mofh_api_user,
            api_key: process.env.mofh_api_key,
            username: username,
        }), {
                httpsAgent: httpsAgent,
            });

        const body = await response.data;
        if (isNullUnd(body)) {
            res = JSON.stringify({
                success: false,
                message: [],
                error: 'null/undefined response',
            });
            msg.channel.send(res);
            return res;
        } else {
            if (!((body).includes("ERROR"))) {
                list = body;
                res = JSON.stringify({
                    success: true,
                    message: list,
                    error: '',
                });
                console.log(res);
                msg.channel.send(`**${list}**`);
                return res;
            } else {
                list = [];
                res = JSON.stringify({
                    success: false,
                    message: list,
                    error: body,
                });
                msg.channel.send(`**:x: | ${body}**`);
                return res;
            }
        }
    } catch (error) {
        msg.channel.send(error);
        res = JSON.stringify({
            success: false,
            message: [],
            error: error,
        });
        msg.channel.send(`**:x: | ${error}**`);
        return res;
    }
}