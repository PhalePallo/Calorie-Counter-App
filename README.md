# Calorie Counter App

A simple and interactive web application that helps users track their daily calorie intake, exercise, and remaining calorie budget. It allows adding multiple food and exercise entries, supports persistent data per date, visualizes stats with a chart, and includes a dark mode toggle.

---

## 🚀 Features

* ✅ Set a daily calorie budget
* 🍽️ Add multiple entries for Breakfast, Lunch, Dinner, and Snacks
* 🏃‍♂️ Track calories burned through Exercise
* 📅 Select dates and track history (with `localStorage`)
* 📊 Visual bar chart using Chart.js for calorie breakdown
* 🌙 Toggle light/dark theme for better accessibility
* 🔄 Clear data and reset easily

---

## 📁 Project Structure

```
Calorie-Counter/
├── index.html          # Main HTML structure
├── styles.css          # Theming and layout styles
├── script.js           # All interactive JavaScript logic
└── README.md           # Project documentation
```

---

## 🧠 JavaScript Concepts Used

### 1. **DOM Manipulation & Dynamic UI Updates**

*`The app uses JavaScript to dynamically create and insert new input fields for different meal or exercise entries. This involves selecting HTML elements, creating new input elements with unique IDs, and inserting them into the appropriate section in the DOM (.input-container divs).`
* `document.getElementById` and `querySelector`
* `insertAdjacentHTML` to add input fields dynamically

### 2. **Event Handling**
*`Event listeners are attached to buttons and form elements to handle user interactions, such as adding new entries, submitting the form to calculate calories, clearing inputs, toggling dark mode, and loading data on date change.`
* `addEventListener` to respond to user interactions
* `submit`, `click`, `change`, and `load` events

### 3. **Form Handling**

* Reading and validating form input values
* Preventing default form submissions

### 4. **Local Storage**

*`The app persists user data in the browser's local storage keyed by the selected date. This ensures data is saved across page refreshes and can be loaded back when the user returns to the app on the same date.`
* `localStorage.setItem()` and `getItem()` to persist data per date

### 5. **Conditional Logic**

* Detecting surplus or deficit based on user inputs
* Error handling for invalid formats (e.g. scientific notation)

### 6. **Chart.js Integration**

* Dynamically rendering and updating a bar chart using Chart.js API

### 7. **Theme Switching**

* Using CSS variables and `classList.toggle("dark-mode")` to change themes

### 8. **Interpolation

String interpolation (template literals) is used extensively to insert dynamic content, such as generating the HTML for new entry inputs with unique IDs and placeholders:

const html = `
  <label for="${section}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${section}-${entryNumber}-name" placeholder="Name" />
  <label for="${section}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input type="number" min="0" id="${section}-${entryNumber}-calories" placeholder="Calories" />
`;

* This improves readability and maintains clean, maintainable code.


### 9. **Chart.js Integration
*`To visually represent calorie data, the app uses Chart.js, a popular JavaScript charting library, to render a dynamic bar chart summarizing calories consumed and burned across different categories.`

### Errors Faced and How They Were Fixed
* Error 1: Unable to Add Entries After Loading Saved Data

    Cause: The app saved and loaded the entire .container innerHTML to/from local storage. When reloading, this replaced the HTML, removing event listeners attached to buttons like “Add Entry” and “Clear”. Without event listeners, button clicks had no effect.

    Fix: Instead of saving raw HTML, the app was updated to save structured data (objects representing entries and calorie values). On loading, the UI rebuilds dynamically from this data. This approach preserves event listeners and avoids DOM replacement issues.

* Error 2: Incorrect Entry Numbering When Adding New Entries

    Cause: The entry number was calculated by counting only text inputs, ignoring the paired calorie number inputs. This led to duplicate IDs or incorrect labels for new entries.

    Fix: Entry numbering now counts both text and number inputs together, dividing by two (since each entry has two inputs), ensuring unique IDs and proper labels.

* Error 3: Cannot Add Entries to Other Meal or Exercise Sections

    Cause: After loading saved HTML, some .input-container divs were missing or replaced incorrectly, causing document.querySelector to fail to find the target container for adding new entries.

    Fix: Ensured that the app’s HTML structure always contains .input-container divs for each section. Also, the save/load mechanism was refactored to rebuild the input containers with proper structure dynamically, preventing missing containers.
---

## 🛠️ Setup Instructions

### ✅ Prerequisites

* Web browser (Chrome, Firefox, Edge, etc.)
* Optional: VS Code or any code editor

### 🔧 How to Run Locally

1. Download or clone the repository:

   ```bash
   git clone https://github.com/PhalePallo/Calorie-Counter-App.git
   ```

2. Open the folder in your editor or file browser

3. Double-click `index.html` to open in a browser (or use Live Server if using VS Code)

---

## 🔍 Possible Improvements

* ✅ Add a nutrition database integration (e.g. Edamam or USDA API)
* ✅ Export data to CSV or JSON
* ✅ Add user authentication for cross-device sync

---

## 📜 License

This project is licensed under the MIT License. Feel free to use and customize it for your needs.

---

## 👨‍💻 Author

**Pallo Phale** — Software Developer & Tech Enthusiast

> "Track smart, eat smart, live smart."

---

## 💬 Feedback

If you have suggestions or find bugs, please open an issue or pull request. Contributions are welcome!
