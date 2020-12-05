var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
    paused: {
        type: Boolean,
        required: true,
        default: false
    },
    channelDiscordID: {
        type: String,
        required: true,
    },

    expirationTime: {
        type: Number,
    },
    timerMessageDiscordID: {
        type: String,
    },
    timeoutJoin: {
        type: Number,
        required: true,
        default: 0
    },
    timeoutIni: {
        type: Number,
        required: true,
        default: 0
    },
    timeoutDeclare: {
        type: Number,
        required: true,
        default: 0
    },
    timeoutResolve: {
        type: Number,
        required: true,
        default: 0
    },
    fixedIni: {
        type: Boolean,
        required: true,
        default: false
    },

    iniOrder: {
        type: Schema.Types.Mixed,
    },

    /*
    // Intended structure:
    // celerity rounds, 0 = main combat round
    iniOrder: [
        // each round = set of iniEntries
        [
            {
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
            }
        ]
    ],
    */

    // array index for iniOrder objects
    // -1 => not yet declaring / resolving actions
    iniCurrentPosition: {
        type: Number,
        required: true,
        default: -1,
    },
    // array index for iniOrder objects
    // 0 => normal inis, before celerity rounds
    iniCurrentCelerityPosition: {
        type: Number,
        required: true,
        default: 0,
    },
    round: {
        type: Number,
        required: true,
        default: 0
    }
});

var Combat = mongoose.model('Combat', combatSchema);

/*
 * Compare the old combat object with the current one
 * If nothing has changed, Combat.continue
 */
Combat.timer = async function (message, combatOld) {
    try {
        // Find current combat state
        var combatCurrent = await Combat.findById(combatOld._id);
        if (!combatCurrent) return;

        if (combatCurrent.round === combatOld.round &&
            combatCurrent.state === combatOld.state &&
            combatCurrent.iniCurrentCelerityPosition === combatOld.iniCurrentCelerityPosition &&
            combatCurrent.iniCurrentPosition === combatOld.iniCurrentPosition) {

            return Combat.continue(message, combatCurrent);
        }
    } catch (err) {
        return console.log("Combat.timer: " + err);
    }
}

