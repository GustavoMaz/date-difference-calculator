document.getElementById('date-form').addEventListener('submit', (event) => {
  event.preventDefault();
});
document.getElementById('submit').addEventListener('click', displayDateDifference);
document.getElementById('today').addEventListener('click', () => {
  document.getElementById('end-day').value = new Date().getDate();
  document.getElementById('end-month').value = new Date().getMonth() + 1;
  document.getElementById('end-year').value = new Date().getFullYear();
});

function calculateDateDifference() {
  let startDay = document.getElementById('start-day').value;
  let startMonth = document.getElementById('start-month').value;
  let startYear = document.getElementById('start-year').value;

  let endDay = document.getElementById('end-day').value;
  let endMonth = document.getElementById('end-month').value;
  let endYear = document.getElementById('end-year').value;

  const daysInMonths = [
    31,  // Janeiro
    29,  // Fevereiro
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
  
  function isInputValid() {
    // Se houver um input vazio
    if (startDay.length === 0 || startYear.length === 0 || endDay.length === 0 || endYear.length === 0) {
      return false;
    }
    
    // Se tentar colocar um dia de número maior do que 29 em fevereiro de um ano bissexto
    if (startMonth == 2 && startYear % 4 != 0 && startDay > 28) {
      return false
    }
    if (endMonth == 2 && endYear % 4 != 0 && endDay > 28) {
      return false
    }

    // Se o dia não existir (ex.: 31 de novembro)
    if (startDay > daysInMonths[startMonth-1] || endDay > daysInMonths[endMonth-1]) {
      return false;
    }

    return true 
  }

  if (!isInputValid()) {
    window.alert('Por favor, preencha todos os campos de forma válida.')
  } else {

    const startDate = new Date(startYear, startMonth, startDay);
    const endDate = new Date(endYear, endMonth, endDay);
    const difference = (endDate - startDate) / (1000 * 60 * 60 * 24);
  
    // Caso a data de início for no futuro, inverta a operação
    if (difference < 0) {
      [startDay, startMonth, startYear, endDay, endMonth, endYear] = [endDay, endMonth, endYear, startDay, startMonth, startYear];
    }
    let [days, months] = [0, 0]
    let years = endYear - startYear;

      let monthPriorToEndMonth = endMonth - 1;
      if (monthPriorToEndMonth < 0) {
        monthPriorToEndMonth = daysInMonths.length - 1;
      }
      
      if (endDay < startDay) {
        months --;
        if (months < 1) {
          months += 12;
          years --;
        }
        startDay -= daysInMonths[monthPriorToEndMonth];
      }
      days = endDay - startDay;
      
      if (endMonth < startMonth) {
        startMonth -= 12;
      }
      months = endMonth - startMonth;
      
      if (months >= 12) {
        years ++;
        months -= 12;
      }

    //console.log(`${years} Anos, ${months} meses e ${days} dias`);
    return [years, months, days];
  }
}

const ymdDisplay = document.createElement('p');
function displayDateDifference() {
  const ymd = calculateDateDifference();

  ymdDisplay.innerHTML = `${ymd[0]} ano(s), ${ymd[1]} mês(es) e ${ymd[2]} dia(s).`

  const resultDisplay = document.getElementById('res');
  resultDisplay.appendChild(ymdDisplay);

  document.getElementById('reset').addEventListener('click', () => {
    resultDisplay.removeChild(ymdDisplay);
  })
}
