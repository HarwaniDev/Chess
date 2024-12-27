const ChessBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  return (
    <div className="w-full max-w-md mx-auto aspect-square">
      <div className="grid grid-cols-8 gap-0 border-4 border-green-800">
        {board.map((row, i) =>
          row.map((_, j) => {
            const isWhite = (i + j) % 2 === 0;
            return (
              <div
                key={`${i}-${j}`}
                className={`aspect-square ${
                  isWhite ? 'bg-white' : 'bg-green-600'
                }`}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;