Combat.showSummary = async function (message, combat) {
    try {
        const embed = new Discord.MessageEmbed();
        embed.setTitle(
            (combat.round > 0 ? "Round " + combat.round + " - " : "") +
            (combat.iniCurrentCelerityPosition > 0 ? " Celerity Round " + combat.iniCurrentCelerityPosition + " - " : "") +
            combat.state +
            (combat.paused ? " - " + "PAUSED" : "")
        );
        embed.setColor('#0099ff');

        if (combat.timer) {
            const now = Date.now() / 1000;
            const timeLeft = combat.timer - now;
        }

        switch (combat.state) {
            case "JOINING":
                var description = "`" + process.env.PREFIX + "join` to join with your selected character." +
                    "\n`" + process.env.PREFIX + "join [NPC name]` to join with an NPC." +
                    "\n`" + process.env.PREFIX + "continue` to start Round 1.";
                    // + (combat.timeoutJoin ? "\n\nRegistration closes after " + Math.floor(combat.timeoutJoin / 1000) + "s." : "");
                break;
            case "INI":
                var description = "Declare boosts and `" + process.env.PREFIX + "celerity` actions, then" +
                    "\n`" + process.env.PREFIX + "ini [modifier] [(opt) NPC]`";
                    // + (combat.timeoutIni ? "\n(You have " + Math.floor(combat.timeoutIni / 1000) + "s)" : "");
                break;
            case "DECLARING":
                var description = "`" + process.env.PREFIX + "declare [action]`";
                    // + (combat.timeoutDeclare ? " (" + Math.floor(combat.timeoutDeclare / 1000) + "s / character)" : "");
                break;
            case "RESOLVING":
                var description = "`" + process.env.PREFIX + "resolve` after you finished your rolls";
                    // + (combat.timeoutResolve ? "\n(" + Math.floor(combat.timeoutResolve / 1000) + "s / character)" : "");
                break;
        }

        for (const celerityRound of combat.iniOrder) {
            var isCelerityRound = combat.iniOrder.indexOf(celerityRound) > 0;

            if (celerityRound.length > 0) {
                var fieldInitiative = "";
                var fieldCharacters = "";
                var fieldActions = "";
                for (const iniEntry of celerityRound) {
                    var combatant = await Combatant.findById(iniEntry.combatant)
                        .populate('player', '_id name discordID')
                        .populate('character', '_id generation bp wp willpower health');

                    var thisCombatantsTurn =
                        (combat.iniOrder.indexOf(celerityRound) === combat.iniCurrentCelerityPosition &&
                            celerityRound.indexOf(iniEntry) === combat.iniCurrentPosition);

                    // Mention player whose turn it is
                    /*
                    if (thisCombatantsTurn) {
                        // description += "\n<@" + combatant.player.discordID + ">, it's your turn with " + combatant.name + ".";
                    }
                    */

                    fieldInitiative +=
                        (fieldInitiative.length > 0 ? "\n" : "") +
                        (thisCombatantsTurn ? "**" : "") +
                        (iniEntry.ini >= 0 ? iniEntry.ini : "/") +
                        (isCelerityRound ? "" : "\n") +
                        (thisCombatantsTurn ? "**" : "");
                    fieldCharacters +=
                        (fieldCharacters.length > 0 ? "\n" : "") +
                        (thisCombatantsTurn ? "**" : "") +
                        combatant.name + " (" + combatant.player.name + ")" +
                        (thisCombatantsTurn ? "**" : "") + 
                        (isCelerityRound ? "" : "\n" +
                            (combatant.character ?
                                Character.getHealthBox(combatant.character.health) +
                                " \u200B " + combatant.character.bp + "/" + Character.getMaxBP(combatant.character.generation) + " BP"
                                // + " \u200B " + combatant.character.wp + "/" + combatant.character.willpower + " WP"
                                : "NPC")
                        );
                    fieldActions +=
                        (fieldActions.length > 0 ? "\n" : "") +
                        (thisCombatantsTurn ? "**" : "") +
                        (iniEntry.action ? iniEntry.action : "/") +
                        (isCelerityRound ? "" : "\n") +
                        (thisCombatantsTurn ? "**" : "");
                }
                if (isCelerityRound) {
                    // embed.addField('Celerity Round ' + combat.iniOrder.indexOf(celerityRound), "\u200B", false);
                    embed.addField('\u200B', fieldInitiative, true);
                    embed.addField('Celerity Round ' + combat.iniOrder.indexOf(celerityRound), fieldCharacters, true);
                    embed.addField('\u200B', fieldActions, true);
                } else {
                    embed.addField('Ini', fieldInitiative, true);
                    embed.addField('Character', fieldCharacters, true);
                    embed.addField('Action', fieldActions, true);
                }
            }
        }

        embed.setDescription(description);

        return message.channel.send(embed);

    } catch (err) {
        console.log("Combat.showSummary: " + err);
        return message.channel.send(err.message);
    }
}

// Used to sort iniEntries into an iniOrder as per initiative rules
// Ranking shows highest inis first
Combat.compareIniEntries = function (a, b) {
    // Tie breakers: ini modifier > coin flip
    if (a.ini === b.ini) {
        if (a.iniModifier === b.iniModifier) {
            return (Math.random() < 0.5) ? 1 : -1;
        } else {
            return (a.iniModifier < b.iniModifier) ? 1 : -1;
        }
    }
    else {
        return (a.ini < b.ini) ? 1 : -1;
    }
}


// Moves combat to the next step
// To start Round 1, to skip players who don't react (in time), or if STs feel like it
Combat.continue = async function (message, combat) {
    try {
        if (!combat.paused) {
            switch (combat.state) {
                case "JOINING":
                    // Continue with Round 1

                    var combatants = await Combatant.find({
                        combat: combat._id
                    });
                    if (!combatants || combatants.length < 2) {
                        return message.channel.send("Let's have at least two combatants before we start, shall we? The thing we have now will be boring both for you and for me.");
                    }

                    return Combat.startNewRound(message, combat);
                case "INI":
                    // Set all undefined inis to 1
                    for (var celerityPhase of combat.iniOrder) {
                        var celerityPhasePosition = combat.iniOrder.indexOf(celerityPhase);
                        for (var iniEntry of celerityPhase) {
                            var position = celerityPhase.indexOf(iniEntry);
                            if (iniEntry.ini === -1) {
                                combat.iniOrder[celerityPhasePosition][position].ini = 1;
                            }
                        }
                    }

                    // Sort iniOrder by the iniEntries' ini values
                    for (var celerityPhase of combat.iniOrder) {
                        var celerityPhasePosition = combat.iniOrder.indexOf(celerityPhase);
                        combat.iniOrder[celerityPhasePosition].sort(Combat.compareIniEntries);
                    }

                    combat.markModified('iniOrder');
                    await combat.save();
                    // await message.channel.send("Set ini of all remaining characters to 1.");

                    return Combat.checkState(message, combat);
                case "DECLARING":
                    // Set combatant's action to 'Skipped' and move on
                    combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition].action = "Full Defense";
                    combat.iniCurrentPosition--;
                    combat.markModified('iniOrder');
                    await combat.save();
                    return Combat.checkState(message, combat);
                case "RESOLVING":
                    combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition].action = "Resolved";
                    combat.iniCurrentPosition++;
                    combat.markModified('iniOrder');
                    await combat.save();
                    return Combat.checkState(message, combat);
            }
        }
    } catch (err) {
        console.log("Combat.continue: " + err);
        return message.channel.send(err.message);
    }
}

