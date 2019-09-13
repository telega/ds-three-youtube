import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject
} from "../../node_modules/three/examples/jsm/renderers/CSS3DRenderer";
import { TrackballControls } from "../../node_modules/three/examples/jsm/controls/TrackballControls";
import { VideoElement, VideoObject } from "../components/VideoObject";
import { VideoIdList } from "../components/VideoIdList";
import { random, remove } from "lodash";
import * as _ from "lodash";

const MAX_VIDEO_OBJECTS = 10;
const VIDEO_ADD_INTERVAL = 10; //seconds
const VIDEO_REMOVE_INTERVAL = 20; // seconds
//const INITIAL_VIDEO_COUNT = 3;

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: CSS3DRenderer;
let controls: TrackballControls;
let videoIdList: VideoIdList;
let videoObjects: VideoObject[] = [];
//const group = new THREE.Group();
const clock = new THREE.Clock();

run();

async function run() {
  await init();
  animate();
}

async function addVideoObject() {
  if (videoObjects.length > MAX_VIDEO_OBJECTS) {
    console.log("returning");
    return;
  }
  const elapsedTime = clock.getElapsedTime();
  const videoId = await videoIdList.getVideoId();
  const createTime = elapsedTime;

  const videoObject = new VideoObject(
    VideoElement(
      videoId,
      random(0, 240, false),
      random(0, 240, false),
      random(0, 240, false),
      random(0, 360, false)
    ),
    random(-0.5, 0.5, true),
    random(-0.5, 0.5, true),
    random(-0.5, 0.5, true),
    createTime
  );
  videoObjects.push(videoObject);
  scene.add(videoObject.videoElement);
}

async function initVideoObjects() {
  await addVideoObject();
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

  await initVideoObjects();

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

async function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  //group.position.setX(group.position.x + 0.1);
  videoObjects.forEach(vo => vo.animate());
  await addNewVideoObjects();
  await removeStaleVideoObjects();
}

async function addNewVideoObjects() {
  console.log(videoObjects.length);
  if (videoObjects.length < MAX_VIDEO_OBJECTS) {
    const lastVideoObject = videoObjects[length - 1];
    const lastCreateTime = lastVideoObject ? lastVideoObject.createTime : 0;
    if (lastCreateTime + VIDEO_ADD_INTERVAL < clock.getElapsedTime()) {
      await addVideoObject();
    }
  }
}

async function removeStaleVideoObjects() {
  const elapsedTime = clock.getElapsedTime();
  const objectsToRemove: string[] = [];

  videoObjects.forEach(vo => {
    if (vo.createTime + VIDEO_REMOVE_INTERVAL < elapsedTime) {
      objectsToRemove.push(vo.videoElement.name);
    }
  });

  objectsToRemove.forEach(name => {
    const object = scene.getObjectByName(name);
    if (object) {
      scene.remove(object);
      remove(videoObjects, vo => vo.videoElement.name === name);
    }
  });
}
