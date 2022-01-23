let table = [];
let filledCells = [];
let clicked = 0;
let cellValue = 0;
let mainRow = -1;
let mainCol = -1;
let lastCell = "";
let leftAttempts = 5;
let counter = 0;
let hiddenNumber = 0;

function startGame() { 
    if (startButton.style.display == "block" && resetButton.style.display == "none" && attempts.style.display == "none") {
        startButton.style.display = "none";
        resetButton.style.display = "block";
        attempts.style.display = "block";
    }
    createTable();
}

//the table will be created with all values equal to 0, for now

function createTable() { 
    for (let i = 0; i < 9; i++) {
        table[i] = [];
        filledCells[i] = [];
        let row = document.createElement("div");
        for ( let j = 0; j < 9; j++) {
            table[i][j] = 0;
            filledCells[i][j] = 1; 
            let cell = document.createElement("button");
            cell.style.width = "30px";
            cell.style.height = "30px";
            cell.id = i.toString() + "." + j.toString();
            cell.addEventListener ("click", function() {
                updateCell(this.id, i, j);
            });
            //it will bold the borders of the 9 x 9 squares to make them more visible
            if (i == 2 || i == 5) {
                cell.style.borderBottom = "3px solid blue";
            }
            if (i == 3 || i == 6) {
                cell.style.borderTop = "3px solid blue";
            }
            if (j == 2 || j == 5) {
                cell.style.borderRight = "3px solid blue";
            }
            if (j == 3 || j == 6) {
                cell.style.borderLeft = "3px solid blue";
            }
            row.appendChild(cell);
        }
        document.getElementById("box").appendChild(row);
    }
    generateSudoku();
    numberButtons();
}

//it fills the previously created Sudoku table with numbers from 1 to 9
//according with Sudoku game rules

function generateSudoku() {

    //this array is shuffled randomly and used to fill the first row of Sudoku table

    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
    }
    for (let row = 0, col = 0; col < 9; col++) {
            table[row][col] = array[col];
            filledCells[row][col] = 0;
            let cellId = row.toString() + "." + col.toString();
            let cell = document.getElementById(cellId);
            cell.innerHTML = table[row][col];
    }

    //based on first row, the Sudoku table will be completed by using some specific permutations as:
    //each row starting with the second one is created by shifting the previous one by three slots, excepting
    //row 4 and 7, these ones are shifted by one slot.

    for (let row = 1; row < 9; row++) {
        let auxArray = array;
        let i = 0;
        if (row != 3 && row != 6) {
            while (i < 3) {
                auxArray.push(auxArray[0]);
                auxArray.shift();
                i++;
            }
            for (let col = 0; col < 9; col++) {
                table[row][col] = auxArray[col];
                filledCells[row][col] = 0;
                let cellId = row.toString() + "." + col.toString();
                let cell = document.getElementById(cellId);
                cell.innerHTML = table[row][col];
            }
        } else {
            auxArray.push(auxArray[0]);
            auxArray.shift();
            for (let col = 0; col < 9; col++) {
                table[row][col] = auxArray[col];
                filledCells[row][col] = 0;
                let cellId = row.toString() + "." + col.toString();
                let cell = document.getElementById(cellId);
                cell.innerHTML = table[row][col];
            }
        }
    }
    hiddenNumbers();
}

//it hides a maximum of 37 numbers (easy level) of the table, hidden numbers
//that the player must guess them.

function hiddenNumbers() {
    let maxHiddenNumbers = 37; //37 - easy level for a Sudoku game
    for (let i = 0; i < maxHiddenNumbers; i++) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (filledCells[row][col] != -1) {
            filledCells[row][col] = -1;
            let cellId = row.toString() + "." + col.toString();
            let cell = document.getElementById(cellId);
            cell.innerHTML = '?';
            cell.style.backgroundColor = "lightblue";
            ++hiddenNumber;
        }
    }
}

//it creates the buttons for 1 to 9 numbers, used by a player to complete the Sudoku game

function numberButtons() {
    var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let i = 0; i < numbers.length; i++) {
        var btn = document.createElement("BUTTON");
        btn.setAttribute("class", "btn btn-primary");
        btn.style.marginRight = "10px";
        btn.innerHTML = numbers[i];
        btn.id = numbers[i];
        var div = document.getElementById("numbers");
        div.appendChild(btn);
        
        btn.addEventListener ("click", function() {
            checkNumber(this.id);
        });
    }
}

//it marks the cell that is chosen by a player to place the number that he thinks is correct

function updateCell(id, row, col) {
    let cell = document.getElementById(id);
    if (cell.innerHTML == "?") {
        if (clicked == 0) {
            cell.style.backgroundColor = "grey";
            clicked = 1;
            cellValue = table[row][col];
            mainRow = row;
            mainCol = col;
            lastCell = document.getElementById(id);
        } else if (cell != lastCell && clicked == 1) {
            cell.style.backgroundColor = "grey";
            lastCell.style.backgroundColor = "lightblue";
            clicked = 1;
            cellValue = table[row][col];
            mainRow = row;
            mainCol = col;
            lastCell = document.getElementById(id);
        } else if (cell == lastCell && clicked == 1) {
            cell.style.backgroundColor = "lightblue";
            clicked = 0;
            cellValue = table[row][col];
            mainRow = row;
            mainCol = col;
            lastCell = document.getElementById(id);
        }
    }
}

//it checks if the number placed by a player in a chosen cell is the right one,
//according with Sudoku game rules

function checkNumber(chosenNumber) {
    if (chosenNumber == cellValue) {
        let cellId = mainRow.toString() + "." + mainCol.toString();
        let value = document.getElementById(cellId);
        value.innerHTML = cellValue;
        value.style.color = "green";
        value.style.backgroundColor = "white";
        value.style.fontWeight = "bold";
        clicked = 0;
        ++counter;
        gameStatus();
    } else {
        let cellId = mainRow.toString() + "." + mainCol.toString();
        let value = document.getElementById(cellId);
        value.innerHTML = chosenNumber;
        value.style.color = "red";
        value.style.backgroundColor = "grey";
        value.style.fontWeight = "bold";
        clicked = 0;
        window.setTimeout(function() {
            value.innerHTML = "?";
            value.style.backgroundColor = "lightblue";
            value.style.color = "black";
            value.style.fontWeight = "normal";
          }, 4000);
        --leftAttempts;
        updateAttempts();
        gameStatus();
    }
}

//it updates on screen the remaining attemps left

function updateAttempts() {
    document.getElementById("attemptsLeft").innerHTML = leftAttempts;
}

//it updates the game status and in case of a correct completion it will show, on screen,
//the winning message, otherwise, when the attempts left are equal to zero, the losing message

function gameStatus() {
    if (counter == hiddenNumber) {
        document.getElementById("finalMessage").innerHTML = "Congratulations! You've completed the table!";
        document.getElementById("finalMessage").style.display = "block";
    } else if (leftAttempts == 0) {
        document.getElementById("finalMessage").innerHTML = "You've lost!";
        document.getElementById("finalMessage").style.display = "block";
        let sudokuTable = document.getElementById("box").getElementsByTagName('*');
        for (let i = 0; i < sudokuTable.length; i++) {
            sudokuTable[i].disabled = true;
        }
        let numberButton = document.getElementById("numbers").getElementsByTagName('*');
        for (let i = 0; i < numberButton.length; i++) {
            numberButton[i].disabled = true;
        }
    }
}

//it restarts the game by pressing the restart button

function restartGame() {
    location.reload();
}