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
    // email: {
    //     type: String,
    //     unique: true,
    //     required: true
    // },
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
    attachments: [{
        type: String, //可能會有問題
        filename: String,
        id: String,
        size: Number,
    }],
    author: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    embeds: [{
        type: String,
        title: String,
        description: String,
        url: String,
        author: {
            name: String,
            url: String
        },
        provider: {
            name: String,
            url: String
        },
        thumbnail: {
            url: String,
            width: Number,
            height: Number
        },
        video: {
            url: String,
            width: Number,
            height: Number
        }
    }]
},{
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