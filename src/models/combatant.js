var mongoose = require('mongoose');
var Combat = require("../models/combat.js");

var combatantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    combat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combat',
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
    },
    name: {
        type: String,
        required: true,
        default: "Random NPC"
    },
});

var Combatant = mongoose.model('Combatant', combatantSchema);

module.exports = Combatant;