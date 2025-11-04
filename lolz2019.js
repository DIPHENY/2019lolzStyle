// ==UserScript==
// @name         LZT style 2019
// @description  LZT back style 2019
// @namespace    http://tampermonkey.net/
// @version      1.2
// @icon         https://lolz.live/styles/brand/download/avatars/three_avatar.svg
// @author       https://lolz.live/tekumi/
// @match        https://lolz.live/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      LZT
// @downloadURL https://update.greasyfork.org/scripts/554560/LZT%20style%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/554560/LZT%20style%202019.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function disableControlsStyles() {
        for (let sheet of document.styleSheets) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                for (let i = rules.length - 1; i >= 0; i--) {
                    const rule = rules[i];
                    if (rule.selectorText &&
                        (rule.selectorText.includes('.discussionListMainPage .discussionListItem .controls') ||
                         rule.selectorText.includes('.discussionListItem--Wrapper:hover .controls'))) {
                        sheet.deleteRule(i);
                    }
                }
            } catch(e) {}
        }
    }

    function applyBackground() {
        const bgUrl = localStorage.getItem('customBackground');
        let bgElement = document.getElementById('customBgLayer');

        if (bgUrl) {
            if (!bgElement) {
                bgElement = document.createElement('div');
                bgElement.id = 'customBgLayer';
                document.body.prepend(bgElement);
            }
            bgElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                z-index: -2;
                width: 100%;
                height: 100vh;
                background: linear-gradient(rgb(54 54 54 / .85), rgb(54 54 54 / .85)), url(${bgUrl});
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            `;
        } else if (bgElement) {
            bgElement.remove();
        }
    }

    function updateRoundingClasses() {
        const hotContainer = document.querySelector('.hotThreadsContainer');
        const textAdsMain = document.querySelector('.text_Ads-main');
        const latestThreadsFirst = document.querySelector('.latestThreads._insertLoadedContent .discussionListItem:first-child');

        if (!hotContainer) return;

        const isHidden = hotContainer.classList.contains('hidden');

        if (textAdsMain) {
            if (isHidden) {
                textAdsMain.classList.add('hot-hidden');
            } else {
                textAdsMain.classList.remove('hot-hidden');
            }
        }

        if (latestThreadsFirst) {
            if (isHidden) {
                latestThreadsFirst.classList.add('hot-hidden');
            } else {
                latestThreadsFirst.classList.remove('hot-hidden');
            }
        }
    }

    window.addEventListener('load', () => {
        disableControlsStyles();
        setTimeout(disableControlsStyles, 500);
        applyBackground();
        updateRoundingClasses();
    });

    GM_addStyle(`
        .text_Ads {
            margin-bottom: 0px !important;
            border-radius: 0px !important;
        }

        .text_Ads-main {
            margin-bottom: 0px !important;
            border-radius: 0px !important;
            border-top-left-radius: 0px !important;
            border-top-right-radius: 0px !important;
            border-bottom-left-radius: 8px !important;
            border-bottom-right-radius: 8px !important;
        }

        .text_Ads-main.hot-hidden {
            border-bottom-left-radius: 0px !important;
            border-bottom-right-radius: 0px !important;
        }

        .text_Ads-main .discussionListItem:first-child {
            border-top-left-radius: 8px !important;
            border-top-right-radius: 8px !important;
        }

        .text_Ads-main .discussionListItem:last-child {
            border-bottom-left-radius: 8px !important;
            border-bottom-right-radius: 8px !important;
        }

        .text_Ads-main.hot-hidden .discussionListItem:last-child {
            border-bottom-left-radius: 0px !important;
            border-bottom-right-radius: 0px !important;
        }

        .latestThreads._insertLoadedContent .discussionListItem:first-child {
            border-top-left-radius: 0px !important;
            border-top-right-radius: 0px !important;
        }

        .latestThreads._insertLoadedContent .discussionListItem:first-child:not(.hot-hidden) {
            border-top-left-radius: 8px !important;
            border-top-right-radius: 8px !important;
        }

        .discussionListItem[data-converted="true"] .listBlock.main .title {
            margin-left: 15px !important;
            display: flex !important;
            align-items: center !important;
            gap: 2px !important;
            flex-wrap: nowrap !important;
            min-width: 0 !important;
        }

        .discussionListItem[data-converted="true"] .listBlock.main .title .threadPrefixes {
            flex-shrink: 0 !important;
            white-space: nowrap !important;
            display: flex !important;
            gap: 2px !important;
        }

        .discussionListItem[data-converted="true"] .listBlock.main .title .spanTitle {
            flex-shrink: 1 !important;
            min-width: 0 !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }

        .discussionListItem[data-converted="true"] .listBlock.main .title .hot {
            margin-right: 6px !important;
            flex-shrink: 0 !important;
            color: #ff6b35 !important;
        }

        .discussionListItem[data-converted="true"] .listBlock.main .secondRow {
            margin-left: 15px !important;
        }

        .discussionListItem[data-converted="true"] {
            margin-bottom: 0px !important;
            border-radius: 0px !important;
        }

        .discussionListItem[data-converted="true"] .discussionListItem--Wrapper {
            margin-bottom: 0px !important;
            border-radius: 0px !important;
        }

        .discussionListItem[data-converted="true"] .listBlock {
            border-radius: 0px !important;
        }

        .discussionListItem[data-converted="true"]:first-child {
            border-top-left-radius: 0px !important;
            border-top-right-radius: 0px !important;
        }

        .index .aboveThread-main {
            border-radius: 8px 8px 0px 0px !important;
        }

        .aboveThread-main {
            padding: 16px;
            margin-bottom: 0px;
            border-radius: 8px !important;
        }

        .hotThreadsContainer {
            margin-top: 12px;
        }

        .hotThreadsContainer.hidden {
            display: none !important;
        }
    `);

    function extractTimestamp(threadItem) {
        const headerBottoms = threadItem.querySelectorAll('.threadHeaderBottom');

        for (let headerBottom of headerBottoms) {
            const allElements = headerBottom.querySelectorAll('*');

            for (let el of allElements) {
                if (el.children.length === 0) {
                    const text = el.textContent.trim();
                    if (text && (text.includes('назад') || text.includes('сегодня') || text.includes('вчера') ||
                        text.match(/в \d{1,2}:\d{2}/) || text.includes('Только что') || text.match(/^\d+\s+сек/) ||
                        text.match(/^\d+\s+мин/) || text.match(/^\d+\s+час/) || text.match(/^\d+\s+\w+\s+\d{4}/) ||
                        text.match(/^\d+\s+янв|^\d+\s+фев|^\d+\s+мар|^\d+\s+апр|^\d+\s+май|^\d+\s+июн|^\d+\s+июл|^\d+\s+авг|^\d+\s+сен|^\d+\s+окт|^\d+\s+ноя|^\d+\s+дек/i))) {
                        return text;
                    }
                }
            }
        }

        return '';
    }

    function getReplyCount(threadItem) {
        const threadCounters = threadItem.querySelector('.threadCounters');
        if (threadCounters) {
            const replyCounter = threadCounters.querySelector('.counter:not(.LikeLink)');
            if (replyCounter) {
                const valueEl = replyCounter.querySelector('.value');
                if (valueEl) {
                    return valueEl.textContent.trim();
                }
            }
        }
        return '0';
    }

    function getLikeCount(threadItem) {
        const threadCounters = threadItem.querySelector('.threadCounters');
        if (threadCounters) {
            const likeLink = threadCounters.querySelector('.LikeLink');
            if (likeLink) {
                const valueEl = likeLink.querySelector('.LikeLabel.value');
                if (valueEl) {
                    return valueEl.textContent.trim();
                }
            }
        }
        return '0';
    }

    function isLikesSection(threadItem) {
        const threadCounters = threadItem.querySelector('.threadCounters');
        if (threadCounters) {
            const likeLink = threadCounters.querySelector('.LikeLink');
            if (likeLink) {
                const like2Icon = likeLink.querySelector('.like2Icon');
                return like2Icon !== null;
            }
        }
        return false;
    }

    function isHotThread(threadItem) {
        return threadItem.classList.contains('hot') || 
               threadItem.querySelector('.hot') !== null ||
               threadItem.classList.contains('isHot');
    }

    function reinitPreviewTooltip(threadItem) {
        const previewLink = threadItem.querySelector('.PreviewTooltip');
        if (previewLink && window.XenForo && window.XenForo.activate) {
            try {
                window.XenForo.activate(previewLink);
            } catch(e) {}
        }
    }

    function convertThreadItem(threadItem) {
        if (threadItem.hasAttribute('data-converted')) return;

        const threadId = threadItem.id;
        const dataAuthor = threadItem.getAttribute('data-author');
        const classes = threadItem.className;

        const titleLink = threadItem.querySelector('.threadHeaderTitle a');
        if (!titleLink) {
            threadItem.remove();
            return;
        }

        const prefixesElement = titleLink.querySelector('.threadPrefixes');
        const prefixesHTML = prefixesElement ? prefixesElement.outerHTML : '';

        let threadTitle = titleLink.textContent.trim();
        if (prefixesElement) {
            const prefixText = prefixesElement.textContent.trim();
            threadTitle = threadTitle.replace(prefixText, '').trim();
        }

        let threadUrl = titleLink.getAttribute('href');

        if (!threadUrl || threadUrl === '#') {
            const altLink = threadItem.querySelector('a[href*="posts/"]');
            if (altLink) {
                threadUrl = altLink.getAttribute('href');
            }
        }

        const previewUrl = threadUrl.replace('/unread', '');

        const creatorLink = threadItem.querySelector('.threadHeaderUsernameBlock .username, .thread_creator_mobile_hidden .username');
        if (!creatorLink) {
            threadItem.remove();
            return;
        }
        const creatorUsernameHTML = creatorLink.innerHTML;
        const creatorUrl = creatorLink.getAttribute('href');

        const creatorAvatar = threadItem.querySelector('.threadHeaderAvatar a.avatar, .zindex-block-main2.threadHeaderAvatar a.avatar');

        const timestamp = extractTimestamp(threadItem);

        let bumpTime = '';
        const headerBottom = threadItem.querySelector('.threadHeaderBottom');
        if (headerBottom) {
            const mutedElements = headerBottom.querySelectorAll('.muted');
            for (let el of mutedElements) {
                const text = el.textContent.trim();
                if (text.includes('поднята') || text.includes('обновлена')) {
                    bumpTime = text.replace('поднята', '').replace('обновлена', '').trim();
                    break;
                }
            }
        }

        const lastPostBlock = threadItem.querySelector('.listBlock.lastPost');
        let lastPostAvatar, lastPostUser, lastPostDateText, lastPostUrl;

        if (lastPostBlock) {
            lastPostAvatar = lastPostBlock.querySelector('a.avatar');
            lastPostUser = lastPostBlock.querySelector('.lastPostInfo.bold .username');

            const dateTimeLink = lastPostBlock.querySelector('a.dateTime.lastPostInfo.muted');
            if (dateTimeLink) {
                lastPostDateText = dateTimeLink.textContent.trim();
                lastPostUrl = dateTimeLink.getAttribute('href');
            }
        }

        const lastPostSection = threadItem.querySelector('.threadLastPost');
        if (lastPostSection && !lastPostDateText) {
            lastPostAvatar = lastPostAvatar || lastPostSection.querySelector('.threadHeaderAvatar a');
            lastPostUser = lastPostUser || lastPostSection.querySelector('.username');

            const lastPostDate = lastPostSection.querySelector('.threadLastPost--date');
            if (lastPostDate) {
                lastPostDateText = lastPostDate.textContent.trim();
                lastPostUrl = lastPostDate.getAttribute('href');
            } else {
                const muteElements = lastPostSection.querySelectorAll('.muted');
                for (let el of muteElements) {
                    if (el.tagName === 'SPAN') {
                        const text = el.textContent.trim();
                        if (text && (text.includes('назад') || text.includes('сегодня') || text.includes('вчера') ||
                            text.match(/в \d{1,2}:\d{2}/) || text.includes('Только что'))) {
                            lastPostDateText = text;
                            lastPostUrl = el.href || threadUrl;
                            break;
                        }
                    }
                }
            }
        }

        if (!lastPostAvatar) {
            lastPostAvatar = creatorAvatar;
            lastPostUser = creatorLink;
        }

        const replyCount = getReplyCount(threadItem);
        const likeCount = getLikeCount(threadItem);
        const hasLikesIcon = isLikesSection(threadItem);
        const likeClassName = hasLikesIcon ? 'discussionListItem--like2Count' : 'discussionListItem--likeCount';
        const isHot = isHotThread(threadItem);

        const displayTime = bumpTime || lastPostDateText || timestamp;

        const controlsBlock = threadItem.querySelector('.controls');
        const controlsHTML = controlsBlock ? controlsBlock.outerHTML : '';

        const lastPostHTML = lastPostAvatar ? `
            <div class="listBlock lastPost">
                ${lastPostAvatar.outerHTML}
                <div class="bold lastPostInfo">
                    ${lastPostUser.outerHTML}
                </div>
                <a href="${lastPostUrl || threadUrl}" title="Перейти к последнему сообщению" class="dateTime lastPostInfo muted">
                    ${displayTime}
                </a>
            </div>
        ` : '';

        const newHTML = `
            <div class="discussionListItem--Wrapper">
                ${lastPostHTML}

                ${controlsHTML}

                <a title="" href="${threadUrl}" class="listBlock main PreviewTooltip" data-previewurl="${previewUrl}//preview" aria-expanded="false">
                    <h3 class="title">
                        ${isHot ? '<i class="hot fa fa-solid fa-fire" title="Горячая тема"></i>' : ''}
                        <span class="spanTitle ${classes.includes('unread') ? 'unread' : ''}">${threadTitle}</span>
                    </h3>
                    <span class="secondRow">
                        <span class="threadTitle--prefixGroup">
                            ${prefixesHTML}
                        </span>
                        <label class="username threadCreator OverlayTrigger" data-href="${creatorUrl}?card=1">${creatorUsernameHTML}</label>
                        <span class="info-separator"></span>
                        <span class="startDate muted" title="">${timestamp}</span>
                        <span class="discussionListItem--replyCount icon muted">${replyCount}</span>
                        <span class="${likeClassName} icon muted pclikeCount">${likeCount}</span>

                        <span class="mobile--LastReply">
                            <span class="discussionListItem--replyCount mobile icon muted">${replyCount}</span>
                            <span style="margin: 0px 8px 0px 0px" class="${likeClassName} icon muted mblikeCount">${likeCount}</span>
                            <span class="svgIcon mobile--LastReplyIcon"></span>
                            <span class="username">
                                ${lastPostUser ? lastPostUser.innerHTML : creatorUsernameHTML}
                            </span>
                            <span class="muted">${displayTime}</span>
                        </span>
                    </span>
                </a>
            </div>
        `;

        threadItem.innerHTML = newHTML;
        threadItem.setAttribute('data-converted', 'true');

        const replyForm = document.getElementById(`replySubmit-${threadId.replace('thread-', '')}`);
        if (replyForm) replyForm.remove();

        setTimeout(() => reinitPreviewTooltip(threadItem), 100);
    }

    function processAllThreads() {
        const threads = document.querySelectorAll('.discussionListItem[id^="thread-"]:not([data-converted])');
        threads.forEach(thread => {
            if (thread.querySelector('.threadMessage, .threadMain')) {
                convertThreadItem(thread);
            }
        });
    }

    function initHotThreadsToggle() {
        const hotContainer = document.querySelector('.hotThreadsContainer');
        if (!hotContainer) return;

        const isHidden = localStorage.getItem('hotThreadsHidden') === 'true';
        if (isHidden) {
            hotContainer.classList.add('hidden');
        }
        updateRoundingClasses();

        function addHotThreadsOption() {
            const feedForm = document.querySelector('#ExcludeForumsForm');
            if (!feedForm) return;

            if (document.getElementById('hideHotThreadsCheckbox')) return;

            const titles = feedForm.querySelectorAll('.title');
            let keywordsSection = null;

            titles.forEach(title => {
                if (title.textContent.trim().includes('ключевым словам')) {
                    keywordsSection = title;
                }
            });

            if (!keywordsSection) return;

            const currentIsHidden = localStorage.getItem('hotThreadsHidden') === 'true';
            const currentBg = localStorage.getItem('customBackground') || '';

            const hotThreadsSection = document.createElement('div');
            hotThreadsSection.style.marginTop = '16px';
            hotThreadsSection.innerHTML = `
                <div class="title">Скрыть горячие темы</div>
                <div class="explainTitle">Горячие темы не будут отображаться на главной странице.</div>
                <div class="" style="margin-top: 8px;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="hideHotThreadsCheckbox" ${currentIsHidden ? 'checked' : ''}>
                        <span>Скрыть раздел "Горячие темы"</span>
                    </label>
                </div>

                <div style="margin-top: 20px;">
                    <div class="title">Задний фон страницы</div>
                    <div class="explainTitle">Установите свой фон для сайта.</div>
                    <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 10px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Ссылка на изображение:</label>
                            <input type="text" id="bgUrlInput" placeholder="https://example.com/image.jpg"
                                   value="${currentBg}" style="width: 100%; padding: 6px; background: #1a1a1a; color: #d6d6d6; border: 1px solid #404040; border-radius: 4px;">
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button id="applyBgBtn" style="padding: 6px 16px; background: #4a9eff; color: white; border: none; border-radius: 4px; cursor: pointer;">Применить</button>
                            <button id="removeBgBtn" style="padding: 6px 16px; background: #ff4a4a; color: white; border: none; border-radius: 4px; cursor: pointer;">Удалить фон</button>
                            <label for="bgFileInput" style="padding: 6px 16px; background: #5a5a5a; color: white; border-radius: 4px; cursor: pointer; display: inline-block;">
                                Загрузить с ПК
                                <input type="file" id="bgFileInput" accept="image/*" style="display: none;">
                            </label>
                        </div>
                    </div>
                </div>
            `;

            keywordsSection.parentElement.insertBefore(hotThreadsSection, keywordsSection);

            const checkbox = document.getElementById('hideHotThreadsCheckbox');
            checkbox.addEventListener('change', () => {
                const shouldHide = checkbox.checked;
                localStorage.setItem('hotThreadsHidden', shouldHide);
                if (shouldHide) {
                    hotContainer.classList.add('hidden');
                } else {
                    hotContainer.classList.remove('hidden');
                }
                setTimeout(updateRoundingClasses, 50);
            });

            const bgUrlInput = document.getElementById('bgUrlInput');
            const applyBgBtn = document.getElementById('applyBgBtn');
            const removeBgBtn = document.getElementById('removeBgBtn');
            const bgFileInput = document.getElementById('bgFileInput');

            applyBgBtn.addEventListener('click', () => {
                const url = bgUrlInput.value.trim();
                if (url) {
                    localStorage.setItem('customBackground', url);
                    applyBackground();
                    alert('Фон применен!');
                }
            });

            removeBgBtn.addEventListener('click', () => {
                localStorage.removeItem('customBackground');
                const bgElement = document.getElementById('customBgLayer');
                if (bgElement) bgElement.remove();
                bgUrlInput.value = '';
                alert('Фон удален!');
            });

            bgFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const dataUrl = event.target.result;
                        localStorage.setItem('customBackground', dataUrl);
                        applyBackground();
                        bgUrlInput.value = 'Загружено с ПК';
                        alert('Фон загружен и применен!');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.querySelector && node.querySelector('#ExcludeForumsForm')) {
                            setTimeout(addHotThreadsOption, 100);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processAllThreads();
            initHotThreadsToggle();
            setTimeout(() => window.scrollBy(0, 1), 100);
        });
    } else {
        processAllThreads();
        initHotThreadsToggle();
        setTimeout(() => window.scrollBy(0, 1), 100);
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches?.('.discussionListItem[id^="thread-"]')) {
                        if (!node.hasAttribute('data-converted') && node.querySelector('.threadMessage, .threadMain')) {
                            convertThreadItem(node);
                        }
                    }
                    if (node.querySelector?.('.discussionListItem[id^="thread-"]')) {
                        processAllThreads();
                    }
                    if (node.matches?.('.hotThreadsContainer') || node.querySelector?.('.hotThreadsContainer')) {
                        initHotThreadsToggle();
                    }
                    if (node.matches?.('.text_Ads-main') || node.querySelector?.('.text_Ads-main') ||
                        node.matches?.('.latestThreads._insertLoadedContent') || node.querySelector?.('.latestThreads._insertLoadedContent')) {
                        setTimeout(updateRoundingClasses, 50);
                    }
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
