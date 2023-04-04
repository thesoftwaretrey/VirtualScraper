import { EventEmitter } from 'events';
class LinkedinScrape {
    isError = false;
    emitter = new EventEmitter();
    links = [];
    async run(page, data) {
        this.isError = false;
        try {
            var counter = 0;
            this.links = []
            console.log(data.data.data)
            var id = data.data.query
            var pge = await page.goto(data.data.data, { waitUntil: 'networkidle2' })
            await page.waitForSelector("html")
            await page.bringToFront();
            var done = false;
            console.log('Starting linkedin search')
            while (!done) {
                try {
                    var rslt = { query: id, auth: data.refID, type: "links", data: [], message: 'updating', total: counter }
                    await this.wait(4)
                    //check if captcha
                    var captcha = await page.$(".h-captcha")
                    if (captcha) {
                        console.log("captcha found")
                        var rslt = { type: "captcha", auth: data.refID, data: [], message: 'We encountered a captcha screen' }
                        this.emitter.emit('done', rslt)
                        done = true;
                        this.links = []
                        return;
                    }
                    await this.checkUsers(page, id);
                    //check if captcha
                    counter = counter + this.links.length;
                    var captcha = await page.$$(".h-captcha")
                    if (this.links.length === 0 || (captcha && captcha.length > 0) || this.isError) {
                        done = true;
                    }

                    if (captcha && captcha.length > 0) {
                        console.log("captcha found")
                        var rslt = { query: id, auth: data.refID, type: "captcha", data: this.links, message: 'We encountered a captcha screen', total: counter }
                        this.emitter.emit('done', rslt);
                        done = true;
                        this.links = []
                    } else if (this.isError) {
                        var rslt = { query: id, auth: data.refID, type: "error", data: this.links, message: "There was an error when scraping indeed. We'll provide all of the data we can. Please try again", total: counter }
                        this.emitter.emit("done", rslt);
                        done = true;
                        this.links = []
                    }
                    if (this.links.length > 150) {
                        done = true;
                    } else {
                        done = await this.checkNav(page);
                    }
                } catch (e) {
                    var rslt = { query: id, auth: data.refID, type: "error", data: this.links, message: e.message }//"There was an error when scraping indeed. We'll provide all of the data we can. Please try again", total: counter }
                    this.emitter.emit("done", rslt)
                    this.links = []
                }

            }
            var rslt = { query: id, auth: data.refID, type: "links", data: this.links, message: 'updating', total: counter }
            this.emitter.emit('done', rslt);
            this.links = []
        } catch (e) {
            console.log(JSON.stringify(e))
        }
    }
    async signIn(page, username, password) {
        var pge = await page.goto("https://www.linkedin.com/sales", { waitUntil: 'networkidle2' })
        await page.bringToFront();
        if (await page.url() === "https://www.linkedin.com/sales/home") {
            //your already signed in
            return
        }
        await page.goto("https://www.linkedin.com/sales/login", { waitUntil: 'networkidle2' })
        await page.waitForSelector('html')
        var frame = await page.waitForSelector(".authentication-iframe")
        if (frame) {
            var content = await frame.contentFrame();
            await content.$eval('#username', (el, value) => el.value = value, username);
            await content.$eval('#password', (el, value) => el.value = value, password);
            var button = await content.$(".btn__primary--large")
            await button.evaluate(e => e.click())
            await this.wait(3)
        } else {
            //something happened, need to get the url for a failed login and make a common method to check for the locked account screen (by url probably). need to add this after each user lookup (before and after)
            var rslt = { query: id, auth: data.refID, type: "lockout", data: username, message: 'A user: ' + username + ' was locked out' }//"There was an error when scraping indeed. We'll provide all of the data we can. Please try again", total: counter }
            this.emitter.emit("done", rslt)
            this.links = []
        }
    }
    async checkUsers(page, id) {
        // //get find button
        var find = await page.$('.' + this.findAll());
        if (!find) {
            find = await page.$('.' + this.findAll1());
        }
        if (!find) {
            find = await page.$('.' + this.findAll2());
        }
        if (find) {
            await find.evaluate(e => e.click());
            await this.wait(10)
            console.log("Seamless find was clicked")
        } else {
            console.log("Seamless find button not found")
            throw ('Extension not found')
            //some issue figure it out
        }
        var names = await page.$$('a[data-anonymize="person-name"]');
        if(!names || names.length === 0){
            
         names = await page.$$('a > span[data-anonymize="person-name"]');
        }
        console.log("Linkedin found " + names.length + " people on the search")
        for (var i = 0; i < names.length; i++) {
            var text = await page.evaluate(e => e.innerText, names[i])
            if (text.indexOf(",") >= 0) {
                var split = text.split(",")
                text = split[0]
            }
            text = text.replace("iii", "");
            text = text.replace("III", "");
            text = text.replace("sr.", "")
            text = text.replace("Sr.", "")
            text = text.replace("jr.", "")
            text = text.replace("Jr.", "")
            text = text.replace("dr", "")
            text = text.replace("Dr", "")
            text = text.replace(".", "")
            text = text.trim();
            var link = { id: id, url: "https://login.seamless.ai/my-contacts?page=1&queryText=" + encodeURI(text) }
            //create new page
            this.links.push(link);
        }
    }
    async checkNav(page) {
        try {
            var nav = await page.$(this.getNext());
            if (nav) {
                var isDisabled = await page.$eval(this.getNext(), button =>
                    button.disabled
                )
                if (isDisabled) {
                    return true;
                }
                await nav.evaluate(n => n.click())
                await this.wait(1)
                return false;
            }
            return true;

        } catch (e) {
            console.log(e)
            return true
        }
    }
    wait(seconds) {
        return new Promise(resolve =>
            setTimeout(() => resolve(true), seconds * 1000)
        );
    }
    getNames() {
        return "result-lockup__name"
    }
    findHeader() {
        return "enterprise-application-header  application-header application-header-homepage full-width global-alert-offset-translate "
    }
    findAll() {
        return 'rs-btn rs-btn-primary Button__StyledButton-iEKVQz jmdkgz'
    }
    findAll1() {
        return 'rs-btn rs-btn-primary Button__StyledButton-iESRRK jPuNpI'
    }
    findAll2() {
        return 'FindAllButton__StyledButton-dTJurc'
    }
    dropdown() {
        return 'ListDropdownMenu__ListItemText-FrgjU gxrCsZ'
    }
    input() {
        return 'rs-input Input__StyledInput-hFpMqr ListDropdownMenu__AddListInput-KVLJr hdEkfK hHlJTo'
    }
    addinput() {
        return 'rs-btn rs-btn-primary Button__StyledButton-iEKVQz cpTRgL'
    }
    view() {
        return 'rs-btn rs-btn-primary Button__StyledButton-iEKVQz jmdkgz'
    }
    getNext() {
        return 'button[aria-label="Next"]'
    }
    getPrevious() {
        return 'search-results__pagination-previous-button'
    }
    getAdded() {
        return 'result-lockup__name'
    }
}
export { LinkedinScrape }