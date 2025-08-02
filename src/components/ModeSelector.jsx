export default function ModeSelector({ onSelectMode }) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-2xl font-semibold">Choose Game Mode</h2>
      <button
        onClick={() => onSelectMode("2P")}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        2 Player Mode
      </button>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Vs Computer</h3>
        {["Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() => onSelectMode(level)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {level} Mode
          </button>
        ))}
      </div>
    </div>
  );
}
