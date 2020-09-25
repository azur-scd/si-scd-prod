module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        bu_id: {
            type: DataTypes.INTEGER,
            references: 'bus',
            referencesKey: 'id'
          },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        groupe: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "users_tmp",
      }
    );

    User.associate = (models) => {
        User.belongsTo(models.Bu,{foreignKey: 'bu_id'});
    };
  
    return User;
  }