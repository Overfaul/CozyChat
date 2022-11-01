const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    phone: { type: DataTypes.STRING, unique: true },
    fullname: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING, defaultValue: "server/images/default_avatar.png" },
    bio: { type: DataTypes.STRING }
});

const Token = sequelize.define("token", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false }
});


const Dialog = sequelize.define("dialog", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    authorId: { type: DataTypes.INTEGER },
    partnerId: { type: DataTypes.INTEGER },
    lastmessage : { type: DataTypes.STRING, allowNull: true }
});

const Message = sequelize.define("message", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    attachment: {type: DataTypes.STRING},
    sentTime: {
        type: DataTypes.STRING
    },

    repliedUsername : {type: DataTypes.STRING},
    repliedMessage : {type: DataTypes.STRING},
    repliedImage : {type: DataTypes.STRING},
});

const User_Dialog = sequelize.define("user_dialog", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

// Associations
User.hasOne(Token);
Token.belongsTo(User);

User.belongsToMany(Dialog, {
    through: User_Dialog
});
Dialog.belongsToMany(User, {
    as: 'users',
    through: User_Dialog,
});

Message.hasOne(Dialog);

Dialog.hasMany(Message)
Message.belongsTo(Dialog)

User.hasMany(Message)
Message.belongsTo(User, {
    as: 'creator'
})




module.exports = {
    User,
    Token,
    Dialog,
    Message,
    User_Dialog
};