import { EventEmitter } from 'events'
class IndeedScrape {
    emitter = new EventEmitter();
    isRunning;
    jobs = [];
    isError = false;
    getContainer() {
        return ".jobsearch-SerpJobCard"
    }
    getContainer1() {
        return ".tapItem"
    }
    getPageList() {
        return ".pagination-list"
    }
    getNext() {
        return "li > a[aria-label='Next']"
    }
    getPrevious() {
        return "li > a[aria-label='Previous']"
    }
    getid() {
        return "id"
    }
    getevent() {
        return "data-hiring-event"
    }
    gettitle() {
        return ".jobtitle"
    }
    gettitle1() {
        return ".jobTitle > span"
    }
    getcompany() {
        return ".company"
    }
    getcompany1() {
        return ".companyName"
    }
    getsalary() {
        return ".salaryText"
    }
    getsalary1() {
        return ".salary-snippet"
    }
    getlocation() {
        return ".location"
    }
    getlocation1() {
        return ".companyLocation"
    }
    getiframe() {
        return "vjs-container-iframe"
    }
    getdescription() {
        return ".jobsearch-jobDescriptionText"
    }
    getdate() {
        return '.date'
    }
    popover() {
        return ".popover popover-foreground jobalert-popover"
    }
    popoverClose() {
        return ".popover-x-button-close icl-CloseButton"
    }
    wait(seconds) {
        return new Promise(resolve =>
            setTimeout(() => resolve(true), seconds * 1000)
        );
    }
    async checkElement(doc, selector) {
        if (doc === undefined || doc === null) {
            return null;
        }
        var checkcount = 0;
        while (doc.querySelector(selector) === null) {
            wait(1)
            if (checkcount > 8) {
                checkcount = checkcount + 1;
            }
            await new Promise(resolve => requestAnimationFrame(resolve))
        }
        return doc.querySelector(selector);
    };
    //scrape
    async run(page, data) {
        this.isError = false;
        try {
            var counter = 0;
            this.jobs = []
            var rslt = await page.goto(data.data.data, { waitUntil: 'networkidle2' })
            await page.waitForSelector("html")
            var done = false;
            while (!done) {
                try {
                    await this.wait(2 + (5 * Math.random()))
                    var captcha = await page.evaluate(() => document.querySelector('.h-captcha'))
                    if (captcha && captcha.length > 0) {
                        console.log("captcha found")
                        var rslt = { auth:data.refID, type: "captcha", isRunning:false, data: [], message: 'We encountered a captcha screen', total: counter }
                        this.emitter.emit('done', rslt)
                    } else if (this.isError) {
                        var rslt = { auth:data.refID, type: "error", isRunning:false, data: [], message: "There was an error when scraping indeed. We'll provide all of the data we can. Please try again", total: counter }
                        this.emitter.emit("done", rslt)
                    } 
                    done = await this.getContainers(data.refID,data.data.query,page);
                    //check if captcha
                    counter = counter + this.jobs.length;
                    if (this.jobs.length === 0 || (captcha && captcha.length > 0) || this.isError) {
                        done = true;
                        console.log("no job found")
                    }
                    done = await this.checkNav(page);
                    
                    await this.wait(8)
                } catch (e) {
                }
            }
            console.log("end")
        } catch (e) {
            console.log(JSON.stringify(e))
        }
    }
    async getContainers(id,query,page) {
        try {
            var containers = await page.$$(this.getContainer())
            if (!containers || containers.length === 0) {
                containers = await page.$$(this.getContainer1())
            }
            if(containers && containers.length === 0){
                console.log("no containers found")
            }
            for (var i = 0; i < containers.length; i++) {
                await containers[i].hover()
                const job = await this.scrapeContainer(containers[i], page);
                if (!job) {
                    continue;
                }
                job.queryID = query;
                var rslt = { type: "job", auth:id, isRunning:true, data: job, message: 'update' }
                this.emitter.emit('done', rslt);
                await this.wait(2 + (5 * Math.random()));
            }
            containers = [];
        } catch (e) {
            console.log(e)
            return true;
        }

    }
    async checkNav(page) {
        try {
            var nav = await page.$(this.getPageList());
            if (nav) {
                var next = await nav.$(this.getNext())
                if (next !== null) {
                    await next.evaluate(n => n.click())
                    await this.wait(1)
                    return false;
                }
            }
            return true;

        } catch (e) {
            console.log(e)
            return true
        }
    }
    async scrapeContainer(container,page) {
        try {
            await container.evaluate(e => e.click());
            var job = {};
            var id = await page.evaluate(el => el.getAttribute("id"), container)
            job.refID = id;
            await this.wait(1)
            var title = await container.$(this.gettitle())
            if (!title) {
                title = await container.$(this.gettitle1())
            }
            if (title) {
                job.name = await page.evaluate(e => e.innerText, title)
            }
            var company = await container.$(this.getcompany())
            if (!company) {
                company = await container.$(this.getcompany1())
            }
            if (company) {
                var coName = await page.evaluate(e => e.innerText, company)
                if (coName && coName.toLocaleLowerCase().indexOf('recruiting') >= 0 || coName.toLocaleLowerCase().indexOf('staffing') >= 0 || coName.toLocaleLowerCase().indexOf('executive search') >= 0 || coName.toLocaleLowerCase().indexOf('headhunting') >= 0) {
                    return;
                }
                if (coName) {
                    job.company = coName;
                }
            }
            var date = await container.$(this.getdate())
            if (date) {
                job.daysOnSite = await page.evaluate(e => e.innerText, date);
            }
            var salary = await container.$(this.getsalary())
            if (!salary) {
                salary = await container.$(this.getsalary1())
            }
            if (salary) {
                job.salary = await page.evaluate(e => { e.innerText ? e.innerText : e.title }, salary);;
            }
            var location = await container.$(this.getlocation())
            if (!location) {
                location = await container.$(this.getlocation1())
            }
            if (location) {
                job.location = await page.evaluate(e => e.innerText, location);
            }
            var frame = await page.$("#" + this.getiframe());
            if (frame) {
                var content = await frame.contentFrame();
                var descript = await content.$(this.getdescription())
                if (descript) {
                    var descriptText = await content.evaluate(el => el.innerText, descript)
                    job.description = descriptText;
                }
            }
            return job

        } catch (e) {
            this.isError = true;
            return null;
        }
    }
}
export { IndeedScrape }