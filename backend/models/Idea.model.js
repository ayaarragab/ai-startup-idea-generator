const Idea = (sequelize, DataTypes) => {
  const IdeaModel = sequelize.define(
    'Idea',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      problem: {
        type: DataTypes.STRING,
        allowNull: false
      },
      solution: {
        type: DataTypes.STRING,
        allowNull: false
      },
      keyPartners: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      keyActivities: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      keyResources: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      valueProposition: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      customerRelationships: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      channels: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      customerSegments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      costStructure: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      revenueStreams: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      nextSteps: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      academicReferences: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      tableName: 'ideas',
      timestamps: true,
    }
  );
  
  return IdeaModel;
}

export default Idea;