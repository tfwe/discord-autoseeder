const logger = require('../logger');
const { fetchLeagueStandings, fetchLeagueEvents } = require('../startgg.js')
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('league')
    .setDescription('Fetches current league standings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('players')
        .setDescription('Fetches players from the league')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('sets')
        .setDescription('Fetches sets from the league')
    ),
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

    const embed = new EmbedBuilder();
		if (interaction.options.getSubcommand() === 'players') {
      const standings = await fetchLeagueStandings('clash-at-carleton-fall-2023-smash-ultimate-singles', 1, 15)
      embed.setTitle("Clash at Carleton League Standings")
      for (let node of standings.nodes) {
        embed.addFields({
          name: `${node.placement}`,
          value: `${node.entrant.name} (${node.entrant.participants[0].player.id})`,
          inline: true
        })
      } 
    }
    if (interaction.options.getSubcommand() === 'sets') {
      const events = await fetchLeagueEvents('clash-at-carleton-fall-2023-smash-ultimate-singles', 1, 15)
      embed.setTitle("Clash at Carleton League Sets")
      logger.info(events)

    }
    await interaction.reply({
      embeds: [embed],
      components: [row]
    })
  }
}
