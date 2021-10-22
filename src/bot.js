require("dotenv").config();

const { Client, Intents, WebhookClient, MessageEmbed } = require("discord.js");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    partials: ["MESSAGE", "REACTION"],
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
);

const PREFIX = "$";

client.on("ready", () => {
    console.log(`${client.user.tag} is ready!`);
});

// discord commands

client.on("message", async (message) => {
    if (message.author.bot) return;
    // console.log(`Hi ${message.author.tag}!!`);

    if (message.content === "hello chizuru") {
        message.reply(`Hi!!`);
    }

    if (message.content === "who are you chizuru") {
        message.reply(`I am a bot`);
    }

    if (message.content === "how are you chizuru?") {
        message.channel.send(`I'm good ${message.author}`);
    }

    // commands
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        if (CMD_NAME === "kick") {
            if (!message.member.hasPermission("KICK_MEMBERS"))
                return message.reply(
                    "You do not have permissions to use that command"
                );
            if (args.length === 0) return message.reply("Please provide an ID");
            const member = message.guild.members.cache.get(args[0]);
            if (member) {
                member
                    .kick()
                    .then((member) =>
                        message.channel.send(`${member} was kicked.`)
                    )
                    .catch((err) =>
                        message.channel.send("I cannot kick that user :(")
                    );
            } else {
                message.channel.send("That member was not found");
            }
        } else if (CMD_NAME === "ban") {
            if (!message.member.hasPermission("BAN_MEMBERS"))
                return message.reply(
                    "You do not have permissions to use that command"
                );
            if (args.length === 0) return message.reply("Please provide an ID");
            try {
                const user = await message.guild.members.ban(args[0]);
                message.channel.send("User was banned successfully");
            } catch (err) {
                console.log(err);
                message.channel.send(
                    "An error occured. Either I do not have permissions or the user was not found"
                );
            }
        } else if (CMD_NAME === "news") {
            console.log(args);
            const msg = args.join(" ");
            console.log(msg);
            webhookClient.send(msg);
        } else if (CMD_NAME === "clear") {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.reply(
                    "You do not have permissions to use that command"
                );
            }
            try {
                message.channel.messages.fetch().then((results) => {
                    message.channel.bulkDelete(results);
                });
            } catch (err) {
                console.log(err);
                message.channel.send(
                    "An error occured. Either I do not have permissions or the user was not found"
                );
            }
        } else if (CMD_NAME === "poll") {
            let pollChannel = message.mentions.channels.first();
            let pollDescription = args.slice(1).join(" ");

            let embedPoll = new MessageEmbed()
                .setTitle("😲 New Poll! 😲")
                .setDescription(pollDescription)
                .setColor("YELLOW");
            let msgEmbed = await pollChannel.send(embedPoll);
            await msgEmbed.react("👍");
            await msgEmbed.react("👎");
        }
    }
});

// Reaction roles

client.on("messageReactionAdd", (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    const ID = "877412764551872532";
    if (reaction.message.id === "877412764551872532") {
        switch (name) {
            case "🕸️":
                member.roles.add("877407987701022731");
                break;
            case "🤖":
                member.roles.add("877408041862041610");
                break;
            case "☁️":
                member.roles.add("877408114658402304");
                break;
        }
    }
});

client.on("messageReactionRemove", (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    const ID = "877412764551872532";
    if (reaction.message.id === "877412764551872532") {
        switch (name) {
            case "🕸️":
                member.roles.remove("877407987701022731");
                break;
            case "🤖":
                member.roles.remove("877408041862041610");
                break;
            case "☁️":
                member.roles.remove("877408114658402304");
                break;
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
