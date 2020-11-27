var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    discordID: {
        type: String,
        required: true,
        unique: true
    },
    selectedCharacter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
    },
});

var Player = mongoose.model('Player', playerSchema);


Player.getPlayerAsync = async function (message) {
    try {
        var existingPlayer = await this.findOne({ discordID: message.author.id });
        if (existingPlayer) {
            // Did anything change?
            if (existingPlayer.name !== message.author.username) {
                existingPlayer.name = message.author.username;
                await existingPlayer.save();
            }

            return existingPlayer;
        } // If the player is not yet registered, do that now
        else {
            return Player.createPlayerAsync(message);
        }
    } catch (err) {
        console.log("getPlayerAsync: " + err);
        return message.author.send(err.message);
    }
}
Player.createPlayerAsync = async function (message) {
    try {
        var newPlayer = new Player({
            _id: new mongoose.Types.ObjectId(),
            name: message.author.username,
            discordID: message.author.id
        });
        return newPlayer.save();
    } catch (err) {
        console.log("createPlayerAsync: " + err);
        return message.author.send(err.message);
    }
}

Player.getPlayer = function (message, callback) {
    this.findOne({ discordID: message.author.id }, function (err, player) {
        if (err) {
            console.log("Player.getPlayer: " + err);
            return message.author.send(err.message);
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
            console.log("Player.createPlayer: " + err);
            return message.author.send(err.message);
        }
        if (player.length > 0) {
            return message.author.send("You're already registered.");
        }

        var newPlayer = new Player({
            _id: new mongoose.Types.ObjectId(),
            name: message.author.username,
            discordID: message.author.id
        });
        newPlayer.save(function (err) {
            if (err) {
                console.log("Player.createPlayer - newPlayer.save: " + err);
                return message.author.send(err.message);
            }
            message.author.send("It seems like you weren't registered at the SanguinusVtM bot. I fixed that for you. You are now registered as " + message.author.username + " with your Discord ID " + message.author.id + ".");
            callback(newPlayer);
        });
    });
}


module.exports = Player;