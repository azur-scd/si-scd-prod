module.exports = (sequelize, DataTypes) => {
    const Disc = sequelize.define('Disc', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        code: DataTypes.STRING,
        disc: DataTypes.STRING,
        parent_id: DataTypes.INTEGER,
        actif: DataTypes.INTEGER,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "disciplines",
      }
    );
  
    Disc.associate = (models) => {
     Disc.hasMany(models.BddDiscipline,{foreignKey: 'disc_id'});
    };
  
    return Disc;
  }