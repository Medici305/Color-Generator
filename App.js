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

    // Add color to background and text
    div.style.backgroundColor = hexColor;
    hexText.innerText = hexColor;

    // Check Color contrast of text
    checkTextContrast(hexColor, hexText);

    // Edit background colors of input sliders
    const randomColor = chroma(hexColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSlider(randomColor, hue, brightness, saturation);
  });
};

const checkTextContrast = (color, text) => {
  const contrast = chroma(color).luminance();
  return contrast > 0.5
    ? (text.style.color = "black")
    : (text.style.color = "#fff");
};

const colorizeSlider = (color, hue, bright, saturation) => {
  // sat section
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const satScale = chroma.scale([noSat, color, fullSat]);

  // bright section
  const midBright = color.set("hsl.l", 0.5);
  const brightScale = chroma.scale(["black", midBright, "#fff"]);

  // Update the input
  saturation.style.backgroundImage = `linear-gradient(to right, ${satScale(
    0
  )}, ${satScale(1)})`;
  bright.style.backgroundImage = `linear-gradient(to right, ${brightScale(
    0
  )}, ${brightScale(0.5)}, ${brightScale(1)}`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`;
};

const hslControls = (e) => {
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-brightness") ||
    e.target.getAttribute("data-saturation");
  const slider = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = slider[0];
  const brightness = slider[1];
  const saturation = slider[2];
  const bgColor = colorDivs[index].querySelector("h2").innerText;
  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);

  colorDivs[index].style.backgroundColor = color;
};

// EventListeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

randomColors();
