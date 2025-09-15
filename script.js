const input = document.querySelector("input");
const commandOut = document.querySelector(".command-output");
const loadingBar = document.querySelector(".loading-bar");
const asciiIcon = document.querySelector(".ascii-icon");
const text_paragraph = document.querySelector(".text-paragraph");
const terminal_info = document.querySelector(".terminal-info");

let commandHistory = [];
let historyIndex = 0;

const paragraph = `
[START PARAGRAPH]

Empathy /ˈempəTHē/ is generally described as the ability to perceive another person's perspective, to understand, feel, and possibly share and respond to their experience.

[END PARAGRAPH]
`;

const loadingFrames = [
	`
    ╔=============[LOADING]=============╗
    ║                                   ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░                               ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░                           ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░░░░░                       ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░░░░░▒▒▒▒                   ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░░░░░▒▒▒▒▒▒▒▒               ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒            ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▓▓          ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓       ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓     ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADING]=============╗
    ║ ░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓   ║
    ╚===================================╝
 `,
	`
    ╔=============[LOADED!]=============╗
    ║ ░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓ ║
    ╚===================================╝
 `
];

const iconFrames = [
	`
  ╱|、
(˚ˎ 。7  
|、˜〵      
じしˍ,)ノ
`,
	`
  ╱|、
(˚ˎ 。7  
|、˜〵      
じしˍ,)ノ
`,
	`
  ╱|、
(ˋˎ - 7  
|、˜〵      
じしˍ,)ノ
`,
	`
  ╱|、
(˚ˎ 。7  
|、˜〵      
じしˍ,)ノ
`,
	`
  ╱|、
(˚ˎ 。7  
|、˜〵      
じしˍ,)ノ
`,
	`
  ╱|、
(˚ˎ 。7  
|、˜〵      
じしˍ,)︵
`,
];

function typeText(text, speed = 5) {
	return new Promise(resolve => {
		input.disabled = true;

		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = text.replace(/\n/g, '<br>');

		const nodes = Array.from(tempDiv.childNodes);
		let nodeIndex = 0;
		let charIndex = 0;

		const timer = setInterval(() => {
			window.scrollTo(0, document.body.scrollHeight);
			if (nodeIndex >= nodes.length) {
				clearInterval(timer);
				input.disabled = false;
				input.focus();
				resolve();
				return;
			}

			const currentNode = nodes[nodeIndex];

			if (currentNode.nodeType === Node.TEXT_NODE) {
				const textContent = currentNode.textContent;

				if (charIndex === 0) {
					const textNode = document.createTextNode('');
					commandOut.appendChild(textNode);
				}

				if (charIndex < textContent.length) {
					const lastNode = commandOut.lastChild;
					lastNode.textContent += textContent[charIndex];
					charIndex++;
				} else {
					nodeIndex++;
					charIndex = 0;
				}
			} else if (currentNode.nodeType === Node.ELEMENT_NODE) {
				const clonedElement = currentNode.cloneNode(true);
				commandOut.appendChild(clonedElement);
				nodeIndex++;
				charIndex = 0;
			}
		}, speed);
	});
}

function typeTextIntoParagraph(text, speed = 50) {
	return new Promise(resolve => {
		let i = 0;
		text_paragraph.innerHTML = '';
		const timer = setInterval(() => {
			if (i >= text.length) {
				clearInterval(timer);
				resolve();
			} else {
				const char = text[i] === '\n' ? '<br>' : text[i];
				text_paragraph.innerHTML += char;
				i++;
			}
		}, speed);
	});
}

function updateTerminalInfo(command = "null", statusCode = 200) {
	const maxCommandLength = 20;
	const displayCommand = command.length > maxCommandLength
		? command.slice(0, maxCommandLength - 3) + "..."
		: command;

	const statusLine = `- STATUS: ${statusCode}`.padEnd(35, " ") + " ║";
	const commandLine = `- COMMAND: ${displayCommand}`.padEnd(35, " ") + " ║";
	const indexLine = `- INDEX: ${historyIndex}`.padEnd(35, " ") + " ║";

	terminal_info.textContent = `
    ╔===========[TERMINAL INFO]===========╗
    ║ ${indexLine}
    ║ ${statusLine}
    ║ ${commandLine}
    ╚=====================================╝
  `;
}

