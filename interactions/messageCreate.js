const logger = require('../logger');
const CLIENT_ID = process.env.CLIENT_ID
module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Check if the bot has been mentioned
    if (!message.mentions.has(CLIENT_ID)) return;
      await message.channel.sendTyping()
      await message.reply("Test message")
  }
}
