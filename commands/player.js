const logger = require('../logger');
const { fetchPlayerSets } = require('../startgg.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('player')
    .setDescription('Fetches specified player standings')
    .addStringOption(option => 
      option.setName('player')
      .setRequired(true)
      .setDescription('Player ID')),
  async execute(interaction) {
    const player = interaction.options.getString('player')
    let prompt = interaction.options.getString('prompt')
    const sets = await fetchPlayerSets(player, 1, 200)
    const embed = new EmbedBuilder()
      .setTitle(`Player Sets`)
    for (let node of sets.nodes) {
      if (!node.event.name.includes('Ultimate Singles')) {
        continue
      }
      logger.info(node)
      embed.addFields({
        name: `${node.event.tournament.name}`,
        value: `${node.displayScore}`,
        inline: true
      })
    } 
    await interaction.reply({embeds: [embed]})
  }
}
