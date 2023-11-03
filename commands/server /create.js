const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('createchannel')
		.setDescription('Creates a new channel')
		.addStringOption(option =>
			option.setName('channelname')
				.setDescription('Name of the new channel')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('category')
				.setDescription('Name or ID of the category')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const channelName = interaction.options.getString('channelname');
			const categoryName = interaction.options.getString('category');

			// Check if the user has the necessary permissions
			if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
				return await interaction.reply({ content: 'You do not have permission to create channels.', ephemeral: true });
			}

			// Defer the reply to indicate that the command is being processed
			await interaction.deferReply();

			// Try to find the category by its name or ID
			let category = interaction.guild.channels.cache.find(c => c.name === categoryName || c.id === categoryName);

			// If the category is not found, use the category of the current channel
			if (!category || category.type !== 'GUILD_CATEGORY') {
				category = interaction.channel.parent;

				// If the current channel is not under any category, send an error message
				if (!category) {
					return await interaction.reply({ content: `Failed to find category ${categoryName} and the current channel is not under any category!`, ephemeral: true });
				}
			}

			// Create the channel under the specified or current category
			await interaction.guild.channels.create(channelName, { type: 'GUILD_TEXT', parent: category });

			// Send a success message
			await interaction.editReply({ content: `Channel ${channelName} created under category ${category.name}!` });
		}
		catch (error) {
			// Handle the error
			console.log(error);
			await interaction.reply({ content: `Failed to create channel: ${error.message}`, ephemeral: true });
		}
	},
};
