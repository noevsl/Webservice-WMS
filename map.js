const map = L.map("map", {
  minZoom: 2
}).setView([43.57, 1.3], 10);

const apiKey = "AAPK354eecdc7c97446693459f3eefcc426aT3yzhYO_6k9e6ki4ef2cUIFW5jr3R8VN7iOdInqVtXc-zLiPA4_x3Q492aOF7ywI";

function getBasemap(style) {
  return L.esri.Vector.vectorBasemapLayer(style, {
      apikey: apiKey
  });
}

const basemapLayers = {
  "ArcGIS:LightGray": getBasemap("ArcGIS:LightGray").addTo(map), // Ajouté par défaut
  "Carto:DarkMatter": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd'
}),
  "Carto:Positron": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd'
  }),
  "OSM:Standard": getBasemap("OSM:Standard"),
};

const serie_temp = L.tileLayer.wms('https://www.geotests.net/geoserver/Lienoe/wms?', {
  version: '1.1.0',
  layers: 'Lienoe:Serie_temp_S2_ndvi',
  format: 'image/png',
  transparent: true,
  attribution: '© GeoTests'
});

const carte_essences = L.tileLayer.wms('https://www.geotests.net/geoserver/Lienoe/wms?', {
  version: '1.1.0',
  layers: 'Lienoe:carte_essences_echelle_pixel',
  format: 'image/png',
  transparent: true,
  attribution: '© GeoTests'
});

const masque = L.tileLayer.wms('https://www.geotests.net/geoserver/Lienoe/wms?', {
  version: '1.1.0',
  layers: 'Lienoe:masque_foret',
  format: 'image/png',
  transparent: true,
  attribution: '© GeoTests'
});

const overlayLayers = {
  "Série Temporelle Sentinel 2 NDVI": serie_temp,
  "Carte des Essences à échelle du pixel": carte_essences,
  "Masque Forêt": masque
};

// Ajouter un contrôle de couche à la carte (permet de basculer entre les couches)
L.control.layers(basemapLayers, overlayLayers).addTo(map);

// Ajouter la barre d'échelle à la carte
L.control.scale({
  position: 'bottomleft',  // Position de la barre d'échelle (en bas à gauche)
  metric: true,            // Afficher l'échelle en mètres (tu peux mettre false pour ne pas afficher en mètres)
  imperial: false          // Afficher l'échelle en miles (mettre true si tu veux l'échelle en miles)
}).addTo(map);

//--------------------------------------------------

const legendeContainer = document.getElementById("legende");

// Stocke les URL des légendes actuellement actives
let activeLegends = new Set();

const legendes = {
    "Lienoe:Serie_temp_S2_ndvi": {
        title: "NDVI",
        url: "https://www.geotests.net/geoserver/Lienoe/wms?"
    },
    "Lienoe:carte_essences_echelle_pixel": {
        title: "Essences",
        url: "https://www.geotests.net/geoserver/Lienoe/wms?"
    },
    "Lienoe:masque_foret": {
        title: "Présence de Forêt",
        url: "https://www.geotests.net/geoserver/Lienoe/wms?"
    }
};

function updateLegend() {
    if (activeLegends.size === 0) {
        legendeContainer.innerHTML = "";
        legendeContainer.style.display = "none";
        return;
    }

    let legendHTML = "";
    activeLegends.forEach(layerName => {
        const legendData = legendes[layerName];
        if (legendData) {
            const legendUrl = `${legendData.url}service=WMS&request=GetLegendGraphic&format=image/png&layer=${layerName}`;
            legendHTML += `<strong>${legendData.title}</strong><br>`;
            legendHTML += `<img src="${legendUrl}" alt="Légende de ${legendData.title}" style="max-width: 200px; border: 1px solid #ccc; margin-bottom: 10px;"/><br>`;
        }
    });

    legendeContainer.innerHTML = legendHTML;
    legendeContainer.style.display = "block";
}

// Écouteur d'événement pour ajouter une légende lors de l'activation d'une couche
map.on("overlayadd", (e) => {
    const layerName = e.layer.wmsParams.layers;
    activeLegends.add(layerName);
    updateLegend();
});

// Écouteur d'événement pour supprimer une légende lors de la désactivation d'une couche
map.on("overlayremove", (e) => {
    const layerName = e.layer.wmsParams.layers;
    activeLegends.delete(layerName);
    updateLegend();
});

// Ajouter une flèche nord sur la carte
const northArrow = L.control();

northArrow.onAdd = function () {
    let div = L.DomUtil.create("div", "fleche_nord");
    div.innerHTML = '<img src="D:/M2/902_1/ProjetWeb/noun-north-arrow-3064876.png" alt="North Arrow" style="width: 50px">';
    return div;
};

northArrow.addTo(map);


