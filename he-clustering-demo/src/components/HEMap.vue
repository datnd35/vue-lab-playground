<template>
  <div class="page">
    <h2>Diver Clustering Demo</h2>

    <div ref="mapContainer" class="map"></div>

    <div v-if="selectedCluster.length" class="popup">
      <h3>Grouped Divers</h3>

      <div
        v-for="diver in selectedCluster"
        :key="diver.id"
        class="popup-item"
        @click="selectDiver(diver)"
      >
        {{ diver.id }} - {{ diver.name }}
      </div>

      <button @click="closePopup">Close</button>
    </div>

    <div v-if="selectedDiver" class="detail">
      <h3>Selected Diver Detail</h3>
      <p><strong>ID:</strong> {{ selectedDiver.id }}</p>
      <p><strong>Name:</strong> {{ selectedDiver.name }}</p>
      <p><strong>Latitude:</strong> {{ selectedDiver.latitude }}</p>
      <p><strong>Longitude:</strong> {{ selectedDiver.longitude }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";

import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import ClusterSource from "ol/source/Cluster";

import { fromLonLat } from "ol/proj";

import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";

import "ol/ol.css";
import { diverData } from "../data/diverData";

const mapContainer = ref(null);
const selectedCluster = ref([]);
const selectedDiver = ref(null);

let map = null;

function createDiverFeatures() {
  return diverData.map((diver) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([diver.longitude, diver.latitude])),
      diver,
    });

    return feature;
  });
}

function createSingleDiverStyle() {
  return new Style({
    image: new CircleStyle({
      radius: 16,
      fill: new Fill({
        color: "#1976d2",
      }),
      stroke: new Stroke({
        color: "#ffffff",
        width: 2,
      }),
    }),
    text: new Text({
      text: "1",
      fill: new Fill({
        color: "#ffffff",
      }),
      font: "bold 14px Arial",
    }),
  });
}

function createClusterStyle(count) {
  return new Style({
    image: new CircleStyle({
      radius: 16,
      fill: new Fill({
        color: "#e53935",
      }),
      stroke: new Stroke({
        color: "#ffffff",
        width: 2,
      }),
    }),
    text: new Text({
      text: String(count),
      fill: new Fill({
        color: "#ffffff",
      }),
      font: "bold 14px Arial",
    }),
  });
}

function clusterStyleFunction(clusterFeature) {
  const groupedFeatures = clusterFeature.get("features");
  const count = groupedFeatures.length;

  if (count === 1) {
    return createSingleDiverStyle();
  }

  return createClusterStyle(count);
}

function handleMapClick(event) {
  selectedCluster.value = [];
  selectedDiver.value = null;

  const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
    return feature;
  });

  if (!clickedFeature) {
    return;
  }

  const groupedFeatures = clickedFeature.get("features");

  if (!groupedFeatures || groupedFeatures.length === 0) {
    return;
  }

  if (groupedFeatures.length === 1) {
    selectedDiver.value = groupedFeatures[0].get("diver");
    return;
  }

  selectedCluster.value = groupedFeatures.map((feature) =>
    feature.get("diver"),
  );
}

function selectDiver(diver) {
  selectedDiver.value = diver;
  selectedCluster.value = [];
}

function closePopup() {
  selectedCluster.value = [];
}

onMounted(() => {
  const features = createDiverFeatures();

  const vectorSource = new VectorSource({
    features,
  });

  const clusterSource = new ClusterSource({
    distance: 30,
    source: vectorSource,
  });

  const baseLayer = new TileLayer({
    source: new OSM(),
  });

  const clusterLayer = new VectorLayer({
    source: clusterSource,
    style: clusterStyleFunction,
  });

  map = new Map({
    target: mapContainer.value,
    layers: [baseLayer, clusterLayer],
    view: new View({
      center: fromLonLat([106.700981, 10.776889]),
      zoom: 14,
    }),
  });

  map.on("click", handleMapClick);
});

onBeforeUnmount(() => {
  if (map) {
    map.setTarget(null);
    map = null;
  }
});
</script>

<style scoped>
.page {
  padding: 16px;
  font-family: Arial, sans-serif;
}

.map {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
}

.popup,
.detail {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.popup-item {
  padding: 8px;
  margin-bottom: 4px;
  cursor: pointer;
  background: white;
  border: 1px solid #eee;
}

.popup-item:hover {
  background: #f0f0f0;
}

button {
  margin-top: 8px;
}
</style>
