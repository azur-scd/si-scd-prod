module.exports = (sequelize, DataTypes) => {
    const Bu = sequelize.define('Bu', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        bu: DataTypes.STRING,
        code_bib_aleph: DataTypes.STRING,
        latitude: DataTypes.FLOAT,
        longitude: DataTypes.FLOAT,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "bus",
      }
    );
  
    Bu.associate = (models) => {
      //Bu.hasMany(models.horaire);
    };
  
    return Bu;
  }
  