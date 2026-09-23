// Direct port of the prototype's hero globe — Canvas 2D, no libraries.
// Ported near-verbatim from the prototype's own script (real continent
// outlines, 13 real hub cities, orthographic projection, drag/inertia,
// arc animation between matched cities). Only the entry/exit points are
// adapted to fit a single React-managed canvas instead of the original's
// document-wide `WW.globeInit(root)`/`globePause(root)` router hooks.

const PI = Math.PI;
const D2R = PI / 180;
const ROWS = 69;
const STEP = 180 / ROWS;
const AUTO = -((2 * PI) / 90);
const BASE_TILT = 17 * D2R;
const MAX_TILT = 35 * D2R;
const START_LON = 100 * D2R;
const FILL = 0.8;
const SPAWN_EVERY = 1.4;
const NB = 8;
const LIMB = 0.5;
const LIMB_DEPTH = 0.2;

// ---------- rough continent outlines: flat [lon,lat, lon,lat, ...] ----------
const LAND: number[][] = [
  [-168,66,-162,70,-156,71,-141,70,-128,70,-115,68.5,-108,68,-96,68,-94,72,-88,68,-86,66,-93,62,-94,58.7,-90,57,-85,55.3,-82,53,-80,51.2,-78.5,53,-77,56,-78,59,-77.5,62.5,-72,62,-70,59,-66,59,-64.5,60.3,-61,56,-56,52.5,-60,50,-66,50,-65,47.5,-61,46,-66,43.5,-70,43,-70.5,41.5,-74,40.2,-75.5,37.5,-76,35,-79,33,-81.2,31,-80.2,27,-80.5,25.2,-82,26.5,-82.8,29.5,-85,29.7,-89,30.2,-90,29.2,-94,29.5,-97.2,27.5,-97.6,24,-97.5,21,-96,19,-94.5,18.2,-95,16.2,-98,16.3,-101.5,17.5,-105.5,20,-105.5,22.5,-108,25.5,-110,27.5,-112.5,30,-114.7,31.7,-112.5,28,-110.5,24.5,-109.8,23,-112,24.8,-114.5,27.8,-115.8,30.2,-117.2,32.6,-120.5,34.5,-122,36.8,-124,40.2,-124.3,43,-124,46.5,-124.7,48.4,-123,49,-127,50.7,-130.5,54.5,-134,58,-138,59.5,-144,60,-149,60.5,-152,59,-157,57,-162,55,-160,58.5,-165,61,-164.5,63.5,-161,64.5,-166,65],
  [-88,73.5,-78,73.5,-68,70.5,-62,66.5,-65,62.5,-74,64.5,-73,68,-84,70],
  [-125,74,-115,73.5,-105,73,-101,70,-108,68.8,-117,69.5,-125,71.5],
  [-92,76.5,-80,76,-75,78.5,-62,82,-72,83,-90,81.5,-95,79],
  [-59.3,47.7,-55.5,51.5,-52.7,47.5,-55.5,46.7],
  [-73,78.2,-60,82,-35,83.5,-18,81,-20,75,-22,70.5,-32,68,-40,65,-43.5,60,-48.5,61,-52,65,-54,69.5,-58,75,-68,76],
  [-94.5,18.3,-91,18.7,-90.5,21,-87,21.5,-87.8,18,-88.8,15.9,-84,15.8,-83.3,12,-83.7,10.5,-81.5,9,-79.5,9.5,-77.3,8.7,-77.5,7.3,-80,7.3,-81,8.2,-83,8.3,-85.7,10,-87.5,13,-91.5,14,-94,16,-95.5,16],
  [-85,22,-80.5,23.2,-74.2,20.3,-77.5,19.9,-81.5,21.8],
  [-74.4,18.4,-72.8,19.9,-68.4,18.7,-71,17.7],
  [-77.3,8.5,-75.5,10.8,-71.7,12.4,-68,10.8,-62,10.7,-60,8.5,-57,6,-52,4.8,-50,1,-48,-1,-44,-2.5,-40,-3,-37,-4.8,-35,-7,-35.2,-9.5,-37.5,-12,-39,-15,-39.3,-18,-41,-22,-44.5,-23.2,-48,-25.5,-48.7,-28.3,-52,-32.5,-53.5,-34.2,-56,-34.8,-58.4,-34,-57,-36.5,-57.7,-38.2,-62,-39,-65,-41,-63.7,-42.7,-65.5,-45,-67.5,-46.5,-65.8,-48,-68.5,-50.2,-68.4,-52.5,-65.5,-54.8,-69,-55.3,-72,-54,-74.5,-51,-75.5,-47,-73.5,-42,-73.7,-37,-71.5,-32,-71.3,-28,-70.3,-23,-70.3,-18.3,-73,-16.5,-76.2,-13.8,-78,-10,-79.8,-7,-81.2,-5,-80.3,-3,-80.8,-1,-80,0.8,-78.8,1.5,-77.3,4,-77.5,7],
  [-9.3,38.7,-8.9,43.2,-1.8,43.4,-1.2,46,-4.7,48.4,-1.5,48.7,-1.6,49.6,1.6,50.3,3.5,51.4,4.7,53,8,53.7,8.3,54.9,8.2,57,10.6,57.7,10.2,55.2,11,54,14.2,54,18.5,54.8,21,55.2,21.2,57,23.5,59.3,28,59.6,30,60,32,55,32,50,31,46.5,29.7,45.2,28.6,43.5,27.9,42.5,28.2,41.5,29,41.1,26.2,40.6,23.8,40.7,22.8,40.2,23.3,39,24,38,23,36.5,21.3,37.3,20,39.5,19.4,41.8,17.5,43,15,44.5,13.7,45.6,12.3,45.3,12.5,44,14,42.3,16,41.8,18.4,40.2,17,40.5,16.6,38.8,16,38,15.7,40,13.5,41.2,11,42.4,10,44,8.8,44.4,7.5,43.7,4.8,43.4,3.1,43,3.2,41.9,0.8,40.8,-0.3,39.4,0.2,38.7,-0.7,37.7,-2.2,36.8,-5.3,36.1,-6.3,36.8,-7.4,37.2,-8.9,37],
  [5.3,59,5,61.8,7,63,10.5,64.3,12.5,66.2,14.5,68.3,18.5,69.8,23,70.8,28,71,31,70.2,33,69.4,41,67.8,40.5,66.2,34.5,66.4,35,64.3,30,60,25,60,22.5,60,21.3,61.5,21.5,63.2,25,65,24,65.8,22,65.7,21,64.5,17.5,62.3,17.2,61,18.8,60,17,58.7,16.5,56.5,14.5,56,14.2,55.4,12.8,55.4,12.8,56.5,11.5,58,10.8,59.2,8,58.1],
  [-5.5,50.1,-3.5,50.4,1.3,51.2,1.7,52.7,0.2,53.3,-0.3,54.5,-1.6,55.5,-2.2,56.8,-1.9,57.6,-3.5,57.8,-3.2,58.6,-5,58.6,-6,57,-5.5,55.5,-4.8,54.8,-3.2,54.8,-3,53.5,-4.5,53.2,-4.2,52.2,-5.2,51.8,-3.3,51.4,-4.3,51.1],
  [-10,51.7,-6.3,52.2,-6,54,-5.6,54.8,-7.5,55.3,-10,54.2,-9.5,53],
  [-24,65.5,-22,66.4,-16,66.5,-13.7,65,-16,63.8,-19,63.4,-22.5,63.9],
  [11,79,16,80,27,80.2,21,77.5,15,76.8],
  [52,71,56,73.5,60,76,68,77,64,75.5,57,72.5,55,70.7],
  [32.3,31.3,34.3,31.3,34.9,29.5,34.2,27.8,32.6,29.9,35.5,24,37.2,21,37.4,18.5,39.5,15.5,43.2,12.5,43.3,11.5,44.5,10.5,51.2,11.8,50.8,9.5,48,5,46,2.5,42,-1.5,40.2,-3,39.2,-6.5,40.5,-10.5,40.6,-15,36,-18.8,35,-22.5,35.5,-24,32.8,-26,32.3,-28.8,30,-31.5,27,-33.8,22,-34.3,19.8,-34.8,18.3,-34,18,-32,16.5,-28.6,14.5,-23,12,-17.5,13.5,-12.5,12.2,-6,9,-1,9.5,2.5,9.7,4,8.5,4.5,6,4.3,4.5,6.2,3.4,6.4,1,5.8,-2,4.8,-4.5,5.2,-7.5,4.4,-9.5,6,-11.5,7,-13.3,9,-15,11,-16.7,12.4,-17.5,14.7,-16.3,16.5,-16.3,19.5,-17,21,-16,23.8,-14.5,26.2,-13,27.8,-10,29.5,-9.7,31.5,-8.5,33.4,-6.8,34.1,-5.9,35.8,-5.3,35.9,-2.9,35.3,-1,35.6,1.5,36.5,5,36.8,9,37.2,10.2,37.3,11,37,10.6,34.5,10,33.8,11,33.3,13,32.9,15.3,32.3,16.5,31.2,19,30.3,20,31,20,32.5,23,32.7,25,31.7,29,30.9,31,31.5],
  [49.3,-12,50.4,-15.5,49.5,-18,47.8,-23,47,-25,45.2,-25.5,43.7,-23.5,43.3,-21.5,44.3,-19.5,44,-17,46.3,-15.7,48,-13.5],
  [35,29.5,34.8,28,37.2,24.5,39,21.5,41,18,42.8,14.8,43.5,12.7,45,12.8,49,14.2,52.2,16,55.2,17.5,57.8,19,59.8,22.5,58.6,23.7,56.6,24.5,56.4,26.3,55.3,25.4,54,24.2,51.6,24.2,51.5,26,50.2,26.3,48.8,28,48,29.8,48.7,31,35.5,31],
  [29,46,29,59.5,30.5,60.2,35,64.2,37.5,63.9,40.5,64.6,40,66,44,66.5,44,68.3,46,68,47,66.9,54,68.5,60,69,66,69.2,68,68.5,69,72.8,73,71.5,74,68,80,72.5,87,74.5,98,76,104,77.7,113,75.8,112,73.8,127,72.8,131,71,140,72.5,150,71.5,160,69.7,170,70,178,69.3,185,67,190,66,187,64.5,182,65,179,62.5,170,60,163.5,59.8,162,58,162,56,160,53,156.7,51,155.5,55,157,58,160,60.5,156,61.5,154.5,59.5,150,59.3,143,59.3,137,55,141,52.5,140.5,49,138,46,135,43.4,131.5,42.8,129.5,41.5,127.5,39.8,129.4,37,129,35.2,126.4,34.5,126.3,37,124.8,39.7,121.7,39,122,40.6,118,39,119,37.5,122.4,37.2,119.3,35,121,32,121.8,30.5,120,27,118,24.5,114.2,22.4,110.4,21.2,108.5,21.7,106,20,105.8,18.8,108.8,15.5,109.3,12,107,10.4,105,8.7,104.8,10.3,102.7,11.8,100.9,13.4,99.8,11,100.3,8,101.8,6.8,103.4,4.5,103.5,2.5,104.2,1.4,103.4,1.3,101.3,2.9,100.3,5.5,98.3,8,98.6,10.5,98.5,13.5,97.7,16.5,95.5,15.8,94.3,18,92,21.5,90.5,22,88.5,21.7,87,20.7,85,19.5,82.3,16.5,80.2,15,80.2,12.5,79.8,10.3,78.2,8.9,77.5,8.1,76.3,10,74.8,13,73.5,16,72.8,19,72.7,21,70.5,20.8,69,22.3,70,23,68.2,23.7,67,24.8,62,25.2,57.3,25.6,56.5,27.1,54,26.6,51.5,27.8,50,30,48.7,30.2,35,29.5,34.3,31.3,35,33,35.9,35.5,36.2,36.8,33,36.2,30.6,36.8,27.4,36.8,26.3,38.5,26.5,40,29,40.5,29.2,41.2,31.5,41.3,35,42,38,41,41.5,41.6,39,44,37.5,45.3,38.5,47,35,46.2,33.5,44.5,32.5,45.5,33,46.1,31,46.6],
  [79.8,9.7,81.2,8.5,81.8,7,80.6,5.9,79.8,7],
  [120.1,23,121,25.2,122,25,121.4,23,120.8,22],
  [129.7,33,130.8,31.2,131.8,31.5,132,33.5,134.5,33.7,135.8,33.5,137,34.6,139,34.8,140.8,35.6,141,38,142,39.6,141.4,41.4,140,41,139.8,39,138.5,37.4,137,37.2,136,36,135.5,35.6,132.5,35.5,131,34.4,129.8,33.6],
  [140,41.6,141,43.2,141.7,45.4,143.5,44.2,145.3,43.8,145,43,143.3,42,141.5,42.4],
  [141.9,46,143.5,46.8,142.8,49,144.5,49.2,143.3,52,142.8,54.3,142,53.5,141.8,50,142.1,48],
  [120.2,16.2,120.6,18.6,122.2,18.5,122.3,16.3,121.7,14.3,124.1,13,123.9,12.5,121.8,13.6,120.5,13.7,120,15],
  [122,11.9,125.3,12.5,125.8,11,126.5,8,126.2,6.3,125.4,5.6,124,6.5,122,7,121.9,7.8,123.5,8.6,122.5,10,121.9,10.5],
  [95.3,5.6,97.5,5.2,100.4,2.5,103.7,-1,106,-3,105.8,-5.8,104.5,-5.8,102.2,-4,100.3,-1,98.7,1.7,97,3.5],
  [105.2,-6.8,106.5,-5.9,108.6,-6.5,110.8,-6.3,112.7,-6.8,114.5,-7.8,114.4,-8.7,111,-8.3,108,-7.8,106.4,-7.4],
  [115,-8,119,-8.1,123,-8.2,122.8,-9.2,119,-9.4,115.2,-8.9],
  [123.5,-10.3,125,-8.6,127.2,-8.4,125.5,-9.8],
  [109,1.8,111.3,2.6,113,3.3,115.5,5,116.8,7,119.2,5.2,117.8,3.5,118,1.5,117.5,0.5,116.5,-1.5,116,-3.8,114.5,-4.1,111.8,-3.3,110.2,-2.8,109.2,-0.5],
  [119.3,-5.5,120.6,-5.6,121,-3.2,122.8,-4.9,123.3,-3.5,121.7,-1.8,123.2,-0.9,121,-0.7,120.3,0.4,124.9,1.2,125.1,1.8,120.8,1.4,119.7,0.2,119,-3],
  [131,-0.8,134,-0.7,135,-3.3,138,-1.6,141,-2.6,145,-4.4,147.5,-6,148,-8,150.6,-10.4,147.5,-10,144.5,-7.7,142.5,-9.2,139,-8.1,137.8,-5.5,135,-4.4,132.8,-4,133.5,-2.5,131.2,-1.5],
  [114,-22,113.5,-24.5,114.2,-26.5,115,-30.5,115.7,-32,115,-34.3,118,-35,120,-33.9,123.5,-33.9,126,-32.3,129,-31.6,131.5,-31.5,134.2,-32.8,135.5,-34.7,137.8,-33,137.5,-35.2,139.5,-36,140.5,-38,143.5,-38.8,146.3,-39,148,-37.8,150,-37.2,151.6,-33.5,153,-30.5,153.5,-28,153,-25.5,151,-23.5,149.5,-22,147,-19.3,146,-18,145.4,-15,143.8,-14.3,142.6,-10.8,141.7,-13,141,-17.5,139.5,-17.5,137.5,-16,135.7,-15,136.8,-12.2,135,-12.2,132.5,-11.5,130.8,-12.5,129.5,-15,128,-14.8,126,-14,124,-16.3,122.2,-18,121,-19.7,117,-20.7],
  [144.7,-40.8,148.2,-40.9,148,-43,146.5,-43.6,145.3,-42.5],
  [172.7,-34.5,174.5,-36,175.8,-36.7,178.4,-37.7,177.2,-39.5,176,-41.4,174.9,-41.4,174.8,-39.8,173.8,-39.3,174.6,-37.5],
  [172.7,-40.6,174.2,-41.5,172.8,-43.6,171,-45.5,169.5,-46.6,166.7,-46,168.2,-44.2,171,-42.2],
  [-180,-90,-180,-77,-160,-77.5,-140,-74.5,-120,-73.5,-100,-72.5,-80,-73,-70,-69,-64,-65,-58,-63.5,-57,-65,-62,-69,-60,-74,-45,-78,-30,-77,-15,-72,0,-70,20,-70,40,-69,55,-66.5,70,-68.5,80,-67,100,-66,120,-66.8,140,-66.8,160,-70,170,-72,165,-77.5,180,-78,180,-90],
];
const WATER: number[][] = [
  [47.5,44.5,50,46.8,53,46.5,52.5,44,51,42.5,54,41,53.5,37.2,50,37,49,39.5,48,42],
];

