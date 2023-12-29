const logger = require('../logger');
const { fetchPlayerData } = require('../startgg.js')
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('player')
    .setDescription('Fetches specified player data')
    .addStringOption(option => 
      option.setName('player')
      .setRequired(true)
      .setDescription('Player ID')),
  async execute(interaction) {
    const nextPageButton = new ButtonBuilder()
			.setCustomId('next')
			.setLabel('Next Page')			
      .setStyle(ButtonStyle.Secondary);

		const prevPageButton = new ButtonBuilder()
			.setCustomId('prev')
			.setLabel('Previous Page')			
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder()
			.addComponents(nextPageButton, prevPageButton);

    const playerId = interaction.options.getString('player')
    const player = await fetchPlayerData(playerId)
    const embed = new EmbedBuilder()
      .setTitle(`${player.prefix} | ${player.gamerTag}`)
    for (let node of player.sets.nodes) {
      if (!node.event.name.includes('Ultimate Singles') || node.event.name.includes('Ladder') || node.event.name.includes('Crew Battle')) {
        continue
      }
      logger.info(node)
      embed.addFields({
        name: `${node.event.tournament.name}`,
        value: `${node.displayScore}`,
        inline: true
      })
    } 
    await interaction.reply({
      embeds: [embed],
      components: [row]
    })
  }
}
