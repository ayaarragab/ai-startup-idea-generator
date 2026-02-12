const TargetUsers = (sequelize,DataTypes) => {
  const TargetUsersModel = sequelize.define(
    'TargetUsers',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'targetUsers',
      timestamps: true,
    }
  )
  return TargetUsersModel;
}

export default TargetUsers;