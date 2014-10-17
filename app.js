var BI = {
    GRID_SIDE: 8,
    HARD: 0.9,
    MEDIUM: 0.85,
    // EASY: 0.4,
    EASY: 0.4,

    selectedToken: '',
    selectedDifficulty: null,
    board: [],
    fullBoard: [],
    startBoard: [],
    
    init: function () {
        FastClick.attach(document.body);
        window.setTimeout(function () { window.scrollTo(0, 1); }, 0);

        BI.selectedDifficulty = BI.EASY;
        BI.initGrid(BI.GRID_SIDE);
        BI.initControls();
        BI.newGame();
        
    },
    
    initGrid: function (gridSide) {
        var grid = document.getElementById('grid');

        var w = grid.getAttribute("width");
        var h = grid.getAttribute("height");

        var xPadding = 6;
        var yPadding = 6;
        w = w - (xPadding * gridSide);
        h = h - (yPadding * gridSide);
        var cw = (~~(w / gridSide));
        var ch = (~~(h / gridSide));
        var y = 0;

        for(var j = 0; j < gridSide; j++) {
            var x = 0;
            for(var i = 0; i < gridSide; i++) {
                var cell = document.createElementNS("http://www.w3.org/2000/svg", "g");
                cell.setAttribute("class", "cell");
                cell.setAttribute("cell-number", j*8+i);
                cell.onclick = BI.cellSelectionHandler;
                grid.appendChild(cell);

                var outerRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                outerRect.setAttribute("width", cw);
                outerRect.setAttribute("height", ch);
                outerRect.setAttribute("x", x);
                outerRect.setAttribute("y", y);
                cell.appendChild(outerRect);

                var innerRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                innerRect.setAttribute("class", "empty-visible");
                innerRect.setAttribute("width", cw / 4);
                innerRect.setAttribute("height", ch / 4);
                innerRect.setAttribute("x", x + cw / 2.8);
                innerRect.setAttribute("y", y + ch / 2.5);
                cell.appendChild(innerRect);

                x = x + cw + xPadding;
            }
            y = y + ch + yPadding;
        }
    },
    
    initControls: function () {
        var restartButton = document.getElementById('restart');
        restartButton.onclick = BI.restart;

        var newGameButton = document.getElementById('new');
        newGameButton.onclick = BI.newGame;

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

        var win = BI.checkForWin(BI.board, BI.fullBoard, BI.GRID_SIDE);
        if (win) {
            console.log("completed!!!!");
            window.setTimeout(function () {
                BI.showCompletedOverlay();
            }, 800);
        }
    },
    
    showCompletedOverlay: function () {
        var overlay = document.getElementById("overlay");
        overlay.setAttribute("class", "overlay-visible");

        var button = document.getElementById("next");
        button.onclick = function () {
            overlay.setAttribute("class", "overlay-invisible");
        };
    },

    setCellText: function (cell, text) {
        var outerRect = cell.getElementsByTagName("rect")[0];
        var innerRect = cell.getElementsByTagName("rect")[1];

        innerRect.setAttribute("class", "empty-invisible");

        var classId = '';
        if (text === '1') {
            classId = 'red';
        } else if (text === '0') {
            classId = 'blue';
        } else {
            innerRect.setAttribute("class", "empty-visible");
        }
        outerRect.setAttribute("class", classId);
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
        BI.fullBoard = BI.generateBoard(BI.GRID_SIDE).next();
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
        var currentBoard = 0;
        var boards = [
            ["0","1","0","0","1","1","0","1",
            "1","0","1","0","0","1","1","0",
            "0","1","0","1","1","0","0","1",
            "1","0","1","0","1","0","1","0",
            "1","0","0","1","0","1","0","1",
            "0","1","1","0","1","0","0","1",
            "1","0","1","1","0","0","1","0",
            "0","1","0","1","0","1","1","0",],
        ];

        return {
            next: function () {
                currentBoard = currentBoard + 1;
                if (currentBoard > boards.length - 1) {
                    currentBoard = 0;
                }
                return boards[currentBoard];
            }
        };
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