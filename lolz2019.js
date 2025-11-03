// ==UserScript==
// @name         LZT style 2019
// @description  LZT back style 2019
// @namespace    http://tampermonkey.net/
// @version      1.1
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
        }

        .text_Ads-main .discussionListItem:first-child {
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
                const iconCounter = likeLink.querySelector('.icon-counter-main-likes');
                return iconCounter !== null;
            }
        }
        return false;
    }

    function convertThreadItem(threadItem) {
        if (threadItem.hasAttribute('data-converted')) return;

        const threadId = threadItem.id;
        const dataAuthor = threadItem.getAttribute('data-author');
        const classes = threadItem.className;

        const titleLink = threadItem.querySelector('.threadHeaderTitle a');
        if (!titleLink) return;
        const threadTitle = titleLink.textContent.trim();
        let threadUrl = titleLink.getAttribute('href');

        if (!threadUrl || threadUrl === '#') {
            const altLink = threadItem.querySelector('a[href*="posts/"]');
            if (altLink) {
                threadUrl = altLink.getAttribute('href');
            }
        }

        const prefixesElement = titleLink.querySelector('.threadPrefixes');
        const prefixesHTML = prefixesElement ? prefixesElement.outerHTML : '';

        const creatorLink = threadItem.querySelector('.threadHeaderUsernameBlock .username, .thread_creator_mobile_hidden .username');
        if (!creatorLink) return;
        const creatorUsernameHTML = creatorLink.innerHTML;
        const creatorUrl = creatorLink.getAttribute('href');

        const creatorAvatar = threadItem.querySelector('.threadHeaderAvatar a.avatar, .zindex-block-main2.threadHeaderAvatar a.avatar');

        const timestamp = extractTimestamp(threadItem);

        const lastPostSection = threadItem.querySelector('.threadLastPost');
        let lastPostAvatar, lastPostUser, lastPostDateText, lastPostUrl;

        if (lastPostSection) {
            lastPostAvatar = lastPostSection.querySelector('.threadHeaderAvatar a');
            lastPostUser = lastPostSection.querySelector('.username');

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
        const useLikesClass = isLikesSection(threadItem);
        const likeClassName = useLikesClass ? 'discussionListItem--likeCount' : 'discussionListItem--like2Count';

        const displayTime = lastPostDateText || timestamp;

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

                <a title="" href="${threadUrl}" class="listBlock main PreviewTooltip" data-previewurl="${threadUrl}/preview" aria-expanded="false">
                    <h3 class="title">
                        ${prefixesHTML}
                        <span class="spanTitle ${classes.includes('unread') ? 'unread' : ''}">${threadTitle}</span>
                    </h3>
                    <span class="secondRow">
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
    }

    function processAllThreads() {
        const threads = document.querySelectorAll('.discussionListItem[id^="thread-"]');
        threads.forEach(thread => {
            if (thread.querySelector('.threadMessage, .threadMain')) {
                convertThreadItem(thread);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processAllThreads();
            setTimeout(() => window.scrollBy(0, 1), 100);
        });
    } else {
        processAllThreads();
        setTimeout(() => window.scrollBy(0, 1), 100);
    }

    const observer = new MutationObserver(mutations => {
        let shouldProcess = false;

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches?.('.discussionListItem[id^="thread-"]')) {
                        if (node.querySelector('.threadMessage, .threadMain')) {
                            shouldProcess = true;
                        }
                    }
                    if (node.querySelector?.('.discussionListItem[id^="thread-"]')) {
                        shouldProcess = true;
                    }
                }
            });
        });

        if (shouldProcess) {
            processAllThreads();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
