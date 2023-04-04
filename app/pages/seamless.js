import { EventEmitter } from 'events';
class SeamlessScrape {
    isError = false;
    emitter = new EventEmitter();
    managers = [];
    async run(page, data) {
        this.isError = false;
        try {
            var counter = 0;
            this.manager = null
            console.log("Running seamless")
            for (var i = 0; i < data.data.length; i++) {
                var id = data.data[i].id
                console.log("page: " + data.data[i].url)
                await page.goto(data.data[i].url)
                await page.bringToFront();
                await this.wait(4)
                try {
                    var manager = null;
                    //check if captcha
                    var captcha = await page.$(".h-captcha")
                    if (captcha) {
                        console.log("captcha found")
                        var rslt = { type: "captcha", auth: data.refID, data: [], message: 'We encountered a captcha screen' }
                        this.emitter.emit('done', rslt)
                        return;
                    }
                    var card = await this.findCard(page);
                    if (card && card.length > 0) {
                        console.log('***Card found, total found: ' + card.length)
                        while (!this.findAnyResearch(card[0])) {
                            await this.wait(5)
                        }
                        if(card.length > 1){
                            console.log('*****Warning, more than one card was found*****')
                            for(var i = 1;i< card.length;i++){
                                var text = await card[i].evaluate(f => f.innerHTML);
                                console.log(text)
                            }
                        }
                        var first = await card[0].evaluate(f => f.innerHTML);
                        console.log(first)
                        manager = await this.processCard(card[0])
                    } else {
                        console.log("No card found")
                    }
                    if (manager) {
                        manager.queryID = id;
                        console.log(JSON.stringify(manager))
                    }
                    var captcha = await page.$(".h-captcha")
                    if (captcha) {
                        console.log("captcha found")
                        var rslt = { query: id, auth: data.refID, type: "captcha", data: manager, message: 'We encountered a captcha screen' }
                        this.emitter.emit('done', rslt)
                    } else if (this.isError) {
                        var rslt = { query: id, auth: data.refID, type: "error", data: manager, message: "There was an error with your seamless account" }
                        this.emitter.emit("done", rslt)
                    } else if(!manager){
                        var rslt = { query: id, auth: data.refID, type: "no_data", data: manager, message: "We were unable to find data on the specific individual:" +  data.data[i].url}
                        this.emitter.emit("done", rslt)
                    } else {
                        var rslt = { query: id, auth: data.refID, type: "managers", data: manager, message: 'update' }
                        this.emitter.emit('done', rslt);
                        await this.wait(1);
                    }
                } catch (e) {
                    console.log(e)
                    var rslt = { query: id, auth: data.refID, type: "error", data: manager, message: "There was an error with your seamless account" + e.message }
                    this.emitter.emit("done", rslt)
                }
            }
            
            var rslt = { query: id, auth: data.refID, type: "managers", data: manager, message: 'done' }
            this.emitter.emit('done', rslt);
        } catch (e) {
            console.log(JSON.stringify(e))
        }
    }
    async signIn(page, username, password) {
        var btn = await page.waitForSelector("shadow/.FlyoutTabButton__TabButton-gHTcCm")
        await this.wait(1);
        if (btn) {
            await btn.evaluate(e => e.click())
            await this.wait(1);
            var frame = await page.$("shadow/#flyout-iframe")
            if (frame) {
                console.log('Seamless sign in')
                await this.wait(3);
                var content = await frame.contentFrame();
                const user = await content.$('input[type="username"]')
                const pass = await content.$('input[type="password"]')
                if (user && pass) {

                    await content.type('input[type="username"]', username)
                    await content.type('input[type="password"]', password)
                    const btn = await content.$('button[type="submit"]')
                    await btn.evaluate(e => e.click())
                    console.log("Seamless login attempted")
                } else {
                    console.log("No user or password control found")
                }
            } else {
                console.log("Seamless flyout not found")
            }
        }
        await this.wait(3)
    }
    async signOut(page) {
        var frame = await page.$("shadow/#flyout-iframe")
        if (frame) {
            await this.wait(2);
            var content = await frame.contentFrame();
            var btn = await content.$('div[class*="headerStyles__HeaderContainer"] > div[class*="headerStyles__HeaderButtonsContainer"] > div[class*="rs-dropdown Dropdown__StyledDropdown"] > span > button')
            if (btn) {
                await btn.evaluate(e => e.click())
                await this.wait(2)
                var links = await content.$$('ul > li > a')
                if (links && links.length) {
                    for (var i = 0; i < links.length; i++) {
                        var inner = await links[i].evaluate(e => e.innerText)
                        if (inner.indexOf('Logout') >= 0) {
                            await links[i].evaluate(e => e.click())
                            await this.wait(2)
                        }
                    }
                }
            }
        }
        // }
    }
    async processCard(card) {
        try {
            var manager = {};
            var sections = await card.$$(`td[role="cell"]`)
            var text = await card.evaluate(e => e.innerHTML)
            console.log(text)
            //reverting to relative path because seamless changes it's class name often....sigh
            //0 = checkbox, 1 = profile,2 = company, 3 = contact,4 = location,5 = researched,6 = btn options
            if (sections && sections.length && sections.length >= 7) {
                //profile data 0 = image, 1 = data
                var name = await sections[1].$('div[class*="columnStyles__ColumnContainer"] > div[class*="columnStyles__ColumnContainer"] > div[class*="DataTooltip__OverflowContainer"]')
                var descript = await sections[1].$('div[class*="columnStyles__ColumnContainer"] > div[class*="columnStyles__ColumnContainer"] > div[class*="ContactColumn__ContactTitleContainer"] > div')
                if (name) {

                    manager.name = await name.evaluate(e => e.innerText);
                }
                if (descript) {
                    manager.title = await descript.evaluate(e => e.innerText);

                } else {
                    descript = await sections[1].$('div[class*="ContactColumn__ContactTitleContainer"] > div[class*="DataTooltip__OverflowContainer"] > div[class*="ContactColumn__ContactTitle"]') 
                    if(descript){
                        manager.title = await descript.evaluate(e => e.innerText);
                    }
                }
                //company 
                var company = await sections[2].$$('div[class*="columnStyles__ColumnContainer"] > div[class*="DataTooltip__OverflowContainer"] > button')
                if (company && company.length) {

                    if (company.length > 0) {

                        manager.company = await company[0].evaluate(e => e.innerText)
                    }
                    if (company.length > 1) {

                        manager.companyLink = await company[1].evaluate(e => e.innerText);
                    }
                } else {
                    console.log('company not found')
                }
                // }
                //email
                var emailcontainers = await sections[3].$$('div[class*="columnStyles__"] > div[class*="columnStyles__"]')
                //need to check for the add email button. if found then the get contact detail button is clicked
                var getdata = false
                if(emailcontainers && emailcontainers.length === 1){
                    var needdata = emailcontainers[0].$('button[class*="Button__StyledButton"')
                    if(needdata){
                        getdata = true;
                    }
                }
                if(getdata){
                    console.log("**trying to click on the email button")
                    var getdetails = await sections[6].$('div[class*="IntelColumn__SocialLinks"] > button[data-seam-intel*="contact-details"]')
                    if(!getdetails){
                        console.log('**first hit failed')
                        getdetails = await sections[4].$('div[class*="IntelColumn__SocialLinks"] > button[data-seam-intel*="contact-details"]')
                    }
                    if(getdetails){
                        await getdetails.evaluate(e => e.click());
                        await this.wait(8)
                        var checktext = await card.evaluate(e => e.innerHTML);
                        console.log('*****Updated card after details hit*****')
                        console.log(checktext)
                        var emailcontainers = await sections[3].$$('div[class*="columnStyles__"] > div[class*="columnStyles__"]')

                    } else {
                        console.log('*****unable to get email from card*****')
                    }
                }
                if (emailcontainers && emailcontainers.length > 0) {
                    for (var i = 0; i < emailcontainers.length; i++) {
                        var emailinfo = await emailcontainers[i].$('div[class*="DataTooltip__"] > button')
                        var emailicon = await emailcontainers[i].$('svg[class*="user_svg__feather"]')
                        var emailtext = '';
                        if (emailinfo) { emailtext = await emailinfo.evaluate(e => e.innerText) }
                        else {
                            console.log('email card not found')
                        }
                        const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (email.test(emailtext)) {
                            var addemail = { text: emailtext }
                            addemail.isPersonal = emailicon ? true : false;
                            if (manager.emails === undefined) {
                                manager.emails = []
                            }
                            manager.emails.push(addemail)
                        }
                    }
                } 
                //phones
                var phones = await sections[4].$$('div[class*="columnStyles__"] > div[class*="columnStyles__"]')
                if(!phones || phones.length === 0){
                    phones = await sections[3].$$('div[class*="columnStyles__"] > div[class*="columnStyles__"] ')
                }
                if (phones && phones.length) {
                    for (var i = 0; i < phones.length; i++) {
                        var phoneinfo = await phones[i].$('div[class*="DataTooltip__"] > button');
                        var phoneicon = await phones[i].$('svg[class*="user_svg__feather"]');
                        var phonetext = '';
                        if (phoneinfo) {
                            phonetext = await phoneinfo.evaluate(e => e.innerText)
                        }
                        else {
                            console.log('no phone info')
                        }
                        const phone = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;
                        if (phone.test(phonetext)) {
                            var addemail = { text: phonetext }
                            addemail.isPersonal = phoneicon ? true : false;
                            if (manager.phones === undefined) {
                                manager.phones = []
                            }
                            manager.phones.push(addemail)
                        }
                    }
                }
                //location
                var locations = await sections[5].$$('div[class*="columnStyles__"] > div[class*="columnStyles__"]')
                if(!locations || locations.length === 0){
                    locations = await sections[4].$$('div[class*="columnStyles__"] > div[class*="columnStyles__"]')
                }
                if (locations && locations.length) {
                    for (var i = 0; i < locations.length; i++) {

                        var localinfo = await locations[i].$('div[class*="DataTooltip__"] > button');
                        var localicon = await locations[i].$('svg[class*="user_svg__feather"]');
                        var localtext = '';
                        if (localinfo) {

                            localtext = await localinfo.evaluate(e => e.innerText)
                        } else {
                            console.log('location')
                        }
                        if (localtext) {

                            var addemail = { text: localtext }
                            addemail.isPersonal = localicon ? true : false;
                            if (manager.locations === undefined) {
                                manager.locations = []
                            }
                            manager.locations.push(addemail)
                        }
                    }
                }
                //linkedin
                var linkedin = await sections[6].$('div[class*="IntelColumn__SocialLinks"] > a[href*="linkedin.com"]')
                if(!linkedin){
                    linkedin = await sections[4].$('div[class*="IntelColumn__SocialLinks"] > a[href*="linkedin.com"]')
                }
                if (linkedin) {
                    manager.links = []
                    var link = {}
                    link.text = await linkedin.evaluate(e => e.getAttribute('href'))
                    link.type = 'linkedin'
                    manager.links.push(link)
                }
            } else {
                console.log("cant find cell")
                debugger;
            }
            return manager;

        } catch (e) {
            console.log(e)
        }
    }
    wait(seconds) {
        return new Promise(resolve =>
            setTimeout(() => resolve(true), seconds * 1000)
        );
    }
    seamlessFlyout() {
        return "FlyoutTab__Tab-Xtwcu"
    }
    getFindAll() {
        return "rs-btn rs-btn-primary Button__StyledButton-iESSlv jsnmgf tableActionStyles__FindAllButton-bWztgm ftLTIM"
    }
    getFindAll2() {
        return "rs-btn rs-btn-primary Button__StyledButton-iEKVQz jmdkgz tableActionStyles__FindAllButton-bWaEsS kZsOTA"
    }
    getSection() {
        return "searchStyles__TableContainer-cpigOX cHXAaN"
    }
    getSection2() {
        return "searchStyles__TableContainer-cpGVCr jZQSKU"
    }
    getSection3() {
        return 'Table__StyledTable-fBMNcz bBHuwJ'
    }
    getCards() {
        return "table > tbody > tr"
    }

