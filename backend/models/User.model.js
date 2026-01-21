const User = (sequelize, DataTypes) => {
  const UserModel = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
      },
      
      lastName: DataTypes.STRING,
      
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      provider: DataTypes.STRING,
      googleId: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
  }
  );

  return UserModel;
};

export default User;