new class{constructor(){this.themeLink=document.querySelector("#theme-link"),this.storage=null,this.run()}run(){this.initStorage().then((()=>{this.bindMethods(),this.setThemeStyles(),this.getDomElements(),this.markCheckedElements(),this.initListeners()}))}initStorage(){return new Promise((e=>{chrome.storage.local.get((t=>{this.storage=t,e()}))}))}bindMethods(){this.handleDataToRemove=this.handleDataToRemove.bind(this),this.onDomainRemove=this.onDomainRemove.bind(this),this.handleSaveClick=this.handleSaveClick.bind(this),this.handleDomainDblClick=this.handleDomainDblClick.bind(this)}setThemeStyles(){const e=this.storage.theme;this.themeLink.href="light"===e?chrome.runtime.getURL("css/options/light.css"):chrome.runtime.getURL("css/options/dark.css")}markCheckedElements(){try{this.getStorageData().then((e=>{const{timePeriod:t,timeInterval:i,dataToRemove:s,autorefresh:o,floatbtn:r,cookie_settings:n,audio:a,shortCuts:l}=e;this.markAutoResfreshElement(o),this.markFloatBtnElement(r),this.markAudioItem(a),this.markDeletingItems(s),this.markTimePeriod(t),this.markTimeInterval(i),this.markCookieSettings(n),this.markShortCuts(l),this.showElement({selector:"#main"})}))}catch(e){this.renderFilters(cookie_settings),this.showElement({selector:"#main"})}}markAutoResfreshElement(e){e&&(this.autorefresh.checked=!0)}markFloatBtnElement(e){e&&(this.floatbtn.checked=!0)}markAudioItem(e){e&&(this.audio.checked=!0)}markShortCuts(e){e&&(this.shortCuts.checked=!0)}markDeletingItems(e){[].forEach.call(this.removeDataItems,(t=>{t.checked=!!e.includes(t.id)}))}markTimePeriod(e){for(let t=0;t<this.timePeriodItems.length;t++)this.timePeriodItems[t].id===e&&(this.timePeriodItems[t].checked=!0)}markTimeInterval(e){e+="";for(let t=0;t<this.timeIntervalItems.length;t++)this.timeIntervalItems[t].dataset.minutes===e&&(this.timeIntervalItems[t].checked=!0)}markCookieSettings(e){const t=e.inclusive?"_yes":"_no";document.querySelector("#cookies_filter_inclusive"+t).checked=!0,this.renderFilters(e)}renderFilters(e){e.filters.forEach((e=>this.renderFilter("storedItem",e)))}renderFilter(e,t){const i={newItem:{domain:"domain hidden",input:"filter-input",save:"save"},storedItem:{domain:"domain",input:"filter-input hidden",save:"save hidden"}}[e],s=`<li class="suboption hidden">\t\t\t\t\t\t\t<span class="${i.domain}" data-domain="${t}">${t}</span>\t\t\t\t\t\t\t<input type="text" placeholder="e.g. '.domain.com' or 'sub.domain.com'" class="${i.input}"/>\t\t\t\t\t\t\t<span class="${i.save}"></span>\t\t\t\t\t\t\t<a href="#" class="remove">remove</a>\t\t\t\t\t\t</li>`,o=$(s);$("#cookie-filters ol").append(o),o.fadeIn(100,(()=>{o.removeClass("hidden"),$("input",o).focus()})),o.find("a.remove").click(this.onDomainRemove),o.find(".save").click(this.handleSaveClick),o.find(".domain").dblclick(this.handleDomainDblClick)}handleSaveClick(e){const t=e.target.closest("li"),i=t.querySelector("input"),s=i.value.trim(),o=t.querySelector(".domain").dataset.domain;if(s===o)return void this.showItemViewAfterSaving(t,o,i);if(!this.isDomainCorrect(s))return this.showIncorrectText(i,"Please, type correct data!"),void i.classList.add("error");const r=this.getDomainForStoring(s);if(this.isDomainDublicated(r))return this.showIncorrectText(i,"This domain is already added!"),void i.classList.add("error");let n=JSON.parse(this.storage.cookie_settings);n.filters=n.filters.filter((e=>e!==o)),n.filters.push(r);const a=JSON.stringify(n);chrome.storage.local.set({cookie_settings:a},(()=>{this.showItemViewAfterSaving(t,r,i)}))}showItemViewAfterSaving(e,t,i){e.querySelector(".save").classList.add("hidden"),e.querySelector("input").classList.add("hidden");const s=e.querySelector(".domain");s.setAttribute("data-domain",t),s.textContent=t,s.classList.remove("hidden"),i.classList.remove("error")}handleDomainDblClick(e){const t=e.target.closest("li");this.showItemViewOnEditing(t)}showItemViewOnEditing(e){e.querySelector(".save").classList.remove("hidden");const t=e.querySelector(".domain");t.classList.add("hidden");const i=e.querySelector("input");i.value=t.dataset.domain,i.classList.remove("hidden")}getValidInput(e){if(3>e.length)return!1;const t=e.split(".");return!(2>t.length&&"localhost"!==e)&&(2===t.length&&"."!==t[0][0]&&(t[0][0]="."+t[0][0]),t.join("."))}isDomainCorrect(e){return/(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?([^:\/\n?]?)/gi.test(e)}getDomainForStoring(e){const t=this.getHostname(e);let i=!1;return 2===t.split(".").length&&(i=!0),i?"."+t:t}getHostname(e){var t=(e=e.replace("www.","")).indexOf("//")+2;if(1<t){var i=e.indexOf("/",t);return 0<i||0<(i=e.indexOf("?",t))?e.substring(t,i):e.substring(t)}return e}getStorageData(){return new Promise((e=>{chrome.storage.local.get((t=>{const i=t.audio,s=t.timePeriod,o=t.timeInterval,r=JSON.parse(t.dataToRemove),n=t.autorefresh,a=t.floatbtn,l=JSON.parse(t.cookie_settings),h=t.shortCuts;e({audio:i,timePeriod:s,timeInterval:o,dataToRemove:r,autorefresh:n,floatbtn:a,cookie_settings:l,shortCuts:h})}))}))}getDomElements(){this.autorefresh=document.querySelector("#autorefresh"),this.floatbtn=document.querySelector("#floatbtn"),this.audio=document.querySelector("#audio"),this.shortCuts=document.querySelector("#shortCuts"),this.removeDataItems=document.querySelectorAll("#remove-list li > input"),this.timePeriodItems=document.querySelectorAll("#time-period input"),this.timeIntervalItems=document.querySelectorAll("#time-interval input"),this.cookieFilters=document.querySelector("a.filters"),this.cookiesInclusiveInputs=document.querySelectorAll("#cookie-filters p input"),this.addDomainBtn=document.querySelector("a.add")}initListeners(){this.initDomListeners(),this.initStorageListeners()}initDomListeners(){let e=+this.storage.clickCountFromPopup+ +this.storage.clickCountFromOptions;this.autorefresh.addEventListener("change",this.handleCommonSettings),this.floatbtn.addEventListener("change",this.handleCommonSettings),this.audio.addEventListener("change",this.handleCommonSettings),this.shortCuts.addEventListener("change",this.handleCommonSettings),[].forEach.call(this.removeDataItems,(e=>e.addEventListener("change",this.handleDataToRemove))),[].forEach.call(this.timePeriodItems,(e=>e.addEventListener("change",this.handleTimePeriod))),[].forEach.call(this.timeIntervalItems,(e=>e.addEventListener("change",this.handleTimeInterval))),this.cookieFilters.addEventListener("click",this.handleFilters),[].forEach.call(this.cookiesInclusiveInputs,(e=>e.addEventListener("change",this.handleInclusiveInputs))),this.addDomainBtn.addEventListener("click",(e=>(e.preventDefault(),this.handleAddDomain("",!0),!1))),!this.storage.isConfirm&&e<=25&&$("body").on("click",(()=>{let t,i=0;if(i=e++,chrome.storage.local.set({clickCountFromOptions:i}),25===i){if((t=confirm("Please share your experience with others and make a review for us."))&&chrome.tabs.create({url:"https://chrome.google.com/webstore/detail/"+chrome.runtime.id+"/reviews",selected:!0},(function(e){})),t)return $("body").prop("onclick",null).off("click"),void chrome.storage.local.set({isConfirm:t});i=0,chrome.storage.local.set({clickCountFromPopup:i,clickCountFromOptions:i}),window.location.reload()}}))}initStorageListeners(){chrome.storage.onChanged.addListener((e=>{this.handleStorageChanges(e)}))}handleCommonSettings(e){chrome.storage.local.set({[e.target.id]:e.target.checked},(()=>{}))}handleDataToRemove(){const e=[];[].forEach.call(this.removeDataItems,(t=>{t.checked&&e.push(t.value)})),chrome.storage.local.set({dataToRemove:JSON.stringify(e)},(()=>{}))}handleTimePeriod(e){chrome.storage.local.set({timePeriod:e.target.value},(()=>{}))}handleTimeInterval(e){chrome.runtime.sendMessage({action:"intervalChange",value:e.target.dataset.minutes},(()=>{}))}handleFilters(e){e.preventDefault();const t=$(this).closest("li");return $("aside#cookie-filters",t).slideToggle(),!1}handleInclusiveInputs(e){chrome.storage.local.get(["cookie_settings"],(t=>{const i=JSON.parse(t.cookie_settings);i.inclusive="no"!==e.target.value,chrome.storage.local.set({cookie_settings:JSON.stringify(i)},(()=>{}))}))}handleAddDomain(){this.renderFilter("newItem")}handleStorageChanges(e){Object.keys(e).forEach((t=>{switch(this.storage[t]=e[t].newValue,t){case"theme":this.setThemeStyles();break;case"dataToRemove":const t=JSON.parse(e.dataToRemove.newValue);this.markDeletingItems(t);break;case"timePeriod":this.markTimePeriod(e.timePeriod.newValue);break;case"timeInterval":this.markTimeInterval(e.timeInterval.newValue)}}))}onDomainRemove(e){e.preventDefault();const t=$(e.target).closest("li"),i=t.find(".domain")[0].dataset.domain;let s=JSON.parse(this.storage.cookie_settings);s.filters=s.filters.filter((e=>e!==i));const o=JSON.stringify(s);return chrome.storage.local.set({cookie_settings:o},(()=>{t.delay(0),t.slideToggle(100,(()=>{$(t).remove()}))})),!1}showElement(e){e.selector?document.querySelector(e.selector).classList.remove("hidden"):element.classList.remove("hidden")}isDomainDublicated(e){const t=JSON.parse(this.storage.cookie_settings).filters;let i=!1;return t.forEach((t=>{(t===e||`.${e}`===t)&&(i=!0)})),i}showIncorrectText(e,t){e.value=t,e.classList.add("error")}};