type Hub = { code: string; city: string; v: [number, number, number]; phase: number; pref: number; _x?: number; _y?: number; _z?: number; _r?: number };

const HUB_SOURCE: Array<[string, string, number, number, number?]> = [
  ["SIN", "Singapore", 1.35, 103.82], ["MNL", "Manila", 14.6, 120.98], ["LHR", "London", 51.5, -0.12, -1],
  ["JFK", "New York", 40.7, -74.0], ["GRU", "São Paulo", -23.55, -46.63], ["LOS", "Lagos", 6.52, 3.38],
  ["SYD", "Sydney", -33.87, 151.21], ["BLR", "Bengaluru", 12.97, 77.59], ["DXB", "Dubai", 25.2, 55.27],
  ["BER", "Berlin", 52.52, 13.4], ["YYZ", "Toronto", 43.65, -79.38, -1], ["NBO", "Nairobi", -1.29, 36.82],
  ["SGN", "Ho Chi Minh City", 10.82, 106.63],
];
const PAIR_SOURCE = [
  "SIN>MNL", "LHR>BLR", "SIN>SYD", "JFK>GRU", "SIN>SGN", "BER>LOS", "SIN>LHR", "YYZ>MNL", "DXB>NBO",
  "SYD>BLR", "SIN>DXB", "JFK>LHR", "MNL>SIN", "GRU>LOS", "SIN>BLR", "BER>SGN", "SIN>JFK", "LHR>NBO", "SYD>MNL",
  "YYZ>BER", "SIN>LOS", "DXB>LHR", "SGN>SYD", "SIN>BER",
];
const STATIC_PAIR_SOURCE = ["SIN>MNL", "SIN>SYD", "DXB>BLR"];

