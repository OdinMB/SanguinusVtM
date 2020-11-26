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
    }],
    // array index for iniOrder objects
    iniCurrentPosition: {
        type: Number,
        required: true,
        default: 1,
    }
});

var Combat = mongoose.model('Combat', combatSchema);

module.exports = Combat;