module.exports = (sequelize, DataTypes) => {
    const StatReport = sequelize.define('StatReport', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        counter: DataTypes.STRING,
        report: DataTypes.STRING,
        mesure: DataTypes.STRING,
        display: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
      },
      { freezeTableName: true,
        tableName: "stats_reports",
      }
    );
  
    StatReport.associate = (models) => {
      StatReport.hasMany(models.Bdd,{foreignKey: 'pref_stats_reports_id'});
      StatReport.hasMany(models.BddStat,{foreignKey: 'stats_reports_id'});
    };
  
    return StatReport ;
  }