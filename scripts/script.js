/**
 * Conversor
 *
 * Conversor de moedas feito em JS através dos dados adicionados por API awesomeapi
 *
 * @author Eduardo Rauta
 * @version 1.0
 *
 */

var valor = document.querySelector("#number");
var moeda1 = document.querySelector("#moeda1");
var moeda2 = document.querySelector("#moeda2");
var obs = document.querySelector("#obs");
var total = document.querySelector("#total");

// Código das moedas estrangeiras
// Peso Argentino, Dólar Australiano, BitCoin, Dólar Canadense, Franco Suíço, Yuan Chinês
// Ethereum, Euro, Libra esterlina, Novo Shekel Israelenese, Iene Japonês, LiteCoin
// Dólar Comercial, Dólar Turismo, Ripple

const moedas1 = [
  "ARS",
  "AUD",
  "BTC",
  "CAD",
  "CHF",
  "CNY",
  "ETH",
  "EUR",
  "GBP",
  "ILS",
  "JPY",
  "LTC",
  "USD",
  "XRP",
];

const taxas = [];

criarOption(moeda1, "Real Brasileiro", "BRL");
criarOption(moeda2, "Real Brasileiro", "BRL");

moedas1.forEach((moeda) => {
  let url = `https://economia.awesomeapi.com.br/json/${moeda}`;
  let ajax = new XMLHttpRequest();
  ajax.open("GET", url, true);
  ajax.send();
  ajax.onreadystatechange = function () {
    if (ajax.readyState == 4 && ajax.status == 200) {
      let dataBruta = ajax.responseText;
      let dados = JSON.parse(dataBruta);
      dados.forEach((dado) => (dado.name = dado.name.split("/")[0]));
      console.info(dados);
      taxas.push(dados[0].ask);
      criarOption(moeda1, dados[0].name, dados[0].code);
      criarOption(moeda2, dados[0].name, dados[0].code);
    }
  };
});

function criarOption(select, item, valor) {
  let opcao = document.createElement("option");
  opcao.setAttribute("value", valor);
  opcao.innerHTML = item;
  select.appendChild(opcao);
}

function transformCurrency(value, currency) {
  try {
    return Number(value).toLocaleString("pt-br", {
      style: "currency",
      currency: currency,
    });
  } catch (error) {
    return 0;
  }
}

function retornaErro(motivoDoErro) {
  switch (motivoDoErro) {
    case 1:
      return "Este valor está incorreto : Valor vazio!";
    case 2:
      return "Este valor está incorreto: Caracter inválido!";
    case 3:
      return "Este valor está incorreto! Número negativo!";
    default:
      return "";
  }
}
function retornaCorrecao(motivoDoErro) {
  switch (motivoDoErro) {
    case 1:
      return "Por favor insira um valor";
    case 2:
      return "Por favor, insira um número!!!";
    case 3:
      return "Por favor, insira um número positivo!!!";
    default:
      return "";
  }
}

function mostraObservacao(motivoDaObservacao) {
  if (
    motivoDaObservacao == 1 ||
    motivoDaObservacao == 2 ||
    motivoDaObservacao == 3
  ) {
    return "block";
  } else {
    return "none";
  }
}

function insereObservacao(motivoDaObservacao) {
  obs.innerHTML = `${retornaErro(motivoDaObservacao)} <br> ${retornaCorrecao(
    motivoDaObservacao
  )}`;
  obs.style.display = mostraObservacao(motivoDaObservacao);
}

function testaNumero(numero) {
  numero = convertTextToNumber(numero);
  if (!numero) {
    insereObservacao(1);
  } else if (!Number.isFinite(+numero)) {
    insereObservacao(2);
  } else if (numero < 0) {
    insereObservacao(3);
  } else {
    insereObservacao(0);
    return numero;
  }
  return 0;
}

const convertTextToNumber = (num) => {
  num = num.replace(",", ".");
  num = num.replace(" ", "");
  num = Number(num);
  return num;
};

function converterTaxas(valor) {
  let option1 = moeda1.options.selectedIndex;
  let option2 = moeda2.options.selectedIndex;
  // Com as options de moedas, busca as taxas na listaTaxas
  // Verifica se a option recebe 0 = Real Brasileiro (na tabela buscada pela API não consta Real)
  // E taxa de Real para Real = 1
  let taxa1 = option1 == 0 ? 1 : taxas[option1 - 1];
  let taxa2 = option2 == 0 ? 1 : taxas[option2 - 1];
  let conversao = valor * (taxa1 / taxa2);
  return conversao;
}

const convertMoney = () => {
  let textoFinal = "";
  // Recebe as moedas que serão selecionadas nas option
  let option1 = moeda1.options.selectedIndex;
  let option2 = moeda2.options.selectedIndex;
  // Testa se o valor da caixa de texto é um número
  let val = testaNumero(valor.value);
  // Converte o valor testado de acordo com a lista de taxas
  const valorNovo = converterTaxas(val);
  // Verifica se existe um valor na variável
  if (val) {
    //Transforma os valores em formato Financeiro
    let transformaValorVelho = transformCurrency(val, moeda1[option1].value); //Valor antes de ser convertido
    let transformaValorNovo = transformCurrency(
      valorNovo,
      moeda2[option2].value
    ); // Valor após a conversão
    // Escreve o texto que será inserido
    textoFinal = `Valor em ${moeda1[option1].innerHTML}: ${transformaValorVelho} <br>`;
    textoFinal += `Valor em ${moeda2[option2].innerHTML}: ${transformaValorNovo}`;
    // Insere o texto no local de visualização de resultados
    total.innerHTML = textoFinal;
    // Mostra o local
    total.style.display = "block";
  }
};

const cleanAll = () => {
  valor.value = "";
  moeda1.options.selectedIndex = 0;
  moeda2.options.selectedIndex = 0;
  insereObservacao(0);
  total.innerHTML = "";
  total.style.display = "none";
  console.clear();
};
