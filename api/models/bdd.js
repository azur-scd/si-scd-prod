module.exports = (sequelize, DataTypes) => {
    const Bdd = sequelize.define('Bdd', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        bdd: DataTypes.STRING,
        gestion: {
          type: DataTypes.TEXT,
          get: function() {           
              return JSON.parse(this.getDataValue('gestion'));
          },
          set: function(gestion) {
              this.setDataValue('gestion', gestion);
          }
        },
        signalement: DataTypes.INTEGER,
        type: DataTypes.STRING,
        soutien_oa: DataTypes.STRING,
        pole_gestion: DataTypes.STRING,
        type_marche: DataTypes.STRING,
        type_achat: DataTypes.STRING,
        gc_id: {
          type: DataTypes.INTEGER,
          references: 'gcs',
          referencesKey: 'id'
        },
        perimetre: DataTypes.STRING,
        achat_perenne: DataTypes.INTEGER,
        type_signalement: DataTypes.INTEGER,
        mode_signalement: DataTypes.STRING,
        pref_stats_reports_id:{
          type: DataTypes.INTEGER,
          references: 'stats_reports',
          referencesKey: 'id'
        },
		 stats_collecte: {
          type: DataTypes.TEXT,
          get: function() {           
              return JSON.parse(this.getDataValue('stats_collecte'));
          },
          set: function(stats_collecte) {
              this.setDataValue('stats_collecte', stats_collecte);
          }
        },
        calcul_esgbu: {
          type: DataTypes.TEXT,
          get: function() {           
              return JSON.parse(this.getDataValue('calcul_esgbu'));
          },
          set: function(calcul_esgbu) {
              this.setDataValue('calcul_esgbu', calcul_esgbu);
          }
        },
        stats_get_mode: DataTypes.STRING,
        stats_url_sushi: DataTypes.STRING,
		sushi_requestor_id: DataTypes.STRING,
        sushi_customer_id: DataTypes.STRING,
		sushi_api_key: DataTypes.STRING,
        stats_url_admin: DataTypes.STRING,
        stats_login: DataTypes.STRING,
        stats_mdp: DataTypes.STRING,
        stats_mail: DataTypes.STRING,
        commentaire: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { freezeTableName: true,
        tableName: "bdds",
      }
    );
  
    Bdd.associate = (models) => {
     Bdd.hasOne(models.BddSignalement,{foreignKey: 'bdd_id'});
	 Bdd.hasOne(models.BddDiscipline,{foreignKey: 'bdd_id'});
     Bdd.hasMany(models.BddGestion,{foreignKey: 'bdd_id'});
     Bdd.hasMany(models.BddStat,{foreignKey: 'bdd_id'});
     Bdd.belongsTo(models.StatReport,{foreignKey: 'pref_stats_reports_id'});
     Bdd.belongsTo(models.Gc,{foreignKey: 'gc_id'});
    };
  
    return Bdd;
  }