var BI = {
    GRID_SIDE: 8,
    HARD: 0.9,
    MEDIUM: 0.85,
    // EASY: 0.4,
    EASY: 0.6,

    selectedToken: '',
    selectedDifficulty: null,
    board: [],
    fullBoard: [],
    startBoard: [],
    
    init: function () {
        FastClick.attach(document.body);
        BI.selectedDifficulty = BI.EASY;
        BI.initGrid(BI.GRID_SIDE);
        BI.initControls();
        BI.newGame();
        
    },
    
    initGrid: function (gridSide) {
        var grid = document.getElementById('grid');

        var w = grid.getAttribute("width");
        var h = grid.getAttribute("height");

        var l = w < h ? w : h;
        var cw = (~~(l / gridSide));
        var ch = (~~(l / gridSide));
        var y = 0;

        for(var j = 0; j < gridSide; j++) {
            var x = 0;
            for(var i = 0; i < gridSide; i++) {
                var cell = document.createElementNS("http://www.w3.org/2000/svg", "g");
                cell.setAttribute("class", "cell");
                cell.setAttribute("cell-number", j*8+i);
                cell.onclick = BI.cellSelectionHandler;
                grid.appendChild(cell);

                var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("width", cw);
                rect.setAttribute("height", ch);
                rect.setAttribute("x", x);
                rect.setAttribute("y", y);
                cell.appendChild(rect);

                x = x + cw;
            }
            y = y + ch;
        }
    },
    
    initControls: function () {
        var restartButton = document.getElementById('restart');
        restartButton.onclick = BI.restart;
        
        // var easyButton = document.getElementById('easy');
        // easyButton.onclick = BI.setDifficulty;
        // var mediumButton = document.getElementById('medium');
        // mediumButton.onclick = BI.setDifficulty;
        // var hardButton = document.getElementById('hard');
        // hardButton.onclick = BI.setDifficulty;
    },
    
    cellSelectionHandler: function (e) {
        var cell = e.target.parentNode;
        var cellNumber = cell.attributes['cell-number'].value;
        if (BI.startBoard[cellNumber] !== '') return;

        var cellText = BI.board[cellNumber];

        if (cellText === '') {
            BI.selectedToken = '0';
        } else if (cellText === '0') {
            BI.selectedToken = '1';
        } else {
            BI.selectedToken = '';
        }

        BI.setCellText(cell, BI.selectedToken);

        BI.board[cellNumber] = BI.selectedToken;

        // var win = BI.checkForWin(BI.board, BI.fullBoard, BI.GRID_SIDE);
        // if (win) {
        //     console.log("WIN!!!!");
        // }
    },
    
    setCellText: function (cell, text) {
        var classId = '';
        if (text === '1') {
            classId = 'red';
        } else if (text === '0') {
            classId = 'blue';
        } 
        var rect = cell.getElementsByTagName("rect")[0];
        rect.setAttribute("class", classId);
    },

    checkForWin: function (board, fullBoard, gridSide) {
        var win = true;
        for(var i = 0; i < gridSide * gridSide; i++) {
            if (board[i] !== fullBoard[i]) {
                win = false;
                break;
            }
        }
        return win;
    },
    
    setDifficulty: function (e) {
        var difficulty = BI.EASY;
        switch(e.target.id) {
            case 'easy':
            {
                difficulty = BI.EASY;
                break;
            }
            case 'medium':
            {
                difficulty = BI.MEDIUM;
                break;
            }
            case 'hard':
            {
                difficulty = BI.HARD;
                break;
            }
        }
        BI.selectedDifficulty = difficulty;
        BI.newGame();
    },
    
    newGame: function () {
        /*
            fullBoard = facit
            startBoard = actual board to display
            board = "working" board. The board the player manipulates.
        */
        BI.fullBoard = BI.generateBoard(BI.GRID_SIDE);
        BI.startBoard = BI.generateStartBoard(BI.fullBoard);
        BI.clearGrid();
        BI.fillGrid(BI.startBoard);
        for (var i = 0; i < BI.startBoard.length; i++) {
            BI.board[i] = BI.startBoard[i];
        }
    },
    
    restart: function () {
        BI.fillGrid(BI.startBoard);
    },
    
    generateBoard: function (gridSide, difficulty) {
        var boardSize = gridSide * gridSide;
        var board = [];
        for(var i = 0; i < boardSize / 2; i++) {
            board[i] = '1';
        }
        for(var i = boardSize / 2; i < boardSize; i++) {
            board[i] = '0';
        }
        board = [
            "0","1","0","0","1","1","0","1",
            "1","0","1","0","0","1","1","0",
            "0","1","0","1","1","0","0","1",
            "1","0","1","0","1","0","1","0",
            "1","0","0","1","0","1","0","1",
            "0","1","1","0","1","0","0","1",
            "1","0","1","1","0","0","1","0",
            "0","1","0","1","0","1","1","0",
        ]
        return board;
    },
    
    generateStartBoard: function (board) {
        var startBoard = [];
        for(var i = 0; i < board.length; i++) {
            startBoard[i] = board[i];
        }
        
        var numberOfCellsToRemove = board.length * (1 - BI.selectedDifficulty);
        
        var cellsToRemove = [];
        var i = 0;
        while (cellsToRemove.length < numberOfCellsToRemove) {
            var cellNumber = Math.floor((Math.random() * (BI.GRID_SIDE * BI.GRID_SIDE)));
            var alreadyRemoved = false;
            for (var x = 0; x < cellsToRemove.length; x++) {
                if (cellsToRemove[x] === cellNumber) {
                    alreadyRemoved = true;
                    break;
                }
            }
            if (!alreadyRemoved) {
                cellsToRemove[i++] = cellNumber;
            }
        }
        
        for (var i = 0; i < cellsToRemove.length; i++) {
            var cellNumber = cellsToRemove[i];
            startBoard[cellNumber] = '';
        }
        return startBoard;
    },
    
    fillGrid: function (board) {
        var cells = document.getElementById('grid').childNodes;
        for(var i = 0; i < board.length; i++) {
            BI.setCellText(cells[i], board[i]);
        }
    },
    
    clearGrid: function (board) {
        var cells = document.getElementById('grid').childNodes;
        for(var i = 0; i < cells.length; i++) {
            BI.setCellText(cells[i], '');
        }
    },
};

window.addEventListener('load', BI.init, false);