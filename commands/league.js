const logger = require('../logger');
const { fetchLeagueStandings } = require('../startgg.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('league')
    .setDescription('Fetches current league standings'),
  async execute(interaction) {
    let prompt = interaction.options.getString('prompt')
    const standings = await fetchLeagueStandings('clash-at-carleton-fall-2023-smash-ultimate-singles', 1, 15)
    const embed = new EmbedBuilder()
      .setTitle("Clash at Carleton League Standings")
    for (let node of standings.nodes) {
      embed.addFields({
        name: `${node.placement}`,
        value: `${node.entrant.name}`,
        inline: true
      })
    } 
    await interaction.reply({embeds: [embed]})
  }
}
