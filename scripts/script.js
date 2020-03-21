function convert() {
  // Declare variables for input value, observation, options and message
  let message;
  let obs = $("#obs");
  let inputnum = document.getElementById("number");
  let num = inputnum.value;
  let options = [$('#moeda1')[0].options.selectedIndex, $('#moeda2')[0].options.selectedIndex];

  // Changing , by . an verifing if num is null or empty
  num = num.replace(",", ".");
  num = num.replace(" ", "");
  NumberNull(num);
  // Delete previous result
  remove();

  // Check input value
  let textincorrect = "Este valor está incorreto!";
  let erros = [
    "Caracter inválido!!!",
    "Insira apenas 2 casa após a vírgula!!!"
  ];
  if (!Number.isFinite(+num)) {
    // Not's number
    message = `<div class="total">${textincorrect} <br> ${erros[0]} </div>`;
  } else if (num.indexOf(".") != -1 && num.indexOf(".") < num.length - 3) {
    // More then 2 digits
    message = `<div class="total">${textincorrect} <br> ${erros[1]} </div>`;
  } else {
    // Number -> 0 = real, 1 = dolar, 2 = euros, 3 = pounds(libras)
    obs.text("* Taxa de 19/03/2020 - Atualizada mensalmente")
    message = `<div class="total">`;
    let vlr_moedas = RealToOther(num, options[0], options[1]);
    message += `${vlr_moedas}`;
    message += `</div>`;
  }
  // Create block for function's message
  document.querySelector(".window").insertAdjacentHTML("beforeend", message);

  //Transform from Real to Other
  function RealToOther(number, money1, money2) {
    NumberNull(number);
    //Taxa de 20/03/2020 - real, dolar, euro, libra, iene, bitcoin
    // Declare variables
    let moedas = {
      "name":[ "Reais", "Dólares americanos", "Euros", "Libras esterlinas", "Ienes","Yuans", "Rublos russos"],
      "simb" : ["R$", "US$", "€", "£", "JP¥", "CN¥", "₽"],
      "taxes" : [1, 5.00, 5.33, 5.82, 0.045, 0.70, 0.063]
    }
    // Convert both to Real
    let tax1 = moedas.taxes[money1];
    let value1 = number / tax1;
    let tax2 = moedas.taxes[money2];
    let value2 = number / tax2;
    // Convert 
    let value, saida = '';
    if(value1 == 0 || value2 == 0){
      value = 0
      saida += `Valor em ${moedas.name[money1]}: ${moedas.simb[money1]} 0.00 <br>`
      saida += `Valor em ${moedas.name[money2]}: ${moedas.simb[money2]} 0.00`
    } else {
      value = value2/value1
      saida += `Valor em ${moedas.name[money1]}: ${moedas.simb[money1]} ${parseFloat(number).toFixed(2)} <br>`
      saida += `Valor em ${moedas.name[money2]}: ${moedas.simb[money2]} ${value.toFixed(2)}`
    }
    return saida;
  }
  // Focus the input
  inputnum.focus();
}

// Clean all
function clean() {
  // Declare variables for input value and options
  let num = document.getElementById("number");
  let options = [$('#moeda1')[0], $('#moeda2')[0]];

  // Remove list
  remove();

  // Clean input value and receive focus
  num.value = "";
  num.focus();

  //Clean options
  options.forEach(e => {
    e.selectedIndex = 0
  });
}

// Remove table
function remove(){
  // Declare variables for table and observation
  let total = $(".total")
  let obs = $("#obs")
  // Clean values
  if (total) {
    total.remove();
    obs.text("")
  }
}
// Verify if number is null ou empty
function NumberNull(number){
  if (number == null || number == "") {
    number = 0;
  } 
}