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
let password = args[1]
let email = args[2]
let domain = args[3]
let plan = args[4]
if (!username){
  return msg.channel.send(`**:x: | Please follow this format** **\`${prefix}createaccount [username] [password] [email] [domain] [plan]\` - Example \`${prefix}createaccount lebyydev lebyyiscool lebyy@domain.com lebyy.mydomain.com myplan\`**`)
}
if (!password){
  return msg.channel.send(`**:x: | Please follow this format** **\`${prefix}createaccount [username] [password] [email] [domain] [plan]\` - Example \`${prefix}createaccount lebyydev lebyyiscool lebyy@domain.com lebyy.mydomain.com myplan\`**`)
}
if (!email){
  return msg.channel.send(`**:x: | Please follow this format** **\`${prefix}createaccount [username] [password] [email] [domain] [plan]\` - Example \`${prefix}createaccount lebyydev lebyyiscool lebyy@domain.com lebyy.mydomain.com myplan\`**`)
}
if (!domain){
  return msg.channel.send(`**:x: | Please follow this format** **\`${prefix}createaccount [username] [password] [email] [domain] [plan]\` - Example \`${prefix}createaccount lebyydev lebyyiscool lebyy@domain.com lebyy.mydomain.com myplan\`**`)
}
if (!plan){
  return msg.channel.send(`**:x: | Please follow this format** **\`${prefix}createaccount [username] [password] [email] [domain] [plan]\` - Example \`${prefix}createaccount lebyydev lebyyiscool lebyy@domain.com lebyy.mydomain.com myplan\`**`)
}
    var result = null;
    var res = {};
    try {
        const response = await axios.post('https://panel.myownfreehost.net:2087/xml-api/createacct.php', querystring.stringify({
            username: username,
            password: password,
            contactemail: email,
            domain: domain,
            plan: plan,
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
            result = JSON.stringify({ "status": 0, "statusmsg": 'null/undefined response', "vpusername": 'none', });
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
            var vpusername = 'none';
            if (isset(() => parseXML(body)['createacct']['result'][0]['statusmsg'][0])) {
                statusmsg = parseXML(body)['createacct']['result'][0]['statusmsg'][0];
                if (parseXML(body)['createacct']['result'][0]['status'][0] === '1') {
                    vpusername = parseXML(body)['createacct']['result'][0]['options'][0]['vpusername'][0];
                    status = 1;
                    result = JSON.stringify({ "status": status, "statusmsg": statusmsg, "vpusername": vpusername, });
                    res = JSON.stringify({
                        success: true,
                        message: result,
                        error: '',
                    });
                    msg.channel.send(`**✅ | I have succesfully created an account with the following details - \n Username - ${vpusername} \n Password - ${password} \n Email - ${email} \n Domain - ${domain} \n Plan - ${plan}**`);
                    return res;
                } else {
                    status = 0;
                    result = JSON.stringify({ "status": status, "statusmsg": statusmsg, "vpusername": 'none', });
                    res = JSON.stringify({
                        success: false,
                        message: result,
                        error: statusmsg,
                    });
                    msg.channel.send(`**:x: | ${statusmsg}**`);
                    return res;
                }
            } else {
                result = JSON.stringify({ "status": 0, "statusmsg": body, "vpusername": 'none', });
                res.json({
                    success: false,
                    message: result,
                    error: body,
                });
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
        result = JSON.stringify({ "status": 0, "statusmsg": error, "vpusername": 'none', });
        res = JSON.stringify({
            success: false,
            message: result,
            error: error,
        });
        msg.channel.send(`**:x: | ${error}**`);
        return res;
    }
}