Combat.startNewRound = async function (message, combat) {
    try {
        combat.state = "INI";
        combat.iniCurrentPosition = -1;
        combat.iniCurrentCelerityPosition = 0;
        combat.round++;

        // Cuts off all celerity rounds
        combat.iniOrder.length = 1;

        // Set all inis to -1 (unless inis are fixed)
        if (!combat.fixedIni) {
            for (var i = 0; i < combat.iniOrder[0].length; i++) {
                combat.iniOrder[0][i].ini = -1;
            }
        }
        // Clear all actions
        for (var i = 0; i < combat.iniOrder[0].length; i++) {
            combat.iniOrder[0][i].action = "";
        }
        combat.markModified('iniOrder');
        await combat.save();

        await Combat.showSummary(message, combat);

        if (combat.timeoutIni > 0) {
            return Combat.setTimer(message, combat, combat.timeoutIni);
        }

        return Combat.checkState(message, combat);

    } catch (err) {
        console.log("Combat.startNewRound: " + err);
        return message.channel.send(err.message);
    }
}

// Prompts the next combatant to declare their action
Combat.promptDeclareAction = async function (message, combat) {
    try {
        if (combat.state !== "DECLARING") return;
        // return message.channel.send("This combat is not in its declaration phase. This shouldn't happen. Please report.");

        combatantToPing = await Combatant.findById(
            combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition].combatant
        ).populate('player', '_id name discordID');

        var msg = "<@" + combatantToPing.player.discordID + ">, " +
            "please `" + process.env.PREFIX + "declare [action]` " +
            "for **" + combatantToPing.name + "**.";
            // + (combat.timeoutDeclare ? " You have " + Math.floor(combat.timeoutDeclare / 1000) + "s." : "");

        if (combat.iniCurrentPosition > 0) {
            combatantToPing = await Combatant.findById(
                combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition - 1].combatant
            ).populate('player', '_id name discordID');

            msg += "\n(<@" + combatantToPing.player.discordID + "> stand by. " + combatantToPing.name + " is next.)";
        }

        return message.channel.send(msg);

    } catch (err) {
		console.log("Combat.promptDeclareAction: " + err);
        return message.channel.send(err.message);
    }
}

// Prompts the next combatant to resolve their action
Combat.promptResolveAction = async function (message, combat) {
    try {
        if (combat.state !== "RESOLVING") return;
        // return message.channel.send("This combat is not in its RESOLVING phase. This shouldn't happen. Please report.");

        combatantToPing = await Combatant.findById(
            combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition].combatant
        ).populate('player', '_id name discordID');

        var msg = "<@" + combatantToPing.player.discordID + ">" +
            ", `" + process.env.PREFIX + "roll` for **" + combatantToPing.name + "**'s action" +
            " ('" + combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition].action + "'), " +
            "then `" + process.env.PREFIX + "resolve`.";

        if (combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition + 1] &&
            combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition + 1].ini > 0) {

            combatantToPing = await Combatant.findById(
                combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition + 1].combatant
            ).populate('player', '_id name discordID');

            msg += "\n(<@" + combatantToPing.player.discordID + ">, prepare your roll. " + combatantToPing.name + " is next.)";
        }

        return message.channel.send(msg);
    } catch (err) {
        console.log("Combat.promptResolveAction: " + err);
        return message.channel.send(err.message);
    }
}

Combat.setTimer = async function (message, combat, millisecondsInFuture) {
    try {
        combat.expirationTime = (Date.now() + millisecondsInFuture) / 1000;

        var msgObj = await message.channel.send("```CSS\n" + Math.floor(millisecondsInFuture / 1000) + " seconds left\n```");
        combat.timerMessageDiscordID = "" + msgObj.id;
        await combat.save();
        setTimeout(Combat.cooldownMessageTimer, 100, combat._id, msgObj, Math.floor(millisecondsInFuture / 1000));

        return setTimeout(Combat.timer, millisecondsInFuture, message, combat);
    } catch (err) {
        return console.log("Combat.setTimer: " + err);
    }
}

