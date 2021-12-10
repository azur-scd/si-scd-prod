module.exports = (sequelize, DataTypes) => {
    const Gc = sequelize.define('Gc', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nom: DataTypes.STRING,
        bdd_id: {
          type: DataTypes.INTEGER,
          references: 'bdds',
          referencesKey: 'id'
        },
        debut: DataTypes.STRING,
        fin: DataTypes.STRING,
        montant_ttc: DataTypes.FLOAT,
        porteur: DataTypes.STRING,
        contact: DataTypes.STRING,
        num_bon_commande: DataTypes.STRING,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "gcs",
      }
    );
  
    Gc.associate = (models) => {
        Gc.hasOne(models.Bdd,{foreignKey: 'gc_id'});
        Gc.belongsTo(models.Bdd,{foreignKey: 'bdd_id'});
    };
  
    return Gc;
  }