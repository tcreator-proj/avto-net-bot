import { BotController} from "./telegramBot/BotController.js";
import TelegramBot from "node-telegram-bot-api";
import 'dotenv/config'
import { gotScraping } from 'got-scraping'
import { Dom, parseFromString } from 'dom-parser';
import { getAnchorList } from './utils/getAnchorList.js';

const botController = new BotController();

const botkey = process.env.API_KEY_BOT;
const baseURL = process.env.BASE_URL;

if(!botkey) {
  throw new Error('API_KEY_BOT not found');
}

if(!baseURL) {
  throw new Error('BASE_URL not found');
}

botController.start(botkey);

botController.onStart((msg: TelegramBot.Message) => {
  botController.sendMessage(
    msg.chat.id,
  `Hi, i'm bot that can watch avto.net advertisement. In order to start use \`/setsearchurl <url adress from avto.net>\` command.`
  );
  botController.sendMessage(
    msg.chat.id,
    `For example /setsearchurl https://www.avto.net/Ads/results.asp?znamka=&model=&modelID=&tip=katerikoli%20tip&znamka2=&model2=&tip2=katerikoli%20tip&znamka3=&model3=&tip3=katerikoli%20tip&cenaMin=1000&cenaMax=4000&letnikMin=2006&letnikMax=2016&bencin=201&starost2=999&oblika=0&ccmMin=0&ccmMax=99999&mocMin=0&mocMax=999999&kmMin=0&kmMax=125000&kwMin=0&kwMax=999&motortakt=0&motorvalji=0&lokacija=0&sirina=0&dolzina=&dolzinaMIN=0&dolzinaMAX=100&nosilnostMIN=0&nosilnostMAX=999999&lezisc=&presek=0&premer=0&col=0&vijakov=0&EToznaka=0&vozilo=&airbag=&barva=&barvaint=&doseg=0&EQ1=1000000000&EQ2=1000000000&EQ3=1000000000&EQ4=100000000&EQ5=1000000000&EQ6=1000000000&EQ7=1110100120&EQ8=101000000&EQ9=1000000020&KAT=1010000000&PIA=&PIAzero=&PIAOut=&PSLO=&akcija=0&paketgarancije=&broker=0&prikazkategorije=0&kategorija=0&ONLvid=0&ONLnak=0&zaloga=10&arhiv=0&presort=3&tipsort=DESC&stran=1`
  );
});

botController.onText(/\/setsearchurl/, async(msg: TelegramBot.Message) => {
  const urlEntity = msg.entities?.find(entity => entity.type === 'url');
  if(!urlEntity) {
    botController.sendMessage(msg.chat.id, 'You should use /setsearchurl <url>');
    return;
  }

  const url: string | undefined  = msg.text?.split(' ')[1];

  if(!url) {
    botController.sendMessage(msg.chat.id, 'Something went wrong. Try again');
    return;
  }

  try {
    gotScraping({
      url: url.trim(),
      headerGeneratorOptions:{
        browsers: [
          {
            name: 'chrome',
            minVersion: 87,
            maxVersion: 115
          }
        ],
        devices: ['desktop'],
        locales: ['de-DE', 'en-US'],
        operatingSystems: ['windows', 'linux'],
      }
    }).then((a: any) => {
      const urls: string[] = getAnchorList(a.body);
      const urlMap: string[] = urls.map((url: string) => url.replace('..', baseURL));

      botController.sendMessage(msg.chat.id, urls[0]);
    })
  } catch (e: any) {
    console.error(e.message)
  }


});

botController.on('polling_error', (msg: TelegramBot.Message) => {
  console.error(msg);
})