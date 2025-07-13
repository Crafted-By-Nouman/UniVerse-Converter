// Conversion data
const conversionData = {
  length: {
    name: "Length",
    units: {
      meter: { name: "Meter (m)", factor: 1 },
      kilometer: { name: "Kilometer (km)", factor: 1000 },
      centimeter: { name: "Centimeter (cm)", factor: 0.01 },
      millimeter: { name: "Millimeter (mm)", factor: 0.001 },
      mile: { name: "Mile (mi)", factor: 1609.344 },
      yard: { name: "Yard (yd)", factor: 0.9144 },
      foot: { name: "Foot (ft)", factor: 0.3048 },
      inch: { name: "Inch (in)", factor: 0.0254 },
      nauticalMile: { name: "Nautical Mile", factor: 1852 },
    },
  },
  weight: {
    name: "Weight",
    units: {
      gram: { name: "Gram (g)", factor: 1 },
      kilogram: { name: "Kilogram (kg)", factor: 1000 },
      milligram: { name: "Milligram (mg)", factor: 0.001 },
      ton: { name: "Ton (t)", factor: 1000000 },
      pound: { name: "Pound (lb)", factor: 453.592 },
      ounce: { name: "Ounce (oz)", factor: 28.3495 },
      stone: { name: "Stone", factor: 6350.29 },
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: { name: "Celsius (°C)", factor: 1, offset: 0 },
      fahrenheit: { name: "Fahrenheit (°F)", factor: 5 / 9, offset: -32 },
      kelvin: { name: "Kelvin (K)", factor: 1, offset: -273.15 },
    },
    isTemperature: true,
  },
  digital: {
    name: "Digital Storage",
    units: {
      bit: { name: "Bit (b)", factor: 1 },
      byte: { name: "Byte (B)", factor: 8 },
      kilobyte: { name: "Kilobyte (KB)", factor: 8192 },
      megabyte: { name: "Megabyte (MB)", factor: 8388608 },
      gigabyte: { name: "Gigabyte (GB)", factor: 8589934592 },
      terabyte: { name: "Terabyte (TB)", factor: 8796093022208 },
      kibibyte: { name: "Kibibyte (KiB)", factor: 8192 },
      mebibyte: { name: "Mebibyte (MiB)", factor: 8388608 },
      gibibyte: { name: "Gibibyte (GiB)", factor: 8589934592 },
      tebibyte: { name: "Tebibyte (TiB)", factor: 8796093022208 },
    },
  },
  currency: {
    name: "Currency",
    units: {
      usd: { name: "US Dollar (USD)", factor: 1 },
      eur: { name: "Euro (EUR)", factor: 1.18 },
      gbp: { name: "British Pound (GBP)", factor: 1.38 },
      jpy: { name: "Japanese Yen (JPY)", factor: 0.0091 },
      aud: { name: "Australian Dollar (AUD)", factor: 0.75 },
      cad: { name: "Canadian Dollar (CAD)", factor: 0.79 },
      cny: { name: "Chinese Yuan (CNY)", factor: 0.15 },
      inr: { name: "Indian Rupee (INR)", factor: 0.013 },
    },
  },
};

// DOM elements
const fromUnitSelect = document.getElementById("from-unit");
const toUnitSelect = document.getElementById("to-unit");
const fromValueInput = document.getElementById("from-value");
const toValueInput = document.getElementById("to-value");
const swapBtn = document.getElementById("swap-units");
const copyBtn = document.getElementById("copy-result");
const resetBtn = document.getElementById("reset-btn");
const favoriteBtn = document.getElementById("favorite-btn");
const categoryTabs = document.querySelectorAll(".category-tab");
const categorySearch = document.getElementById("category-search");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const themeToggle = document.getElementById("theme-toggle");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const toast = document.getElementById("toast");
const currentYear = document.getElementById("current-year");

// State
let currentCategory = "length";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let isConverting = false;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Set current year
  currentYear.textContent = new Date().getFullYear();

  // Load theme preference
  loadTheme();

  // Initialize category
  initCategory(currentCategory);

  // Load history
  renderHistory();

  // Set up event listeners
  setupEventListeners();
});

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (savedTheme === "dark") {
    themeToggle.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20C13.57,20 15.03,19.54 16.26,18.76L14.8,17.3C13.97,17.74 13,18 12,18M12,8L17,12.2C17,12.2 14.5,13.3 12,13.3C9.5,13.3 7,12.2 7,12.2L12,8M12,3.5L7.05,7.8L5.6,6.35L12,1.2L18.4,6.36L16.95,7.8L12,3.5Z"></path></svg>';
  }
}

