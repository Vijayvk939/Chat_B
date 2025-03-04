module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('messages', {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    isDelivered: { type: DataTypes.BOOLEAN, defaultValue: false },
    isSeen: { type: DataTypes.BOOLEAN, defaultValue: false }
  });

  Model.associate = function (models) {
    Model.belongsTo(models.users, { foreignKey: "senderId", as: "sender" });
    Model.belongsTo(models.users, { foreignKey: "receiverId", as: "receiver" });
  };

  Model.prototype.toWeb = function () {
    return this.toJSON();
  };

  return Model;
};
