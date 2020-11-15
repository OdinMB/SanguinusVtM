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
    selectedCharacter: {
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

Player.getPlayer = function (message, callback) {
    this.findOne({ discordID: message.author.id }, function (err, player) {
        if (err) {
            console.log(err);
            message.author.send(err.message);
            return;
        }

        if (player) {
            callback(player);
        } // If the player is not yet registered, do that now
        else {
            Player.createPlayer(message, function (newPlayer) {
                callback(newPlayer);
            });
        }
    });
}

Player.createPlayer = function (message, callback) {
    // Is the player already registered?
    this.find({
        discordID: message.author.id
    }).exec(function (err, player) {
        if (err) {
            console.log(err);
            message.author.send(err.message);
            return;
        }
        if (player.length > 0) {
            message.author.send("You're already registered.");
            return;
        }

        var newPlayer = new Player({
            _id: new mongoose.Types.ObjectId(),
            name: message.author.username,
            discordID: message.author.id
        });
        newPlayer.save(function (err) {
            if (err) {
                console.log(err);
                message.author.send(err.message);
                return;
            }
            message.author.send("It seems like you weren't registered at the SanguinusVtM bot. I fixed that for you. You are now registered as " + message.author.username + " with your Discord ID " + message.author.id + ".");
            callback(newPlayer);
        });
    });
}


module.exports = Player;