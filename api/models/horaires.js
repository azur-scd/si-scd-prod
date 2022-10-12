module.exports = (sequelize, DataTypes) => {
    const Horaires = sequelize.define('Horaires', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        id_bu: {
            type: DataTypes.INTEGER,
            references: 'bus',
            referencesKey: 'id'
          },
        type_horaires: DataTypes.STRING,
        start: DataTypes.DATE,
        end: DataTypes.DATE,
        date_jour: DataTypes.DATEONLY,
        heureOuv: DataTypes.TIME,
        heureFerm: DataTypes.TIME,
        title: DataTypes.STRING,
        commentaire: DataTypes.TEXT,
        templates: DataTypes.STRING,
        alertePortail: DataTypes.STRING,
        alertePortailText: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "horaires",
      }
    );
  
    Horaires.associate = (models) => {
        Horaires.belongsTo(models.Bu,{foreignKey: 'id_bu'});
    };
  
    return Horaires;
  }