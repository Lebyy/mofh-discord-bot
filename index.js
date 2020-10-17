/*
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
    OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
*/

var config = require('./config.json');
var Discord = require('discord.js');
var client = new Discord.Client();

client.on('ready', async() => {
    console.log(`${client.user.username} has logged in successfully!`);
});

client.on('message', async(msg) => {
    if(msg.author.bot) return;
    if(!msg.guild) return;

    var prefix = config.prefix;
    if(!msg.content.toLowerCase().startsWith(prefix)) return;

    var args = msg.content.split(' ');
    var cmd = args.shift().slice(prefix.length).toLowerCase();

    try {
        var file = require(`./commands/${cmd}.js`);
        file.run(client, msg, args);
    } catch(err) {
        console.warn(err);
    }
});

client.login(config.token);
