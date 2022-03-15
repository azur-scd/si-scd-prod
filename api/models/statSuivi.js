module.exports = (sequelize, DataTypes) => {
    const StatSuivi = sequelize.define('StatSuivi', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        bdd_id: {
          type: DataTypes.INTEGER,
          references: 'bdds',
          referencesKey: 'id'
        },
        etat: DataTypes.STRING,
        annee: DataTypes.STRING,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "stats_suivi"
      }
    );
  
    StatSuivi.associate = (models) => {
        StatSuivi.belongsTo(models.Bdd,{foreignKey: 'bdd_id'});
    };
  
    return StatSuivi;
  }