import { EventEmitter } from 'events'
class GoogleJobs {
    emitter = new EventEmitter();
    wait(seconds) {
        return new Promise(resolve =>
            setTimeout(() => resolve(true), seconds * 1000)
        );
    }
    async run(page, data) {
        try {
            var url = data.data.data;
            var pge = await page.goto(url, { waitUntil: 'networkidle2' })
            await page.bringToFront();
            await this.wait(5)

        } catch (e) {

        }
    }
    async set(page, data) {
        await this.wait(2)
        var job = JSON.parse(data.data.message)
        var tabcontainer = await page.$('div[id*="gws-plugins-horizon-jobs__"]')
        if (!tabcontainer) {
            console.log('There was a problem getting to the google page')
            return
        }
        var tablist = await tabcontainer.$('div[role="tablist"]')
        var location = await tablist.$('span[data-facet="city"]')
        if (job.radius && location) {
            await location.evaluate(e => e.click())
            await this.wait(2)
            var locationcontainer = await tabcontainer.$('div[data-facet="city"] > div')
            if (locationcontainer) {
                var radius = job.radius;
                var dta = 'div > div[data-display-value="' + radius + '"]'
                var locationbutton = await locationcontainer.$(dta)
                if (locationbutton) {
                    await locationbutton.evaluate(e => e.click())
                    await this.wait(2)
                }
            }
        }
        var posted = await tablist.$('span[data-facet="date_posted"]')
        if (posted && job.fromDays) {
            await posted.evaluate(e => e.click())
            await this.wait(2)
            var postedContainer = await tabcontainer.$('div[data-facet="date_posted"]')
            if (postedContainer) {
                var dta = 'div > div[data-value="' + job.fromDays + '"]'
                var postedBtn = await postedContainer.$(dta);
                if (postedBtn) {
                    await postedBtn.evaluate(e => e.click())
                    await this.wait(2)
                }
            }
        }
        var requirements = await tablist.$('span[data-facet="requirements"]')
        if (requirements && job.skillLevel) {
            await requirements.evaluate(e => e.click())
            await this.wait(2)
            var requirecontainer = await tabcontainer.$('div[data-facet="requirements"]')
            if (requirecontainer) {

                var dta = 'div > div[data-value="' + job.skillLevel + '"]'
                var requirebtn = await requirecontainer.$(dta);
                if (requirebtn) {
                    await requirebtn.evaluate(e => e.click())
                    await this.wait(2)
                }
            }
        }
        var type = await tablist.$('span[data-facet="employment_type"]')
        if (type && job.jobType) {
            await type.evaluate(e => e.click())
            await this.wait(2)
            var typecontainer = await tabcontainer.$('div[data-facet="employment_type"]')
            if (typecontainer) {
                var dta = 'div > div[data-value="' + job.jobType + '"]'
                var typebtn = await typecontainer.$(dta);
                if (typebtn) {
                    await typebtn.evaluate(e => e.click())
                    await this.wait(2)
                }
            }
        }

        var newToYou = await tablist.$('span[data-facet="new_to_you"]')
        if (newToYou && job.fromDays) {
            await newToYou.evaluate(e => e.click())
            await this.wait(2)
            var newContainer = await tabcontainer.$('div[data-facet="new_to_you"]')
            if (newContainer) {
                var dta = 'div > div[data-value="show_unseen_jobs_only"]'
                var newBtn = await newContainer.$(dta);
                if (newBtn) {
                    await newBtn.evaluate(e => e.click())
                    await this.wait(2)
                }
            }
        }
    }
    async manageList(page, data) {
        var rslt = []
        var tree = await page.$('div[role="tree"]')
        var itemlist = await tree.$$('div[role="treeitem"]')
        var index = 0;
        var counter = 0;
        while (itemlist.length > index) {
            var btn = await itemlist[index].$('div')
            await itemlist[index].click(btn)
            var item = await this.scrapeContainer(page)
            if (item) {
                item.queryID = Number(data.data.query)
            }
            counter = counter + 1;
            console.log('You have scraped ' + counter + ' jobs, there are ' + itemlist.length + ' items in the list')
            var rslt = { type: "job", isRunning: true, data: item, message: 'update', counter: counter }

            this.emitter.emit('done', rslt);
            itemlist = await tree.$$('div[role="treeitem"]')
            index = index + 1;
        }

    }
    async scrapeContainer(page) {
        var job = {};
        var container = await page.$('div[id="tl_ditsc"] > div > div[id="tl_ditc"] > div > div')
        if (container) {
            var sections = await container.$$('div')
            if (sections && sections.length > 5) {
                const t = await sections[0].evaluate(e => e.outerHTML);
                var title = await sections[0].$('div > div > div > div > h2')
                if (title) {
                    job.name = await title.evaluate(e => e.innerText)
                }
                var company = await sections[0].$$('div > div > div > div > div > div')
                if (company && company.length >= 2) {
                    job.company = await company[company.length - 2].evaluate(e => e.innerText)
                    job.location = await company[company.length - 1].evaluate(e => e.innerText)
                }
                var headersection = await container.$('div[class="ocResc"] div[class="I2Cbhb"]') //> span > span > svg > path[d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"]')
                if (headersection) {
                    var dayCheck = await headersection.$('span > span > svg > path[d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"]')
                    if (dayCheck) {
                        var days = await headersection.$('span > span[aria-hidden="true"]')
                        if (days) {
                            job.daysOnSite = await days.evaluate(e => e.innerText)
                        }
                    }
                }
                var columns = await container.$$('g-expandable-content > span > div > table > tbody > tr > td > div > div')
                if (columns) {
                    if (columns && columns.length > 0) {
                        for (var k = 0; k < columns.length; k++) {
                            var sections = await columns[k].$$('div')
                            if (sections && sections.length > 0) {
                                var headername = await sections[0].evaluate(e => e.innerText)
                                if (headername && headername === 'Benefits') {
                                    for (var l = 0; l < sections.length; l++) {
                                        var bullet = await sections[l].$$('div')
                                        if (bullet && bullet.length > 1) {
                                            var bullCheck = await bullet[0].evaluate(e => e.innerText);
                                            if (bullCheck === '•') {
                                                var benefitCheck = await bullet[1].evaluate(e => e.innerText)
                                                if (benefitCheck && benefitCheck.indexOf(' $') >= 0) {
                                                    job.salary = benefitCheck;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var description = await container.$('div[class="YgLbBe"] > div');
                if (description) {
                    var btn = await description.$('div[role="button"]')
                    if (btn) {
                        await btn.evaluate(e => e.click())
                    }
                    await this.wait(1)
                    var texts = await description.$$('span')
                    job.description = ''
                    if (texts && texts.length > 0) {
                        for (var j = 0; j < texts.length; j++) {
                            var text = await texts[j].evaluate(e => e.innerText)
                            if (text !== '...' && text !== undefined && text.indexOf("Show full description")) {
                                job.description = job.description + text;
                            }
                        }
                    }
                }
                return job;
            }
        }
    }
}
export { GoogleJobs }