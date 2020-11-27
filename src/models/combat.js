var mongoose = require('mongoose');
var Combatant = require("../models/combatant.js");

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

Combat.startNewRound = async function (message, combat) {
    try {
        combat.state = "INI";
        combat.iniCurrentPosition = -1;
        combat.round++;
        // Set all inis to -1 (unless inis are fixed)
        if (!combat.fixedIni) {
            for (var i = 0; i < combat.iniOrder.length; i++) {
                combat.iniOrder[i].ini = -1;
            }
        }
        await combat.save();

        return message.channel.send(
            "ROUND " + combat.round +
            (combat.fixedIni ? "" : "\nRoll inis!")
        );
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

        return message.channel.send(combatantToPing.player.name + ", please declare " + combatantToPing.name + "'s action.");
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

        return message.channel.send(combatantToPing.player.name +
            ", please resolve " + combatantToPing.name + "'s action: " +
            "'" + combat.iniOrder[combat.iniCurrentPosition].action + "'.");
    } catch (err) {
        console.log(err);
        return message.channel.send(err.message);
    }
}

module.exports = Combat;