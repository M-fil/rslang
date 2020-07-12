import paintings1 from '../paintings-collection/level1';
import paintings2 from '../paintings-collection/level2';
import paintings3 from '../paintings-collection/level3';
import paintings4 from '../paintings-collection/level4';
import paintings5 from '../paintings-collection/level5';
import paintings6 from '../paintings-collection/level6';

function findPaintingFromPage(page, masOfPaintings) {
  let painting = masOfPaintings.filter((el) => Number(el.id.split('_')[1]) === page)[0];
  if (!painting) {
    [painting] = masOfPaintings;
  }
  return painting;
}

export default function findPainting(level, page) {
  let mas = null;
  switch (level) {
    case 1:
      mas = paintings1;
      break;
    case 2:
      mas = paintings2;
      break;
    case 3:
      mas = paintings3;
      break;
    case 4:
      mas = paintings4;
      break;
    case 5:
      mas = paintings5;
      break;
    default:
      mas = paintings6;
      break;
  }
  return findPaintingFromPage(page, mas);
}
