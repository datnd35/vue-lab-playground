# HE Clustering Demo

**Task 699850 – [max4-web] Combine HE: Display Multiple HE at the Same Location Using Clustering**

Demo implementation for clustering multiple Horizontal Extrapolation (HE) markers at the same map location using **OpenLayers `ClusterSource`** in Vue 3.

---

## Problem

When multiple HE share the same geographic coordinates, their markers overlap on the map, making it impossible for users to click individual HE.

```text
Current issue:
Multiple HE markers have same coordinates
        |
        v
Markers overlap on map
        |
        v
User cannot click individual HE easily
```

---

## Selected Solution

**OpenLayers `ClusterSource` + popup list** — uses core OpenLayers only, no external library required.

### Why popup list over spiderfy/expand

```text
Popup list solution
 |
 +-- Uses core OpenLayers only (no ol-ext needed)
 +-- No external library required
 +-- Easy to implement in Vue.js
 +-- Works when HE have exactly the same coordinates
 +-- Lower regression risk
 +-- Matches acceptance criteria: "via expansion or popup list"
```

> StackOverflow note: If all HE share the exact same coordinates,
> `fit(extent)` / zoom-to-expand cannot visually separate them.
> Popup list is the correct fallback.

---

## Architecture

### Data flow

```text
HE Data
 |
 |-- HE-001: same lat/lng
 |-- HE-002: same lat/lng
 |-- HE-003: same lat/lng
 |-- HE-004: unique lat/lng
 |
 v
Convert HE data to OpenLayers Feature
 |
 v
VectorSource
 |
 v
ClusterSource (distance: 30px)
 |
 v
VectorLayer
 |
 v
Map
```

### Rendering logic

```text
Cluster layer style function
        |
        v
Get features inside cluster: feature.get('features')
        |
        v
Count grouped features
        |
        +-- count === 1
        |      |
        |      v
        |   Render normal HE marker (blue circle, radius 8)
        |   Keep existing marker style unchanged
        |
        +-- count > 1
               |
               v
            Render cluster marker (red circle, radius 16)
            Show badge count: [2], [3], [5] ...
```

### Click behavior

```text
User clicks marker on map
        |
        v
Get clicked cluster feature
        |
        v
const features = clickedFeature.get('features')
        |
        v
Check number of features
        |
        +-- features.length === 1
        |       |
        |       v
        |    Open existing HE detail panel
        |
        +-- features.length > 1
                |
                v
             Show popup list of grouped HE
                |
                v
             User selects one HE from list
                |
                v
             Open HE detail panel
```

---

## Code-level Implementation

```text
Create HE features
 |
 v
const features = heData.map(he => new Feature({
  geometry: new Point(fromLonLat([he.longitude, he.latitude])),
  he
}))
 |
 v
const vectorSource = new VectorSource({ features })
 |
 v
const clusterSource = new Cluster({ distance: 30, source: vectorSource })
 |
 v
const clusterLayer = new VectorLayer({
  source: clusterSource,
  style: clusterStyleFunction   // 1 HE -> normal | 2+ HE -> cluster badge
})
 |
 v
map.on('click', handleMapClick)
  // 1 HE  -> show detail
  // 2+ HE -> show popup list
```

---

## Acceptance Criteria

```text
[✓] 2 or more HE same position -> ClusterSource groups them into one marker
[✓] Cluster marker shows count -> Cluster style displays features.length
[✓] Clicking cluster reveals grouped HE -> Popup/list displays grouped HE names
[✓] Single HE marker remains unchanged -> features.length === 1 uses existing HE style
[✓] No visual regression -> Only cluster rendering layer is changed
```

---

## File Structure

```text
he-clustering-demo/
├── src/
│   ├── components/
│   │   └── HEMap.vue       ← Main map component with cluster logic
│   ├── data/
│   │   └── heData.js       ← Mock HE data (3 same-coord + 2 unique)
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

### Mock data setup

- `HE-001`, `HE-002`, `HE-003` → same coordinates → grouped as cluster `[3]`
- `HE-004`, `HE-005` → unique coordinates → shown as individual markers

---

## Run the Demo

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Test scenarios

| Scenario                     | Expected                                        |
| ---------------------------- | ----------------------------------------------- |
| Map loads                    | Cluster marker `[3]` at HE-001/002/003 position |
| Click cluster `[3]`          | Popup list shows HE-001, HE-002, HE-003         |
| Click one HE in list         | Detail panel shows HE ID, name, lat, lng        |
| Click single marker (HE-004) | Detail panel opens directly                     |
| Zoom in / out                | Cluster regroups dynamically                    |

---

## Alternative (Not Selected)

Spiderfy / expand circle on click — requires either:

- Custom coordinate offset logic, or
- External library `ol-ext` (`ol.interaction.SelectCluster`)

Reference: [ol-ext SelectCluster example](https://viglino.github.io/ol-ext/examples/animation/map.animatedcluster.html)

Not selected for this task due to higher complexity and the fact that `fit(extent)` does not visually separate markers with identical coordinates.

---

## Integration Notes for `max4-web`

When integrating into the real codebase:

1. **Wrap existing HE `VectorSource` with `ClusterSource`** — no change to data fetching
2. **Update layer style function** — add `count === 1` branch to preserve existing single-marker style
3. **Add click handler branch** — `features.length > 1` → show list UI (panel/modal)
4. **Test** — HE same coord, HE near coord, HE single, zoom in/out
