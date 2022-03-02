const { Client, Intents, MessageAttachment } = require('discord.js');
const { token } = require('./secrets.json');

const faq = require('./faq.json');

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', async () => {
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

    // const originalCommand = await (await client.application.commands.fetch()).first()

    // client.application.commands.edit(originalCommand, {
    //     options: [
    //         {
    //             type: "STRING",
    //             name: "question",
    //             description: "Question",
    //             required: false,
    //             autocomplete: true
    //         }
    //     ]
    // })
});

client.on('interactionCreate', (interaction) => {
    if (interaction.isAutocomplete()) {
        switch (interaction.commandName) {
            case 'faq':
                const value = interaction.options.get("question").value;

                let filteredOptions;
                if (!value || value.length === 0) {
                    filteredOptions = Object.keys(faq)
                } else {
                    filteredOptions = Object.keys(faq).filter(key => key.toLowerCase().startsWith(value.toLowerCase()))
                }

                // Trim to 25 items
                if (filteredOptions.length > 25) {
                    filteredOptions = filteredOptions.slice(0, 25);
                }

                interaction.respond(filteredOptions.map(option => ({ name: option, value: option })));
        }
    }


    // We only want commands.
    if (!interaction.isApplicationCommand()) return;

    switch (interaction.commandName) {
        case 'faq':
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
            break;
    }
});

client.login(token);