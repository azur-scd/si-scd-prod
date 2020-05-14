module.exports = (sequelize, DataTypes) => {
    const BddStat = sequelize.define('BddStat', {
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
        stats_reports_id:{
            type: DataTypes.INTEGER,
            references: 'stats_reports',
            referencesKey: 'id'
          },
         periodeDebut: DataTypes.DATE,
         periodeFin: DataTypes.DATE,
         count: DataTypes.INTEGER,
         dimension: DataTypes.STRING,
         mesure: DataTypes.STRING,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "bdds_stats"
      }
    );
  
    BddStat.associate = (models) => {
     BddStat.belongsTo(models.Bdd,{foreignKey: 'bdd_id'});
     BddStat.belongsTo(models.StatReport,{foreignKey: 'stats_reports_id'});
    };
  
    return BddStat;
  }