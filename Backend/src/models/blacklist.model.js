const mongoose = require('mongoose')


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required to be added in blacklist" ]
    },
    expiredAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

// TTL index: MongoDB will automatically delete documents once expiredAt is reached
blacklistTokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 })

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)


module.exports = tokenBlacklistModel