/*
document.querySelector('.spin-button').addEventListener('click', spinWheel);

function spinWheel() {
    const resultMessage = document.getElementById('result-message');
    const results = [
        '+500 Cookies!',
        '+700 Cookies!',
        '-200 Cookies!',
    ];

    const randomResult = results[Math.floor(Math.random() * results.length)];
    resultMessage.innerText = randomResult;

    // Display different characters based on the result
    const characterImages = {
        '+500 Cookies!': '/images/SaturnWin.png',
        '+700 Cookies!': '/images/CoffyNormal.png',
        '-200 Cookies!': '/images/SaturnNormal.png',
    };

    document.querySelector('.wheel').innerHTML = `<img src="${characterImages[randomResult]}" alt="Result Character" />`;
}
*/