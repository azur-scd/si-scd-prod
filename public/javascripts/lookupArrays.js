var binaryState = [{ "cle": 0, "valeur": "non" }, { "cle": 1, "valeur": "oui" }]
var poleState = [{ "cle": "SCD", "valeur": "SCD" }, { "cle": "SHS", "valeur": "SHS" }, { "cle": "STM", "valeur": "STM" }]
var marcheState = [
    { "cle": "", "valeur": "" },
    { "cle": "GC", "valeur": "GC" },
    { "cle": "marche", "valeur": "Marché BDD" },
    { "cle": "hors_marche", "valeur": "Hors marché" },
    { "cle": "autre", "valeur": "Autre" }
]
var achatperenneState = [
    { "cle": 0, "valeur": "Non" }, 
    { "cle": 1, "valeur": "Oui" },
    { "cle": 2, "valeur": "Licence nationale" }
]
var typeAchatState = [
    { "cle": "", "valeur": "" },
    { "cle": "bouquet", "valeur": "Bouquet" },
    { "cle": "titre", "valeur": "Titre à titre" }
]
var typeBddState = [{ "cle": "", "valeur": "" },
{ "cle": "bdd", "valeur": "Base de données" },
{ "cle": "perios", "valeur": "Bouquet de périodiques" },
{ "cle": "ebooks", "valeur": "Collection d'Ebooks" },
{ "cle": "autre", "valeur": "Autre" }]
var typeBase = [{ "cle": "", "valeur": "" },
{ "cle": "Données", "valeur": "Données" },
{ "cle": "Texte intégral", "valeur": "Texte intégral" },
{ "cle": "Bibliographique", "valeur": "Bibliographique" }]
var typeOA = [
    { "cle": "", "valeur": "" },
    { "cle": "non", "valeur": "Non" },
    { "cle": "oas", "valeur": "OAS" },
    { "cle": "oar", "valeur": "OAR" }
]
var typePerimetre = [
    { "cle": "", "valeur": "" },
    { "cle": "UCA", "valeur": "UCA" },
    { "cle": "UCA-EC", "valeur": "UCA-EC" }
]
var accessState = [
    { "cle": "", "valeur": "" },
    { "cle": 0, "valeur": "Abonnement SCD" },
    { "cle": 1, "valeur": "Open Access" },
    { "cle": 2, "valeur": "Accès CHU" },
    { "cle": 3, "valeur": "Pas d'accès distant" }
]
var typeSignalement = [
    { "cle": "", "valeur": "" },
    { "cle": 0, "valeur": "Plateforme" },
    { "cle": 1, "valeur": "Titre à titre" },
    { "cle": 2, "valeur": "Plateforme + Titre à titre" }
]
var modeSignalement = [
    { "cle": "", "valeur": "" },
    { "cle": "ebsco", "valeur": "FTF (Ebsco)" },
    { "cle": "sudoc", "valeur": "Sudoc-Aleph" },
    { "cle": "editeur", "valeur": "Métadonnées éditeurs" }
]
var getStatState = [{ "cle": "", "valeur": "" },
{ "cle": "sushi", "valeur": "Moissonnage Sushi" },
{ "cle": "manuel", "valeur": "Manuelle" },
{ "cle": "nostats", "valeur": "Pas de stats" }]
var typeRapportState = [{ "cle": "", "valeur": "" },
{ "cle": "Counter5", "valeur": "Counter5" },
{ "cle": "Counter4", "valeur": "Counter4" },
{ "cle": "Non Counter", "valeur": "Non Counter" }]
var mesureRapportState = [{ "cle": "", "valeur": "" },
{ "cle": "ydt", "valeur": "Téléchargements (ou assimilés)" },
{ "cle": "access_denied", "valeur": "Refus d'accès" },
{ "cle": "search", "valeur": "Recherches (ou assimilés)" },
{ "cle": "session", "valeur": "Sessions (ou assimilés)" },
{ "cle": "result_click", "valeur": "Clics de résultats" },
{ "cle": "record_view", "valeur": "Notices vues" },
{ "cle": "page_view", "valeur": "Pages vues" },
{ "cle": "visit", "valeur": "Visites" }]
var disciplines = [{ "cle": "", "valeur": "" },
{ "cle": "Anglais", "valeur": "Anglais" },
{ "cle": "Chimie", "valeur": "Chimie" },
{ "cle": "Commerce", "valeur": "Commerce" },
{ "cle": "Droit", "valeur": "Droit" },
{ "cle": "Economie-gestion", "valeur": "Economie-gestion" },
{ "cle": "Ethnologie", "valeur": "Ethnologie" },
{ "cle": "Généralités", "valeur": "Généralités" },
{ "cle": "Infirmier", "valeur": "Infirmier" },
{ "cle": "Informatique", "valeur": "Informatique" },
{ "cle": "Littérature", "valeur": "Littérature" },
{ "cle": "Mathématiques", "valeur": "Mathématiques" },
{ "cle": "Médecine", "valeur": "Médecine" },
{ "cle": "Physique", "valeur": "Physique" },
{ "cle": "Sciences de la vie", "valeur": "Sciences de la vie" },
{ "cle": "Sciences humaines", "valeur": "Sciences humaines" },
{ "cle": "Sport", "valeur": "Sport" }
]
var deviseState = [{ "cle": "", "valeur": "" },
{ "cle": "euro", "valeur": "Euro" },
{ "cle": "dollar", "valeur": "Dollar" },
{ "cle": "livre", "valeur": "Livre" }]
var etatState = [
    { "cle": "1-prev", "valeur": "Prévisionnel" },
    { "cle": "2-budgete", "valeur": "Budgété" },
    { "cle": "3-estime", "valeur": "Estimé" },
    { "cle": "4-facture", "valeur": "Facturé" }
]
var years = [{ "cle": 2022, "valeur": 2022 },
{ "cle": 2021, "valeur": 2021 },
{ "cle": 2020, "valeur": 2020 },
{ "cle": 2019, "valeur": 2019 },
{ "cle": 2018, "valeur": 2018 }]
var steps = [{ "cle": "prev", "valeur": "Prévisions" },
{ "cle": "exec", "valeur": "Exécution" }]
var months = [{ "cle": "janvier", "valeur": "Janvier", "start": "-01-01", "end": "-01-31","code":"01" },
{ "cle": "fevrier", "valeur": "Février", "start": "-02-01", "end": "-02-28","code":"02" },
{ "cle": "mars", "valeur": "Mars", "start": "-03-01", "end": "-03-31","code":"03" },
{ "cle": "avril", "valeur": "Avril", "start": "-04-01", "end": "-04-30","code":"04" },
{ "cle": "mai", "valeur": "Mai", "start": "-05-01", "end": "-05-31","code":"05" },
{ "cle": "juin", "valeur": "Juin", "start": "-06-01", "end": "-06-30","code":"06" },
{ "cle": "juillet", "valeur": "Juillet", "start": "-07-01", "end": "-07-30","code":"07" },
{ "cle": "aout", "valeur": "Août", "start": "-08-01", "end": "-08-31","code":"08" },
{ "cle": "septembre", "valeur": "Septembre", "start": "-09-01", "end": "-09-30","code":"09" },
{ "cle": "octobre", "valeur": "Octobre", "start": "-10-01", "end": "-10-31","code":"10" },
{ "cle": "novembre", "valeur": "Novembre", "start": "-11-01", "end": "-11-30","code":"11" },
{ "cle": "decembre", "valeur": "Décembre", "start": "-12-01", "end": "-12-31","code":"12" },
{ "cle": "total", "valeur": "Total", "start": "-01-01", "end": "-12-31" }];
var sushiReportUrlSegment = [{"cle":"tr_j3","valeur":"Revues - Téléchargements (tr_j3)","mapReportId":1},
{"cle":"tr_j2","valeur":"Revues - Refus d'accès (tr_j2)","mapReportId":3},
{"cle":"tr_b3","valeur":"Ebooks - Téléchargements (tr_b3)","mapReportId":1},
{"cle":"tr_b2","valeur":"Ebooks - Refus d'accès (tr_b2)","mapReportId":3},
{"cle":"dr_d1","valeur":"Base de données - Recherches (dr_d1)","mapReportId":4},
{"cle":"pr_p1","valeur":"Plateforme - Recherches (pr_p1)","mapReportId":4}]
var esgbuDisplayReport = [{"cle":"1,2,6","valeur":"Téléchargements"},
{"cle":"4","valeur":"Recherches"},
{"cle":"5,7","valeur":"Sessions"}]
var userGroups = [{ "cle": "admin", "valeur": "Admin" },
{ "cle": "docelec", "valeur": "Docelec" },
{ "cle": "horaires", "valeur": "Horaires" }]            