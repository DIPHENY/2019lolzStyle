// ==UserScript==
// @name         Lolz Live — Feed Like Screenshot (2-column)
// @namespace    lolz-minimal
// @version      6.0
// @description  Переставляет элементы как на скриншоте: слева контент, справа аватар+время
// @match        https://lolz.live/*
// @match        https://*.lolz.live/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function reflow() {
    document.querySelectorAll(".discussionListItem:not([data-reflow='1'])").forEach(item => {
      // источники данных (берём desktop-версии блоков)
      const avatarWrap   = item.querySelector(".threadHeaderAvatar"); // <a><img/></a>
      const titleBlock   = item.querySelector(".threadHeaderTitle.header_mobile_hiden");
      const titleA       = titleBlock ? titleBlock.querySelector("a") : null;
      const prefixes     = titleBlock ? titleBlock.querySelector(".threadPrefixes") : null;

      const authorNode   = item.querySelector(".thread_creator_mobile_hidden .username")
                         || item.querySelector(".threadHeaderUsernameBlock .username");

      const forumNode    = item.querySelector(".threadHeaderBottom .zindex-block-main-forum-title");
      const createdNode  = item.querySelector(".threadHeaderBottom .muted:not(.threadLastPost--date)");
      // второе "поднята …" обычно идёт после раздела и разделителя:
      const bumpNode     = item.querySelector(".threadHeaderBottom .muted + .separator + .muted");

      const countersWrap = item.querySelector(".threadCounters"); // в нём лайки/комменты как на лолзе

      if (!titleA || !avatarWrap || !authorNode) return;

      // прячем исходный контент целиком
      [...item.children].forEach(ch => ch.style.display = "none");

      // правый столбец: аватар + время (поднята/только что)
      const avatarHTML = avatarWrap.cloneNode(true).outerHTML;
      const rightTime  = (bumpNode && bumpNode.innerText.trim()) || (createdNode ? createdNode.innerText.trim() : "");
      const rightCol   = `
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:6px;
          min-width:72px;
          padding:6px 6px 6px 0;
        ">
          <div class="threadHeaderAvatar" style="display:block;">${avatarHTML}</div>
          <div style="color:#9a9a9a;font-size:12px;text-align:center;line-height:1.2;">
            ${rightTime}
          </div>
        </div>
      `;

      // левая колонка:
      const prefixHTML  = prefixes ? prefixes.outerHTML : "";
      const titleHTML   = titleA.outerHTML;                 // нативная ссылка (цвет/ховер сохранятся)
      const authorHTML  = authorNode.outerHTML;             // нативный цвет ника + значки
      const forumHTML   = forumNode ? forumNode.outerHTML : "";

      // строка метаданных (как на скрине: автор • раздел • …)
      const metaLine = `
        <div style="display:flex;align-items:center;gap:6px;color:#aaa;font-size:13px;">
          ${authorHTML}
          <span style="color:#8e8e8e">•</span>
          ${forumHTML}
          ${createdNode ? `<span style="color:#8e8e8e">•</span><span>${createdNode.innerText.trim()}</span>` : ""}
        </div>
      `;

      // счётчики — вставляем ровно родной контейнер, просто уменьшаем визуально
      const countersHTML = countersWrap
        ? `<div class="threadCounters" style="margin-top:6px; transform: scale(.95); transform-origin:left center;">${countersWrap.innerHTML}</div>`
        : "";

      // карточка (2-колоночный флекс)
      const card = document.createElement("div");
      card.style.cssText = `
        display:flex;
        justify-content:space-between;
        gap:10px;
        padding:10px 12px;
        border-bottom:1px solid rgba(255,255,255,0.08);
      `;

      card.innerHTML = `
        <div style="flex:1; min-width:0;">
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
  obs.observe(document.body, { childList: true, subtree: true });

  reflow();
})();
