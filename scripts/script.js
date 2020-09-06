/**
 * Conversor
 *
 * Conversor de moedas feito em JS através dos dados adicionados por API awesomeapi
 *
 * @author Eduardo Rauta
 * @version 1.0
 *
 */

// Recupera os itens do HTML
var valor = document.querySelector("#number"); // Caixa de inserção dos números
var moeda1 = document.querySelector("#moeda1"); // Lista de opções da moeda inicial a ser convertida
var moeda2 = document.querySelector("#moeda2"); // Lista de opções da moeda à qual se quer converter
var obs = document.querySelector("#obs"); // Observações sobre erros de valor (letras, números negativos, etc.)
var total = document.querySelector("#total"); // Local do visualização dos resultados (inicialmente oculta)

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
  "USDT",
  "XRP",
];
//  Cria a constante que receberá as taxas de conversão de moeda para Real
const taxas = []
// Cria option inicial com o nome do Real
criarOption(moeda1, "Real Brasileiro", "BRL")
criarOption(moeda2, "Real Brasileiro", "BRL")

// Requisição de dados do API através do Array de código das moedas
moedas1.forEach((moeda) => {
  // URL do API
  let url = `https://economia.awesomeapi.com.br/json/${moeda}`;
  // Requisição GET
  let ajax = new XMLHttpRequest();
  // Seta tipo de requisição e URL com os parâmetros
  ajax.open("GET", url, true);
  // Envia a requisição
  ajax.send();
  // Cria um evento para receber o retorno
  ajax.onreadystatechange = function () {
    // Caso o state seja 4 e o http.status for 200, é porque a requisição deu certo
    if (ajax.readyState == 4 && ajax.status == 200) {
      // Recupera o dado após requisição dar certo
      let dataBruta = ajax.responseText;
      // Transforma o dado recuperado em JSON
      let dados = JSON.parse(dataBruta);
      //console.log(dados)
      taxas.push(dados[0].ask)
      // Cria as option do selects moeda1 e moeda2 do HTML com o nome das moedas 
      criarOption(moeda1, dados[0].name, dados[0].code)
      criarOption(moeda2, dados[0].name, dados[0].code)
    } 
  };
});

// Criação das options do select
function criarOption(select,item,valor) {
  // Cria a opção option
  let opcao = document.createElement("option");
  // Atribui o valor da option com o código Valor
  opcao.setAttribute("value", valor);
  // Insere o Texto Item no option
  opcao.innerHTML = item;
  // Insere a option criada dentro da select
  select.appendChild(opcao);
}

// Transformação em moeda
function transformCurrency(value, currency) {
  // Testa se o número está correto, caso funcione retorna a funçao de acordo com o toLocaleString
  try {
    // função toLocaleString é interna do JS, a modificação vem da variável currency
    return Number(value).toLocaleString("pt-br", {
      style: "currency",
      currency: currency,
    });
  } catch (error) {
    // Caso dê erro, retorna 0
    return 0;
  }
}

// Testar número
function testaNumero(numero) {
  numero = convertTextToNumber(numero) // Converte a variável número de String para Number
  // Cria as variáveis para inserção de erro e correções
  let erro = ''
  let correcao = ''
  if(!numero){ // Verifica se a caixa está vazia
    erro = "Este valor está incorreto : Valor vazio!" // Mostra o tipo de erro
    correcao = "Por favor insira um valor" // Sugere correção
    obs.innerHTML = `${erro} <br> ${correcao}`; // Insere textos na observação
    obs.style.display = "block"; // Mostra o erro
  } else if (!Number.isFinite(+numero)) { // Verifica se o número tem caracter inválido
    erro = "Este valor está incorreto: Caracter inválido!"; // Mostra o tipo de erro
    correcao = "Por favor, insira um número!!!"; // Sugere correção  
    obs.innerHTML = `${erro} <br> ${correcao}`; // Insere textos na observação
    obs.style.display = "block"; // Mostra o erro
  } else if (numero < 0) {  // Verifica se o o número é positivo (moeda não pode ser negativa)
    erro = "Este valor está incorreto! Número negativo!";// Mostra o tipo de erro
    correcao = "Por favor, insira um número positivo!!!";// Sugere correção
    obs.innerHTML = `${erro} <br> ${correcao}`; // Insere textos na observação
    obs.style.display = "block"; // Mostra o erro
  } else { //Caso não haja os erros acima
    obs.innerHTML = ``; // Retira textos na observação
    obs.style.display = "none"; // Oculta o erro
    return numero // Retorna o Number numero
  }
  return 0 // Caso tudo der errado retorna 0
}

// Converter texto em número - String -> Number
const convertTextToNumber = (num) => {
  // Troca a vírgula pelo ponto (padrão inglês utilizado pelas linguagens de programação)
  num = num.replace(",", ".");
  // Retira espaços digitados incorretamente
  num = num.replace(" ", "");
  // Tipifica para o  tipo Number
  num = Number(num);
  // Retorna o num
  return num;
}

// Converter as moedas com as taxas recebidas
function conversaoTaxas(listaTaxas, valor){
  // Recebe as opções da moedas
  let option1 = moeda1.options.selectedIndex
  let option2 = moeda2.options.selectedIndex
  // Com as options de moedas, busca as taxas na listaTaxas
  // Verifica se a option recebe 0 = Real Brasileiro (na tabela buscada pela API não consta Real)
  // E taxa de Real para Real = 1
  let taxa1 = option1 == 0 ?  1 : taxas[option1-1]
  let taxa2 = option2 == 0 ?  1 : taxas[option2-1]
  // Converte o valor
  let conversao = valor * (taxa1/taxa2)
  return conversao
}

// Converter - função ao clicar o botão Converter do HTML
const convert = () => {
  // Inicia o texto a ser escrito no total com vazio
  let textoFinal = ''
  // Recebe as moedas que serão selecionadas nas option
  let option1 = moeda1.options.selectedIndex
  let option2 = moeda2.options.selectedIndex
  // Testa se o valor da caixa de texto é um número
  let val = testaNumero(valor.value)
  // Converte o valor testado de acordo com a lista de taxas
  const valorNovo = conversaoTaxas(taxas, val)
  // Verifica se existe um valor na variável
  if(val){
    //Transforma os valores em formato Financeiro 
    let transformaValorVelho = transformCurrency(val, moeda1[option1].value) //Valor antes de ser convertido
    let transformaValorNovo = transformCurrency(valorNovo, moeda2[option2].value) // Valor após a conversão
    // Escreve o texto que será inserido
    textoFinal = `Valor em ${moeda1[option1].innerHTML}: ${transformaValorVelho} <br>`
    textoFinal += `Valor em ${moeda2[option2].innerHTML}: ${transformaValorNovo}`
    // Insere o texto no local de visualização de resultados
    total.innerHTML = textoFinal
    // Mostra o local
    total.style.display = 'block'
  }
}


// Clean - função ao clicar o botão Clean do HTML
const clean = () => {
  // Limpa a caixa de texto com o valor
  valor.value = "";
  // Seleciona a primeira option da moeda1
  moeda1.options.selectedIndex = 0;
  // Seleciona a primeira option da moeda2
  moeda2.options.selectedIndex = 0;
  // Limpa observações
  obs.innerHTML = "";
  // Limpa caixa de mostrar totais
  total.innerHTML = "";
  // Oculta caixa de mostrar totais
  total.style.display = "none";
  // Limpa o console
  console.clear()
}
