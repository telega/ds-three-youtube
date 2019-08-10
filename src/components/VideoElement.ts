import { CSS3DObject } from "../../node_modules/three/examples/jsm/renderers/CSS3DRenderer";
export const VideoElement = (
  id: string,
  x: number,
  y: number,
  z: number,
  ry: number
) => {
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
  div.appendChild(iframe);
  const object = new CSS3DObject(div);
  object.position.set(x, y, z);
  object.rotation.y = ry;
  object.name = id;
  return object;
};

export class VideoObject {
  public videoElement: CSS3DObject;
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;
  public dx: number = 0;
  public dy: number = 0;
  public dz: number = 0;

  constructor(
    videoElement: CSS3DObject,
    dx: number = 0,
    dy: number = 0,
    dz: number = 0
  ) {
    const { x, y, z } = videoElement.position;
    this.videoElement = videoElement;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  animate() {
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;
    this.videoElement.position.set(this.x, this.y, this.z);
  }
}
