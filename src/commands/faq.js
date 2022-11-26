export default function faq(interaction, embed) {
    var channel = '<#' + randoInfoId + '>';

    embed.setTitle('To get started with the randomizer, please read our FAQ and startup guide.');
    embed.setDescription('You can find them in ' + channel + ".");
    embed.setColor(0xffad21);

    interaction.reply({ embeds: [embed] });
}