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
    fullname: {
        type: String,
        unique: true,
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
});
var Character = mongoose.model('Character', characterSchema);

// ToDo: send via PM
Character.show = function (message) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(message.author.username);
    // embed.setDescription(comment);
    embed.setColor('#0099ff');
    //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
    // embed.setImage('https://www.sanguinus.org/klaus/botch.png')

    embed.addField('Physical', 'Strength: 2\nDexterity: 3\nStamina: 2', true)
    embed.addField('Social', 'Charisma: 4\nManipulation: 2\nAppearance: 2', true)
    embed.addField('Mental', 'Perception: 4\nIntelligence: 3\nWits: 3', true)

    // embed.addField('\u200B', '\u200B');

    embed.addField('Talents', 'Alertness: 1\nAthlectics: 2\nAwareness 1\nBrawl: 1\nEmpathy: 4\nExpression: 1\nIntimidation: 2\nLeadership: 1\nStreetwise: 1\nSubterfuge: 3', true)
    embed.addField('Skills', 'XXXXX\nXXX\nXX', true)
    embed.addField('Knowledge', 'XXXXX\nXXX\nXX', true)

    embed.addField('Specialties', 'Charisma (Inspiring)\nPerception (Observant)\nEmpathy (Gain Trust)\nPerformance (Performance Art)', true)

    message.author.send(embed);
}

module.exports = Character;
