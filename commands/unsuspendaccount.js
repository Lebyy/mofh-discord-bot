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
if (!msg.member.hasPermission("ADMINISTRATOR"))
return msg.channel.send(`**:x: | You don't have enough permissionns to run this command**`);
let prefix = config.prefix;
let username = args[0]
if (!username){
  return msg.channel.send(`**:x: | Please follow this format** **\`${prefix}suspendaccount [username] [reason]\` - Example \`${prefix}unsuspendaccount lebyydev\`**`)
}

    var result = null;
    var res = {};
    try {
        const response = await axios.post('https://panel.myownfreehost.net:2087/xml-api/unsuspendacct.php', querystring.stringify({
            user: username,
        }),
            {
                httpsAgent: httpsAgent,
                auth: {
                    username: process.env.mofh_api_user,
                    password: process.env.mofh_api_key,
                },
            });

        const body = await response.data;
        if (isNullUnd(body)) {
            result = JSON.stringify({ "status": 0, "statusmsg": 'null/undefined response' });
            res = JSON.stringify({
                success: false,
                message: result,
                error: 'null/undefined response',
            });
            console.log(res);
            return res;
        } else {
            var status = 'none';
            var statusmsg = 'none';
            if (isset(() => parseXML(body)['unsuspendacct']['result'][0]['status'][0])) {
                status = parseXML(body)['unsuspendacct']['result'][0]['status'][0];
                if (status === '1') {
                    result = JSON.stringify({ "status": 1 });
                    res = JSON.stringify({
                        success: true,
                        message: result,
                        error: '',
                    });
                    msg.channel.send(`**✅ | I have succesfully unsuspended ${username}**`);
                    return res;
                } else {
                    statusmsg = parseXML(response.data)['unsuspendacct']['result'][0]['statusmsg'][0];
                    result = JSON.stringify({ "status": 0, "statusmsg": statusmsg, });
                    res = JSON.stringify({
                        success: false,
                        message: result,
                        error: statusmsg,
                    });
                    msg.channel.send(`**:x: | ${statusmsg}**`);
                    return res;
                }
            } else {
                result = JSON.stringify({ "status": 0, "statusmsg": body, });
                res = JSON.stringify({
                    success: false,
                    message: result,
                    error: body,
                });
                msg.channel.send(`**:x: | ${body}**`);
                return res;
            }
        }
    } catch (error) {
        console.log(error);
        result = JSON.stringify({ "status": 0, "statusmsg": error, });
        res = JSON.stringify({
            success: false,
            message: result,
            error: error,
        });
        msg.channel.send(`**:x: | ${error}**`);
        return res;
    }
}
