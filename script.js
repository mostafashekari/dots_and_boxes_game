const N = 4;
const M = 4;

let turn = "R";
let selectedLines = [];
let scores = { R: 0, B: 0 };

const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) =>
	` الان نوبت ${turn === "R" ? "قرمز" : "آبی"} است `;


const isLineSelected = (line) =>
	line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
	const gameGridContainer = document.getElementsByClassName(
		"game-grid-container"
	)[0];

	const rows = Array(N)
		.fill(0)
		.map((_, i) => i);
	const cols = Array(M)
		.fill(0)
		.map((_, i) => i);

	rows.forEach((row) => {
		cols.forEach((col) => {
			const dot = document.createElement("div");
			dot.setAttribute("class", "dot");

			const hLine = document.createElement("div");
			hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
			hLine.setAttribute("id", `h-${row}-${col}`);
			hLine.addEventListener("click", handleLineClick);

			gameGridContainer.appendChild(dot);
			if (col < M - 1) gameGridContainer.appendChild(hLine);
		});

		if (row < N - 1) {
			cols.forEach((col) => {
				const vLine = document.createElement("div");
				vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
				vLine.setAttribute("id", `v-${row}-${col}`);
				vLine.addEventListener("click", handleLineClick);

				const box = document.createElement("div");
				box.setAttribute("class", "box");
				box.setAttribute("id", `box-${row}-${col}`);

				gameGridContainer.appendChild(vLine);
				if (col < M - 1) gameGridContainer.appendChild(box);
			});
		}
	});

	document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const changeTurn = () => {
	const nextTurn = turn === "R" ? "B" : "R";

	const lines = document.querySelectorAll(".line-vertical, .line-horizontal");

	lines.forEach((l) => {
		if (!isLineSelected(l)) {
			l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
		}
	});
	turn = nextTurn;
};

const handleLineClick = (e) => {
	const lineId = e.target.id;

	const selectedLine = document.getElementById(lineId);

	if (isLineSelected(selectedLine)) {
		return;
	}

	selectedLines = [...selectedLines, lineId];

	colorLine(selectedLine);

	if (!checkForNewBox(selectedLine)) {
		changeTurn();
	}

	document.getElementById("game-status").innerHTML =
		isGameOver() ? `${getWinner()} بُرد` : playersTurnText(turn);
};

const colorLine = (selectedLine) => {
	selectedLine.classList.remove(hoverClasses[turn]);
	selectedLine.classList.add(bgClasses[turn]);
};

const checkForNewBox = (selectedLine) => {
	let newBoxCreated = false;

	const [type, row, col] = selectedLine.id.split("-");

	if (type === "h") {
		if (row > 0 && isBoxComplete(row - 1, col)) {
			newBoxCreated |= true;
			colorBox(row - 1, col);
			scores[turn]++;
			document.getElementById("scores").innerHTML = `قرمز: ${scores.R}, آبی: ${scores.B}`;
		}
		
        if (row < N - 1 && isBoxComplete(row, col)) {
			newBoxCreated |= true;
			colorBox(row, col);
			scores[turn]++;
			document.getElementById("scores").innerHTML = `قرمز: ${scores.R}, آبی: ${scores.B}`;
        }
    } else if (type === "v") {
        if (col > 0 && isBoxComplete(row, col - 1)) {
            newBoxCreated |= true;
            colorBox(row, col - 1);
            scores[turn]++;
            document.getElementById("scores").innerHTML = `قرمز: ${scores.R}, آبی: ${scores.B}`;
        }
        
        if (col < M - 1 && isBoxComplete(row, col)) {
            newBoxCreated |= true;
            colorBox(row, col);
            scores[turn]++;
            document.getElementById("scores").innerHTML = `قرمز: ${scores.R}, آبی: ${scores.B}`;
        }
    }

	return newBoxCreated;
};


const isBoxComplete = (row, col) =>
	isLineSelected(document.getElementById(`h-${row}-${col}`)) &&
	isLineSelected(document.getElementById(`h-${parseInt(row) + 1}-${col}`)) &&
	isLineSelected(document.getElementById(`v-${row}-${col}`)) &&
	isLineSelected(document.getElementById(`v-${row}-${parseInt(col) + 1}`));

const colorBox = (row, col) => {
	const box = document.getElementById(`box-${row}-${col}`);
	box.classList.add(bgClasses[turn]);
};

const isGameOver = () => selectedLines.length === (N - 1) * M + N * (M - 1);

const getWinner = () => (scores.R > scores.B ? "قرمز" : "آبی");

createGameGrid();