    getResearch() {
        return 'Researching__ResearchingContainer-fiyheL kjiCrq'
    }
    getName() {
        return "isKJRm ofest"
    }
    getName2() {
        return "rs-btn rs-btn-link Button__StyledButton-iEKVQz fTjbLI columnStyles__ColumnData-hFzXYE columnStyles__ColumnDataBtn-gXdDYw euBUkY jQfdxL"
    }
    getName3() {
        return "rs-btn rs-btn-link Button__StyledButton-iESRRK jesUAX columnStyles__ColumnData-hFsbXt columnStyles__ColumnDataBtn-gWVHXl bYRiRl dqcFVV"
    }
    getTitle() {
        return "ContactColumn__ContactTitle-geAFwS hHDIkN"
    }
    getTitle2() {
        return "ContactColumn__ContactTitle-geIBRO hUTqUI"
    }
    getTitle3() {
        return "ContactColumn__ContactTitle-geAFQD evXVd"
    }
    getIsPersonal() {
        return "user_svg__feather user_svg__feather-user"
    }
    getLinkContainers() {
        return "columnStyles__DataWithIconContainer-fXLxuo jqA-dvV"
    }
    getLinkContainers1() {
        return "columnStyles__DataWithIconContainer-fXDBtd hESugc"
    }
    getEmailPhone() {
        return "rs-btn rs-btn-link Button__StyledButton-iESSlv lkixII columnStyles__ColumnData-hFsbDI columnStyles__ColumnDataBtn-gWVHDA isKJRm liTnSR"
    }
    getEmailPhone2() {
        return "rs-btn rs-btn-link Button__StyledButton-iEKVQz fTjbLI columnStyles__ColumnData-hFzXYE columnStyles__ColumnDataBtn-gXdDYw euBUkY fKMXCr"
    }
    getNavGroup() {
        return 'rs-btn-group ButtonGroup__StyledButtonGroup-kCCrEP cVDABf'
    }
    getNavGroup2() {
        return 'rs-btn-group ButtonGroup__StyledButtonGroup-kCuvjT jknnQa'
    }
    getButton() {
        return 'rs-btn rs-btn-default Button__StyledButton-iESSlv iqPfJC'
    }
    getButton2() {
        return 'rs-btn rs-btn-default Button__StyledButton-iEKVQz biJseu'
    }
    getRightChevron() {
        return 'chevron-right_svg__feather chevron-right_svg__feather-chevron-right'
    }
    getRightChevron2() {
        return 'chevron-right_svg__feather chevron-right_svg__feather-chevron-right'
    }
    getCompany() {
        return 'rs-btn rs-btn-link Button__StyledButton-iEKVQz fTjbLI columnStyles__ColumnData-hFzXYE columnStyles__ColumnDataBtn-gXdDYw euBUkY jQfdxL'
    }
    getCompany1() {
        return 'rs-btn rs-btn-link Button__StyledButton-iESRRK jesUAX columnStyles__ColumnData-hFsbXt columnStyles__ColumnDataBtn-gWVHXl bYRiRl dqcFVV'
    }
    getSocialList() {
        return 'div a[href*="linkedin.com"]'
    }
    async findButton(ele) {
        var button = await ele.$(this.getFindAll());
        if (!button) {
            button = await ele.$(this.getFindAll2());
        }
        return button
    }
    async findLinkedin(ele) {
        return await ele.$(this.getSocialList());
    }
    async findSection(ele) {
        var button = await ele.$(this.getSection());
        if (!button) {
            button = await ele.$(this.getSection2());
            if (!button) {
                button = await ele.$(this.getSection3());
            }
        }
        return button
    }
    async findCard(ele) {
        return await ele.$$(this.getCards());
    }
    async findName(ele) {
        var button = await ele.$(this.getName());
        if (!button) {
            button = await ele.$(this.getName2());
            if (!button) {
                button = await ele.$(this.getName3());
            }
        }
        return button
    }
    async findCompany(ele) {
        var button = await ele.$(this.getCompany());
        if (!button) {
            button = await ele.$(this.getCompany1());
        }
        return button
    }
    async findTitle(ele) {
        var button = await ele.$(this.getTitle());
        if (!button) {
            button = await ele.$(this.getTitle2());
            if (!button) {
                button = await ele.$(this.getTitle3());
            }
        }
        return button
    }
    async findPhone(ele) {
        var button = await ele.$(this.getEmailPhone());
        if (!button) {
            button = await ele.$(this.getEmailPhone2());
        }
        return button
    }
    async findContainer(ele) {
        var button = await ele.$$(this.getLinkContainers());

        if (!button) {
            button = await ele.$$(this.getLinkContainers1());
        }
        return button
    }
    async hasPersonal(ele) {
        var button = await ele.$(this.getIsPersonal());
        return button
    }
    async findNavGroup(page) {
        var button = await ele.$(this.getNavGroup());
        if (!button) {
            button = await ele.$(this.getNavGroup2());
        }
        return button
    }
    async findNavButton(ele) {
        var button = await ele.$(this.getButton());
        if (!button) {
            button = await ele.$(this.getButton2());
        }
        return button
    }
    async findRightChevron(ele) {
        var button = await ele.$(this.getRightChevron());
        if (!button) {
            button = await ele.$(this.getRightChevron2());
        }
        return button
    }
    async findAnyResearch(ele) {
        var button = await ele.$(this.getResearch());
        return button
    }
}
export { SeamlessScrape }