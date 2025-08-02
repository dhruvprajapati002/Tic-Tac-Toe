import { useState, useEffect } from "react";
import ModeSelector from "./ModeSelector";
import WinningLine from "./WinningLine";

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const emptyBoard = Array(9).fill(null);

export default function TicTacToe() {
  const [board, setBoard] = useState(emptyBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const currentPlayer = isXNext ? "X" : "O";

  useEffect(() => {
    if (mode && !isXNext && mode !== "2P" && !winner) {
      const timeout = setTimeout(() => {
        makeComputerMove(mode);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [board, isXNext, mode]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    checkGameResult(newBoard);
    setIsXNext(!isXNext);
  };

  const makeComputerMove = (difficulty) => {
    const available = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);
    let move;

    if (difficulty === "Easy") {
      move = available[Math.floor(Math.random() * available.length)];
    }

    if (difficulty === "Medium") {
      move = findBestMove("O");
      if (move === null) move = findBestMove("X");
      if (move === null) move = available[Math.floor(Math.random() * available.length)];
    }

    if (difficulty === "Hard") {
      move = getBestMove(board, "O");
    }

    if (move !== undefined) handleClick(move);
  };

  function getBestMove(boardState, aiPlayer) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === null) {
        const newBoard = [...boardState];
        newBoard[i] = aiPlayer;
        const score = minimax(newBoard, 0, false, aiPlayer);
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(boardState, depth, isMaximizing, aiPlayer) {
    const humanPlayer = aiPlayer === "X" ? "O" : "X";
    const result = calculateWinner(boardState);

    if (result === aiPlayer) return 10 - depth;
    if (result === humanPlayer) return depth - 10;
    if (result === "Draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (boardState[i] === null) {
          boardState[i] = aiPlayer;
          const score = minimax(boardState, depth + 1, false, aiPlayer);
          boardState[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (boardState[i] === null) {
          boardState[i] = humanPlayer;
          const score = minimax(boardState, depth + 1, true, aiPlayer);
          boardState[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  const findBestMove = (player) => {
    for (let [a, b, c] of WIN_PATTERNS) {
      const line = [board[a], board[b], board[c]];
      const count = line.filter((v) => v === player).length;
      const emptyIndex = [a, b, c].find((i) => board[i] === null);
      if (count === 2 && emptyIndex !== undefined) {
        return emptyIndex;
      }
    }
    return null;
  };

  const checkGameResult = (newBoard) => {
    const foundWinner = calculateWinner(newBoard);
    if (foundWinner) {
      setWinner(foundWinner);
      setScores((prev) => ({
        ...prev,
        [foundWinner === "Draw" ? "Draws" : foundWinner]: prev[foundWinner === "Draw" ? "Draws" : foundWinner] + 1,
      }));
    }
  };

  function calculateWinner(squares) {
    for (let [a, b, c] of WIN_PATTERNS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningLine([a, b, c]);
        return squares[a];
      }
    }
    return squares.includes(null) ? null : "Draw";
  }

  const resetBoard = () => {
    setBoard(emptyBoard);
    setWinner(null);
    setIsXNext(true);
    setWinningLine([]);
  };

  const resetAll = () => {
    resetBoard();
    setScores({ X: 0, O: 0, Draws: 0 });
    setMode(null);
  };

  if (!mode) return <ModeSelector onSelectMode={setMode} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white animate-fade-in">
        Tic Tac Toe
      </h1>

      <div className="relative grid grid-cols-3 gap-2 mb-4">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`relative w-24 h-24 rounded-xl text-3xl font-bold shadow transition-all duration-200
              ${val === "X" ? "text-blue-500" : "text-pink-500"}
              ${val ? "bg-white" : "bg-gray-100 hover:bg-gray-200"}
              dark:${val ? "bg-gray-800" : "bg-gray-700 hover:bg-gray-600"}
              flex items-center justify-center`}
          >
            <span className="animate-scale">{val}</span>
          </button>
        ))}

        {winningLine.length > 0 && <WinningLine indices={winningLine} />}
      </div>

      <div className="text-lg mb-2 text-center text-gray-700 dark:text-gray-300">
        {winner
          ? winner === "Draw"
            ? "It's a Draw!"
            : `🎉 ${winner} Wins!`
          : `Next Turn: ${currentPlayer}`}
      </div>

      <div className="flex gap-3 mb-4">
        <button onClick={resetBoard} className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600">
          Play Again
        </button>
        <button onClick={resetAll} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600">
          Reset All
        </button>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2">Scoreboard</h2>
        <div className="grid grid-cols-3 gap-4 text-lg">
          <div className="text-blue-500">X: {scores.X}</div>
          <div className="text-gray-700 dark:text-gray-300">Draws: {scores.Draws}</div>
          <div className="text-pink-500">O: {scores.O}</div>
        </div>
      </div>
    </div>
  );
}