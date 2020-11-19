const Discord = require('discord.js');
var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 15],
        message: 'This is the shorthand name for your character that can be used in SanguinusVtM bot commands. It should not have more than 15 letters. Characters can also have a full name that can be much longer.',
    }),
    validate({
        validator: 'isAlphanumeric',
        passIfEmpty: true,
        message: "Your character's name should contain alpha-numeric characters only.",
    }),
];

var URLValidator = [
    validate({
        validator: 'isURL',
        passIfEmpty: true,
        message: "Invalid URL.",
    }),
];

var msgLT0 = "You might be bad at this, but you can't be worse than 0.";
var msgGT10 = "We all want to be close to Caine. Alas, in this game, we can't have abilities greater than 10.";

// Mongoose Model
var characterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: nameValidator,
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'retired', 'dead'],
        default: 'active',
        required: true
    },

    // Profile
    fullname: {
        type: String,
        maxlength: [40, 'Even the full name should not be longer than 40 letters.'],
    },
    description: {
        type: String,
        maxlength: [1000, 'The description should not have more than 1000 letters.'],
    },
    rpstyle: {
        type: String,
        maxlength: [150, 'The RP style description should not have more than 150 letters.'],
    },
    thumbnailURL: {
        type: String,
        validate: URLValidator,
    },
    imageURL: {
        type: String,
        validate: URLValidator,
    },
    URL: {
        type: String,
        validate: URLValidator,
    },

    /*specialties: {
        type: Map,
        of: String
    },*/

    // Attributes
    strength: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    dexterity: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    stamina: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    charisma: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    manipulation: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    appearance: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    perception: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    intelligence: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    wits: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },

    // Abilities
    alertness: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    athletics: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    awareness: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    brawl: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    empathy: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    expression: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    intimidation: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    leadership: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    streetwise: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    subterfuge: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    animalken: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    crafts: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    drive: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    etiquette: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    firearms: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    larceny: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    melee: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    performance: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    stealth: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    survival: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    academics: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    computers: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    finance: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    investigation: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    law: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    medicine: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    occult: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    politics: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    science: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
    technology: {
        type: Number,
        required: true,
        default: 0,
        min: [0, msgLT0],
        max: [10, msgGT10],
    },
});
var Character = mongoose.model('Character', characterSchema);

Character.isEditable = function (key) {
    return [
        'strength', 'dexterity', 'stamina',
        'charisma', 'manipulation', 'appearance',
        'perception', 'intelligence', 'wits',
        'alertness', 'athletics', 'awareness', 'brawl', 'empathy', 'expression', 'intimidation', 'leadership', 'streetwise', 'subterfuge',
        'animalken', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival',
        'academics', 'computers', 'finance', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science', 'technology',
    ].includes(key);
};

Character.isKnowledge = function (key) {
    return ['academics', 'computers', 'finance', 'investigation', 'law', 'medicine', 'occult', 'politics', 'science', 'technology']
        .includes(key);
}
Character.isSkill = function (key) {
    return ['animalken', 'crafts', 'drive', 'etiquette', 'firearms', 'larceny', 'melee', 'performance', 'stealth', 'survival',]
        .includes(key);
}
Character.shorthand = function (key) {
    switch (key) {
        case "str": return "strength";
        case "dex": return "dexterity";
        case "sta": return "stamina";
        case "cha": return "charisma";
        case "man":
        case "manip": return "manipulation";
        case "app": return "appearance";
        case "per":
        case "perc": return "perception";
        case "int": return "intelligence";
        case "wit": return "wits";

        case "ale": return "alertness";
        case "ath": return "athletics";
        case "awa":
        case "aware": return "awareness";
        case "bra": return "brawl";
        case "emp": return "empathy";
        case "exp": return "expression";
        case "intim": return "intimidation";
        case "lea":
        case "lead": return "leadership";
        case "street": return "streetwise";
        case "sub": return "subterfuge";

        case "ani":
        case "animal": return "animalken";
        case "cra":
        case "craft":
            return "crafts";
        case "dri": return "drive";
        case "eti": return "etiquette";
        case "fir":
        case "fire": return "firearms";
        case "lar": return "larceny";
        case "mel": return "melee";
        case "perf":
        case "perform": return "performance";
        case "ste": return "stealth";
        case "sur": return "survival";

        case "aca": return "academics";
        case "com":
        case "comp": return "computers";
        case "fin": return "finance";
        case "inv": return "investigation";
        case "med": return "medicine";
        case "occ": return "occult";
        case "pol": return "politics";
        case "sci": return "science";
        case "tec":
        case "tech": return "technology";

        default: return key;
    }
}

Character.readable = function (stat) {
    stat = Character.shorthand(stat);
    if (stat === "animalken") {
        stat = "animal Ken";
    }
    return stat.charAt(0).toUpperCase() + stat.slice(1);
}

module.exports = Character;
