// element constants
const newPeriodFormEl = document.getElementsByTagName("form")[0];
const startDateInputEl = document.getElementById("start-date");
const endDateInputEl = document.getElementById("end-date");

//listen to form submissions
newPeriodFormEl.addEventListener("submit", (event)=>{
    // prevent default submit cuz we're doing it all client side
    event.preventDefault();

    // Get the start and end dates from the form.
  const startDate = startDateInputEl.value;
  const endDate = endDateInputEl.value;

  // Check if the dates are invalid
  if (checkDatesInvalid(startDate, endDate)) {
    // If the dates are invalid, exit.
    return;
  }

  // Store the new period in our client-side storage.
  storeNewPeriod(startDate, endDate);

  // Refresh the UI.
  renderPastPeriods();

  // Reset the form.
  newPeriodFormEl.reset();
})

function checkDatesInvalid(startDate, endDate){
    // not very robust; could add lots of improvements
    if(!startDate || !endDate || startDate > endDate) {
        //for now just reset the form :P
        newPeriodFormEl.reset();
        return true;
    }
    return false;
}

// Setting Up Storage (localstorage)
const  STORAGE_KEY = "cycletrackertut";
function storeNewPeriod(startDate, endDate){
    // get from storage
    const periods = getAllStoredPeriods();

    periods.push({startDate, endDate});
    periods.sort((a,b)=>new Date(a.startDate) - new Date(b.startDate));

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
}

function getAllStoredPeriods(){
    const data = window.localStorage.getItem(STORAGE_KEY);
    const periods = data ? JSON.parse(data) : [];
    return periods;
}

// Rendering Data

const pastPeriodContainer = document.getElementById("past-periods");

function renderPastPeriods() {
  // get the parsed string of periods, or an empty array.
  const periods = getAllStoredPeriods();

  // exit if there are no periods
  if (periods.length === 0) {
    return;
  }

  // Clear the list of past periods, since we're going to re-render it.
  pastPeriodContainer.textContent = "";

  const pastPeriodHeader = document.createElement("h2");
  pastPeriodHeader.textContent = "Past periods";

  const pastPeriodList = document.createElement("ul");

  // Loop over all periods and render them.
  periods.forEach((period) => {
    const periodEl = document.createElement("li");
    periodEl.textContent = `From ${formatDate(
      period.startDate,
    )} to ${formatDate(period.endDate)}`;
    pastPeriodList.appendChild(periodEl);
  });

  pastPeriodContainer.appendChild(pastPeriodHeader);
  pastPeriodContainer.appendChild(pastPeriodList);
}

function formatDate(dateString) {
  // Convert the date string to a Date object.
  const date = new Date(dateString);

  // Format the date into a locale-specific string.
  // include your locale for better user experience
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

// Render periods on load
renderPastPeriods();