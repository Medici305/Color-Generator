// Select Element nodes
const colorDivs = document.querySelectorAll(".color");
const hexName = document.querySelectorAll(".color h2");
const generateBtn = document.querySelector("generate");
const sliders = document.querySelectorAll('input[type = "range"]');
let initialColors;

// Functions
const generateHex = () => chroma.random();

const randomColors = () => {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const hexColor = generateHex();

    div.style.backgroundColor = hexColor;
    hexText.innerText = hexColor;
  });
};

randomColors();
