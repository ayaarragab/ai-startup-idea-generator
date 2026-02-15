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
      },
      clientMessageId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: true
      }
    },   
  {
    tableName: 'messages',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["conversationId", "clientMessageId", "role"],
      },
    ]
  });

  return messageModel;
}

export default Message;