function vec(lat: number, lon: number): [number, number, number] {
  const a = lat * D2R;
  const o = lon * D2R;
  const c = Math.cos(a);
  return [c * Math.sin(o), Math.sin(a), c * Math.cos(o)];
}

function project(vx: number, vy: number, vz: number, cl: number, sl: number, ct: number, st: number, out: number[]) {
  const x1 = vx * cl - vz * sl;
  const z1 = vz * cl + vx * sl;
  out[0] = x1;
  out[1] = vy * ct - z1 * st;
  out[2] = vy * st + z1 * ct;
  return out;
}

function pip(p: number[], x: number, y: number): boolean {
  let inside = false;
  const n = p.length;
  for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
    const xi = p[i], yi = p[i + 1], xj = p[j], yj = p[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

type Prepped = { p: number[]; b: [number, number, number, number] };
function prep(list: number[][]): Prepped[] {
  return list.map((p) => {
    const b: [number, number, number, number] = [1e9, 1e9, -1e9, -1e9];
    for (let i = 0; i < p.length; i += 2) {
      if (p[i] < b[0]) b[0] = p[i];
      if (p[i] > b[2]) b[2] = p[i];
      if (p[i + 1] < b[1]) b[1] = p[i + 1];
      if (p[i + 1] > b[3]) b[3] = p[i + 1];
    }
    return { p, b };
  });
}

let LANDP: Prepped[] | null = null;
let WATERP: Prepped[] | null = null;
function hit(set: Prepped[], lon: number, lat: number): boolean {
  for (let i = 0; i < set.length; i++) {
    const s = set[i];
    if (lat < s.b[1] || lat > s.b[3]) continue;
    for (let k = 0; k < 2; k++) {
      const L = lon + k * 360;
      if (L < s.b[0] || L > s.b[2]) continue;
      if (pip(s.p, L, lat)) return true;
    }
  }
  return false;
}
function isLand(lon: number, lat: number): boolean {
  if (!LANDP) {
    LANDP = prep(LAND);
    WATERP = prep(WATER);
  }
  return hit(LANDP, lon, lat) && !hit(WATERP!, lon, lat);
}

let DOTS: { land: Float32Array; sea: Float32Array } | null = null;
function build() {
  if (DOTS) return DOTS;
  const land: number[] = [];
  const sea: number[] = [];
  for (let k = 0; k < ROWS; k++) {
    const lat = -90 + (k + 0.5) * STEP;
    const n = Math.max(1, Math.round((360 * Math.cos(lat * D2R)) / STEP));
    const ls = 360 / n;
    const off = k % 2 ? 0.5 : 0;
    for (let j = 0; j < n; j++) {
      let lon = -180 + (j + off) * ls;
      if (lon > 180) lon -= 360;
      const v = vec(lat, lon);
      if (isLand(lon, lat)) land.push(v[0], v[1], v[2]);
      else if (k % 2 === 0 && j % 2 === 0) sea.push(v[0], v[1], v[2]);
    }
  }
  DOTS = { land: new Float32Array(land), sea: new Float32Array(sea) };
  return DOTS;
}

const hubs: Hub[] = HUB_SOURCE.map((h, i) => ({
  code: h[0],
  city: h[1],
  v: vec(h[2], h[3]),
  phase: (i * 0.377) % 1,
  pref: h[4] === -1 ? -1 : 1,
}));
function hubIndex(code: string): number {
  for (let i = 0; i < hubs.length; i++) if (hubs[i].code === code) return i;
  return 0;
}
function pairOf(s: string): [number, number] {
  const p = s.split(">");
  return [hubIndex(p[0]), hubIndex(p[1])];
}
const pairs = PAIR_SOURCE.map(pairOf);
const staticPairSource = STATIC_PAIR_SOURCE.map(pairOf);

type Arc = { a: number; b: number; n: number; pts: Float32Array; t0: number; grow: number; hold: number; fade: number };
function makeArc(a: number, b: number, t0: number): Arc {
  const A = hubs[a].v;
  const B = hubs[b].v;
  const d = Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  const om = Math.acos(d);
  const so = Math.sin(om);
  const n = Math.max(18, Math.ceil(om * 26));
  const h = Math.min(0.23, 0.02 + 0.1 * om);
  const pts = new Float32Array((n + 1) * 3);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let wa: number, wb: number;
    if (so < 1e-4) {
      wa = 1 - t;
      wb = t;
    } else {
      wa = Math.sin((1 - t) * om) / so;
      wb = Math.sin(t * om) / so;
    }
    const x = wa * A[0] + wb * B[0];
    const y = wa * A[1] + wb * B[1];
    const z = wa * A[2] + wb * B[2];
    const m = Math.sqrt(x * x + y * y + z * z) || 1;
    const lift = (1 + h * Math.sin(PI * t)) / m;
    pts[i * 3] = x * lift;
    pts[i * 3 + 1] = y * lift;
    pts[i * 3 + 2] = z * lift;
  }
  return { a, b, n, pts, t0, grow: 1.5 + 0.45 * om, hold: 1.3, fade: 1.1 };
}

function hexRgb(hex: string, fallback: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim()) || /^#?([0-9a-f]{6})$/i.exec(fallback)!;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
function theme() {
  let cs: CSSStyleDeclaration | null = null;
  try {
    cs = window.getComputedStyle(document.documentElement);
  } catch {
    // ignore
  }
  function v(name: string) {
    try {
      return cs ? cs.getPropertyValue(name) : "";
    } catch {
      return "";
    }
  }
  return {
    cloud: hexRgb(v("--cloud"), "#E4EEFD"),
    mist: hexRgb(v("--mist"), "#C9DDF7"),
    sky: hexRgb(v("--sky"), "#4A90E2"),
    voyage: hexRgb(v("--voyage"), "#1E4FA3"),
    ink: hexRgb(v("--ink"), "#172B4D"),
    white: hexRgb(v("--white"), "#FFFFFF"),
    amber: "245,166,35",
    mono: (v("--font-mono") || "").trim() || "ui-monospace,'SF Mono',Menlo,Consolas,monospace",
  };
}

const P: number[] = [0, 0, 0];
let buckets: Float32Array[] | null = null;
const counts = new Int32Array(NB);
function scratch(len: number) {
  if (buckets && buckets[0].length >= len) return;
  buckets = [];
  for (let i = 0; i < NB; i++) buckets.push(new Float32Array(len));
}
let sx = new Float32Array(128);
let sy = new Float32Array(128);
let sv = new Float32Array(128);
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

type Theme = ReturnType<typeof theme>;
type GlobeState = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  dead: boolean;
  col: Theme;
  active: boolean;
  inView: boolean;
  ok: boolean;
  raf: number;
  last: number;
  dpr: number;
  time: number;
  intro: number;
  nextSpawn: number;
  pairI: number;
  lon: number;
  tilt: number;
  vLon: number;
  vTilt: number;
  arcs: Arc[];
  lab: Float32Array;
  drag: { id: number; x: number; y: number; t: number; vx: number; vy: number } | null;
  side: Float32Array;
  stillArcs: Arc[];
  w: number;
  h: number;
  cx: number;
  cy: number;
  R: number;
  cl: number;
  sl: number;
  ct: number;
  st: number;
  ro?: ResizeObserver;
  io?: IntersectionObserver;
  onResize?: () => void;
};

