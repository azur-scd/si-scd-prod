module.exports = (sequelize, DataTypes) => {
    const BddSignalement = sequelize.define('BddSignalement', {
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
        nom_court: DataTypes.STRING,
        source: DataTypes.STRING,
        editeur: DataTypes.STRING,
        url: DataTypes.STRING,
        proxified_url: DataTypes.STRING,
        disc: DataTypes.STRING,
        langue: DataTypes.STRING,
        type_contenu: DataTypes.STRING,
        type_base: DataTypes.STRING,
        type_acces: DataTypes.STRING,
        note_acces: DataTypes.STRING,
        description: DataTypes.STRING,
        tuto: DataTypes.STRING,
        icone: DataTypes.STRING,
        new: DataTypes.STRING,
        alltitles: DataTypes.STRING,
        uca: DataTypes.STRING,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "bdds_signalement"
      }
    );
  
    BddSignalement.associate = (models) => {
     BddSignalement.belongsTo(models.Bdd,{foreignKey: 'bdd_id'});
    };
  
    return BddSignalement;
  }