function _getDocumentWidth() {
  return document.body.clientWidth || document.documentElement.clientWidth;
}

function _getDocumentHeight() {
  return document.body.clientHeight || document.documentElement.clientHeight;
}

function getDocumentSize() {
//   if (document.getElementById("graph-container")) {
//     return {
//       width: document.getElementById("graph-container").clientWidth,
//       height: document.getElementById("graph-container").clientHeight,
//     };
//   }
  return {
    width: _getDocumentWidth() ,
    height: _getDocumentHeight() ,
  };
}

function openInNewTab(url) {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
}

export { getDocumentSize, openInNewTab };
