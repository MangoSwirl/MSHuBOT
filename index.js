const { Client, Intents, MessageAttachment } = require('discord.js');
const { token } = require('./secrets.json');

const faq = require('./faq.json');

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag);

    // Create slash commands
    // client.application.commands.create({
    //     name: 'faq',
    //     description: 'Show frequently asked questions',
    //     options: [
    //         {
    //             type: "STRING",
    //             name: "question",
    //             description: "Question"
    //         }
    //     ]
    // })
});

client.on('interactionCreate', (interaction) => {
    // We only want commands.
    if (!interaction.isApplicationCommand()) return;

    const question = interaction.options.get("question", false)

    if (!question) {
        // If there isn't a question, show the full list.
        interaction.reply("**Frequently Asked Questions:**\n" + Object.values(faq).map(question => `**${question.title}** \n${question.message}`).join("\n\n"));
    } else {
        // If there is a question, show the answer.
        const answer = faq[question.value];
        if (!answer) {
            interaction.reply({ content: "I don't have an answer for that question.", ephemeral: true });
            return;
        }

        interaction.reply({ content: `**${answer.title}** \n${answer.message}`, files: answer.image ? [{attachment: answer.image}] : [] });
    }
});

client.login(token);