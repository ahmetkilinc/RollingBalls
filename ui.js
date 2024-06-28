document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const betButton = document.getElementById('betButton');
    const colorSelect = document.getElementById('colorSelect');
    const betAmountInput = document.getElementById('betAmount');
    const winnerDiv = document.getElementById('winner');
    const balanceDiv = document.getElementById('balance');

    let balance = 100;
    let selectedColor = '';
    let betAmount = 0;
    let betPlaced = false;

    function updateBalance(amount) {
        balance += amount;
        balanceDiv.textContent = `Bakiye: ${balance}`;
    }

    betButton.addEventListener('click', () => {
        if (!betPlaced) {
            selectedColor = colorSelect.value;
            betAmount = parseInt(betAmountInput.value);
            if (betAmount > 0 && betAmount <= balance) {
                updateBalance(-betAmount);
                betPlaced = true;
                startButton.disabled = false;
                betButton.disabled = true;
            } else {
                alert('Geçersiz bahis miktarı!');
            }
        }
    });

    function handleWin(winningColor) {
        if (winningColor === selectedColor) {
            updateBalance(betAmount * 2);
            winnerDiv.textContent = `Kazandınız! Bakiye: ${balance}`;
        } else {
            winnerDiv.textContent = `Kaybettiniz! Bakiye: ${balance}`;
        }
        betPlaced = false;
        betButton.disabled = false;
    }

    window.handleWin = handleWin;

    startButton.addEventListener('click', () => {
        if (betPlaced) {
            window.startRace();
        } else {
            alert('Önce bahis yapmalısınız!');
        }
    });

    startButton.disabled = true;
});
