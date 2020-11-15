var mongoose = require('mongoose');

var rollSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: [12, "Try to stay within 12 characters. It's supposed to be a short-hand, after all."],
    },
    dicepool: {
        type: Number,
        required: true,
        min: [1, "You need a pool of at least 1 die."],
        max: [100, "I know you are a strong little Cainite, but 100 dice is enough."]
    },
    difficulty: {
        type: Number,
        required: true,
        default: 6,
        min: [2, "The difficulty needs to be at least 2."],
        max: [10, "We all love a challenge, but the rules stop at difficulty 10."]
    },
    comment: {
        type: String,
        maxlength: [100, "Leave the storytelling to the IC chat. 100 character need to suffice."],
    }
});

var Roll = mongoose.model('Roll', rollSchema);

module.exports = Roll;