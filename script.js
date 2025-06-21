// Get references to HTML elements
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
const logDate = document.getElementById('log-date');

let isError = false;
let chart;

// Clean input string helper
function cleanInputString(str) {
  const regex = /[+\-\s]/g;
  return str.replace(regex, '');
}

// Check invalid scientific notation input
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// Add new entry fields for selected section
function addEntry() {
  const section = entryDropdown.value;
  const container = document.querySelector(`#${section} .input-container`);
  if (!container) {
    alert(`Cannot find container for section: ${section}`);
    return;
  }
  const entryNumber = container.querySelectorAll('input[type="text"], input[type="number"]').length / 2 + 1;

  const html = `
    <label for="${section}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${section}-${entryNumber}-name" placeholder="Name" />
    <label for="${section}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" id="${section}-${entryNumber}-calories" placeholder="Calories" />
  `;
  container.insertAdjacentHTML('beforeend', html);
  saveData();
}

// Calculate calories on form submit
function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  // Helper to get all number inputs from a section
  function getSectionCalories(section) {
    const inputs = document.querySelectorAll(`#${section} input[type="number"]`);
    return getCaloriesFromInputs(inputs);
  }

  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
  const breakfastCalories = getSectionCalories('breakfast');
  const lunchCalories = getSectionCalories('lunch');
  const dinnerCalories = getSectionCalories('dinner');
  const snacksCalories = getSectionCalories('snacks');
  const exerciseCalories = getSectionCalories('exercise');

  if (isError) return;

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;
  output.classList.remove('hide');

  renderChart([breakfastCalories, lunchCalories, dinnerCalories, snacksCalories, -exerciseCalories]);
  saveData();
}

// Sum calories helper
function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const input of list) {
    const val = cleanInputString(input.value);
    if (isInvalidInput(val)) {
      alert(`Invalid input: ${val}`);
      isError = true;
      return null;
    }
    calories += Number(val) || 0;
  }
  return calories;
}

// Clear form and local storage
function clearForm() {
  const containers = document.querySelectorAll('.input-container');
  containers.forEach(c => (c.innerHTML = ''));
  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
  if (chart) chart.destroy();
  localStorage.removeItem(`calorieData-${logDate.value}`);
}

// Save structured data (not full HTML)
function saveData() {
  const data = {
    budget: budgetNumberInput.value,
    entries: {}
  };

  ['breakfast', 'lunch', 'dinner', 'snacks', 'exercise'].forEach(section => {
    const container = document.querySelector(`#${section} .input-container`);
    const sectionEntries = [];
    // Each entry has 4 children: label, input(name), label, input(calories)
    for (let i = 0; i < container.children.length; i += 4) {
      const nameInput = container.children[i + 1];
      const calInput = container.children[i + 3];
      sectionEntries.push({
        name: nameInput.value,
        calories: calInput.value
      });
    }
    data.entries[section] = sectionEntries;
  });

  localStorage.setItem(`calorieData-${logDate.value}`, JSON.stringify(data));
}

// Load structured data and rebuild UI
function loadData() {
  const saved = localStorage.getItem(`calorieData-${logDate.value}`);
  if (saved) {
    const data = JSON.parse(saved);
    budgetNumberInput.value = data.budget || '';

    ['breakfast', 'lunch', 'dinner', 'snacks', 'exercise'].forEach(section => {
      const container = document.querySelector(`#${section} .input-container`);
      container.innerHTML = '';
      const entries = data.entries[section] || [];
      entries.forEach((entry, idx) => {
        const entryNumber = idx + 1;
        const html = `
          <label for="${section}-${entryNumber}-name">Entry ${entryNumber} Name</label>
          <input type="text" id="${section}-${entryNumber}-name" placeholder="Name" value="${entry.name}" />
          <label for="${section}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
          <input type="number" min="0" id="${section}-${entryNumber}-calories" placeholder="Calories" value="${entry.calories}" />
        `;
        container.insertAdjacentHTML('beforeend', html);
      });
    });
  }
}

// Render Chart.js bar chart
function renderChart(dataArray) {
  const ctx = document.getElementById('calorieChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Exercise'],
      datasets: [{
        label: 'Calories',
        data: dataArray,
        backgroundColor: ['#ffa07a', '#f08080', '#e9967a', '#fafad2', '#90ee90'],
      }]
    }
  });
}

// Event listeners
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
logDate.addEventListener("change", loadData);

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

window.addEventListener('load', () => {
  const today = new Date().toISOString().split('T')[0];
  logDate.value = today;
  loadData();
});
