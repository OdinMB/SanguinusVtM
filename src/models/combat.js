var mongoose = require('mongoose');
var Combatant = require("../models/combatant.js");

var combatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    status: {
        type: String,
        enum: ['ONGOING', 'FINISHED'],
        required: true,
        default: 'ONGOING'
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
    state: {
        type: String,
        enum: ['JOINING', 'INI', 'DECLARING', 'ACTIONS'],
        required: true,
        default: 'JOINING'
    },
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

// Prompts the next combatant to declare their action
Combat.promptDeclareAction = async function (message, combat) {
    try {
        // If position is not set: set it to the first combatant to declare actions
        if (combat.iniCurrentPosition < 0) {
            combat.iniCurrentPosition = combat.iniOrder.length - 1;
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

module.exports = Combat;