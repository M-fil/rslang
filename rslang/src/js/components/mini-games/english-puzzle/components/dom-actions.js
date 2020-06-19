function viewElement(hide, show) {
  if (hide.length) {
    hide.forEach((e) => e.classList.add('hidden-element'));
  }
  if (show.length) {
    show.forEach((e) => e.classList.remove('hidden-element'));
  }
}

function cleanParentNode(par) {
  while (par.firstChild) {
    if (par.firstChild) {
      par.removeChild(par.firstChild);
    }
  }
}

export {
  viewElement,
  cleanParentNode,
};
