function convert() {
    // Declare variables for input value and message
    let message
    let inputnum = document.getElementById('number')
    let num = inputnum.value;
    num = num.replace(',','.')
    num = num.replace(' ','')
    // Delete previous result
    if (document.querySelector('table')) document.querySelector('table').remove();
    if (document.querySelector('.total')) document.querySelector('.total').remove();

    // Coin counting function
    function divide_by_coins(number) {
      let checks = document.getElementsByClassName("checks")
      let coins = [0,0,0,0,0]
      let value = [0,0,0,0,0]
      let rest = number
      let totcoins = 0
      for(let i = 0; i< checks.length; i++){
        if(checks[i].checked){
          value[i] = checks[i].value
        }       
      }
      let tabela = `<table><tr><td>Moedas</td><td>Quantidade</td></tr>`
      for(let j = 0; j < checks.length; j++){
        if(value[j] != 0){
          coins[j] = Math.floor(rest/value[j])
          rest = number%value[j]
          tabela += `<tr><td>Moedas de (${value[j]} &#162)</td><td>${coins[j]}</td></tr>`
        } 
      }
      value.forEach(e => {
        if(e!= 0){totcoins++}
      })
      if(totcoins==0){
        tabela += `<tr><td colspan='2'>Não há moedas!</td></tr>`
      }
      if(rest != 0) {
        tabela += `<tr class="sobra"><td>Sobraram</td><td>${rest} centavos</td></tr></table>` 
      } else {
        tabela +=`</table>`
      }     
      return tabela
    }
  
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
        message = `<div class="total">Total em Reais: R$ ${num}<br><br>Total de centavos: ${cents} centavos<br><br>Total em dólares: U$ ${dollars}<br><br>Total em euros: E$ ${euros}</div>` + divide_by_coins(cents);
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