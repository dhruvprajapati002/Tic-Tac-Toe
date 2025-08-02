export default function WinningLine({ indices }) {
  // Mapping board index to grid cell center positions
  const posMap = {
    0: [0, 0], 1: [1, 0], 2: [2, 0],
    3: [0, 1], 4: [1, 1], 5: [2, 1],
    6: [0, 2], 7: [1, 2], 8: [2, 2],
  };

  const [x1, y1] = posMap[indices[0]];
  const [x2, y2] = posMap[indices[2]];

  const cellSize = 96; // 24rem => Tailwind: w-24 h-24
  const offset = cellSize / 2;

  const xStart = x1 * cellSize + offset;
  const yStart = y1 * cellSize + offset;
  const xEnd = x2 * cellSize + offset;
  const yEnd = y2 * cellSize + offset;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
    >
      <line
        x1={xStart}
        y1={yStart}
        x2={xEnd}
        y2={yEnd}
        stroke="lime"
        strokeWidth="6"
        strokeLinecap="round"
      >
        <animate
          attributeName="x2"
          from={xStart}
          to={xEnd}
          dur="0.4s"
          fill="freeze"
        />
        <animate
          attributeName="y2"
          from={yStart}
          to={yEnd}
          dur="0.4s"
          fill="freeze"
        />
      </line>
    </svg>
  );
}