function drawDots(g: GlobeState, pts: Float32Array, r0: number, rgb: string, aMin: number, aMax: number) {
  const ctx = g.ctx!;
  const R = g.R, cx = g.cx, cy = g.cy;
  scratch(pts.length);
  for (let b = 0; b < NB; b++) counts[b] = 0;
  for (let i = 0; i < pts.length; i += 3) {
    project(pts[i], pts[i + 1], pts[i + 2], g.cl, g.sl, g.ct, g.st, P);
    const z = P[2];
    if (z <= 0.02) continue;
    let b = (z * NB) | 0;
    if (b >= NB) b = NB - 1;
    const buf = buckets![b];
    const c = counts[b];
    buf[c] = cx + P[0] * R;
    buf[c + 1] = cy - P[1] * R;
    buf[c + 2] = r0 * (0.4 + 0.6 * z);
    counts[b] = c + 3;
  }
  for (let b = 0; b < NB; b++) {
    const n = counts[b];
    if (!n) continue;
    const buf = buckets![b];
    ctx.fillStyle = `rgba(${rgb},${((aMin + (aMax - aMin) * Math.pow((b + 0.5) / NB, 0.85)) * g.intro).toFixed(3)})`;
    ctx.beginPath();
    for (let i = 0; i < n; i += 3) {
      ctx.moveTo(buf[i] + buf[i + 2], buf[i + 1]);
      ctx.arc(buf[i], buf[i + 1], buf[i + 2], 0, 6.2832);
    }
    ctx.fill();
  }
}

