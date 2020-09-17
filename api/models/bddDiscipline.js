module.exports = (sequelize, DataTypes) => {
    const BddDiscipline= sequelize.define('BddDiscipline', {
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
        disc_id: {
            type: DataTypes.INTEGER,
            references: 'disciplines',
            referencesKey: 'id'
          },
        quotite: DataTypes.FLOAT,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "bdds_disc"
      }
    );
  
    BddDiscipline.associate = (models) => {
     BddDiscipline.belongsTo(models.Bdd,{foreignKey: 'bdd_id'});
     BddDiscipline.belongsTo(models.Disc,{foreignKey: 'disc_id'});
    };
  
    return BddDiscipline;
  }