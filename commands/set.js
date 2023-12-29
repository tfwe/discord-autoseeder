const logger = require('../logger');
const { fetchSetData } = require('../startgg.js')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Fetches specified set data')
    .addStringOption(option => 
      option.setName('set')
      .setRequired(true)
      .setDescription('Set ID')),
  async execute(interaction) {
    const setId = interaction.options.getString('set')
    const set = await fetchSetData(setId)
    const embed = new EmbedBuilder()
      .setTitle(`${set.event.tournament.name}`)
      .setDescription(`${set.event.name} (Round ${set.round})`)
    logger.info(set)
    for (let slot of set.slots) {
      embed.addFields({
        name: `${slot.entrant.name}`,
        value: `Player ID: ${slot.entrant.id}`,
        inline: true
      })
    }
    embed.addFields({
      name: `Score`,
      value: `${set.displayScore}`,
      inline: false
    })
    await interaction.reply({embeds: [embed]})
  }
}
