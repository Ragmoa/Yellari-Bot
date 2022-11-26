export default function faq(interaction, embed) {
    embed.setTitle('To get started with the randomizer, please read our FAQ and startup guide.');
    embed.setDescription(`You can find them in <#${chaprocess.env.RANDO_INFO_CHANNEL_IDnnel}>.`);
    embed.setColor(0xffad21);

    interaction.reply({ embeds: [embed] });
}