function drawSphere(g: GlobeState) {
  const ctx = g.ctx!;
  const R = g.R, cx = g.cx, cy = g.cy, c = g.col;
  ctx.save();
  ctx.translate(cx, cy + R * 1.05);
  ctx.scale(1, 0.12);
  let gr = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.66);
  gr.addColorStop(0, `rgba(${c.voyage},0.22)`);
  gr.addColorStop(0.6, `rgba(${c.voyage},0.08)`);
  gr.addColorStop(1, `rgba(${c.voyage},0)`);
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.66, 0, 6.2832);
  ctx.fill();
  ctx.restore();
  gr = ctx.createRadialGradient(cx - R * 0.36, cy - R * 0.42, R * 0.04, cx - R * 0.1, cy - R * 0.1, R * 1.18);
  gr.addColorStop(0, `rgb(${c.white})`);
  gr.addColorStop(0.5, `rgba(${c.cloud},0.55)`);
  gr.addColorStop(1, `rgb(${c.cloud})`);
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, 6.2832);
  ctx.fillStyle = `rgb(${c.white})`;
  ctx.fill();
  ctx.fillStyle = gr;
  ctx.fill();
  gr = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R);
  gr.addColorStop(0, `rgba(${c.sky},0)`);
  gr.addColorStop(1, `rgba(${c.sky},0.10)`);
  ctx.fillStyle = gr;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgb(${c.mist})`;
  ctx.stroke();
}

function ripple(g: GlobeState, hi: number, q: number, rgb: string) {
  const v = hubs[hi].v;
  const ctx = g.ctx!;
  project(v[0], v[1], v[2], g.cl, g.sl, g.ct, g.st, P);
  if (P[2] < 0.08) return;
  const r = Math.max(3, g.R * 0.017) * (1 + 4.2 * (1 - Math.pow(1 - q, 3)));
  ctx.strokeStyle = `rgba(${rgb},${((1 - q) * 0.75 * Math.min(1, P[2] * 3)).toFixed(3)})`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(g.cx + P[0] * g.R, g.cy - P[1] * g.R, r, 0, 6.2832);
  ctx.stroke();
}

function drawArc(g: GlobeState, arc: Arc, now: number, still: boolean) {
  const ctx = g.ctx!;
  const R = g.R, c = g.col;
  const tau = still ? arc.grow + 1 : now - arc.t0;
  if (tau < 0) return;
  let head = 1, tail = 0, life = 1, mix = 1;
  const n = arc.n, pts = arc.pts;
  if (tau < arc.grow) {
    head = ease(tau / arc.grow);
    mix = 0;
  } else {
    mix = Math.min(1, (tau - arc.grow) / 0.6);
    const p0 = (tau - arc.grow - arc.hold) / arc.fade;
    if (p0 > 0) {
      const p = Math.min(1, p0);
      tail = p * p * 0.9;
      life = 1 - p;
    }
  }
  if (n + 2 > sx.length) {
    sx = new Float32Array(n + 8);
    sy = new Float32Array(n + 8);
    sv = new Float32Array(n + 8);
  }
  for (let i = 0; i <= n; i++) {
    project(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2], g.cl, g.sl, g.ct, g.st, P);
    sx[i] = g.cx + P[0] * R;
    sy[i] = g.cy - P[1] * R;
    sv[i] = P[2] >= 0 ? 1 : P[0] * P[0] + P[1] * P[1] > 1.002 ? Math.max(0, LIMB * (1 + P[2] / LIMB_DEPTH)) : 0;
  }
  const tf = tail * n, hf = head * n;
  const i0 = Math.min(n - 1, Math.floor(tf));
  const i1 = Math.min(n, Math.floor(hf));
  let last = i1;
  let hx = sx[i1], hy = sy[i1], hv = sv[i1] > 0;
  if (i1 < n) {
    const fr = hf - i1;
    if (fr > 0.001) {
      hx = sx[i1] + (sx[i1 + 1] - sx[i1]) * fr;
      hy = sy[i1] + (sy[i1 + 1] - sy[i1]) * fr;
      last = i1 + 1;
      hv = sv[i1] > 0 && sv[last] > 0;
    }
  }
  const fr0 = tf - i0;
  if (fr0 > 0.001 && i0 < i1) {
    sx[i0] += (sx[i0 + 1] - sx[i0]) * fr0;
    sy[i0] += (sy[i0 + 1] - sy[i0]) * fr0;
  }
  if (last > i1) {
    sx[last] = hx;
    sy[last] = hy;
  }
  if (last > i0) {
    const aHead = life * (1 - mix + 0.62 * mix);
    const aMid = life * (0.464 * (1 - mix) + 0.62 * mix);
    const aTail = life * (0.2 * (1 - mix) + 0.62 * mix);
    let style: string | CanvasGradient = `rgba(${c.sky},${clamp(aHead, 0, 1).toFixed(3)})`;
    const dx = hx - sx[i0], dy = hy - sy[i0];
    if (mix < 1 && dx * dx + dy * dy > 9) {
      const gr = ctx.createLinearGradient(sx[i0], sy[i0], hx, hy);
      gr.addColorStop(0, `rgba(${c.sky},${clamp(aTail, 0, 1).toFixed(3)})`);
      gr.addColorStop(0.5, `rgba(${c.sky},${clamp(aMid, 0, 1).toFixed(3)})`);
      gr.addColorStop(1, style);
      style = gr;
    }
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(1.2, R * 0.0075);
    ctx.strokeStyle = style;
    ctx.globalAlpha = clamp(g.intro, 0, 1);
    ctx.beginPath();
    let pen = false, any = false;
    for (let i = i0; i < last; i++) {
      if (sv[i] === 1 && sv[i + 1] === 1) {
        if (!pen) {
          ctx.moveTo(sx[i], sy[i]);
          pen = true;
        }
        ctx.lineTo(sx[i + 1], sy[i + 1]);
        any = true;
      } else pen = false;
    }
    if (any) ctx.stroke();
    ctx.lineCap = "butt";
    for (let i = i0; i < last; i++) {
      if (sv[i] === 1 && sv[i + 1] === 1) continue;
      const w = Math.min(sv[i], sv[i + 1]);
      if (w <= 0) continue;
      ctx.globalAlpha = clamp(w * g.intro, 0, 1);
      ctx.beginPath();
      ctx.moveTo(sx[i], sy[i]);
      ctx.lineTo(sx[i + 1], sy[i + 1]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.lineCap = "round";
  }
  if (!still && tau < arc.grow && hv) {
    ctx.fillStyle = `rgba(${c.sky},0.22)`;
    ctx.beginPath();
    ctx.arc(hx, hy, Math.max(4, R * 0.024), 0, 6.2832);
    ctx.fill();
    ctx.fillStyle = `rgb(${c.white})`;
    ctx.strokeStyle = `rgb(${c.sky})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(hx, hy, Math.max(2, R * 0.011), 0, 6.2832);
    ctx.fill();
    ctx.stroke();
  }
  const la = still ? 1 : Math.min(1, tau / 0.35) * life;
  const lb = still ? 1 : tau < arc.grow ? 0 : Math.min(1, (tau - arc.grow) / 0.35) * life;
  if (la > g.lab[arc.a]) g.lab[arc.a] = la;
  if (lb > g.lab[arc.b]) g.lab[arc.b] = lb;
  if (!still) {
    if (tau < 0.9) ripple(g, arc.a, tau / 0.9, c.sky);
    if (tau >= arc.grow && tau < arc.grow + 1.1) ripple(g, arc.b, (tau - arc.grow) / 1.1, c.amber);
  }
}

