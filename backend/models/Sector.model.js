const Sector = (sequelize, DataTypes) => {
  const SectorModel = sequelize.define(
    "Sector",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "sectors",
      timestamps: true,
    },
  );
  return SectorModel;
};

export default Sector;
