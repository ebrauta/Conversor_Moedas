function convert() {
  // Declare variables for input value and message
  let message
  let inputnum = document.getElementById('number')
  let num = inputnum.value;
  num = num.replace(',','.')
  num = num.replace(' ','')
  // Delete previous result
  if (document.querySelector('.total')) document.querySelector('.total').remove();

  // Check input value
  let textincorrect = "Este valor está incorreto!"
  let erros = ['Caracter inválido!!!', 'Insira apenas 2 casa após a vírgula!!!', 'Digite um valor!!!' ]
  if (!(Number.isFinite(+num))){
    message = `<div class="total">${textincorrect} <br> ${erros[0]} </div>`
  } else if (num.indexOf('.') != -1 && num.indexOf('.') < num.length-3) {
    message = `<div class="total">${textincorrect} <br> ${erros[1]} </div>`;
  } else if(num == ''){
    message = `<div class="total">${textincorrect} <br> ${erros[2]} </div>`;
  } else {
      let cents = Math.round(+num * 100);
      dollars = RealToOther(num,1)
      euros = RealToOther(num,2)
      pounds = RealToOther(num,3)
      message = `<div class="total">Total em Reais: R$ ${num}<br><br>Total em dólares: U$ ${dollars}<br><br>Total em euros: E$ ${euros}<br><br>Total em libras esterlinas: L$ ${pounds}</div>`
  }
  // Create block for function's message
  document.querySelector('.window').insertAdjacentHTML('beforeend', message);

  //Transform from Real to Other
  function RealToOther(number, money){
      //Taxa de 20/02/2020 
      let tax = 1 
      switch(money){
        case 1: //real to dollar
          tax = 4.39
          break
        case 2: // real to euro
          tax = 4.74
          break
        case 3:
          tax = 5.79
          break
        default:
          tax = 1
          break
      }  

      let value = number/tax
      return value.toFixed(2);
  }
  inputnum.focus()
}

function clean(){
if (document.querySelector('table')) {
  document.querySelector('table').remove()
}
if (document.querySelector('.total')){
  document.querySelector('.total').remove()
}

let num = document.getElementById('number')
num.value = ""

let checkcoins = document.getElementsByClassName("checks")
for(let i = 0; i < checkcoins.length; i++){
  checkcoins[i].checked = false
}

num.focus()
}