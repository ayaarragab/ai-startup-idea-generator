const Conversation = (sequelize, DataTypes) => {
  const conversationModel = sequelize.define(
    'Conversation', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    },
    {
      tableName: 'conversations',
      timestamps: true,
    }
  )

  return conversationModel;
}

export default Conversation;