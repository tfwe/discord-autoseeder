const logger = require('../logger');

const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('example')
    .setDescription('Executes an example command')
    .addStringOption(option => 
      option.setName('prompt')
      .setDescription('Enter a prompt')
      .setRequired(true)),
  async execute(interaction) {
    await interaction.channel.sendTyping()
    let prompt = interaction.options.getString('prompt')
    await interaction.reply(`Your prompt was ${prompt}`)
  }
}
