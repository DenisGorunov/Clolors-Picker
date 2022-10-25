const cards = document.querySelectorAll('.card');
const popup = document.querySelector('.confirm-copy');

document.addEventListener('keydown', event => {
    event.preventDefault();

    if (event.code.toLowerCase() === 'space') {
        run();
    }
});

document.addEventListener('click', event => {
    const target = event.target;
    const {dataset, children, tagName} = target;

    if (dataset.type === 'lock-button') {
        const element = tagName.toLowerCase() === 'i' ? target : children[0];

        element.classList.toggle('fa-lock-open');
        element.classList.toggle('fa-lock');
    }

    if (dataset.type === 'color') {
        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
        }, 2000);

        return navigator.clipboard.writeText(target.textContent);
    }
});

const generateRandomColors = () => {
    let color = '#';
    const codes = '0123456789ABCDEF';

    [...Array(6)].forEach(() => {
        color += codes[Math.floor(Math.random() * codes.length)];
    });

    return color;
};

const updateUrl = (colors = []) => {
    document.location.hash = colors.map(c => c.toString().substring(1)).join('~');
};

const getColorFromUrl = () => {
    return document.location.hash.length > 1 ?
        document.location.hash.substring(1).split('~').map(c => '#' + c) : [];
};

const run = (init = false) => {
    const randomColor = init ? getColorFromUrl() : [];

    cards.forEach((card, index) => {
        // const color = generateRandomColors(); self implementation
        const isColorLock = card.querySelector('i').classList.contains('fa-lock');
        const color = init ? randomColor[index] ? randomColor[index] : chroma.random() : chroma.random();
        const h2 = card.querySelector('h2');
        const button = card.querySelector('button');
        const textColor = chroma(color).luminance() > 0.5 ? 'black' : 'white';

        if (!isColorLock) {
            card.style.background = color;
            h2.textContent = color;
            h2.style.color = textColor;
            button.style.color = textColor;
            randomColor.push(color);
        } else if (!init) {
            randomColor.push(h2.textContent);
        }
    });

    if(!init) {
        updateUrl(randomColor);
    }
};

run(true);