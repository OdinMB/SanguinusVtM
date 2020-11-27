var mongoose = require('mongoose');
var Character = require("../models/character.js");
var Combatant = require("../models/combatant.js");
const Discord = require('discord.js');

var combatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    state: {
        type: String,
        enum: [
            'JOINING',
            'INI',
            'DECLARING',
            'RESOLVING',
            // 'FINISHED'
        ],
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
        iniModifier: {
            type: Number,
            required: true,
            default: 1
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
        embed.setTitle(
            (combat.round > 0 ?
                "Round " + combat.round + " - " :
                "") +
            combat.state
        );
        embed.setColor('#0099ff');

        switch (combat.state) {
            case "JOINING":
                var description = "`" + process.env.PREFIX + "join` to join with your selected character." +
                    "\n`" + process.env.PREFIX + "join [NPC name]` to join with an NPC." +
                    "\n`" + process.env.PREFIX + "round` to start Round 1.";
                break;
            case "INI":
                var description = "Everybody, declare boosts and Celerity actions, then" +
                    "\n`" + process.env.PREFIX + "ini [modifier]` for your selected character or" + 
                    "\n`" + process.env.PREFIX + "ini [modifier] [NPC name]` for your NPCs";
                break;
            case "DECLARING":
                var description = "`" + process.env.PREFIX + "declare [action]`";
                break;
            case "RESOLVING":
                var description = "`" + process.env.PREFIX + "resolve` after you finished your rolls";
                break;
        }

        if (combat.iniOrder.length > 0) {

            var fieldInitiative = "";
            var fieldCharacters = "";
            var fieldActions = "";
            for (const iniEntry of combat.iniOrder) {
                var combatant = await Combatant.findById(iniEntry.combatant)
                    .populate('player', '_id name discordID')
                    .populate('character', '_id generation bp wp willpower health');

                // Mention player whose turn it is
                if (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition) {
                    // description += "\n<@" + combatant.player.discordID + ">, it's your turn with " + combatant.name + ".";
                }

                fieldInitiative +=
                    (fieldInitiative.length > 0 ? "\n" : "") +
                    (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
                    (iniEntry.ini >= 0 ? iniEntry.ini : "/") + "\n" +
                    (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "");
                fieldCharacters +=
                    (fieldCharacters.length > 0 ? "\n" : "") +
                    (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
                    combatant.name + " (" + combatant.player.name + ")" +
                    (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
                    "\n" + (iniEntry.ini === 0 ? "Celerity" :
                        (combatant.character ?
                            Character.getHealthBox(combatant.character.health) +
                            " \u200B " + combatant.character.bp + "/" + Character.getMaxBP(combatant.character.generation) + " BP"
                            // + " \u200B " + combatant.character.wp + "/" + combatant.character.willpower + " WP"
                            : "")
                    );
                fieldActions +=
                    (fieldActions.length > 0 ? "\n" : "") +
                    (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "") +
                    (iniEntry.action ? iniEntry.action : "/") + "\n" +
                    (combat.iniOrder.indexOf(iniEntry) === combat.iniCurrentPosition ? "**" : "");
            }
            embed.addField('Ini', fieldInitiative, true);
            embed.addField('Character', fieldCharacters, true);
            embed.addField('Action', fieldActions, true);
        }

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

        // Clear all Celerity ini entries
        for (var i = combat.iniOrder.length - 1; i >= 0; i--) {
            if (combat.iniOrder[i].ini === 0) {
                combat.iniOrder.splice(i, 1);
            }
        }
        // Set all inis to -1 (unless inis are fixed)
        if (!combat.fixedIni) {
            for (var i = 0; i < combat.iniOrder.length; i++) {
                combat.iniOrder[i].ini = -1;
            }
        }
        // Clear all actions
        for (var i = 0; i < combat.iniOrder.length; i++) {
            combat.iniOrder[i].action = "";
        }

        await combat.save();

        return this.showSummary(message, combat);
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