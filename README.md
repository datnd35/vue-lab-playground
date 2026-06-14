# frontend-test-pipeline-demo

Vue.js demo workspace for frontend testing and feature prototyping.

---

## Projects

### `he-clustering-demo/`

**Task 699850 – Display Multiple HE at the Same Location Using Clustering**

Demonstrates OpenLayers `ClusterSource` grouping multiple HE markers at the same map coordinates into a single cluster marker with a count badge.

```bash
cd he-clustering-demo
npm install
npm run dev
```

**Solution:** `ol/source/Cluster` + popup list on cluster click  
**Stack:** Vue 3 + Vite + OpenLayers 10

See [`he-clustering-demo/README.md`](./he-clustering-demo/README.md) for full architecture and integration notes.

---

### `frontend-test-pipeline-demo/`

Frontend testing pipeline demo with Vitest.

```bash
cd frontend-test-pipeline-demo
npm install
npm run test
```
