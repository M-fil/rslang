function hidingElement(...el) {
  el.forEach((e) => e.classList.add('hidden-element'));
}

function showingElement(...el) {
  el.forEach((e) => e.classList.remove('hidden-element'));
}

function cleanParentNode(par) {
  while (par.firstChild) {
    if (par.firstChild) {
      par.removeChild(par.firstChild);
    }
  }
}

export {
  hidingElement,
  showingElement,
  cleanParentNode,
};
