const Feedback = (sequelize, DataTypes) => {
  const FeedbackModel = sequelize.define(
    'Feedback',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ideaId: {
        type: DataTypes.INTEGER,
        allowNull: false,        
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    },
    {
      tableName: 'feedbacks',
      timestamps: true,
    }
  )
  return FeedbackModel;
}

export default Feedback;