function drawHubs(g: GlobeState, now: number, still: boolean) {
  const ctx = g.ctx!;
  const R = g.R, c = g.col;
  const r0 = Math.max(3, R * 0.017);
  for (let i = 0; i < hubs.length; i++) {
    const h = hubs[i];
    project(h.v[0], h.v[1], h.v[2], g.cl, g.sl, g.ct, g.st, P);
    const z = P[2];
    if (z < 0.05) continue;
    const vis = Math.min(1, (z - 0.05) / 0.25) * g.intro;
    const x = g.cx + P[0] * R, y = g.cy - P[1] * R, r = r0 * (0.6 + 0.4 * z);
    const ph = still ? 0.42 : (now / 2.6 + h.phase) % 1;
    ctx.strokeStyle = `rgba(${c.amber},${((1 - ph) * 0.55 * vis).toFixed(3)})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(x, y, r * (1.3 + 2.4 * ph), 0, 6.2832);
    ctx.stroke();
    ctx.globalAlpha = vis;
    ctx.fillStyle = `rgb(${c.amber})`;
    ctx.strokeStyle = `rgb(${c.white})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.2832);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    h._x = x;
    h._y = y;
    h._z = z;
    h._r = r;
  }
  const px = Math.round(clamp(R * 0.05, 9, 12));
  ctx.font = `700 ${px}px ${c.mono}`;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  for (let i = 0; i < hubs.length; i++) {
    const h = hubs[i];
    if (g.lab[i] < 0.02) {
      g.side[i] = 2;
      continue;
    }
    project(h.v[0], h.v[1], h.v[2], g.cl, g.sl, g.ct, g.st, P);
    if (P[2] < 0.2) continue;
    let s = g.side[i];
    const q = P[0] * h.pref;
    const want = s > 1.5 ? (q > 0.5 ? -h.pref : h.pref) : q > 0.62 ? -h.pref : q < 0.38 ? h.pref : s < 0 ? -1 : 1;
    if (s > 1.5 || still) s = want;
    else if (s < want) s = Math.min(want, s + 0.12);
    else if (s > want) s = Math.max(want, s - 0.12);
    g.side[i] = s;
    const left = s < 0;
    const tx = h._x! + (left ? -1 : 1) * (h._r! + 6);
    const ty = h._y! + 0.5;
    ctx.globalAlpha = clamp(g.lab[i] * Math.min(1, (P[2] - 0.2) / 0.2) * g.intro * Math.abs(s), 0, 1);
    ctx.textAlign = left ? "right" : "left";
    ctx.strokeStyle = `rgba(${c.white},0.92)`;
    ctx.lineWidth = 3.5;
    ctx.strokeText(h.code, tx, ty);
    ctx.fillStyle = `rgb(${c.ink})`;
    ctx.fillText(h.code, tx, ty);
  }
  ctx.globalAlpha = 1;
}

