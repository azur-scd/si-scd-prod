module.exports = (sequelize, DataTypes) => {
    const BddGestion = sequelize.define('BddGestion', {
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
        montant_initial: DataTypes.FLOAT,
        devise: DataTypes.STRING,
        taux_change: DataTypes.FLOAT,
        montant_ht: DataTypes.FLOAT,
        part_tva1: DataTypes.FLOAT,
        taux_tva1: DataTypes.FLOAT,
        part_tva2: DataTypes.FLOAT,
        taux_tva2: DataTypes.FLOAT,
        taux_recup_tva: DataTypes.FLOAT,
        taux_tva_frais_gestion: DataTypes.FLOAT,
        montant_frais_gestion: DataTypes.FLOAT,
        montant_ttc: DataTypes.FLOAT,
        last_estime: DataTypes.FLOAT,
        reliquat: DataTypes.FLOAT,
        surcout_uca: DataTypes.FLOAT,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "bdds_gestion"
      }
    );
  
    BddGestion.associate = (models) => {
     BddGestion.belongsTo(models.Bdd,{foreignKey: 'bdd_id'});
    };
  
    return BddGestion;
  }