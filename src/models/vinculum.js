var mongoose = require('mongoose');
var Character = require("../models/character.js");
var Roller = require("../models/roller.js");

var vinculumSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    binding: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
        required: true,
    },
    bound: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 1,
        min: [1, "The Vinculum has to have a value of at least 1."],
        max: [10, "The Vinculum rating only goes to 10."]
    },
});

var Vinculum = mongoose.model('Vinculum', vinculumSchema);

Vinculum.strengthen = async function (characterBinding, characterBound) {
    try {
        var existingVinculum = await Vinculum.findOne({
            binding: characterBinding._id,
            bound: characterBound._id
        });

        var vinculumRoll = Roller.die();
        // If there is no existing Vinculum, create one
        if (!existingVinculum) {
            var newVinculum = new Vinculum({
                _id: new mongoose.Types.ObjectId(),
                binding: characterBinding._id,
                bound: characterBound._id,
                rating: vinculumRoll,
            });
            await newVinculum.save();
            return characterBound.name +
                " has a new vinculum to " + characterBinding.name +
                " with rating " + vinculumRoll + ".";
        } // Otherwise, see if the existing one needs to be increased
        else {
            if (vinculumRoll > existingVinculum.rating) {
                existingVinculum.rating++;
            }
            await existingVinculum.save();
            return characterBound.name + "'s vinculum rating towards " +
                characterBinding.name +
                (vinculumRoll >= existingVinculum.rating ? " grew to " : " stayed at ") +
                existingVinculum.rating + "."
        }
    } catch (err) {
        return err.message;
    }
}

module.exports = Vinculum;