function initCategory(category) {
  currentCategory = category;

  // Update active tab
  categoryTabs.forEach((tab) => {
    if (tab.dataset.category === category) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  // Populate unit dropdowns
  populateUnitDropdowns();

  // Reset values
  fromValueInput.value = "";
  toValueInput.value = "";

  // Focus on input
  fromValueInput.focus();
}

function populateUnitDropdowns() {
  const units = conversionData[currentCategory].units;

  // Clear existing options
  fromUnitSelect.innerHTML = "";
  toUnitSelect.innerHTML = "";

  // Add options to dropdowns
  Object.keys(units).forEach((unitKey) => {
    const unit = units[unitKey];

    const fromOption = document.createElement("option");
    fromOption.value = unitKey;
    fromOption.textContent = unit.name;

    const toOption = document.createElement("option");
    toOption.value = unitKey;
    toOption.textContent = unit.name;

    // Set default selections
    if (unitKey === "meter" && currentCategory === "length") {
      fromOption.selected = true;
    }
    if (unitKey === "kilometer" && currentCategory === "length") {
      toOption.selected = true;
    }
    if (unitKey === "celsius" && currentCategory === "temperature") {
      fromOption.selected = true;
    }
    if (unitKey === "fahrenheit" && currentCategory === "temperature") {
      toOption.selected = true;
    }
    if (unitKey === "gram" && currentCategory === "weight") {
      fromOption.selected = true;
    }
    if (unitKey === "kilogram" && currentCategory === "weight") {
      toOption.selected = true;
    }
    if (unitKey === "bit" && currentCategory === "digital") {
      fromOption.selected = true;
    }
    if (unitKey === "byte" && currentCategory === "digital") {
      toOption.selected = true;
    }
    if (unitKey === "usd" && currentCategory === "currency") {
      fromOption.selected = true;
    }
    if (unitKey === "eur" && currentCategory === "currency") {
      toOption.selected = true;
    }

    fromUnitSelect.appendChild(fromOption);
    toUnitSelect.appendChild(toOption);
  });

  // Check if this category is a favorite
  updateFavoriteButton();
}

function setupEventListeners() {
  // Category tab clicks
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      initCategory(tab.dataset.category);
    });
  });

  // Category search
  categorySearch.addEventListener("input", () => {
    const searchTerm = categorySearch.value.toLowerCase();

    categoryTabs.forEach((tab) => {
      const tabText = tab.textContent.toLowerCase();
      if (tabText.includes(searchTerm)) {
        tab.style.display = "flex";
      } else {
        tab.style.display = "none";
      }
    });
  });

  // Conversion inputs
  fromValueInput.addEventListener("input", convert);
  fromUnitSelect.addEventListener("change", convert);
  toUnitSelect.addEventListener("change", convert);

  // Swap units
  swapBtn.addEventListener("click", swapUnits);

  // Copy result
  copyBtn.addEventListener("click", copyResult);

  // Reset
  resetBtn.addEventListener("click", resetConverter);

  // Favorite
  favoriteBtn.addEventListener("click", toggleFavorite);

  // Clear history
  clearHistoryBtn.addEventListener("click", clearHistory);

  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Fullscreen toggle
  fullscreenBtn.addEventListener("click", toggleFullscreen);

  // Add ripple effect to buttons
  document.querySelectorAll(".action-btn, .icon-button").forEach((button) => {
    button.classList.add("ripple");
  });
}

function convert() {
  if (isConverting) return;
  isConverting = true;

  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;
  const inputValue = parseFloat(fromValueInput.value);

  if (isNaN(inputValue)) {
    toValueInput.value = "";
    isConverting = false;
    return;
  }

  const category = conversionData[currentCategory];
  const fromUnitData = category.units[fromUnit];
  const toUnitData = category.units[toUnit];

  let result;

  if (category.isTemperature) {
    // Special handling for temperature
    if (fromUnit === "celsius") {
      if (toUnit === "fahrenheit") {
        result = (inputValue * 9) / 5 + 32;
      } else if (toUnit === "kelvin") {
        result = inputValue + 273.15;
      } else {
        result = inputValue;
      }
    } else if (fromUnit === "fahrenheit") {
      if (toUnit === "celsius") {
        result = ((inputValue - 32) * 5) / 9;
      } else if (toUnit === "kelvin") {
        result = ((inputValue - 32) * 5) / 9 + 273.15;
      } else {
        result = inputValue;
      }
    } else if (fromUnit === "kelvin") {
      if (toUnit === "celsius") {
        result = inputValue - 273.15;
      } else if (toUnit === "fahrenheit") {
        result = ((inputValue - 273.15) * 9) / 5 + 32;
      } else {
        result = inputValue;
      }
    }
  } else {
    // Standard conversion for other units
    const baseValue =
      inputValue * fromUnitData.factor + (fromUnitData.offset || 0);
    result = (baseValue - (toUnitData.offset || 0)) / toUnitData.factor;
  }

  // Round to 8 decimal places to avoid floating point precision issues
  result = Math.round(result * 100000000) / 100000000;

  // Update the result field
  toValueInput.value = result;

  // Add to history
  addToHistory(inputValue, fromUnit, result, toUnit);

  isConverting = false;
}

