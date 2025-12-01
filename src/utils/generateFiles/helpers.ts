const ARIAL_AVERAGE_CHAR_WIDTH = 0.5; // Approximation for Arial font

export const calculateArialTextHeight = (
  text: string,
  fontSize: number,
  lineHeight: number,
  maxWidth: number
) => {
  const averageCharWidth = fontSize * ARIAL_AVERAGE_CHAR_WIDTH; // Approximation for Arial
  const words = text.split(' ');
  let lineCount = 1;
  let currentLineWidth = 0;

  words.forEach((word) => {
    const wordWidth = word.length * averageCharWidth;
    if (currentLineWidth + wordWidth > maxWidth) {
      lineCount++;
      currentLineWidth = wordWidth + averageCharWidth; // account for space
    } else {
      currentLineWidth += wordWidth + averageCharWidth; // account for space
    }
  });

  return lineCount * lineHeight;
};
