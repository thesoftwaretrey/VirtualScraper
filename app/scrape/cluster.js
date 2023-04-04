import { Cluster } from 'puppeteer-cluster';
import puppet from 'puppeteer-extra';
const { Puppeteer } = puppet;
// import extra from 'puppeteer-extra';
// const { addExtra } = extra;
import pkg from 'puppeteer-extra-plugin-stealth';
const { StealthPlugin } = pkg;
// import agent from 'random-useragent';
// const { randomUseragent } = agent;
import handler from 'query-selector-shadow-dom/plugins/puppeteer/index.js';
const { QueryHandler } = handler;
import { EventEmitter } from 'events';
import { Run } from './run.js';
// import { SocketServer } from '../service/socketServer.js'
import * as os from 'os';
import * as fs from 'fs';
class ClusterHost {
    emitter = new EventEmitter();
    runner = new Run();
    // clusterService;
    puppeteer;
    runningList = [];
    userDir = os.homedir();
    constructor() {
        this.runner.emitter.addListener('done', f => {
            this.emitter.emit('done', f);
        })
        this.cluster();
    }
    async cluster() {
        var dir = ''
        if(fs.existsSync("c:\\Program Files\\Google\\Chrome\\Application")){
            dir = "c:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        } else if(fs.existsSync("c:\\Program Files (x86)\\Google\\Chrome\\Application")){
            dir = "c:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
        } else if(fs.existsSync(this.userDir + "\\AppData\\Local\\Google\\Chrome\\Application")){
            dir = this.userDir + "\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"
        } else {
            dir = '/usr/bin/google-chrome'
        }
        var datadir = '';
        if(fs.existsSync(this.userDir + `\\AppData\\Local\\Google\\Chrome\\User Data\\Default`)){
            datadir = `--user-data-dir=` + this.userDir + `\\AppData\\Local\\Google\\Chrome\\User Data\\Default`
        } else {
            datadir = `--user-data-dir=/.config/google-chrome/Default`
        }
        puppet.use(pkg());
        await puppet.pptr.registerCustomQueryHandler('shadow', QueryHandler);
        var extensionPath = '/virtualscraper/extensions/seamless'
        var exists = fs.existsSync(extensionPath)
        if(!exists){
            extensionPath = process.cwd() + "\\extensions\\seamless"
        }
        console.log("Extenstion path:" + extensionPath)
        console.log("chrome path: " + dir)
        console.log("chrome data dir path: " + datadir)
        this.clusterService = await Cluster.launch({
            puppet,
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 1,
            timeout: 640000,
            puppeteerOptions: {
                headless: false,
                defaultViewport: null,
                executablePath:dir,
                args: [
                     datadir,
                     `--window-size=1915,1275`,
                    `--disable-extensions-except=${extensionPath}`, // Full path only
                    `--load-extension=${extensionPath}`,
                    '--no-sandbox',
                        '--disable-dev-shm-usage',
                     "--disabled-setupid-sandbox",
                    "--disable-gpu",
                ],
                defaultViewport:{
                    width:1920,
                    height:1280
                }
            }
        });
        if(!this.clusterService){
            console.log('Cluster service is null')
        } 
        await this.clusterService.task(async ({ page, data: data }) => {
            try {
                await page.setJavaScriptEnabled(true);
                await page.setDefaultNavigationTimeout(0);
                await page.evaluateOnNewDocument(() => {
                    // Pass webdriver check
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => false,
                    });
                });
                await page.evaluateOnNewDocument(() => {
                    // Pass chrome check
                    window.chrome = {
                        runtime: {},
                        // etc.
                    };
                });
                await page.evaluateOnNewDocument(() => {
                    //Pass notifications check
                    const originalQuery = window.navigator.permissions.query;
                    return window.navigator.permissions.query = (parameters) => (
                        parameters.name === 'notifications' ?
                            Promise.resolve({ state: Notification.permission }) :
                            originalQuery(parameters)
                    );
                });
                await page.evaluateOnNewDocument(() => {
                    // Overwrite the `plugins` property to use a custom getter.
                    Object.defineProperty(navigator, 'plugins', {
                        // This just needs to have `length > 0` for the current test,
                        // but we could mock the plugins too if necessary.
                        get: () => [1, 2, 3, 4, 5],
                    });
                });
                await page.evaluateOnNewDocument(() => {
                    // Overwrite the `languages` property to use a custom getter.
                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['en-US', 'en'],
                    });
                });
                
                console.log("Start query:" + data?.data.query + ", time:" + new Date().toLocaleTimeString())
                await page.bringToFront()
                await this.runner.invoke(page, data);
                console.log("End query:" + data.data.query + ", time:" + new Date().toLocaleTimeString())
            } catch (e) {
                console.log(e)
            }
        });
    }
    async queue(data) {
        await this.clusterService.queue(data);        
        await this.clusterService.idle();
        await this.clusterService.close();
    }
    statusMsg(id, type, status) {
        var obj = { query: id, message: status }
        return { action: 'update', type: type, data: obj }
    }
    getStatus(id, type) {
        var rslt = this.runningList.find(f => f.id === id && f.type === type);
        if (rslt) {
            return rslt.status;
        }
        return ''
    }
};
export { ClusterHost }