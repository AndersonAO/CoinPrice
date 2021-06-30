const fs = require('fs');

const puppeteer = require('puppeteer');
const util = require('util');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = util.promisify(rl.question).bind(rl);
const read = util.promisify(fs.readFile);

interface()
execute();
async function execute(){
  try {
    let coinBase = await question('// Base currency (ISO): ', async (answer) => answer);
    let coinConvert = await question('// Price to (ISO): ', async (answer) => answer);
    if (!coinBase || !coinConvert) throw new Error('BAD VALUE');
    coinBase = String(coinBase);
    coinConvert = String(coinConvert);
    const supportedBase = await verifySupportedCoin(coinBase)
    const supportedConvert = await verifySupportedCoin(coinConvert)
    if(!supportedBase || !supportedConvert) throw new Error('YOU NEED TO INSERT A SUPPORTED COIN (ISO FORMAT)')
    const price = await initializePuppeteer( coinBase,  coinConvert);
    showPrice(price, coinConvert)
  } catch (error) {
    console.log(error)
  }
}

async function initializePuppeteer(firstCoin = 'USD', secondCoin = 'BRL') {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=' + `${firstCoin} to ${secondCoin}`);
  const cotations = await page.evaluate(()=>{
    return document.querySelector('.DFlfde.SwHCTb').innerText
  })
  await browser.close();
  return await cotations;
}

function interface() {
  console.clear()
  console.log('//////////////////////////////////////////////')
  console.log('//            C O I N B A S E              //')
  console.log('/////////////////////////////////////////////')
}

function showPrice(price, coin){
  interface();
  console.log('     THE PRICE IS ' + `${coin} ${price}`)
}

async function receivedCoinsSupported(){
  const data = await read('./coins_supported.json', "utf8")
  return data;
}

async function verifySupportedCoin(entryUser){
  const coins = await receivedCoinsSupported()
  return coins.includes(entryUser)
}
