const Idea = (sequelize, DataTypes) => {
  const IdeaModel = sequelize.define(
    "Idea",
    {
      // --- Operational Fields ---
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      // --- Problem Space ---
      problemTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      problemDescription: {
        type: DataTypes.TEXT, // Changed to TEXT to allow longer descriptions
        allowNull: false,
      },
      rootCause: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      targetUsers: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      marketRegion: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Egypt or MENA",
      },
      whyNow: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      evidenceSignals: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },

      // --- Solution Space ---
      solutionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      solutionDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      howItWorks: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      keyFeatures: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      technologyStack: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      retrivedStartups: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      // --- Grouped/Nested JSON Objects ---
      businessModel: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      marketAnalysis: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      feasibility: {
        type: DataTypes.JSON,
        allowNull: false,
        // Added the specific default values from your JSON structure
        defaultValue: {
          technical_feasibility: "Low",
          market_feasibility: "Low",
          risk_factors: [],
        },
      },
      noveltyScore: {
        type: DataTypes.FLOAT, // Or INTEGER, depending on your scoring system
        allowNull: false,
        defaultValue: 0,
      },
      impact: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      mvpPlan: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },

      // --- Status Fields ---
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      tableName: "ideas",
      timestamps: true,
      // Optional: Add `underscored: true` here if your actual database
      // table columns need to be strict snake_case (e.g., problem_title)
    },
  );

  return IdeaModel;
};

export default Idea;