async function processCommand(command) {
	let responseText = "";
	let statusCode = 200;
	const cmd = command.toLowerCase();

	switch (cmd) {
		case "help":
			responseText =
				"\nHELP:\n\n" +
				"bio - 'About me'\n\n" +
				"stack - 'View my tech stack'\n\n" +
				"experience - 'See how long I've been working for'\n\n" +
				"info - 'Personal details'\n\n" +
				"projects - 'List of major projects'\n\n" +
				"contact - 'Get my contact links'\n\n" +
				"cls - 'Clears the terminal and history'\n\n";
			break;

		case "bio":
			responseText = `
BIO:

Hello, I'm g0ofycat! I'm a Fullstack Developer with over 5 years of programming experience.

My main language is Python, and I also work with Luau, CSS, JavaScript / TypeScript (plus frameworks), and C.

I am currently exploring Machine Learning, AI, and NLP (Natural Language Processing).

I specialize in areas such as Mechanics / Systems, UI/UX design, and many other projects among other fields!
    `;
			break;

		case "stack":
			responseText =
				"\nSTACK:\n\n" +
				"- <a href='https://www.lua.org/' target='_blank'><b>Lua</b></a>\n\n" +
				"- <a href='https://www.luau.org/' target='_blank'><b>Luau</b></a>\n\n" +
				"- <a href='https://developer.mozilla.org/en-US/docs/Web/HTML' target='_blank'><b>HTML</b></a>\n\n" +
				"- <a href='https://developer.mozilla.org/en-US/docs/Web/CSS' target='_blank'><b>CSS</b></a>\n\n" +
				"- <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript' target='_blank'><b>JavaScript</b></a>\n\n" +
				"- <a href='https://www.typescriptlang.org/' target='_blank'><b>TypeScript</b></a>\n\n" +
				"- <a href='https://www.python.org/' target='_blank'><b>Python</b></a>\n\n" +
				"- <a href='https://en.wikipedia.org/wiki/C_(programming_language)' target='_blank'><b>C</b></a>\n\n" +
				"- <a href='https://en.wikipedia.org/wiki/C%2B%2B' target='_blank'><b>C++</b></a>\n\n";
			break;

		case "experience":
			responseText =
				"\nEXPERIENCE:\n\n" +
				"- <b>5 Years of Programming</b>\n\n" +
				"- <b>2 Years UI/UX</b>\n\n" +
				"- <b>2 Years Building</b>\n\n" +
				"- <b>2 Years Animating</b>\n\n";
			break;

		case "info":
			responseText =
				"\nINFO:\n\n" +
				"Age: <b>15</b>\n\n" +
				"Timezone: <b>EST</b>\n\n" +
				"Region: <b>USA</b>\n\n" +
				"Hiring Status: <a href='https://g0ofycat.github.io/AmIForHire/' target='_blank'>https://g0ofycat.github.io/AmIForHire/</a>\n\n";
			break;

		case "projects":
			responseText =
				"\nPROJECTS [LUAU]:\n\n" +
				'- <a href="https://youtu.be/bD-lJHxu2uI" target="_blank">Match: ELO-based matchmaking system (open-sourced)</a>\n\n' +
				'- <a href="https://youtu.be/fpKKOii6BRQ" target="_blank">NetworkService: Networking module with throttling & compression</a>\n\n' +
				'- <a href="https://youtu.be/fvTjM8hxfj4" target="_blank">MNIST: Neural network for handwritten digits</a>\n\n' +
				'- <a href="https://youtu.be/-LTlYfjOhj0" target="_blank">LuaBuffer: Low-level compression module using bitwise operators</a>\n\n' +
				'- <a href="https://youtu.be/bNjPcCc6EzQ" target="_blank">GuildService: Guild/Clan creation system with Bit-Buffers</a>\n\n' +
				'- <a href="https://youtu.be/8ygDUydN2uo" target="_blank">Custom Movement Engine: Simulates gravity, acceleration, and surfing</a>\n\n' +
				"\nPROJECTS [PROGRAMMING]:\n\n" +
				'- <a href="https://youtu.be/DtTOlYAf0Yg" target="_blank">DSA Minesweeper: C-based Minesweeper using matrices</a>\n\n' +
				'- <a href="https://youtu.be/LcKhqLJwF3w" target="_blank">DSA 2D Grid Pathfinding: Lua BFS pathfinding</a>\n\n' +
				'- <a href="https://youtu.be/946x71SoFnQ" target="_blank">AI Transformer Architecture: Full Transformer in Python with NumPy</a>\n\n';
			break;

		case "contact":
			responseText =
				"\nCONTACT:\n\n" +
				"Discord: <a href='https://discord.com/users/782012749693190176' target='_blank'>https://discord.com/users/782012749693190176</a>\n\n" +
				"GitHub: <a href='https://github.com/g0ofycat' target='_blank'>https://github.com/g0ofycat</a>\n\n" +
				"YouTube: <a href='https://www.youtube.com/channel/UC8YqlEzHti46V3A_Lz6inLQ' target='_blank'>https://www.youtube.com/channel/UC8YqlEzHti46V3A_Lz6inLQ</a>\n\n" +
				"Twitter: <a href='https://x.com/g0ofycat' target='_blank'>https://x.com/g0ofycat</a>\n\n" +
				"Email: <b>g0ofycatbusiness@gmail.com</b>\n\n";
			break;

		case "cls":
			commandHistory = [];
			historyIndex = 0;
			commandOut.textContent = "";
			updateTerminalInfo();
			return;

		default:
			responseText = `\nCommand not found: ${command}\n\n`;
			statusCode = 404;
	}

	updateTerminalInfo(command, statusCode);
	animateLoadingBar(responseText.length / 2);
	typeText(responseText);

	commandHistory.push({
		command,
		response: responseText,
		statusCode
	});
}

