import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject
} from "../../node_modules/three/examples/jsm/renderers/CSS3DRenderer";
import { TrackballControls } from "../../node_modules/three/examples/jsm/controls/TrackballControls";
import { Group } from "three";

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: CSS3DRenderer;
let controls: TrackballControls;
const group = new THREE.Group();

const Element = (id: string, x: number, y: number, z: number, ry: number) => {
  var div = document.createElement("div");
  div.style.width = "480px";
  div.style.height = "360px";
  div.style.backgroundColor = "#000";
  div.style.opacity = "0.5";
  const iframe = document.createElement("iframe");
  iframe.setAttribute("allow", "autoplay");
  iframe.style.width = "480px";
  iframe.style.height = "360px";
  iframe.style.border = "0px";
  iframe.src = [
    "https://www.youtube.com/embed/",
    id,
    "?autoplay=1&mute=1"
  ].join("");
  console.log(iframe.src);
  div.appendChild(iframe);
  const object = new CSS3DObject(div);
  object.position.set(x, y, z);
  object.rotation.y = ry;
  return object;
};

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
  group.add(Element("SJOz3qjfQXU", 0, 0, 240, 0));
  group.add(Element("Y2-xZ-1HE-Q", 240, 0, 0, Math.PI / 2));
  group.add(Element("IrydklNpcFI", 0, 0, -240, Math.PI));
  group.add(Element("9ubytEsCaS0", -240, 0, 0, -Math.PI / 2));
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
