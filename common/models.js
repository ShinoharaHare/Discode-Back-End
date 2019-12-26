const mongoose = require('mongoose');

const config = require('@common/config');

mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    }
});

const MessageSchema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    content: String,
    attachments: [{
        filetype: String,
        filename: String,
        id: String,
        size: Number,
    }],
    code: {
        language: String,
        content: String,
        stdin: String,
        stdout: String,
        stderr: String
    },
}, {
    timestamps: {
        createdAt: 'timestamp',
        updatedAt: 'editedTimestamp'
    }
});


const ChannelSchema = mongoose.Schema({
    name: String,
    icon: String,
    members: [{
        id: String,
        level: {
            type: Number,
            default: 0
        }
    }],
    public: Boolean
});



module.exports = {
    User: mongoose.model('User', UserSchema),
    Message: mongoose.model('Message', MessageSchema),
    Channel: mongoose.model('Channel', ChannelSchema)
};