function animateLoadingBar(extraDelay) {
	let i = 0;

	loadingBar.textContent = loadingFrames[0]

	const timer = setInterval(() => {
		loadingBar.textContent = loadingFrames[i++];
		if (i >= loadingFrames.length) clearInterval(timer);
	}, 20 + extraDelay);
}

function animateCat() {
	let i = 0;
	const delay = 500;

	function nextFrame() {
		asciiIcon.textContent = iconFrames[i];
		i = (i + 1) % iconFrames.length;
		setTimeout(nextFrame, delay);
	}

	nextFrame();
}

function handleInput(e) {
	if (e.key === "Enter" && input.value.trim()) {
		const cmd = input.value.trim();
		const commandEntry = `\nC:\\Users\\Client > ${cmd}\n`;

		const textNode = document.createTextNode(commandEntry);
		commandOut.appendChild(textNode);

		input.value = "";

		processCommand(cmd).then(() => {
			historyIndex = commandHistory.length;
			if (cmd.toLowerCase() !== "cls") {
				updateTerminalInfo(cmd, 200);
			}
		});
	}
}

function handleKeyPress(e) {
	if (e.key === "ArrowUp") {
		if (historyIndex > 0) {
			historyIndex--;
			const {
				command,
				statusCode
			} = commandHistory[historyIndex];
			input.value = command;
			updateTerminalInfo(command, statusCode);
		}
	} else if (e.key === "ArrowDown") {
		if (historyIndex < commandHistory.length - 1) {
			historyIndex++;
			const {
				command,
				statusCode
			} = commandHistory[historyIndex];
			input.value = command;
			updateTerminalInfo(command, statusCode);
		} else {
			historyIndex = commandHistory.length;
			input.value = "";
			updateTerminalInfo(cmd);
		}
	}
}

async function init() {
	animateCat();
	animateLoadingBar(50);
	await typeTextIntoParagraph(paragraph, 1);
	input.focus();
	input.addEventListener("keydown", handleInput);
	input.addEventListener("keydown", handleKeyPress);
	updateTerminalInfo();
}

init();