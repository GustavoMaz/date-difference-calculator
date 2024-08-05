document.getElementById('date-form').addEventListener('submit', (event) => {
  event.preventDefault(); //Previnindo a página de recarregar ao clicar no submit
});

const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

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

function isDateValid(day, month, year) {
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
  ];

  if (isLeapYear(year)) {
    daysInMonths[1] = 29;  // Fevereiro in leap year
  }

  return day > 0 && day <= daysInMonths[month];
}

function calculateDateDifference() {
  let [startDay, startMonth, startYear, endDay, endMonth, endYear] = getInputValues();
  
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

  function areDatesValid() {
    let isValid = true;
    const startDate = startDateInput.value.replaceAll(' / ', '');
    const endDate = endDateInput.value.replaceAll(' / ', '');
    const regex = /^[0-9]+$/;
    console.log(startDate);
    console.log(endDate);
    
    function showWindowAlert(msg) {
      if (isValid) {
        window.alert(msg);
        isValid = false;
      }
    }

    clearLabelClasses();
  
    // Data de início
    if (!regex.test(startDate) && startDate.length != 0) {
      document.querySelector('label[for="start-date"]').classList.add('invalid');
      showWindowAlert('Por favor, use somente números.');
    }

    if (startDate.length == 0) {
      document.querySelector('label[for="start-date"]').classList.add('invalid');
      showWindowAlert('Por favor, preencha todos os campos');
    } else if (startDate.length < 8) {
      document.querySelector('label[for="start-date"]').classList.add('invalid');
      showWindowAlert('Por favor, insira uma data existente. Certifique-se de que a formatação está correta.');
    }
  
    if (startDay > daysInMonths[startMonth-1] || startDay < 1 || startMonth < 1 || startMonth > 12) {
      document.querySelector('label[for="start-date"]').classList.add('invalid');
      showWindowAlert('Por favor, insira uma data existente.');
    }

    // Data de fim
    if (!regex.test(endDate) && endDate.length != 0) {
      document.querySelector('label[for="end-date"]').classList.add('invalid');
      showWindowAlert('Por favor, use somente números.');
    }
    if (endDate.length == 0) {
      document.querySelector('label[for="end-date"]').classList.add('invalid');
      showWindowAlert('Por favor, preencha todos os campos');
    } else if (endDate.length < 8) {
      document.querySelector('label[for="end-date"]').classList.add('invalid');
      showWindowAlert('Por favor, insira uma data existente. Certifique-se de que a formatação está correta.');
    }

    if (endDay > daysInMonths[endMonth-1] || endDay < 1 || endMonth < 1 || endMonth > 12) {
      document.querySelector('label[for="end-date"]').classList.add('invalid');
      showWindowAlert('Por favor, insira uma data existente.');
    }




    return isValid;
  }
  
  if (!areDatesValid()) {
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
