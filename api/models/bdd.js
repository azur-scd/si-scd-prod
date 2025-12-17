// Le fichier exporte une fonction qui reçoit sequelize et DataTypes pour définir le modèle Bdd.
// Le modèle correspond à la table bdds dans la base de données.
// freezeTableName: true empêche Sequelize de pluraliser automatiquement le nom de la table

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
// Champs JSON avec getter/setter
// Permet de stocker des objets JS dans un champ TEXT en JSON.
// Lors de la lecture (get), on reconvertit la chaîne JSON en objet JS.
// Lors de l’écriture (set), l’objet JS est stocké tel quel (Sequelize le convertira en JSON si nécessaire).
		
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
        stats_counter: DataTypes.STRING,  
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
	 Bdd.hasMany(models.BddDiscipline,{foreignKey: 'bdd_id'});
     Bdd.hasMany(models.BddGestion,{foreignKey: 'bdd_id'});
     Bdd.hasMany(models.BddStat,{foreignKey: 'bdd_id'});
     Bdd.hasMany(models.Gc,{foreignKey: 'bdd_id'});
	 Bdd.hasMany(models.StatSuivi,{foreignKey: 'bdd_id'});
     Bdd.belongsTo(models.StatReport,{foreignKey: 'pref_stats_reports_id'});
     Bdd.belongsTo(models.Gc,{foreignKey: 'gc_id'});
    };

// hasOne : une base peut avoir un seul signalement (BddSignalement).
// hasMany : une base peut avoir plusieurs disciplines, gestions, statistiques, GC ou suivis (BddDiscipline, BddGestion, BddStat, Gc, StatSuivi).
// belongsTo : une base peut être liée à un rapport de stats préféré (StatReport) ou à une GC (Gc).
// Les clés étrangères (foreignKey) définissent le lien entre tables.


	
    return Bdd;
  }
