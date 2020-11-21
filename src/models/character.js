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
var msgGT5 = "Even being virtuous has limits. 5 to be exact.";

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

    clan: {
        type: String,
    },
    nature: {
        type: String,
    },
    demeanor: {
        type: String,
    },

    generation: {
        type: Number,
        required: true,
        default: 13,
        min: [8, "I get the idea: if you can't defeat them, join them."],
        max: [15, "Generation 15 should be thin enough."],
    },
    willpower: {
        type: Number,
        required: true,
        default: 1,
        min: [1, "You maximum WP can't be lower than 1."],
        max: [10, "Your maximum WP can't be greater than 10."],
    },
    coderating: {
        type: Number,
        required: true,
        default: 5,
        min: [1, "Humanity/Path rating of 0 means that your character is unplayable."],
        max: [10, "Your Humanity/Path cannot go higher than 10."],
    },
    code: {
        type: String,
        required: true,
        default: "Humanity",
    },

    bp: {
        type: Number,
        required: true,
        default: 10,
        min: [0, "You can't go below 0 BP."],
        max: [20, "You can't go above 20 BP. Actually you can, but you need to track that outside of the bot."],
    },
    wp: {
        type: Number,
        required: true,
        default: 1,
        min: [0, "You WP can't be negative."],
        max: [10, "Your WP can't be greater than 10."],
    },
    xptotal: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "You total XP can't be negative."],
    },
    xp: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "You unspent XP can't be negative."],
    },
    health: {
        type: String,
        default: "",
        maxlength: 7,
    },

    /*specialties: {
        type: Map,
        of: String
    },*/

    // Virtues
    callousness: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [5, msgGT5],
    },
    instinct: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [5, msgGT5],
    },
    morale: {
        type: Number,
        required: true,
        default: 1,
        min: [0, msgLT0],
        max: [5, msgGT5],
    },

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

/*
 * health: old health string
 * amount: # of damage
 * type: 1 = bashing, 2 = lethal, 3 = agg
 * Returns [string new health, bool final death?]
 */
Character.takeDamage = function (health, amount, type) {
    var healthArr = health.split("");
    for (i = 1; i <= amount; i++) {
        // Incapacitated + new damage = final death
        if (healthArr[6] && parseInt(healthArr[6]) > 1) {
            return [healthArr.join(""), true];
        }
        // Damage slots open?
        if (healthArr.length < 7) {
            healthArr.push("" + type);
            healthArr.sort(function (a, b) { return b - a });
        } // If not, upgrade damage
        else {
            // Bashing: upgrade existing bashing
            if (type === 1) {
                // If last health box is already lethal+, nothing happens.
                // Except final death, of course.
                if (parseInt(healthArr[6]) === 1) {
                    healthArr[6] = "" + (parseInt(healthArr[6]) + 1);
                    healthArr.sort(function (a, b) { return b - a });
                }
            } // Lethal + Agg: add, sort, then delete the last element
            else {
                healthArr.push("" + type);
                healthArr.sort(function (a, b) { return b - a });
                healthArr.splice(-1, 1);
            }
        }
        console.log(healthArr);
    }
    return [healthArr.join(""), false];
}

/*
 * health: old health string
 * amount: # of damage
 * type: 1 = bashing, 2 = lethal, 3 = agg
 * Returns [string new health, int amount healed]
 */
Character.healDamage = function (health, amount, type) {
    var healthArr = health.split("");
    var amountHealed = 0;
    for (i = 1; i <= amount; i++) {
        var index = healthArr.indexOf("" + type);
        if (index > -1) {
            healthArr.splice(index, 1);
            amountHealed++;
        }
    }
    return [healthArr.join(""), amountHealed];
}

Character.getHealthBox = function (health) {
    healthArr = health.split("");
    var str = "";
    for (i = 0; i <= 6; i++) {
        if (health[i]) {
            if (health[i] == 1) {
                str += "/";
            } else if (health[i] == 2) {
                str += "X";
            } else {
                str += "\u2731";
            }
        } else {
            str += "\u23FB";
        }
    }
    return str;
}

Character.getHealthStatus = function (health) {
    switch (health.length) {
        case 0: return "Healthy";
        case 1: return "Bruised";
        case 2: return "Hurt (-1)";
        case 3: return "Injured (-1)";
        case 4: return "Wounded (-2)";
        case 5: return "Mauled (-2)";
        case 6: return "Crippled (-5)";
        case 7: return "Incapacitated";
    }
}

Character.getDamagePenalty = function (health) {
    switch (health.length) {
        case 0: return 0;
        case 1: return 0;
        case 2: return 1;
        case 3: return 1;
        case 4: return 2;
        case 5: return 2;
        case 6: return 5;
        case 7: return 20;
    }
}

Character.isDead = function (health) {
    healthArr = health.split("");
    // Yes if all health boxes are filled with at least lethal
    return (health[6] >= 2);
}

Character.isEditable = function (key) {
    return [
        'clan', 'nature', 'demeanor', 'code',
        'generation', 'coderating', 'willpower',
        'callousness', 'instinct', 'morale',
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
        case "cla": return "clan";
        case "nat": return "nature";
        case "dem": return "demeanor";
        case "cod": return "code";

        case "gen": return "generation";
        case "pat":
        case "path":
        case "hum":
        case "humanity":
            return "coderating";
        case "wp":
        case "wil":
        case "will":
            return "willpower";

        case "cal":
        case "call":
            return "callousness";
        case "ins": return "instinct";
        case "mor":
        case "morale":
            return "morale";

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
    } else if (stat === "coderating") {
        stat = "Humanity/Path";
    }
    return stat.charAt(0).toUpperCase() + stat.slice(1);
}

Character.getMaxBP = function (generation) {
    switch (generation) {
        case 15:
        case 14:
        case 13:
            return 10;
        case 12: return 11;
        case 11: return 12;
        case 10: return 13;
        case 9: return 14;
        case 8: return 15;
        default: return false;
    }
}

Character.getMaxBPPerTurn = function (generation) {
    switch (generation) {
        case 15:
        case 14:
        case 13:
        case 12:
        case 11:
        case 10:
            return 1;
        case 9: return 2;
        case 8: return 3;
        default: return false;
    }
}

module.exports = Character;
