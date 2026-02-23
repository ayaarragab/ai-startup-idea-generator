const Conversation = (sequelize, DataTypes) => {
  const conversationModel = sequelize.define(
    "Conversation",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "conversations",
      timestamps: true,
    },
  );

  return conversationModel;
};

export default Conversation;
