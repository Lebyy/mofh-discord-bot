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
if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(`**:x: | You don't have enough permissionns to run this command**`)
let prefix = config.prefix;
let username = args[0]
let password = args[1]
if (!username || !password){
  return msg.channel.send(`**:x: | Please follow this format** **\`${prefix}resetpassword [username] [newpassword]\` - Example \`${prefix}resetpassword lebyydev lebyyiscool\`**`)
}
    var result = null;
    var res = {};
    try {
        const response = await axios.post('https://panel.myownfreehost.net:2087/xml-api/passwd.php', querystring.stringify({
            user: username,
            pass: password,
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
            var status = 0;
            var statusmsg = 'none';
            /**
                * Get the status of the account if the account is not active.
                *
                * The result will contain one of the following chars:
                * - x: suspended
                * - r: reactivating
                * - c: closing
                * ``` */
            if (isset(() => parseXML(body)['passwd']['passwd'][0]['statusmsg'][0])) {
                statusmsg = parseXML(body)['passwd']['passwd'][0]['statusmsg'][0];
                if ((statusmsg).includes("This account currently not active, the account must be active to change the password")) {
                    result = JSON.stringify({ "status": 0, "statusmsg": statusmsg, });
                    res = JSON.stringify({
                        success: false,
                        message: result,
                        error: 'null/undefined response',
                    });
                    console.log(res);
                    return res;
                } else if ((statusmsg).includes("An error occured changing this password.")) {
                    //The password is identical (which is technically identical to be being changed successfully)
                    result = JSON.stringify({ "status": 1, "statusmsg": 'Success', });
                    res = JSON.stringify({
                        success: true,
                        message: result,
                        error: '',
                    });
                    msg.channel.send(`**:x: | The password is identical to the current password - ${result}**`);
                    return res;
                } else if (parseXML(body)['passwd']['passwd'][0]['status'][0] === '1') {
                    status = 1;
                    result = JSON.stringify({ "status": status, "statusmsg": 'Success', });
                    res = JSON.stringify({
                        success: true,
                        message: result,
                        error: '',
                    });
                    msg.channel.send(`**✅ | I have succesfully changed the password for ${username} to ${password}**`);
                    return res;
                } else {
                    status = 0;
                    result = JSON.stringify({ "status": status, "statusmsg": statusmsg, });
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
