require('dotenv/config')
const util = require('util');
const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = util.promisify(rl.question).bind(rl);
const read = util.promisify(fs.readFile);

const key = process.env.API_KEY
const axios = require('axios');
const base_URL = 'https://free.currconv.com/api/v7/convert?q='
const args = '&compact=ultra&apiKey='

execute()

async function execute(){
  try {
    let coinBase = await question('// Base currency (ISO): ', async (answer) => answer);
    let coinConvert = await question('// Price to (ISO): ', async (answer) => answer);
    if (!coinBase || !coinConvert) throw new Error('BAD VALUE');
    coinBase = String(coinBase).toUpperCase();
    coinConvert = String(coinConvert).toUpperCase();
    const supportedBase = await verifySupportedCoin(coinBase)
    const supportedConvert = await verifySupportedCoin(coinConvert)
    if(!supportedBase || !supportedConvert) throw new Error('YOU NEED TO INSERT A SUPPORTED COIN (ISO FORMAT)')
    const price = await convert( coinBase,  coinConvert);
    showPrice(price, coinConvert)
  } catch (error) {
    console.log(error)
  }
}
async function convert(coin1 = 'USD', coin2 = 'BRL'){
 const res = await axios.get(`${base_URL}${coin1}_${coin2}${args}${key}`)
  .then(response => response.data[`${coin1}_${coin2}`])
 return res;
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