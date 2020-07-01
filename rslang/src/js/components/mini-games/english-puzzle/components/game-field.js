import create from '../../../../utils/сreate';
import {
  PUZZLE_PROPERTIES,
} from '../../../../constants/constatntsForEP';

export default async function createCanvasElements(
  {
    src,
    wordsList,
  },
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const groupsWords = wordsList.map((word) => word.split(' '));
      const groupsRow = groupsWords.length;
      const EXTRA_WIDTH_VALUE = parseInt(PUZZLE_PROPERTIES.extraWidthValue, 10);
      const result = [];

      let startYPointCropImage = 0;

      groupsWords.forEach((words, i) => {
        const row = create('div', `group-words row-${i + 1}`);
        const wordCount = words.length;
        const letterCounts = words.reduce((acc, val) => acc + val.replace(/<[^>]*>/g, '').length, 0);
        const reduceLength = letterCounts * EXTRA_WIDTH_VALUE;
        const extraWidth = Math.round(reduceLength / wordCount);
        const onePart = Math.round((imgWidth - reduceLength) / letterCounts);
        const canvasHeight = Math.round(imgHeight / groupsRow);
        let widthCount = 0;

        words.forEach((w, j) => {
          const word = w.replace(/<[^>]*>/g, '');
          const canvas = create('canvas', `canvas-item canvas-row-${i + 1} canvas-item-${j + 1}`);
          canvas.setAttribute('data-item', `${i + 1}-${j + 1}`);
          canvas.setAttribute('data-word', word);

          const ctx = canvas.getContext('2d');
          const canvasWidth = (j === wordCount - 1) ? imgWidth - widthCount
            : (word.length * onePart) + extraWidth;
          widthCount += canvasWidth;

          const x1 = 0;
          const y1 = Math.round(canvasHeight / 3);
          const y2 = Math.round((canvasHeight / 3) * 2);
          const centerY = canvasHeight / 2;
          const radius = Math.round((canvasHeight / 3) / 2);
          const startXPointCropImage = widthCount - canvasWidth;
          const fontSize = Math.round(canvasHeight / 4);

          ctx.canvas.width = canvasWidth + radius;
          ctx.canvas.height = canvasHeight;
          ctx.beginPath();

          if (j) {
            ctx.arc(x1, centerY, radius, Math.PI / 2, Math.PI * 1.5, true);
          }

          ctx.lineTo(0, y1);
          ctx.lineTo(0, 0);
          ctx.lineTo(canvasWidth, 0);
          ctx.lineTo(canvasWidth, y1);

          if (j !== wordCount - 1) {
            ctx.arc(canvasWidth, centerY, radius, Math.PI * 1.5, Math.PI / 2, false);
          }

          ctx.lineTo(canvasWidth, y2);
          ctx.lineTo(canvasWidth, canvasHeight);
          ctx.lineTo(0, canvasHeight);
          ctx.lineTo(0, y2);

          if (!j) {
            ctx.lineTo(0, y1);
          }

          ctx.clip();

          ctx.drawImage(
            img,
            startXPointCropImage,
            startYPointCropImage,
            canvasWidth + radius,
            canvasHeight,
            0,
            0,
            canvasWidth + radius,
            canvasHeight,
          );
          ctx.shadowColor = PUZZLE_PROPERTIES.colorShadowBorder;
          ctx.strokeStyle = PUZZLE_PROPERTIES.colorBorder;
          ctx.shadowBlur = PUZZLE_PROPERTIES.shadowPuzzle;
          ctx.lineWidth = PUZZLE_PROPERTIES.borderPuzzle;
          ctx.stroke();
          ctx.globalCompositeOperation = 'destination-in';
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          ctx.beginPath();
          ctx.shadowColor = PUZZLE_PROPERTIES.colorShadowText;
          ctx.shadowBlur = PUZZLE_PROPERTIES.shadowText;
          ctx.lineWidth = PUZZLE_PROPERTIES.borderText;
          ctx.strokeStyle = PUZZLE_PROPERTIES.colorText;
          ctx.font = `${PUZZLE_PROPERTIES.fontType} ${fontSize * PUZZLE_PROPERTIES.fontRatio}pt ${PUZZLE_PROPERTIES.fontFamily}`;
          ctx.textAlign = 'center';
          ctx.fillStyle = PUZZLE_PROPERTIES.solidTextColor;
          ctx[PUZZLE_PROPERTIES.fontStyle](
            word,
            canvasWidth / 2 + radius / 2,
            canvasHeight / 2 + fontSize / 3,
          );
          row.appendChild(canvas);
        });
        startYPointCropImage += canvasHeight;
        result.push(row);
      });
      resolve(result);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}
