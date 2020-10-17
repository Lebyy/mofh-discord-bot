exports.run = async(client, msg, args) => {
    msg.channel.send(`Pong! ${client.ws.ping}ms`);
}
