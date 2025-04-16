// renderer.js

// If the URL does NOT include "skipRedirect=true" and there is no hash, then redirect to dashboard.html.
if (
  window.location.href.indexOf("skipRedirect=true") === -1 &&
  window.location.hash === ""
) {
  window.location.replace("dashboard.html");
}

document.addEventListener("DOMContentLoaded", () => {
  let currentZoom = 1;
  const mainContainer = document.querySelector(".main-container");
  
  document.getElementById("zoomIn").addEventListener("click", () => {
    currentZoom += 0.1;
    applyZoom();
  });
  
  document.getElementById("zoomOut").addEventListener("click", () => {
    currentZoom = Math.max(0.3, currentZoom - 0.1);
    applyZoom();
  });
  
  document.getElementById("zoomReset").addEventListener("click", () => {
    currentZoom = 1;
    applyZoom();
  });
  
  function applyZoom() {
    mainContainer.style.transform = `scale(${currentZoom})`;
    mainContainer.style.transformOrigin = "top left";
  }
});
