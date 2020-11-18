const Discord = require('discord.js');
const rollerStats = require('../models/rollerstats.js')

/**
 * Returns a random number between min (inclusive) and max (inclusive)
 */ 
function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

/*
 * Returns an array with two integers:
 * - the percentage of rolls with the same parameters that are worse than the actual result
 * - the percentage of rolls with the same parameters that are better than the actual result
 * Based on a result database in rollerstats.js, which was generated with misc/roll-database.js
 */
function getLuck(dicePool, diff, spec, result) {
    var percWorse = 0;
    for (var i = result - 1; i > -1; i--) {
        percWorse += rollerStats.database[dicePool][diff][(spec ? "spec" : "nospec")]["s" + i];
    }
    const percBetter = 1 - percWorse - rollerStats.database[dicePool][diff][(spec ? "spec" : "nospec")]["s" + result]
    return [Math.round(percWorse*100), Math.round(percBetter*100)];
}

exports.ini = function (message, mod) {
    die = between(1, 10);
    var result = die + mod;

    const embed = new Discord.MessageEmbed();
    embed.setTitle(message.author.username + "' initiative: " + result);
    embed.setColor('#0099ff');
    // embed.addField(result, '\u200B');
    embed.setFooter(die + " + " + mod);
    message.channel.send(embed);

    return result;
}

exports.roll = function (message, dicePool, difficulty, comment) {
    const spec = (Array.isArray(comment.match(/spec/i)));
    var successes = 0;
    var tens = 0;
    var ones = 0;
    var die = 0;
    var diceString = "";
    var result = 0;

    const embed = new Discord.MessageEmbed();
    // embed.setDescription(comment);
    embed.setColor('#0099ff');
    //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
    // embed.addField('\u200B', '\u200B');
    // .addField('Inline field title', 'Some value here', true)

    for (i = 1; i <= dicePool; i++) {
        die = between(1, 10);
        diceString += die + " ";
        if (die === 1) {
            ones++;
        } else if (die === 10) {
            tens++;
        } else if (die >= difficulty) {
            successes++;
        }
    }

    if (ones > 0 && tens + successes == 0) {
        result = -1;
        // embed.addField('BOTCH', diceString);
        embed.setImage('https://www.sanguinus.org/klaus/botch.png');
        embed.setTitle(message.author.username + "' roll: BOTCH");
    } else if (ones >= tens + successes) {
        result = 0;
        // embed.addField('FAILURE', diceString);
        embed.setImage('https://www.sanguinus.org/klaus/failure.png');
        embed.setTitle(message.author.username + "' roll: FAILURE");
    } else {
        for (var j = 1; j <= ones; j++) {
            if (successes > 0) {
                successes--;
                ones--;
            } else {
                tens--;
                ones--;
            }
        }
        if (spec) {
            result = tens * 2 + successes;
        } else {
            result = tens + successes;
        }
        if (result > 10) {
            embed.addField(result + ' SUCCESSES', "I don't have a picture for that.");
        } else {
            embed.setImage('https://www.sanguinus.org/klaus/success' + result + '.png');
        }
        embed.setTitle(message.author.username + "' roll: " + result + " SUCCESS" + (result > 1 ? "ES" : ""));
    }

    var luck = getLuck(dicePool, difficulty, spec, result);
    embed.setFooter(comment + "\n" +
        "Dice " + dicePool + ", " + 
        "Difficulty " + difficulty +
        (spec ? ', Specialty' : '') + "\n" +
        "Values: " + diceString + "\n" + 
        "Luck: " + (luck[0] - luck[1]) +
        " (" + luck[0] + "% worse, " + luck[1] + "% better" +
            (luck[0] - luck[1] >= 75 ? ". Praise Caine!" : "") + ")");
    message.channel.send(embed);
}