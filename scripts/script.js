var valor = document.getElementById("number");
var moeda1 = document.getElementById("moeda1");
var moeda2 = document.getElementById("moeda2");
var obs = document.getElementById("obs");
var total = document.getElementById("total");

function criarSelect(select) {
  let opcoes = moedas.map((item) => item.name);
  opcoes.forEach((item, index) => {
    let opcao = document.createElement("option");
    opcao.setAttribute("value", index);
    opcao.innerHTML = item;
    select.appendChild(opcao);
  });
}
criarSelect(moeda1);
criarSelect(moeda2);

function toNumbers(num, tax) {
  return num * tax;
}

function transformCurrency(value, currency) {
  return Number(value).toLocaleString("pt-br", {
    style: "currency",
    currency: currency,
  });
}

function testaNumero(numero) {
  total.style.display = "none"
  if (!Number.isFinite(+numero)) {
    let textincorrect = "Este valor está incorreto: Caracter inválido!";
    let erro = "Por favor, insira um número!!!";
    obs.innerHTML = `${textincorrect} <br> ${erro}`;
  } else if (numero < 0) {
    let textincorrect = "Este valor está incorreto! Número negativo!";
    let erro = "Por favor, insira um número positivo!!!";
    obs.innerHTML = `${textincorrect} <br> ${erro}`;
  } else {
    let option1 = moeda1.options.selectedIndex;
    let opc1 = [moedas[option1].name,moedas[option1].country]
    let option2 = moeda2.options.selectedIndex;
    let opc2 = [moedas[option2].name,moedas[option2].country]
    let tax = moedas[option1].tax / moedas[option2].tax;
    let transformed = toNumbers(numero, tax);
    let saida = `Valor em ${opc1[0]} (${opc1[1]}): ${transformCurrency(
      numero,
      moedas[option1].currency
    )}<br>`;
    saida += `Valor em ${opc2[0]} (${opc2[1]}): ${transformCurrency(
      transformed,
      moedas[option2].currency
    )}`;
    total.innerHTML = saida;
    total.style.display = "block";
  }
}

function convert() {
  let num = valor.value;
  num = num.replace(",", ".");
  num = num.replace(" ", "");
  num = Number(num);
  testaNumero(num);
}

function clean() {
  valor.value = "";
  moeda1.options.selectedIndex = 0;
  moeda2.options.selectedIndex = 0;
  obs.innerHTML = "";
  total.innerHTML = "";
  total.style.display = "none";
}