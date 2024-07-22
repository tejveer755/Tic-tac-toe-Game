import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [board, setBoard] = useState(
    JSON.parse(localStorage.getItem('board')) || Array(9).fill(null)
  );
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Track player turn
  const [gameMode, setGameMode] = useState(
    localStorage.getItem('gameMode') || ""
  ); // Retrieve game mode from localStorage

  useEffect(() => {
    localStorage.setItem('board', JSON.stringify(board));
    if (!isPlayerTurn && gameMode === 'computer') {
      const timer = setTimeout(() => {
        handleComputerMove();
      }, 700); // Add a slight delay for the computer's move
      return () => clearTimeout(timer);
    }
  }, [board, isPlayerTurn, gameMode]);

  const handleClick = (id) => {
    if (board[id] !== null || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[id] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard)) {
      setTimeout(() => {
        alert(`Player ${currentPlayer} wins!`);
        resetGame();
      }, 10);
    } else if (newBoard.every(cell => cell !== null)) {
      setTimeout(() => {
        alert('It\'s a draw!');
        resetGame();
      }, 10);
    } else {
      if (gameMode === 'computer') {
        setIsPlayerTurn(false);
        setCurrentPlayer("O"); // Switch to computer's turn
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    }
  };

  const handleComputerMove = () => {
    const emptyIndices = board.reduce((acc, cell, index) => {
      if (cell === null) acc.push(index);
      return acc;
    }, []);

    // Attempt to win or block
    const winningMove = findBestMove(board, "O");
    const blockingMove = findBestMove(board, "X");

    const move =
      winningMove !== -1
        ? winningMove
        : blockingMove !== -1
          ? blockingMove
          : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    const newBoard = [...board];
    newBoard[move] = "O"; // Computer is "O"
    setBoard(newBoard);

    if (checkWinner(newBoard)) {
      setTimeout(() => {
        alert(`Computer wins!`);
        resetGame();
      }, 10);
    } else if (newBoard.every(cell => cell !== null)) {
      setTimeout(() => {
        alert('It\'s a draw!');
        resetGame();
      }, 10);
    } else {
      setIsPlayerTurn(true);
      setCurrentPlayer("X"); // Switch back to player's turn
    }
  };

  const findBestMove = (board, player) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] === player && board[b] === player && board[c] === null)
        return c;
      if (board[a] === player && board[b] === null && board[c] === player)
        return b;
      if (board[a] === null && board[b] === player && board[c] === player)
        return a;
    }
    return -1;
  };

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setIsPlayerTurn(true); // Start with player's turn
  };

  const handleModeSelection = (mode) => {
    setGameMode(mode);
    localStorage.setItem('gameMode', mode); // Save mode to localStorage
    resetGame(); // Reset the game when mode changes
  };

  return (
    <>
    <h2>Made by: <a href="https://github.com/tejveer755">Tejveer Singh </a>🦅</h2>
      {!gameMode  ? (
        <div className="homepage">
          <h1>Select Mode</h1>
          <button onClick={() => handleModeSelection('computer')}>Play with Computer</button>
          <button onClick={() => handleModeSelection('friend')}>Play with Friend</button>
        </div>
      ) : (
        <>
          <h1  className="status">Current Mode : {gameMode}</h1>
          <h1 className="status">Current Player: {currentPlayer}</h1>
          <div className="game-container">
            <div className="game-board">
              {board.map((value, index) => (
                <div
                  key={index}
                  className="cell"
                  onClick={() => handleClick(index)}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
          <div className="btns">
            <button className="reset-btn" onClick={resetGame}>Restart</button>
            <button className="reset-btn" onClick={() => handleModeSelection(null)}>Change Mode</button>
          </div>
        </>
      )}
    </>
  );
};

export default App;
