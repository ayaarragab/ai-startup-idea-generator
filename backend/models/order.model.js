const Order = (sequelize, DataTypes) => {
  const orderModel = sequelize.define(
    "Order",
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      ideaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ideas",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "paid"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );
  return orderModel;
}

export default Order;