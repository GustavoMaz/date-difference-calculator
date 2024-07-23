document.getElementById('date-form').addEventListener('submit', (event) => {
  event.preventDefault();
});

const startDayInput = document.getElementById('start-day');
const startMonthInput = document.getElementById('start-month');
const startYearInput = document.getElementById('start-year');
const endDayInput = document.getElementById('end-day');
const endMonthInput = document.getElementById('end-month');
const endYearInput = document.getElementById('end-year');

document.getElementById('submit').addEventListener('click', displayDateDifference);
document.getElementById('today').addEventListener('click', () => {
  const today = new Date();
  endDayInput.value = today.getDate();
  endMonthInput.value = today.getMonth() + 1;
  endYearInput.value = today.getFullYear();
});

function clearLabelClasses() {
  document.querySelectorAll('label').forEach(label => label.classList.remove('invalid'));
}

function clearForm() {
  if (document.getElementById('res').contains(ymdDisplay)) {
    document.getElementById('res').removeChild(ymdDisplay);
  }
  clearLabelClasses();
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function isDateValid(day, month, year) {
  const daysInMonths = [
    31,  // Janeiro
    28,  // Fevereiro (non-leap year by default)
    31,  // Março
    30,  // Abril
    31,  // Maio
    30,  // Junho
    31,  // Julho
    31,  // Agosto
    30,  // Setembro
    31,  // Outubro
    30,  // Novembro
    31   // Dezembro
  ];

  if (isLeapYear(year)) {
    daysInMonths[1] = 29;  // Fevereiro in leap year
  }

  return day > 0 && day <= daysInMonths[month];
}

function isInputValid() {
  let isValid = true;
  clearLabelClasses();

  const startDay = parseInt(startDayInput.value);
  const startMonth = parseInt(startMonthInput.value) - 1; // Ajuste para fazer o índice começar no 0 
  const startYear = parseInt(startYearInput.value);
  const endDay = parseInt(endDayInput.value);
  const endMonth = parseInt(endMonthInput.value) - 1;
  const endYear = parseInt(endYearInput.value);

  if (!startYear && startYear != 0) {
    document.querySelector('label[for="start-year"]').classList.add('invalid');
    isValid = false;
  }

  if (!endYear && endYear != 0) {
    document.querySelector('label[for="end-year"]').classList.add('invalid');
    isValid = false;
  }

  if (!startDay || !endDay) {
    document.querySelector('label[for="start-day"]').classList.add('invalid');
    document.querySelector('label[for="end-day"]').classList.add('invalid');
    isValid = false;
  }

  if (!isDateValid(startDay, startMonth, startYear)) {
    document.querySelector('label[for="start-day"]').classList.add('invalid');
    isValid = false;
  }

  if (!isDateValid(endDay, endMonth, endYear)) {
    document.querySelector('label[for="end-day"]').classList.add('invalid');
    isValid = false;
  }

  return isValid;
}

function calculateDateDifference() {
  let startDay = parseInt(startDayInput.value);
  let startMonth = parseInt(startMonthInput.value) - 1; // Adjusting month to 0-indexed
  let startYear = parseInt(startYearInput.value);
  let endDay = parseInt(endDayInput.value);
  let endMonth = parseInt(endMonthInput.value) - 1; // Adjusting month to 0-indexed
  let endYear = parseInt(endYearInput.value);

  if (!isInputValid()) {
    window.alert('Por favor, preencha todos os campos de forma válida.');
    return null;
  } else {
    const startDate = new Date(startYear, startMonth, startDay);
    const endDate = new Date(endYear, endMonth, endDay);
    let difference = (endDate - startDate) / (1000 * 60 * 60 * 24);

    if (difference < 0) {
      [startDay, startMonth, startYear, endDay, endMonth, endYear] = [endDay, endMonth, endYear, startDay, startMonth, startYear];
      difference = Math.abs(difference);
    }

    let years = endYear - startYear;
    let months = endMonth - startMonth;
    let days = endDay - startDay;

    const daysInMonths = [
      31,  // Janeiro
      isLeapYear(endYear) ? 29 : 28,  // Fevereiro
      31,  // Março
      30,  // Abril
      31,  // Maio
      30,  // Junho
      31,  // Julho
      31,  // Agosto
      30,  // Setembro
      31,  // Outubro
      30,  // Novembro
      31   // Dezembro
    ];

    if (days < 0) {
      months--;
      days += daysInMonths[(endMonth - 1 + 12) % 12];
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return [years, months, days];
  }
}

const ymdDisplay = document.createElement('p');

function displayDateDifference() {
  const ymd = calculateDateDifference();
  if (ymd == null) return;

  let dayMsg = ymd[2] === 1 ? 'dia' : 'dias';
  let monthMsg = ymd[1] === 1 ? 'mês' : 'meses';
  let yearMsg = ymd[0] === 1 ? 'ano' : 'anos';

  ymdDisplay.innerHTML = `A diferença é de ${ymd[0]} ${yearMsg}, ${ymd[1]} ${monthMsg} e ${ymd[2]} ${dayMsg}.`;

  document.getElementById('res').appendChild(ymdDisplay);
  document.getElementById('reset').addEventListener('click', clearForm);
}
