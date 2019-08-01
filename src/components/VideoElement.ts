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
  return object;
};
