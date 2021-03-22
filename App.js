// Select Element nodes
const colorDivs = document.querySelectorAll(".color");
const hexName = document.querySelectorAll(".color h2");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type = "range"]');
const popup = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelectorAll(".lock");
const sliderContainer = document.querySelectorAll(".sliders");
const closeAdjustment = document.querySelectorAll(".close-adjustment");
let initialColors;
let savePalette = [];

// Functions
const generateHex = () => chroma.random();

const randomColors = () => {
  initialColors = [];

  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const hexColor = generateHex();

    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(hexColor).hex());
    }

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

  resetInputs();

  adjustBtn.forEach((button, index) => {
    checkTextContrast(initialColors[index], button);
    checkTextContrast(initialColors[index], lockBtn[index]);
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
  const bgColor = initialColors[index];
  let color = chroma(bgColor)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);

  colorDivs[index].style.backgroundColor = color;

  // Colorize Inputs
  colorizeSlider(color, hue, brightness, saturation);
};

const updateTextUI = (index) => {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const hexText = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  hexText.innerText = color.hex();

  // Fix contrast of icons and text
  checkTextContrast(color, hexText);
  for (let icon of icons) {
    checkTextContrast(color, icon);
  }
};

const resetInputs = () => {
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightnessColor =
        initialColors[slider.getAttribute("data-brightness")];
      const brightnessValue = chroma(brightnessColor).hsl()[2];
      slider.value = Math.floor(brightnessValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const saturationColor =
        initialColors[slider.getAttribute("data-saturation")];
      const saturationValue = chroma(saturationColor).hsl()[1];
      slider.value = Math.floor(saturationValue * 100) / 100;
    }
  });
};

const copyToClipboard = (hexText) => {
  const el = document.createElement("textarea");
  el.value = hexText.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  // Popup animation
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
};

const openAdjustmentPanel = (index) => {
  sliderContainer[index].classList.toggle("active");
};

const closeAdjustmentPanel = (index) => {
  sliderContainer[index].classList.remove("active");
};

const changeLockIcon = (index) => {
  colorDivs[index].classList.toggle("locked");
  if (colorDivs[index].classList.contains("locked")) {
    lockBtn[index].querySelector("svg").setAttribute("class", "fa fa-lock");
  } else {
    lockBtn[index]
      .querySelector("svg")
      .setAttribute("class", "fa fa-lock-open");
  }
};

// EventListeners
generateBtn.addEventListener("click", randomColors);

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

hexName.forEach((hexText) => {
  hexText.addEventListener("click", () => {
    copyToClipboard(hexText);
  });
});

popup.addEventListener("transitionend", () => {
  popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});

adjustBtn.forEach((button, index) => {
  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});

closeAdjustment.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});

lockBtn.forEach((lock, index) => {
  lock.addEventListener("click", () => {
    changeLockIcon(index);
  });
});

const saveBtn = document.querySelector(".save");
const submitBtn = document.querySelector(".submit-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const closeSave = document.querySelector(".close-save");
const libraryContainer = document.querySelector(".library-container");
const closeLibraryBtn = document.querySelector(".close-library");
const libraryBtn = document.querySelector(".library");

const openPalette = () => {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
};

const closePalette = () => {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
};

const saveToPalette = () => {
  closePalette();
  const name = saveInput.value;
  let colors = [];
  colorDivs.forEach((hex) => {
    colors.push(hex.children[0].innerText);
  });
  // Create color object to push into savePalette array
  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palette"));
  if (paletteObjects) {
    paletteNr = paletteObjects.length;
  } else {
    paletteNr = savePalette.length;
  }
  const paletteObj = { name, colors, Nr: paletteNr };
  savePalette.push(paletteObj);
  saveToLocal(paletteObj);
  saveInput.value = "";

  // Library container holding all saved palettes
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = paletteObj.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.colors.forEach((color) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = color;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.Nr);
  paletteBtn.innerText = "select";

  // Picking color from library
  paletteBtn.addEventListener("click", (e) => {
    closeLibrary();
    const paletteIndex = e.target.classList[1];
    let initialColors = [];
    savePalette[paletteIndex].colors.forEach((color, index) => {
      initialColors.push(color);
      colorDivs[index].style.backgroundColor = color;
      const text = colorDivs[index].children[0];
      checkTextContrast(color, text);
      updateTextUI(index);
    });
    resetInputs();
    libraryInputUpdate();
  });

  // Append all to popup of library and palette div
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
};

const openLibrary = () => {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
};

const closeLibrary = () => {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
};

const saveToLocal = (paletteObj) => {
  let paletteColors;
  if (localStorage.getItem("palette") === null) {
    paletteColors = [];
  } else {
    paletteColors = JSON.parse(localStorage.getItem("palette"));
  }
  paletteColors.push(paletteObj);
  localStorage.setItem("palette", JSON.stringify(paletteColors));
};

const getItem = () => {
  let palette;
  if (localStorage.getItem("palette") === null) {
    palette = [];
  } else {
    palette = JSON.parse(localStorage.getItem("palette"));
    savePalette = [...palette];
    palette.forEach((paletteObj) => {
      // Library container holding all saved palettes
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = paletteObj.name;
      const preview = document.createElement("div");
      preview.classList.add("small-preview");
      paletteObj.colors.forEach((color) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = color;
        preview.appendChild(smallDiv);
      });
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.Nr);
      paletteBtn.innerText = "select";

      // Picking color from library
      paletteBtn.addEventListener("click", (e) => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        let initialColors = [];
        savePalette[paletteIndex].colors.forEach((color, index) => {
          initialColors.push(color);
          colorDivs[index].style.backgroundColor = color;
          const text = colorDivs[index].children[0];
          checkTextContrast(color, text);
          updateTextUI(index);
        });
        resetInputs();
      });

      // Append all to popup of library and palette div
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette);
    });
  }
};

saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitBtn.addEventListener("click", saveToPalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

getItem();
randomColors();
