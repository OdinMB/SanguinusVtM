const Discord = require('discord.js');

/**
 * Returns a random number between min (inclusive) and max (inclusive)
 */
function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
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
    embed.setTitle(message.author.username + "' roll");
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
    } else if (ones >= tens + successes) {
        result = 0;
        // embed.addField('FAILURE', diceString);
        embed.setImage('https://www.sanguinus.org/klaus/failure.png');
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
            embed.addField(result + ' SUCCESSES', "Wow. Just wow.");
        } else {
            embed.setImage('https://www.sanguinus.org/klaus/success' + result + '.png');
        }
    }

    embed.setFooter(comment + "\n" +
        // dicePool + " dice, " +
        "Difficulty " + difficulty +
        (spec ? ', Specialty' : '') + "\n" +
        "Values: " + diceString);
    message.channel.send(embed);
    return result;
}