function orient(g: GlobeState) {
  g.cl = Math.cos(g.lon);
  g.sl = Math.sin(g.lon);
  g.ct = Math.cos(g.tilt);
  g.st = Math.sin(g.tilt);
}
function draw(g: GlobeState, still: boolean) {
  if (!g.ok) return;
  const ctx = g.ctx!;
  const d = build();
  orient(g);
  ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
  ctx.clearRect(0, 0, g.w, g.h);
  drawSphere(g);
  drawDots(g, d.sea, Math.max(0.7, g.R * 0.0042), g.col.sky, 0.05, 0.2);
  drawDots(g, d.land, Math.max(1, g.R * 0.0092), g.col.voyage, 0.16, 0.95);
  for (let i = 0; i < hubs.length; i++) g.lab[i] = 0;
  const arcs = still ? g.stillArcs : g.arcs;
  for (let i = 0; i < arcs.length; i++) drawArc(g, arcs[i], g.time, still);
  drawHubs(g, g.time, still);
}

function spawn(g: GlobeState) {
  orient(g);
  let pick = -1, second = -1;
  for (let k = 0; k < pairs.length && pick < 0; k++) {
    const idx = (g.pairI + k) % pairs.length;
    const pr = pairs[idx];
    let live = false;
    for (let i = 0; i < g.arcs.length; i++) if (g.arcs[i].a === pr[0] && g.arcs[i].b === pr[1]) live = true;
    if (live) continue;
    const a = project(hubs[pr[0]].v[0], hubs[pr[0]].v[1], hubs[pr[0]].v[2], g.cl, g.sl, g.ct, g.st, P)[2];
    const b = project(hubs[pr[1]].v[0], hubs[pr[1]].v[1], hubs[pr[1]].v[2], g.cl, g.sl, g.ct, g.st, P)[2];
    if (a > 0.15 && b > 0.1) pick = idx;
    else if (second < 0 && a > 0.2 && b > -0.35) second = idx;
  }
  if (pick < 0) pick = second;
  if (pick < 0) pick = g.pairI % pairs.length;
  g.pairI = pick + 1;
  const pr = pairs[pick];
  g.arcs.push(makeArc(pr[0], pr[1], g.time));
  try {
    g.canvas.dispatchEvent(
      new CustomEvent("ww:arc", {
        bubbles: true,
        detail: { from: { code: hubs[pr[0]].code, city: hubs[pr[0]].city }, to: { code: hubs[pr[1]].code, city: hubs[pr[1]].city } },
      })
    );
  } catch {
    // ignore
  }
}
function step(g: GlobeState, dt: number) {
  g.time += dt;
  g.intro = Math.min(1, g.intro + dt / 0.9);
  if (!g.drag) {
    g.vLon += (AUTO - g.vLon) * (1 - Math.exp(-dt / 1.2));
    g.lon += g.vLon * dt;
    g.vTilt *= Math.exp(-dt / 0.3);
    g.tilt += g.vTilt * dt + (BASE_TILT - g.tilt) * (1 - Math.exp(-dt / 2.2));
  }
  g.tilt = clamp(g.tilt, -MAX_TILT, MAX_TILT);
  if (g.lon > PI) g.lon -= 2 * PI;
  else if (g.lon < -PI) g.lon += 2 * PI;
  for (let i = g.arcs.length - 1; i >= 0; i--) {
    const a = g.arcs[i];
    if (g.time - a.t0 > a.grow + a.hold + a.fade) g.arcs.splice(i, 1);
  }
  if (g.time >= g.nextSpawn) {
    g.nextSpawn = g.time + SPAWN_EVERY;
    if (g.arcs.length < 4) spawn(g);
  }
}

