const Sector = (sequelize,DataTypes) => {
  const SectorModel = sequelize.define(
    'Sector',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'sectors',
      timestamps: true,
    }
  )
  return SectorModel;
}

export default Sector;