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
  "ArcGIS:Streets": getBasemap("ArcGIS:Streets"),
  "ArcGIS:Imagery": getBasemap("ArcGIS:Imagery"),
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

// Ajouter le geocoder pour la recherche d'adresse (loupe)
var geocoder = L.Control.Geocoder.nominatim();
var searchControl = L.control.geocoder(geocoder, {
  position: 'topleft' // Tu peux ajuster la position si tu veux
}).addTo(map);
