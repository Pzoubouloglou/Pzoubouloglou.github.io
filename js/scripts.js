/*
 * Accessible tab navigation for the site's main sections.
 * URL hashes keep every section directly linkable and make browser
 * back/forward navigation work as expected.
 */
(function () {
    "use strict";

    var tabList = document.querySelector('#sideNav [role="tablist"]');
    if (!tabList) return;

    var tabs = Array.prototype.slice.call(tabList.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('section[role="tabpanel"]'));
    var defaultHash = "#about";

    function getValidHash(hash) {
        var panel = hash && hash.charAt(0) === "#"
            ? document.getElementById(hash.slice(1))
            : null;
        return panel && panel.getAttribute("role") === "tabpanel" ? hash : defaultHash;
    }

    function activateTab(hash, options) {
        var settings = options || {};
        var validHash = getValidHash(hash);
        var activePanel = document.getElementById(validHash.slice(1));
        var activeTab = tabs.filter(function (tab) {
            return tab.getAttribute("href") === validHash;
        })[0];

        panels.forEach(function (panel) {
            var isActive = panel === activePanel;
            panel.classList.toggle("active", isActive);
            panel.hidden = !isActive;
        });

        tabs.forEach(function (tab) {
            var isActive = tab === activeTab;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
            tab.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        if (settings.scrollToTop) {
            window.scrollTo(0, 0);
        }

        if (window.jQuery) {
            window.jQuery("#navbarSupportedContent").collapse("hide");
        }
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function (event) {
            event.preventDefault();
            var hash = tab.getAttribute("href");

            if (window.location.hash !== hash) {
                window.history.pushState(null, "", hash);
            }

            activateTab(hash, { scrollToTop: true });
            tab.focus();
        });

        tab.addEventListener("keydown", function (event) {
            var nextIndex = null;

            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                nextIndex = (index + 1) % tabs.length;
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                nextIndex = (index - 1 + tabs.length) % tabs.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = tabs.length - 1;
            }

            if (nextIndex !== null) {
                event.preventDefault();
                tabs[nextIndex].click();
            }
        });
    });

    document.querySelector("#sideNav .navbar-brand").addEventListener("click", function (event) {
        event.preventDefault();
        if (window.location.hash !== defaultHash) {
            window.history.pushState(null, "", defaultHash);
        }
        activateTab(defaultHash, { scrollToTop: true });
    });

    window.addEventListener("popstate", function () {
        activateTab(window.location.hash, { scrollToTop: true });
    });

    window.addEventListener("hashchange", function () {
        activateTab(window.location.hash, { scrollToTop: true });
    });

    activateTab(window.location.hash, { scrollToTop: false });
})();