// Updates the countdown message every 2 seconds
// Unless the combat has moved on. In that case, destroy the message
Combat.cooldownMessageTimer = async function (combatID, msgObj, secondsLeft) {
    try {
        // If there is a new discord message flowflake stored, this timer
        // is not longer needed
        var combat = await Combat.findById(combatID);
        if (!combat.timerMessageDiscordID ||
            combat.timerMessageDiscordID !== "" + msgObj.id) {

            return msgObj.delete();
        }
        if (secondsLeft < 2) {
            return msgObj.delete();
        }
        setTimeout(Combat.cooldownMessageTimer, 2000, combatID, msgObj, secondsLeft - 2);
        return msgObj.edit("```CSS\n" + secondsLeft + " seconds left\n```");
    } catch (err) {
        return console.log("Combat.cooldownMessageTimer: " + err);
    }
}

/*
 * 
 */
Combat.checkState = async function (message, combat) {
    if (combat.state === "JOINING") {
        if (combat.timeoutJoin) {
            await Combat.setTimer(message, combat, combat.timeoutJoin);
        }
    }

    if (combat.state === "INI") {
        // If all Inis are set, move on to declaring actions
        if (Combat.allInisSet(combat)) {
            combat.state = "DECLARING";

            // set iniCurrentPosition to the first combatant to declare actions
            var actions = Combat.getActions(combat);
            combat.iniCurrentPosition = actions - 1;

            await combat.save();
            await Combat.showSummary(message, combat);
        } // When continue unpauses combat, the timer needs to be reset
        else if (!combat.expirationTime && combat.timeoutIni) {
            return Combat.setTimer(message, combat, combat.timeoutIni);
        }

    }

    if (combat.state === "DECLARING") {
        // If all actions are declared, start resolving with pointer to highest initiative
        if (combat.iniCurrentPosition === -1) {
            combat.state = "RESOLVING";
            combat.iniCurrentPosition = 0;
            await combat.save();
            await Combat.showSummary(message, combat);
        } else {
            await Combat.promptDeclareAction(message, combat);
            if (combat.timeoutDeclare > 0) {
                await Combat.setTimer(message, combat, combat.timeoutDeclare);
            }
        }
    }

    if (combat.state === "RESOLVING") {
        var actions = Combat.getActions(combat);
        // If all actions are resolved, start the next ...
        if (combat.iniCurrentPosition === actions) {
            // Celerity round
            if (combat.iniCurrentCelerityPosition+1 < combat.iniOrder.length) {
                combat.iniCurrentCelerityPosition++;
                combat.state = "DECLARING";

                // set iniCurrentPosition to the first combatant to declare actions
                var actions = Combat.getActions(combat);
                combat.iniCurrentPosition = actions - 1;

                await combat.save();

                await Combat.showSummary(message, combat);
                // Goes to DECLARE section and prompts players to declare actions
                return Combat.checkState(message, combat);
            } // Combat round
            else {
                return Combat.startNewRound(message, combat);
            }
        } else {
            // If the action was set to Full Defense (via a continue command)
            // it gets resolved automatically
            if (combat.iniOrder[combat.iniCurrentCelerityPosition][combat.iniCurrentPosition].action === "Full Defense") {
                return Combat.continue(message, combat);
            }
            await Combat.promptResolveAction(message, combat);
            if (combat.timeoutResolve > 0) {
                await Combat.setTimer(message, combat, combat.timeoutResolve);
            }
        }
    }
}

// Returns the number of actions that happen this round
// Careful: new combatants might have joined who still have their first action next round
// Ignore combatants with ini < 0
Combat.getActions = function (combat) {
    var actions = 0;
    for (const iniEntry of combat.iniOrder[combat.iniCurrentCelerityPosition]) {
        if (iniEntry.ini >= 0) {
            actions++;
        }
    }
    return actions;
}

Combat.allInisSet = function (combat) {
    var allInisSet = true;
    for (var iniEntry of combat.iniOrder[0]) {
        if (iniEntry.ini < 0) {
            allInisSet = false;
        }
    }
    return allInisSet;
}

// Bob instead of bob, BOB, bOB, etc.
Combat.normalizeNPCName = function (name) {
    return name.substr(0, 1).toUpperCase() +
        name.substr(1, name.length - 1).toLowerCase();
}

module.exports = Combat;