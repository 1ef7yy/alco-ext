const unirest = require("unirest")
const cheerio = require("cheerio");

const generateQuery = (name) => {

    const prefix = "https://untappd.com/search?q="
    const suffix = name.split(' ').join("+")

    return prefix+encodeURIComponent(suffix);
}


const getLinks = async(url) => {
    try{
        const response = await unirest.get(url)
        const data = response.body

        const $ = cheerio.load(data)

        let hrefs = []
        $("a").each((index, value) => {
            let href = $(value).attr("href")
            hrefs.push(href)
        })
        let validHrefs = []
        for (let i = 0; i < hrefs.length; i++) {
            // wouldnt work without this conversion for some reason
            // (TypeError: Cannot read properties of undefined (reading 'startsWith'))
            let value = String(hrefs[i])
            if (value.startsWith("/b/")){
                validHrefs.push(value.toString());
            }
        }

        let links = []

        for (const href of validHrefs) {
            links.push(`https://untappd.com${href}`)
        }

        return links;
    }
    catch(e)
    {
        console.log(e);
    }
}




module.exports = [
    // promise-based function
    getLinks,
    generateQuery
]