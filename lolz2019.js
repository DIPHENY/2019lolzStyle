// ==UserScript==
// @name         Lolz Live 2019 UI Feed Minimal + Auto Update
// @namespace    https://lolz.live/
// @version      1.0.0
// @description  Минималистичная лента Lolz.live + автообновление + UI как на скрине
// @match        https://lolz.live/*
// @match        https://*.lolz.live/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

// ===================== //
//  CONFIG FOR UPDATER   //
// ===================== //
const SCRIPT_NAME = "Lolz 2019 UI Feed";
const RAW_URL = "https://raw.githubusercontent.com/DIPHENY/2019lolzStyle/refs/heads/main/lolz2019.js";
const CURRENT_VERSION = GM_info.script.version;

// ===================== //
//     UPDATE BANNER     //
// ===================== //
GM_addStyle(`
.lolzUpdateBanner {
  position: fixed;
  top: 0; left: 0; right: 0;
  background: #1e2126;
  padding: 8px 14px;
  border-bottom: 1px solid rgba(255,255,255,.12);
  font-family: sans-serif;
  color: #fff;
  z-index: 9999999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.lolzUpdateBanner button {
  background: #0ac18e;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
`);

function versionCompare(v1, v2) {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i]||0) > (b[i]||0)) return 1;
    if ((a[i]||0) < (b[i]||0)) return -1;
  }
  return 0;
}

function showBanner(newV) {
  const bar = document.createElement("div");
  bar.className = "lolzUpdateBanner";
  bar.innerHTML = `
    🚀 Новая версия скрипта доступна: <b>v${newV}</b> (у вас v${CURRENT_VERSION})
    <button id="updateScriptBtn">Обновить</button>
  `;
  document.body.appendChild(bar);

  document.getElementById("updateScriptBtn").onclick = () => {
    window.open(RAW_URL, "_blank");
    bar.remove();
  };
}

GM_xmlhttpRequest({
  method: "GET",
  url: RAW_URL + "?_=" + Date.now(),
  onload: (res) => {
    const match = res.responseText.match(/@version\s+([\d.]+)/);
    if (!match) return;
    const latest = match[1];
    if (versionCompare(latest, CURRENT_VERSION) > 0) showBanner(latest);
  }
});

// ===================== //
//     FEED MINI-LAYOUT  //
// ===================== //

function reflow() {
  document.querySelectorAll(".discussionListItem:not([data-reflow='1'])").forEach(item => {

    const avatarWrap = item.querySelector(".threadHeaderAvatar");
    const titleBlock = item.querySelector(".threadHeaderTitle.header_mobile_hiden");
    const titleA     = titleBlock ? titleBlock.querySelector("a") : null;
    const prefixes   = titleBlock ? titleBlock.querySelector(".threadPrefixes") : null;
    const authorNode = item.querySelector(".thread_creator_mobile_hidden .username")
                     || item.querySelector(".threadHeaderUsernameBlock .username");
    const forumNode  = item.querySelector(".threadHeaderBottom .zindex-block-main-forum-title");
    const createdNode= item.querySelector(".threadHeaderBottom .muted:not(.threadLastPost--date)");
    const bumpNode   = item.querySelector(".threadHeaderBottom .muted + .separator + .muted");
    const countersWrap = item.querySelector(".threadCounters");

    if (!titleA || !avatarWrap || !authorNode) return;

    [...item.children].forEach(ch => ch.style.display = "none");

    const avatarHTML = avatarWrap.cloneNode(true).outerHTML;
    const rightTime  = bumpNode?.innerText.trim() || createdNode?.innerText.trim() || "";

    const rightCol = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;min-width:72px;padding:6px 6px 6px 0;">
        ${avatarHTML}
        <div style="color:#999;font-size:12px;text-align:center;line-height:1.2;">${rightTime}</div>
      </div>
    `;

    const prefixHTML = prefixes?.outerHTML || "";
    const titleHTML  = titleA.outerHTML;
    const authorHTML = authorNode.outerHTML;
    const forumHTML  = forumNode?.outerHTML || "";
    const createdStr = createdNode ? createdNode.innerText.trim() : "";

    const metaLine = `
      <div style="display:flex;align-items:center;gap:6px;color:#aaa;font-size:13px;">
        ${authorHTML}
        <span style="color:#6f6f6f">•</span>
        ${forumHTML}
        <span style="color:#6f6f6f">•</span>
        ${createdStr}
      </div>
    `;

    const countersHTML = countersWrap 
      ? `<div class="threadCounters" style="margin-top:6px; transform:scale(.94); transform-origin:left center;">${countersWrap.innerHTML}</div>`
      : "";

    const card = document.createElement("div");
    card.style.cssText = `display:flex;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.08);`;

    card.innerHTML = `
      <div style="flex:1;min-width:0;">
        ${prefixHTML}
        ${titleHTML}
        ${metaLine}
        ${countersHTML}
      </div>
      ${rightCol}
    `;

    item.appendChild(card);
    item.dataset.reflow = "1";
  });
}

const obs = new MutationObserver(reflow);
obs.observe(document.body, { childList:true, subtree:true });

reflow();
