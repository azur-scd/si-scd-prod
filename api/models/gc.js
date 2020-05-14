module.exports = (sequelize, DataTypes) => {
    const Gc = sequelize.define('Gc', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nom: DataTypes.STRING,
        debut: DataTypes.DATE,
        fin: DataTypes.DATE,
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
    };
  
    return Gc;
  }