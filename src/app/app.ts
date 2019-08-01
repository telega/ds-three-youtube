import * as THREE from "three";
import { CSS3DRenderer } from "../../node_modules/three/examples/jsm/renderers/CSS3DRenderer";
import { TrackballControls } from "../../node_modules/three/examples/jsm/controls/TrackballControls";
import { VideoElement } from "../components/VideoElement";
import { getVideoId } from "../components/VideoId";
import { config } from "../config";

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: CSS3DRenderer;
let controls: TrackballControls;
const group = new THREE.Group();

init();
animate();
function init() {
  let container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  camera.position.set(500, 350, 750);
  scene = new THREE.Scene();
  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (container) {
    container.appendChild(renderer.domElement);
  }
  group.add(VideoElement(getVideoId(), 0, 0, 240, 0));
  group.add(VideoElement(getVideoId(), 240, 0, 0, Math.PI / 2));
  group.add(VideoElement(getVideoId(), 0, 0, -240, Math.PI));
  group.add(VideoElement(getVideoId(), -240, 0, 0, -Math.PI / 2));
  scene.add(group);
  controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 4;
  window.addEventListener("resize", onWindowResize, false);
  // Block iframe events when dragging camera
  let blocker = document.getElementById("blocker");
  if (blocker) {
    blocker.style.display = "none";
  }
  controls.addEventListener("start", function() {
    if (blocker) {
      blocker.style.display = "";
    }
  });
  controls.addEventListener("end", function() {
    if (blocker) {
      blocker.style.display = "none";
    }
  });
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  group.position.setX(group.position.x + 0.1);
}
