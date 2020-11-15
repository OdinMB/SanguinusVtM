var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    discordID: {
        type: Number,
        required: true,
        unique: true
    },
    activeCharacter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
        unique: true
    },
    /*
    linkedin: {
        type: String,
        validate: {
            validator: function (text) {
                return text.indexOf('https://www.linkedin.com/') === 0;
            },
            message: 'LinkedIn must start with https://www.linkedin.com/'
        }
    },
    */
});

var Player = mongoose.model('Player', playerSchema);
module.exports = Player;