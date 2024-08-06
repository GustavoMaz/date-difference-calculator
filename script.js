document.getElementById('date-form').addEventListener('submit', (event) => {
  event.preventDefault(); //Previnindo a página de recarregar ao clicar no submit
});

const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

document.getElementById('today').addEventListener('click', () => {
  endDateInput.value = getTodaysDate();
});

function getTodaysDate() {
  const day = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  let today = `${day < 10 ? + '0' : ''}${day} / ${month < 10 ? + '0' : ''}${month+1} / ${year}`

  return today;
}

startDateInput.addEventListener('input', () => {
  formatInputField(startDateInput);
});
endDateInput.addEventListener('input', () => {
  formatInputField(endDateInput);
});

function formatInputField(inputField) {
  let str = inputField.value;
  let lengthToFormatAt = 2;
  for (i = 0; i <= 2; i++) {
    if (str.length == lengthToFormatAt) {
      str += ' / ';
    } 
    if (str.length == lengthToFormatAt + 2) {
      str = str.substring(0, str.length - 3); // Corta os três últimos caractéres
    }
    lengthToFormatAt = 7;
  }
  inputField.value = str; 
}

function getInputValues() {
  const startDay = parseInt(startDateInput.value.substring(0, 1+1))
  const startMonth = parseInt(startDateInput.value.substring(5, 6+1))
  const startYear = parseInt(startDateInput.value.substring(10, startDateInput.value.length));

  const endDay = parseInt(endDateInput.value.substring(0, 1+1))
  const endMonth = parseInt(endDateInput.value.substring(5, 6+1))
  const endYear = parseInt(endDateInput.value.substring(10, endDateInput.value.length));

  return [
    startDay, 
    startMonth, 
    startYear,
    endDay, 
    endMonth, 
    endYear
  ];
}

document.getElementById('submit').addEventListener('click', displayDateDifference);

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

const daysInMonths = [
  31,  // Janeiro
  28,  // Fevereiro
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
]
function calculateDateDifference() {
  let [startDay, startMonth, startYear, endDay, endMonth, endYear] = getInputValues();

  function isDateValid(date, labelFor) {
    const label = document.querySelector(`label[for="${labelFor}-date"]`);
    let isValid = true;
    date = date.replaceAll(' / ', '');
    const regex = /^[0-9]+$/;

    const daysInMonths = [
      31,  // Janeiro
      isLeapYear(parseInt(date.substring(3, date.length))) ? 29 : 28,  // Fevereiro
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
    ]
    function invalidateDate(msg) {
      if (isValid) {
        label.classList.add('invalid');
        window.alert(msg);
        isValid = false;
      }
    }
    clearLabelClasses();
    if (!regex.test(date) && date.length != 0) {
      invalidateDate('Por favor, use somente números.');
    }
    if (date.length == 0) {
      invalidateDate('Por favor, preencha todos os campos');
    } else if (date.length < 8) {
      invalidateDate('Por favor, insira uma data existente. Certifique-se de que a formatação está correta.');
    }
    if (startDay > daysInMonths[startMonth-1] || startDay < 1 || startMonth < 1 || startMonth > 12) {
      invalidateDate('Por favor, insira uma data existente.');
    }
    return isValid;
  }
  
  if (isDateValid(startDateInput.value, 'start') && isDateValid(endDateInput.value, 'end')) {
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