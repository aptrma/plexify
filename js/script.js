const input = document.getElementById('input');
const output = document.getElementById('output');
const predictions = document.getElementById('predictions');
const prompt = document.getElementById('prompt');
const inputLine = document.getElementById('input-line');

        let isPromptActive = false;

const commands = {
    help: () => '[ ' + new Date().toLocaleString() + ' ] ' + 'Available commands:\n\n' +
        '― help    : Display this help message\n' +
        '― about   : About PLEXIFY\n' +
        '― status  : Check server status\n' +
        '― plans   : View server plans.\n' +
        '― start   : Join PLEXIFY.\n' +
        '― contact : Contact support',
    about: () => '[ ' + new Date().toLocaleString() + ' ] ' + 'Overvoid is a small free 24/7 host for Minecraft, Node.js, and more, based in the US. We provide free yet reliable hosting solutions for your projects. We also keep all of our code open-source, you can see it at https://github.com/OvervoidLabs',
    status: () => '[ ' + new Date().toLocaleString() + ' ] ' + 'All systems operational. Network uptime: 99.92491%.',
    plans: () => '[ ' + new Date().toLocaleString() + ' ] ' + 'Hosting plans:\n\n' +
        '1. None. We are free, and we use a scalable resources system so that you can upgrade your servers for free.',
    start: () => '[ ' + new Date().toLocaleString() + ' ] ' + 'Ah, that one is easy. Just go to https://app.overvoid.xyz/ and click the big Login with Discord button. If you need support, have a look at the support command.',
    contact: () => '[ ' + new Date().toLocaleString() + ' ] ' + 'For support, please email us at support@overvoid.xyz or join our Discord server: discord.gg/overvoid'
};

const commandList = Object.keys(commands);

async function executeCommand(command) {
    const [cmd, ...args] = command.split(' ');
    if (commands[cmd]) {
        const result = await commands[cmd](args);
        return result;
    } else {
        throw new Error(`Command not found: ${cmd}`);
    }
}

function displayOutput(text, isError = false) {
    const outputElement = document.createElement('div');
    outputElement.innerHTML = parseColorCodes(text);
    outputElement.classList.add('output');
    if (isError) outputElement.classList.add('error');
    output.appendChild(outputElement);
    setTimeout(() => outputElement.classList.add('visible'), 10);
    output.scrollTop = output.scrollHeight;
}

