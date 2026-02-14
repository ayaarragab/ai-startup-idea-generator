const Message = (sequelize, DataTypes) => {
  const messageModel = sequelize.define(
    'Message', {
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id'
        }
      },
      role: {
        type: DataTypes.ENUM('ai', 'user'),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }
  )
  return messageModel;
}

export default Message;
