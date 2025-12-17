// Ce fichier gère l’accès aux rapports SUSHI via HTTP.
// testHarvest : teste un URL SUSHI et renvoie le nombre d’items.
// harvest / get_sushi : récupère les données, filtre selon un metric, les transforme et agrège par mois.
// Fonctions utilitaires :
// flatDeep : aplatit des tableaux imbriqués.
// getGroupSum : agrège les valeurs par un champ (ex : mois).
// object2array : transforme un objet clé-valeur en tableau pour JSON.
// Les logs (console.log) servent au debug des URL et metrics.

/*schéma visuel du flux de traitement SUSHI pour ce fichier Node.js, depuis l’appel HTTP jusqu’au résultat JSON agrégé :


Client (Front-end)
        │
        │ POST /harvest ou /testHarvest avec body { url, metric, resourceId, reportId }
        ▼
Server (Node.js Controller)
        │
        ├─ testHarvest → test_get_sushi()
        │       │
        │       ├─ fetch(req.body.url)
        │       │
        │       ├─ JSON.parse(body)
        │       │
        │       └─ compte data.Report_Items.length
        │
        │       → renvoie { "Nombre d'items": X }
        │
        └─ harvest → get_sushi()
                │
                ├─ fetch(req.body.url)
                │
                ├─ JSON.parse(body)
                │
                ├─ data.Report_Items.map()
                │       │
                │       └─ record.Performance.map()
                │               │
                │               └─ i.Instance.filter(Metric_Type == req.body.metric)
                │                       │
                │                       └─ extraction obj["total"] = d.Count
                │
                ├─ flatDeep() → aplatit tableau imbriqué
                │
                ├─ getGroupSum(..., "month", "total") → somme par mois
                │
                └─ object2array() → transforme {mois: somme} en [{dimension: mois, count: total}]
                        │
                        ▼
                JSON final agrégé par mois

Explications du flux :
1. Client : envoie l’URL SUSHI, le metric et éventuellement resourceId/reportId.
2. Server :
  - testHarvest → teste juste l’URL et renvoie le nombre d’items.
  - harvest → récupère toutes les données, filtre par metric, crée des objets {month, total}.
3. Traitement :
  - Parcours des Report_Items et de leurs Performance.
  - Filtrage des Instance selon le metric demandé.
  - Aplatissement des tableaux imbriqués (flatDeep).
  - Agrégation par mois (getGroupSum).
  - Transformation en tableau JSON (object2array).
4. Résultat final : JSON renvoyé au client, prêt pour affichage ou traitement.
*/
    

// ===========================
// Point d’entrée pour tester le harvest (SUSHI) sur une URL spécifique
// ===========================
exports.testHarvest = async function(req, res) {
    // Affiche le paramètre "view" dans la console
    console.log(req.params.view)
    // Appelle la fonction test_get_sushi qui teste l'accès au rapport SUSHI
    return await test_get_sushi(req, res)
}

// ===========================
// Point d’entrée pour récupérer le harvest complet
// ===========================
exports.harvest = async function(req, res) {
    // Appelle la fonction get_sushi qui traite le rapport SUSHI complet
    return await get_sushi(req, res)
};

// ===========================
// Fonction interne de test (non utilisée directement dans les exports)
// Parse et transforme un rapport SUSHI JSON
// ===========================
async function test(req, res) {
    try {
        // On fait un fetch vers l’URL fournie dans req.body.url
        // Note : pas d’option rejectUnauthorized, donc certificat non vérifié
        const response = await fetch(req.body.url);

        // Si réponse non OK, on lève une erreur
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // On parse le corps de la réponse en JSON
        const data = await response.json();

        // Transformation des Report_Items en objet simplifié
        const result = data.Report_Items.map(function(record) {
            var obj = {};
            obj["resource_id"] = req.body.resourceId;
            obj["report_id"] = req.body.reportId;

            // Parcours de chaque performance dans le report
            record.Performance.map(function(i) {
                var obj1 = {};
                obj1["year"] = i.Period.Begin_Date.split("-")[0]; // année
                obj1["month"] = i.Period.Begin_Date.split("-")[1]; // mois
                obj1["period_begin"] = i.Period.Begin_Date; // début période
                obj1["period_end"] = i.Period.End_Date; // fin période

                // Filtrage des instances pour ne prendre que Total_Item_Requests
                i.Instance
                    .filter(function(d) { return d.Metric_Type == "Total_Item_Requests" })
                    .map(function(d) {
                        obj1["total"] = d.Count; // nombre total
                        console.log(Object.assign(obj, obj1)) // debug
                        return Object.assign(obj, obj1)
                    })
            })
            return obj
        });

        // Renvoie le résultat JSON
        res.json(result)
    } catch (error) {
        // En cas d’erreur, renvoie le message
        res.json(error.message || error);
    }
}

// ===========================
// Test simplifié du SUSHI : renvoie le nombre d’items dans le report
// ===========================
async function test_get_sushi(req, res) {
    console.log(req.body.url)
    console.log(req.body.metric)
    try {
        const response = await fetch(req.body.url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // On lit le corps de la réponse en texte puis on parse JSON
        const body = await response.text();
        const dataCount = JSON.parse(body).Report_Items.length;

        // Renvoie le nombre d’items
        res.json({ "Nombre d'items : ": dataCount });
    } catch (error) {
        res.json(error.message || error);
    }
}

// ===========================
// Récupère et agrège les données SUSHI selon le metric choisi
// ===========================
async function get_sushi(req, res) {
    console.log(req.body.metric)
    var report_filter = req.body.metric // type de metric à filtrer
    console.log(req.body.url)
    try {
        const response = await fetch(req.body.url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const body = await response.text();
        const data = JSON.parse(body);

        // Parcours des Report_Items et de leurs Performance
        var result = data.Report_Items.map(function(record) {
            return record.Performance.map(function(i) {
                var obj = {};
                obj["month"] = i.Period.Begin_Date.split("-")[1]; // mois
                i.Instance
                    // Filtrage selon le metric demandé
                    .filter(function(d) { return d.Metric_Type == report_filter })
                    .map(function(d) {
                        return obj["total"] = d.Count; // valeur total
                    })
                // On garde uniquement les objets avec "total"
                return obj
            })
            .filter(function(d) { if (d.hasOwnProperty("total")) { return d } })
        })

        // Aplatir et sommer par mois
        var aggResult = getGroupSum(flatDeep(result), "month", "total")

        res.json(aggResult)
    } catch (error) {
        res.json(error.message || error);
    }
}

// ===========================
// Transforme un objet {key:value} en tableau [{dimension:key,count:value}]
// ===========================
function object2array(obj) {
    var arr = []
    Object.keys(obj).forEach(function(key) {
        var value = obj[key];
        arr.push({ "dimension": key, "count": value });
    });
    return arr;
}

// ===========================
// Agrège les valeurs d’un tableau d’objets par un label
// ex : somme totale par mois
// ===========================
function getGroupSum(data, labelField, aggField) {
    var agg = data.reduce(function(memo, item) {
        memo[item[labelField]] = (memo[item[labelField]] || 0) + item[aggField];
        return memo;
    }, {})
    return object2array(agg) // transformation en tableau
}

// ===========================
// Fonction utilitaire : aplatit un tableau multidimensionnel
// ===========================
function flatDeep(arr) {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val), []);
};
