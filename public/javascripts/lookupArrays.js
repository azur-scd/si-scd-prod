var binaryState = [{"cle":0,"valeur":"non"},{"cle":1,"valeur":"oui"}]
var poleState = [{"cle":"","valeur":""},{"cle":"SHS","valeur":"SHS"},{"cle":"STM","valeur":"STM"}]
var marcheState = [
                {"cle":"","valeur":""},
				{"cle":"GC","valeur":"GC"},
				{"cle":"marche","valeur":"Marché BDD"},
				{"cle":"hors_marche","valeur":"Hors marché"},
                {"cle":"autre","valeur":"Autre"}
            ]
var typeBddState = [{"cle":"","valeur":""},
				    {"cle":"bdd","valeur":"Base de données"},
					{"cle":"perios","valeur":"Bouquet de périodiques"},
					{"cle":"ebooks","valeur":"Collection d'Ebooks"},
                    {"cle":"autre","valeur":"Autre"}]
var typeBase = [{"cle":"","valeur":""},
				{"cle":"Données","valeur":"Données"},
                {"cle":"Texte intégral","valeur":"Texte intégral"},
				{"cle":"Bibliographique","valeur":"Bibliographique"}]
var typeOA = [
            {"cle":"","valeur":""},
            {"cle":"non","valeur":"Non"},
            {"cle":"oas","valeur":"OAS"},
            {"cle":"oar","valeur":"OAR"}
        ]
var typePerimetre = [
             {"cle":"","valeur":""},
            {"cle":"UCA","valeur":"UCA"},
            {"cle":"UCA-EC","valeur":"UCA-EC"}
        ]        			             
var accessState = [
                {"cle":"","valeur":""},
                {"cle":0,"valeur":"Abonnement SCD"},
				{"cle":1,"valeur":"Open Access"},
				{"cle":2,"valeur":"Accès CHU"},
                {"cle":3,"valeur":"Pas d'accès distant"}
            ]            
var getStatState = [{"cle":"","valeur":""},
                    {"cle":"sushi","valeur":"Moissonnage Sushi"},
					{"cle":"manuel","valeur":"Manuelle"},
					{"cle":"nostats","valeur":"Pas de stats"}]
var typeRapportState = [{"cle":"","valeur":""},
                        {"cle":"Counter5","valeur":"Counter5"},
                        {"cle":"Counter4","valeur":"Counter4"},
						{"cle":"Non Counter","valeur":"Non Counter"}]
var mesureRapportState = [{"cle":"","valeur":""},
                        {"cle":"ydt","valeur":"Téléchargements (ou assimilés)"},
                        {"cle":"access_denied","valeur":"Refus d'accès"},
						{"cle":"search","valeur":"Recherches (ou assimilés)"},
						{"cle":"session","valeur":"Sessions (ou assimilés)"},
						{"cle":"result_click","valeur":"Clics de résultats"},
						{"cle":"record_view","valeur":"Notices vues"},
						{"cle":"page_view","valeur":"Pages vues"},
						{"cle":"visit","valeur":"Visites"}]				  
var disciplines = [{"cle":"","valeur":""},
                {"cle":"Anglais","valeur":"Anglais"},
                {"cle":"Chimie","valeur":"Chimie"},
                {"cle":"Commerce","valeur":"Commerce"},
                {"cle":"Droit","valeur":"Droit"},
                {"cle":"Economie-gestion","valeur":"Economie-gestion"},
                {"cle":"Ethnologie","valeur":"Ethnologie"},
                {"cle":"Généralités","valeur":"Généralités"},
                {"cle":"Infirmier","valeur":"Infirmier"},
                {"cle":"Informatique","valeur":"Informatique"},
                {"cle":"Littérature","valeur":"Littérature"},
                {"cle":"Mathématiques","valeur":"Mathématiques"},
                {"cle":"Médecine","valeur":"Médecine"},
                {"cle":"Physique","valeur":"Physique"},
                {"cle":"Sciences de la vie","valeur":"Sciences de la vie"},
                {"cle":"Sciences humaines","valeur":"Sciences humaines"},
                {"cle":"Sport","valeur":"Sport"}
            ]
var deviseState = [{"cle":"","valeur":""},
                {"cle":"euro","valeur":"Euro"},
				{"cle":"dollar","valeur":"Dollar"},
                {"cle":"livre","valeur":"Livre"}]
var etatState = [
                {"cle":"1-prev","valeur":"Prévisionnel"},
				{"cle":"2-budgete","valeur":"Budgété"},
				{"cle":"3-estime","valeur":"Estimé"},
                {"cle":"4-facture","valeur":"Facturé"}
            ]  

var years = [{"cle":2019,"valeur":2019},
            {"cle":2020,"valeur":2020},
            {"cle":2021,"valeur":2021}]            