function parseColorCodes(text) {
    const colorMap = {
        '&0': '#000000', '&1': '#0000AA', '&2': '#00AA00', '&3': '#00AAAA',
        '&4': '#AA0000', '&5': '#AA00AA', '&6': '#FFAA00', '&7': '#AAAAAA',
        '&8': '#555555', '&9': '#5555FF', '&a': '#55FF55', '&b': '#55FFFF',
        '&c': '#FF5555', '&d': '#FF55FF', '&e': '#FFFF55', '&f': '#FFFFFF',
    };

            return text.replace(/&[0-9a-f]/g, match => `</span><span style="color: ${colorMap[match]}">`)
                        .replace(/\n/g, '<br>')
                        + '</span>';
        }

        function setTime() {
            const el = document.getElementById('time');
            const date = new Date().toLocaleString();

            el.innerHTML = '[ ' + date + ' ] © OVERVOID Industries, LLC.';
        }

        setInterval(setTime, 100);

        function updatePredictions() {
            const inputText = input.value.toLowerCase();
            const matchedCommands = commandList.filter(cmd => cmd.startsWith(inputText));
            predictions.textContent = matchedCommands.join(' ');
        }

        input.addEventListener('keyup', async (e) => {
            if (e.key === 'Enter') {
                const command = input.value;
                displayOutput(`> ${command}`);
                try {
                    const result = await executeCommand(command);
                    displayOutput(result);
                } catch (error) {
                    displayOutput(error.message, true);
                }
                input.value = '';
                predictions.textContent = '';
            } else {
                updatePredictions();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const inputText = input.value.toLowerCase();
                const matchedCommands = commandList.filter(cmd => cmd.startsWith(inputText));
                if (matchedCommands.length === 1) {
                    input.value = matchedCommands[0];
                }
            }
        });

        function hideMainPrompt() {
            if (!isPromptActive) {
                isPromptActive = true;
                inputLine.classList.add('fade-out');
                predictions.classList.add('fade-out');
                setTimeout(() => {
                    inputLine.style.opacity = "0";
                    predictions.style.opacity = "0";
                    inputLine.classList.remove('fade-out');
                    predictions.classList.remove('fade-out');
                }, 500);
            }
        }

        function showMainPrompt() {
            if (isPromptActive) {
                isPromptActive = false;
                inputLine.style.opacity = "1";
                predictions.style.opacity = "1";
                inputLine.classList.add('fade-in');
                predictions.classList.add('fade-in');
                setTimeout(() => {
                    inputLine.classList.remove('fade-in');
                    predictions.classList.remove('fade-in');
                }, 500);
                input.focus();
            }
        }

        function promptUser(question) {
            return new Promise((resolve) => {
                const inputLine = document.createElement('div');
                inputLine.classList.add('fade-in');
                const promptSpan = document.createElement('span');
                const inputField = document.createElement('input');

                promptSpan.textContent = question;
                promptSpan.style.marginTop = '10px'
                inputField.style.marginTop = '10px'
                inputField.style.marginLeft = '5px'
                inputField.type = 'text';
                inputField.className = 'input';
                inputField.style.background = 'transparent';
                inputField.style.border = 'none';
                inputField.style.outline = 'none';
                inputField.style.color = 'white';
                inputField.placeholder = '. . .';

                inputLine.appendChild(promptSpan);
                inputLine.appendChild(inputField);
                output.appendChild(inputLine);

                inputField.focus();

                inputField.addEventListener('keyup', function onEnter(e) {
                    if (e.key === 'Enter') {
                        const response = inputField.value;
                        inputField.removeEventListener('keyup', onEnter);
                        inputLine.classList.add('fade-out');
                        setTimeout(() => {
                            inputLine.remove();
                            resolve(response);
                        }, 500);
                    }
                });
            });
        }

        function promptSelection(question, options) {
            return new Promise((resolve) => {
                const inputLine = document.createElement('div');
                inputLine.classList.add('fade-in');
                const promptSpan = document.createElement('span');
                promptSpan.textContent = question;
                inputLine.appendChild(promptSpan);

                options.forEach(option => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.textContent = option.name;
                    card.onclick = () => {
                        inputLine.classList.add('fade-out');
                        setTimeout(() => {
                            inputLine.remove();
                            resolve(option.value);
                        }, 500);
                    };
                    inputLine.appendChild(card);
                });

                output.appendChild(inputLine);
            });
        }

        function promptNumber(question, min, max) {
            return new Promise((resolve) => {
                const inputLine = document.createElement('div');
                inputLine.classList.add('fade-in');
                const promptSpan = document.createElement('span');
                const inputField = document.createElement('input');

                promptSpan.textContent = question;
                inputField.type = 'number';
                inputField.min = min;
                inputField.max = max;
                inputField.className = 'input-field';
                inputField.style.background = 'transparent';
                inputField.style.border = 'none';
                inputField.style.outline = 'none';
                inputField.style.color = 'white';

                inputLine.appendChild(promptSpan);
                inputLine.appendChild(inputField);
                output.appendChild(inputLine);

                inputField.focus();

                inputField.addEventListener('keyup', function onEnter(e) {
                    if (e.key === 'Enter') {
                        const value = parseInt(inputField.value);
                        if (value >= min && value <= max) {
                            inputField.removeEventListener('keyup', onEnter);
                            inputLine.classList.add('fade-out');
                            setTimeout(() => {
                                inputLine.remove();
                                resolve(value);
                            }, 500);
                        } else {
                            displayOutput(`Invalid input. Please enter a number between ${min} and ${max}.`, true);
                        }
                    }
                });
            });
        }

        // Initial focus
        input.focus();