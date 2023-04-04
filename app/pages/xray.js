import { EventEmitter } from 'events';
class XRay {
    emitter = new EventEmitter();
    constructor() {
    }
    wait(seconds) {
        return new Promise(resolve =>
            setTimeout(() => resolve(true), seconds * 1000)
        );
    }
    async signOut(page) {
        try {
            var linkedin = "https://www.linkedin.com/"
            await page.goto(linkedin)
            await this.wait(2);
            if (page.url() !== linkedin) {
                var btn = await page.$('button[class*="global-nav__primary-link"')
                if (btn) {
                    await btn.evaluate(e => e.click())
                    var container = await page.$('ul[class*="global-nav__secondary-items"] > li > a')
                    if (container) {
                        container.evaluate(e => e.click())
                    }
                }
            }
        } catch (e) {
            console.log('error signin')
            return;
        }
    }
    async signIn(page, data, user, password) {
        try {
            var linkedin = "https://www.linkedin.com/"
            if (page.url() !== linkedin) {
                var pge = await page.goto(linkedin, { waitUntil: 'networkidle2' })
            }
            await this.wait(1)
            await page.bringToFront();
            if (page.url() !== linkedin) {
                if (page.url() === "https://www.linkedin.com/feed/") {
                    return true;
                }

                return false;
            }
            await this.wait(2 + (Math.random() * 6));
            await page.$eval('input[autocomplete="username"]', (el, value) => el.value = value, user);
            await this.wait(2 + (Math.random() * 6));
            await page.$eval('input[autocomplete="current-password"]', (el, value) => el.value = value, password);
            await this.wait(2 + (Math.random() * 6));
            console.log('logging in')
            var button = await page.$('button[class="sign-in-form__submit-button"]')
            if (button) {

                await button.evaluate(e => e.click())
                await this.wait(10)
                if (page.url().indexOf('/checkpoint/challenge/') >= 0 || page.url().indexOf('login-submit') >= 0) {
                    console.log("Challenge hit")
                    data.status = 'lockout'
                    this.emitter.emit('done', data)
                    return false;
                }
                return true;
            } else {
                console.log('Linkedin login button not found')
            }
            return false
        } catch (e) {
            console.log('error signin:' + JSON.stringify(e))
            return false
        }
    }
    mouseMove(page) {
        //move over a 20 period time frame        
        setTimeout(async () => await page.mouse.move(200 + (Math.random() * 200), 400 + (Math.random() * 400)), 5 * Math.random() + 5)
        setTimeout(async () => await page.mouse.move(300 + (Math.random() * 200), 400 + (Math.random() * 600)), 5 * Math.random() + 10)
        setTimeout(async () => await page.mouse.move(400 + (Math.random() * 200), 400 + (Math.random() * 100)), 5 * Math.random() + 15)
    }
    async getList(page, data) {
        this.isError = false;
        var rslts = []
        try {
            var done = false;
            while (!done) {
                try {
                    //check if captcha
                    var captcha = await page.$(".h-captcha")
                    if (captcha) {
                        console.log("captcha found")
                        var rslt = { type: "captcha", data: [], message: 'We encountered a captcha screen' }
                        this.emitter.emit('done', rslt)
                        done = true;
                        this.links = []
                        return;
                    }
                    //loop through the page
                    await this.wait(5)
                    await this.getLinkedinUrl(page, data)
                    await this.wait(5)
                    await page.bringToFront();
                    done = await this.checkNext(page)
                } catch (e) {

                }
            }
            return rslts;
        } catch (e) {
            console.log('error getlist')
            return;
        }
    }
    async setGoogle(page, data) {
        try {
            console.log('Loading google.com')
            await page.goto("https://www.google.com", { waitUntil: 'networkidle2' })
            await this.wait(2)
            await page.$eval('input[title*="Search"]', (e, val) => { e.value = val }, data.data.data)
            await this.wait(2)
            var btn = await page.$('input[value="Google Search"]')
            if (btn) {
                await btn.evaluate(e => e.click())
                await this.wait(2)
                console.log("curr page: " + page.url());
                var counter = 0;
                var samepage = page.url() === "https://www.google.com/";
                if (!samepage) {
                    console.log('not same ' + page.url())
                } else {
                    console.log('same' + page.url())
                }
                while (samepage) {
                    await page.keyboard.press("Enter")
                    await this.wait(2)
                    counter = counter + 1;
                    if (counter > 5) {
                        samepage = false
                    } else {
                        samepage = page.url() === "https://www.google.com/";
                    }

                }
            } else {
                console.log("test")
            }
            await this.wait(4)

        } catch (e) {
            console.log("error in setgoogle")
            return;
        }
    }
    async scrapePage(page, data) {
        await page.bringToFront();
        var rslt = await this.scrapeLinkedin(page, data);
        this.emitter.emit('done', rslt)
    }
    async getLinkedinUrl(page, data) {
        try {
            var linkedins = await page.$$('a[href*="www.linkedin.com"]')
            for (var i = 0; i < linkedins.length; i++) {
                var url = await page.evaluate(e => e.getAttribute('href'), linkedins[i])
                //send a socket request to the profile db to see 
                if (url) {
                    const newPage = await page.browser().newPage();
                    await newPage.goto(url);
                    await newPage.bringToFront();
                    await this.wait(1)
                    await this.scrapePage(newPage, data)
                    setTimeout(async f => {
                        await newPage.close();
                    }, Math.round((60 + (180 * Math.random())) * 1000))
                }
            }
        } catch (e) {
            return []
        }
    }
    async scrapeLinkedinList(page, data) {
        for (var i = 0; i < data.data.length; i++) {

            var url = data.data[i]
            //send a socket request to the profile db to see 
            if (url) {
                const newPage = await page.browser().newPage();
                await newPage.goto(url);
                await newPage.bringToFront();
                await this.wait(1)
                await this.scrapePage(newPage, data)
                setTimeout(async f => {
                    await newPage.close();
                }, Math.round((60 + (180 * Math.random())) * 1000))
            }
        }
    }
    async scrapeLinkedin(page, data) {
        try {
            const dta = await page.evaluate(() => document.querySelector('*').outerHTML);
            const inner = await page.evaluate(() => document.querySelector('*').innerHTML);
            await this.wait(1)
            this.mouseMove(page);
            var url = await page.url();
            var name = await page.$('h1[class*="text-heading-"')
            if (!name) {
                name = await page.$('h1[class*="__title"]')
            } if (!name) {
                name = await page.$('h1[class*="base-aside-card__title"]')
            }
            var title = await page.$('h2[class*="top-card-layout__headline"]')
            if (!title) {
                title = await page.$('div[class*="pv-text-details__left-panel"] > div[class*="text-body-medium"]')
            }
            if (!title) {
                title = await page.$('p[class*="base-aside-card__subtitle"]')
            }
            var location = await page.$('span[class*="top-card__subline-item"]')
            if (!location) {
                location = await page.$('div[class*="pv-text-details__left-panel"] > span[class*="text-body-small"]')
            }
            if (!location) {
                location = await page.$('div[class*="pv-text-details__left-panel"] > span[class*="text-body-small"]')
            }
            var about = await page.$('div[class*="core-section-container__content"] > p')
            if (!about) {
                about = await page.$('div[class*="pv-shared-text-with-see-more"] > div[class*="inline-show-more-text"] > span[aria-hidden="true"]')
            }
            if (!about) {
                about = await page.$('div[class*="pv-shared-text-with-see-more"] > div[class*="inline-show-more-text"] > span[aria-hidden="true"]')
            }
            var sections = await page.$$('main > section');
            var school = null;
            var degree = null;
            if (sections && sections.length > 0) {
                for (var i = 0; i < sections.length; i++) {
                    var exists = await sections[i].$('div[id="education"')
                    if (exists) {

                        school = await sections[i].$('div[class*="profile-section-card__contents" ] > h3[class*="profile-section-card__title"]')
                        if (!school) {
                            school = await sections[i].$('a[href*="https://www.linkedin.com/company/"] > div[class*="display-flex"] > span[class*="t-bold"] > span[aria-hidden="true"]')
                        }
                        if (!school) {
                            school = await sections[i].$('a[class*="optional-action-target-wrapper"] > div[class*="display-flex"] > span[class*="t-bold"] > span[aria-hidden="true"]')
                        }
                        degree = await sections[i].$('div[class*="core-section-container__content"] > h4[class*="profile-section-card__subtitle"] > span')
                        if (!degree) {
                            degree = await sections[i].$('a[class*="optional-action-target-wrapper"] > span[class*="t-14"] > span[aria-hidden="true"]')
                        }
                        if (!degree) {
                            degree = await sections[i].$('a[class*="optional-action-target-wrapper"] > span[class*="t-14"] > span[aria-hidden="true"]')
                        }
                    }
                }
            }
            var nametext = await name?.evaluate(e => e.innerText)
            var locationtext = await location?.evaluate(e => e.innerText);
            var abouttext = await about?.evaluate(e => e.innerText);
            var schooltext = await school?.evaluate(e => e.innerText);
            var degreetext = await degree?.evaluate(e => e.innerText)
            var ed = [];
            if (schooltext && degreetext) {
                ed.push({ text: schooltext + ":" + degreetext })
            }
            var skillList = []
            var skillbtn = await page.$('a[href*="/details/skills?"]')
            await this.wait(1 + (1 * Math.random()))
            await page.evaluate(() => window.scrollBy(0, (window.innerHeight / 4) - (Math.random() * (document.body.scrollHeight / 4))));
            await this.wait(2 + (3 * Math.random()))
            await page.evaluate(_ => window.scrollBy(0, (window.innerHeight / 2) - (Math.random() * (document.body.scrollHeight / 2))));
            await this.wait(1 + (6 * Math.random()))
            await page.evaluate(_ => window.scrollBy(0, window.innerHeight - (Math.random() * document.body.scrollHeight)));
            await this.wait(3 + (10 * Math.random()))
            await page.evaluate(_ => window.scrollBy(0, document.body.scrollHeight - (100 * Math.random())));
            await page.bringToFront();
            if (skillbtn) {
                await skillbtn.evaluate(e => e.click());
                await this.wait(3 + (Math.random() * 10));
                await page.evaluate(_ => window.scrollBy(0, document.body.scrollHeight));
                await this.wait(1 + (Math.random() * 10))
                await page.bringToFront();
                var getlist = await page.$$('ul[class*="pvs-list"] > li[class*="pvs-list__paged-list-item"]')

                for (var i = 0; i < getlist.length; i++) {
                    var container = await getlist[i].$('span[class="mr1 t-bold"] > span[aria-hidden="true"]')
                    if (container) {
                        var skill = await container?.evaluate(e => e.innerText)
                        var yearcontainer = await container.$('span[class*="pvs-entity__supplementary-info"] > span')
                        var yearextract = await yearcontainer?.evaluate(e => e.innerText)
                        var year = yearextract?.replace(/^\D+/g, '')
                        var skill = { text: skill ? skill : '', years: year ? year : '0' }
                        skillList.push(skill)
                    }
                }
            }
            return {
                query: data.data.query, type: 'candidate', status: 'update', data: { name: nametext ? nametext : '', linkedinUrl:url, location: locationtext ? locationtext : '', description: abouttext ? abouttext : '', educations: ed, skills: skillList }
            }

        } catch (e) {
            return;
        }
    }
    async checkNext(page) {
        try {
            var all = await page.$$('a')
            for (var i = 0; i < all.length; i++) {
                let inner = await all[i].getProperty('innerText');
                let innerText = await inner.jsonValue();
                if (innerText?.indexOf('Next') >= 0) {
                    await all[i].click()
                    return false;
                }
                let id = await all[i].getProperty('id');
                let idText = await id.jsonValue();
                if (idText?.indexOf('pnnext') >= 0) {
                    await all[i].click()
                    return false;
                }
                let aria = await all[i].getProperty('aria-label');
                let ariaText = await aria.jsonValue();
                if (ariaText?.indexOf('Next page') >= 0) {
                    await all[i].click()
                    return false;
                }
                var arrow = await all[i].$('span')
                if (arrow) {
                    var arr = await arrow.getProperty('innerText')
                    var arrvalue = await arr.jsonValue();
                    if (arrvalue?.indexOf('>') >= 0 && arrvalue.length === 1) {
                        await all[i].click();
                        return false;
                    }
                }
            }
            return true;

        } catch (e) {
            return true;
        }
    }
}
export { XRay }