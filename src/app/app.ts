import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject
} from "../../node_modules/three/examples/jsm/renderers/CSS3DRenderer";
import { TrackballControls } from "../../node_modules/three/examples/jsm/controls/TrackballControls";
import { VideoElement, VideoObject } from "../components/VideoElement";
import { VideoIdList } from "../components/VideoIdList";
import { random } from "lodash";

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: CSS3DRenderer;
let controls: TrackballControls;
let videoIdList: VideoIdList;
let videoObjects: VideoObject[] = [];
const group = new THREE.Group();

run();

async function run() {
  await init();
  animate();
}

async function initVideoObjects(n = 5) {
  while (n >= 1) {
    videoObjects.push(
      new VideoObject(
        VideoElement(
          await videoIdList.getVideoId(),
          random(0, 240, false),
          random(0, 240, false),
          random(0, 240, false),
          random(0, 360, false)
        ),
        random(-0.5, 0.5, true),
        random(-0.5, 0.5, true),
        random(-0.5, 0.5, true)
      )
    );
    n--;
  }

  videoObjects.forEach(vo => scene.add(vo.videoElement));
}

async function init() {
  videoIdList = new VideoIdList();
  await videoIdList.init();

  let container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  camera.position.set(500, 350, 750);
  scene = new THREE.Scene();

  // const fog = new THREE.FogExp2(0xffffff, 0.8);
  // scene.fog = fog;

  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (container) {
    container.appendChild(renderer.domElement);
  }

  await initVideoObjects(2);

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
  //group.position.setX(group.position.x + 0.1);

  videoObjects.forEach(vo => vo.animate());
}