function swapUnits() {
  const tempUnit = fromUnitSelect.value;
  fromUnitSelect.value = toUnitSelect.value;
  toUnitSelect.value = tempUnit;

  if (fromValueInput.value && toValueInput.value) {
    const tempValue = fromValueInput.value;
    fromValueInput.value = toValueInput.value;
    toValueInput.value = tempValue;
  } else {
    convert();
  }

  showToast("Units swapped");
}

function copyResult() {
  if (!toValueInput.value) return;

  navigator.clipboard
    .writeText(toValueInput.value)
    .then(() => {
      showToast("Result copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      showToast("Failed to copy", "error");
    });
}

function resetConverter() {
  fromValueInput.value = "";
  toValueInput.value = "";
  fromValueInput.focus();
  showToast("Converter reset");
}

function addToHistory(value, fromUnit, result, toUnit) {
  const category = conversionData[currentCategory];
  const fromUnitName = category.units[fromUnit].name;
  const toUnitName = category.units[toUnit].name;

  const historyItem = {
    id: Date.now(),
    category: currentCategory,
    fromValue: value,
    fromUnit: fromUnit,
    fromUnitName: fromUnitName,
    toValue: result,
    toUnit: toUnit,
    toUnitName: toUnitName,
    timestamp: new Date().toISOString(),
  };

  // Add to beginning of history array
  history.unshift(historyItem);

  // Keep only the last 50 items
  if (history.length > 50) {
    history.pop();
  }

  // Save to localStorage
  localStorage.setItem("history", JSON.stringify(history));

  // Update UI
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML =
      '<p class="empty-history">No conversion history yet</p>';
    return;
  }

  // Filter history for current category
  const categoryHistory = history.filter(
    (item) => item.category === currentCategory
  );

  if (categoryHistory.length === 0) {
    historyList.innerHTML =
      '<p class="empty-history">No history for this category</p>';
    return;
  }

  // Show only the first 5 items for this category
  const itemsToShow = categoryHistory.slice(0, 5);

  itemsToShow.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item fade-in";
    historyItem.innerHTML = `
            <div class="conversion">${item.fromValue} ${item.fromUnitName} → ${
      item.toValue
    } ${item.toUnitName}</div>
            <div class="timestamp">${formatDate(item.timestamp)}</div>
        `;

    historyItem.addEventListener("click", () => {
      fromValueInput.value = item.fromValue;
      fromUnitSelect.value = item.fromUnit;
      toUnitSelect.value = item.toUnit;
      convert();
    });

    historyList.appendChild(historyItem);
  });
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

function clearHistory() {
  // Clear only history for current category
  history = history.filter((item) => item.category !== currentCategory);
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
  showToast("History cleared");
}

function toggleFavorite() {
  const index = favorites.indexOf(currentCategory);

  if (index === -1) {
    // Add to favorites
    favorites.push(currentCategory);
    showToast("Added to favorites");
  } else {
    // Remove from favorites
    favorites.splice(index, 1);
    showToast("Removed from favorites");
  }

  // Save to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update button
  updateFavoriteButton();
}

function updateFavoriteButton() {
  const isFavorite = favorites.includes(currentCategory);

  if (isFavorite) {
    favoriteBtn.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path></svg> Favorited';
    favoriteBtn.style.color = "var(--accent-color)";
  } else {
    favoriteBtn.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"></path></svg> Favorite';
    favoriteBtn.style.color = "";
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  if (newTheme === "dark") {
    themeToggle.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20C13.57,20 15.03,19.54 16.26,18.76L14.8,17.3C13.97,17.74 13,18 12,18M12,8L17,12.2C17,12.2 14.5,13.3 12,13.3C9.5,13.3 7,12.2 7,12.2L12,8M12,3.5L7.05,7.8L5.6,6.35L12,1.2L18.4,6.36L16.95,7.8L12,3.5Z"></path></svg>';
    showToast("Dark mode enabled");
  } else {
    themeToggle.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"></path></svg>';
    showToast("Light mode enabled");
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
      showToast("Fullscreen failed", "error");
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = "toast";

  // Add type class
  if (type === "error") {
    toast.style.backgroundColor = "var(--error-color)";
  } else if (type === "warning") {
    toast.style.backgroundColor = "var(--warning-color)";
  } else {
    toast.style.backgroundColor = "var(--success-color)";
  }

  // Show toast
  toast.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Handle fullscreen change event
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    fullscreenBtn.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z"></path></svg>';
  } else {
    fullscreenBtn.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"></path></svg>';
  }
});
