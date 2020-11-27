var mongoose = require('mongoose');
var Combatant = require("../models/combatant.js");
const Discord = require('discord.js');

var combatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    state: {
        type: String,
        enum: ['JOINING', 'INI', 'DECLARING', 'RESOLVING', 'FINISHED'],
        required: true,
        default: 'JOINING'
    },
    channelDiscordID: {
        type: String,
        required: true,
    },
    nofifications: {
        type: Boolean,
        required: true,
        default: true
    },
    fixedIni: {
        type: Boolean,
        required: true,
        default: false
    },
    iniOrder: [{
        ini: {
            type: Number,
            required: true,
            default: -1
        },
        combatant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Combatant'
        },
        action: {
            type: String,
        }
    }],

    // array index for iniOrder objects
    // -1 => not yet declaring / resolving actions
    iniCurrentPosition: {
        type: Number,
        required: true,
        default: -1,
    },
    round: {
        type: Number,
        required: true,
        default: 0
    }
});

var Combat = mongoose.model('Combat', combatSchema);

Combat.showSummary = async function (message, combat) {
    try {
        const embed = new Discord.MessageEmbed();
        embed.setTitle("Round " + combat.round + " - " + combat.state);
        embed.setColor('#0099ff');

        switch (combat.state) {
            case "JOINING":
                var description = "`" + process.env.PREFIX + "join [(opt) NPC name]`";
                break;
            case "INI":
                var description = "`" + process.env.PREFIX + "ini [modifier] [(opt) NPC name]`";
                break;
            case "DECLARING":
                var description = "`" + process.env.PREFIX + "declare [action]`";
                break;
            case "RESOLVING":
                var description = "`" + process.env.PREFIX + "resolve` after you finished your rolls";
                break;
        }

        var fieldInitiative = "";
        var fieldCharacters = "";
        var fieldActions = "";
        for (const iniEntry of combat.iniOrder) {
            var combatant = await Combatant.findById(iniEntry.combatant).populate('player', '_id name discordID');

            // Mention player whose turn it is
            if (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition) {
                description += "\n<@" + combatant.player.discordID + ">, it's your turn with " + combatant.name + ".";
            }

            fieldInitiative +=
                (fieldInitiative.length > 0 ? "\n" : "") +
                (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
                (iniEntry.ini > 0 ? iniEntry.ini : "/") +
                (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "");
            fieldCharacters +=
                (fieldCharacters.length > 0 ? "\n" : "") +
                (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
                combatant.name + " (" + combatant.player.name + ")" +
                (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "");
            fieldActions +=
                (fieldActions.length > 0 ? "\n" : "") +
                (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
                (iniEntry.action ? iniEntry.action : "/") +
                (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "");
        }
        embed.addField('Ini', fieldInitiative, true);
        embed.addField('Character', fieldCharacters, true);
        embed.addField('Action', fieldActions, true);

        embed.setDescription(description);

        return message.channel.send(embed);

    } catch (err) {
        console.log(err);
        return message.channel.send(err.message);
    }
}

Combat.startNewRound = async function (message, combat) {
    try {
        combat.state = "INI";
        combat.iniCurrentPosition = -1;
        combat.round++;
        // Set all inis to -1 (unless inis are fixed)
        if (!combat.fixedIni) {
            for (var i = 0; i < combat.iniOrder.length; i++) {
                combat.iniOrder[i].ini = -1;
                combat.iniOrder[i].action = "";
            }
        }
        await combat.save();

        return this.showSummary(message, combat);
        /*
        message.channel.send(
            "**ROUND " + combat.round + "**" +
            (combat.fixedIni ? "" : "\nEverybody, roll `" + process.env.PREFIX + "ini [modifier]`!")
        );
        */
    } catch (err) {
        console.log(err);
        return message.channel.send(err.message);
    }
}

// Prompts the next combatant to declare their action
Combat.promptDeclareAction = async function (message, combat) {
    try {
        if (combat.state !== "DECLARING") {
            return message.channel.send("This combat is not in its declaration phase. This shouldn't happen. Please report.");
        }

        combatantToPing = await Combatant.findById(
            combat.iniOrder[combat.iniCurrentPosition].combatant
        ).populate('player', '_id name discordID');

        var msg = "<@" + combatantToPing.player.discordID + ">, " +
            "please `" + process.env.PREFIX + "declare [action]` " +
            "for **" + combatantToPing.name + "**.";

        if (combat.iniCurrentPosition > 0) {
            combatantToPing = await Combatant.findById(
                combat.iniOrder[combat.iniCurrentPosition - 1].combatant
            ).populate('player', '_id name discordID');

            msg += "\n(<@" + combatantToPing.player.discordID + "> stand by. " + combatantToPing.name + " is next.)";
        }

        return message.channel.send(msg);
    } catch (err) {
		console.log(err);
        return message.channel.send(err.message);
    }
}

// Prompts the next combatant to resolve their action
Combat.promptResolveAction = async function (message, combat) {
    try {
        if (combat.state !== "RESOLVING") {
            return message.channel.send("This combat is not in its RESOLVING phase. This shouldn't happen. Please report.");
        }

        combatantToPing = await Combatant.findById(
            combat.iniOrder[combat.iniCurrentPosition].combatant
        ).populate('player', '_id name discordID');

        var msg = "<@" + combatantToPing.player.discordID + ">" +
            ", `" + process.env.PREFIX + "roll` for **" + combatantToPing.name + "**'s action" +
            " ('" + combat.iniOrder[combat.iniCurrentPosition].action + "'), " +
            "then `" + process.env.PREFIX + "resolve`.";

        if (combat.iniOrder[combat.iniCurrentPosition + 1] &&
            combat.iniOrder[combat.iniCurrentPosition + 1].ini > 0) {

            combatantToPing = await Combatant.findById(
                combat.iniOrder[combat.iniCurrentPosition+1].combatant
            ).populate('player', '_id name discordID');

            msg += "\n(<@" + combatantToPing.player.discordID + ">, prepare your roll. " + combatantToPing.name + " is next.)";
        }

        return message.channel.send(msg);
    } catch (err) {
        console.log(err);
        return message.channel.send(err.message);
    }
}

module.exports = Combat;