function reducedNow(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
function measure(g: GlobeState): boolean {
  const w = g.canvas.clientWidth || 0, h = g.canvas.clientHeight || 0;
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  g.ok = w > 8 && h > 8;
  if (!g.ok) return false;
  const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
  const changed = pw !== g.canvas.width || ph !== g.canvas.height || dpr !== g.dpr;
  if (changed) {
    g.canvas.width = pw;
    g.canvas.height = ph;
  }
  g.w = w;
  g.h = h;
  g.dpr = dpr;
  g.cx = w / 2;
  g.cy = h / 2;
  g.R = Math.min(w, h) * 0.5 * FILL;
  return changed;
}
function canRun(g: GlobeState) {
  return g.active && g.inView && !document.hidden && g.ok && !reducedNow();
}
function fail(g: GlobeState, e: unknown) {
  g.dead = true;
  if (g.raf) {
    try {
      window.cancelAnimationFrame(g.raf);
    } catch {
      // ignore
    }
    g.raf = 0;
  }
  if (window.console) console.error("[WW globe]", e);
}
function paint(g: GlobeState, still: boolean) {
  if (g.dead) return;
  try {
    draw(g, still);
  } catch (e) {
    fail(g, e);
  }
}
function sync(g: GlobeState, tick: (t: number) => void) {
  if (g.dead) return;
  if (canRun(g)) {
    if (!g.raf) {
      g.last = 0;
      g.raf = window.requestAnimationFrame(tick);
    }
  } else {
    if (g.raf) {
      window.cancelAnimationFrame(g.raf);
      g.raf = 0;
    }
    if (g.active && g.ok && reducedNow()) {
      g.intro = 1;
      paint(g, true);
    }
  }
}
function refresh(g: GlobeState, tick: (t: number) => void) {
  if (g.dead) return;
  const changed = measure(g);
  sync(g, tick);
  if (changed && g.ok && g.active && !reducedNow()) paint(g, false);
}

export type GlobeHandle = {
  start: () => void;
  pause: () => void;
  destroy: () => void;
};

// Creates and starts a globe bound to one canvas element. Call `destroy()`
// on unmount to tear down observers/animation frames.
export function createGlobe(canvas: HTMLCanvasElement): GlobeHandle {
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext("2d");
  } catch {
    // ignore
  }
  const g: GlobeState = {
    canvas,
    ctx,
    dead: !ctx || !window.requestAnimationFrame,
    col: theme(),
    active: false,
    inView: true,
    ok: false,
    raf: 0,
    last: 0,
    dpr: 0,
    time: 0,
    intro: reducedNow() ? 1 : 0,
    nextSpawn: 0.5,
    pairI: 0,
    lon: START_LON,
    tilt: BASE_TILT,
    vLon: AUTO,
    vTilt: 0,
    arcs: [],
    lab: new Float32Array(hubs.length),
    drag: null,
    side: new Float32Array(hubs.length),
    stillArcs: staticPairSource.map((p) => makeArc(p[0], p[1], 0)),
    w: 0,
    h: 0,
    cx: 0,
    cy: 0,
    R: 0,
    cl: 0,
    sl: 0,
    ct: 0,
    st: 0,
  };
  for (let k = 0; k < hubs.length; k++) g.side[k] = 2;
  if (!reducedNow()) {
    g.lon = START_LON + 0.62;
    g.vLon = AUTO * 8.5;
  }

  if (g.dead) {
    return { start: () => {}, pause: () => {}, destroy: () => {} };
  }

  function tick(t: number) {
    g.raf = 0;
    if (!canRun(g)) return;
    const dt = g.last ? Math.min(0.05, Math.max(0, (t - g.last) / 1000)) : 0.016;
    g.last = t;
    try {
      step(g, dt);
      draw(g, false);
    } catch (e) {
      fail(g, e);
      return;
    }
    if (!g.raf) g.raf = window.requestAnimationFrame(tick);
  }

  function onResize() {
    refresh(g, tick);
  }
  if ("ResizeObserver" in window) {
    try {
      g.ro = new ResizeObserver(onResize);
      g.ro.observe(canvas);
    } catch {
      // ignore
    }
  }
  g.onResize = onResize;
  if ("IntersectionObserver" in window) {
    try {
      g.io = new IntersectionObserver(
        (entries) => {
          if (!entries.length) return;
          g.inView = !!entries[entries.length - 1].isIntersecting;
          if (g.inView) refresh(g, tick);
          else sync(g, tick);
        },
        { rootMargin: "80px" }
      );
      g.io.observe(canvas);
    } catch {
      // ignore
    }
  }

  function end(e: PointerEvent) {
    if (!g.drag || e.pointerId !== g.drag.id) return;
    const d = g.drag;
    g.drag = null;
    canvas.classList.remove("is-grabbing");
    try {
      canvas.releasePointerCapture(d.id);
    } catch {
      // ignore
    }
    const idle = (window.performance ? performance.now() : Date.now()) - d.t > 120;
    g.vLon = idle ? 0 : clamp(-d.vx / g.R, -2.4, 2.4);
    g.vTilt = idle ? 0 : clamp(d.vy / g.R, -1.2, 1.2);
  }
  function onPointerDown(e: PointerEvent) {
    if (g.dead || !g.ok || !g.active || (e.pointerType === "mouse" && e.button !== 0)) return;
    g.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: window.performance ? performance.now() : Date.now(), vx: 0, vy: 0 };
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    canvas.classList.add("is-grabbing");
    if (e.pointerType === "mouse") e.preventDefault();
  }
  function onPointerMove(e: PointerEvent) {
    const d = g.drag;
    if (!d || e.pointerId !== d.id) return;
    const now = window.performance ? performance.now() : Date.now();
    const dx = e.clientX - d.x, dy = e.clientY - d.y, dt = Math.max(1, now - d.t) / 1000;
    d.x = e.clientX;
    d.y = e.clientY;
    d.t = now;
    d.vx = d.vx * 0.6 + (dx / dt) * 0.4;
    d.vy = d.vy * 0.6 + (dy / dt) * 0.4;
    g.lon -= dx / g.R;
    g.tilt = clamp(g.tilt + dy / g.R, -MAX_TILT, MAX_TILT);
    if (reducedNow()) paint(g, true);
  }
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  canvas.addEventListener("lostpointercapture", end as EventListener);

  function onVisibility() {
    sync(g, tick);
  }
  document.addEventListener("visibilitychange", onVisibility);

  return {
    start() {
      g.active = true;
      refresh(g, tick);
    },
    pause() {
      g.active = false;
      g.drag = null;
      canvas.classList.remove("is-grabbing");
      sync(g, tick);
    },
    destroy() {
      g.dead = true;
      if (g.raf) window.cancelAnimationFrame(g.raf);
      g.ro?.disconnect();
      g.io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", end);
      canvas.removeEventListener("pointercancel", end);
      canvas.removeEventListener("lostpointercapture", end as EventListener);
    },
  };
}
