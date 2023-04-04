import { IndeedScrape } from '../pages/indeed.js'
import { LinkedinScrape } from '../pages/linkedin.js'
import { SeamlessScrape } from '../pages/seamless.js'
import { XRay } from '../pages/xray.js'
import { GoogleJobs } from '../pages/google_jobs.js'
import { EventEmitter } from 'events'
class Run {
    emitter = new EventEmitter();
    linkedin = new LinkedinScrape();
    seamless = new SeamlessScrape();
    indeed = new IndeedScrape();
    google = new GoogleJobs();
    xray = new XRay();
    constructor() {
    }
    async invoke(page, data) {
        try {
            if (!page) {
                return;
            }
            await this.wait(1)
            await page.close();
        } catch (e) {
            console.log(e)
        }
    }
    wait(seconds) {
        return new Promise(resolve =>
            setTimeout(() => resolve(true), seconds * 1000)
        );
    }
}
export { Run }