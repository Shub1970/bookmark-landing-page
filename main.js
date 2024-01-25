const tab_container = document.querySelector(".tab-container");
const tabs = document.querySelectorAll(
  ".tab-container div[aria-labelledby='tab']"
);
const tabPanels = document.querySelectorAll(
  ".tabpanel-container div[role='tabpanel']"
);

tabs.forEach((tab, index) => {
  tab.addEventListener("click", function () {
    let previousTab = document.querySelector(
      ".tab-container div[aria-selected='true']"
    );
    if (this.getAttribute("aria-selected") == "true") {
      return;
    } else {
      changeActiveTab(previousTab, this);
    }
  });

  tab.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      let newIndex = index + direction;

      // Ensure newIndex is within bounds
      newIndex = Math.max(0, Math.min(newIndex, tabs.length - 1));

      let previousTab = document.querySelector(
        ".tab-container div[aria-selected='true']"
      );

      if (tabs[newIndex] !== previousTab) {
        tabs[newIndex].focus();
      }
    } else if (event.key === "Enter") {
      let previousTab = document.querySelector(
        ".tab-container div[aria-selected='true']"
      );

      if (previousTab !== tab) {
        changeActiveTab(previousTab, tab);
      }
    }
  });
});

function changeTabStatus(tab, boolStatus) {
  tab.setAttribute("aria-selected", boolStatus);
  tab.setAttribute("tabindex", boolStatus ? 0 : -1);
  tab.setAttribute("aria-expanded", boolStatus);
}

function changeActiveTab(previousTab, finalActiveTab) {
  changeTabStatus(previousTab, false);
  changeTabStatus(finalActiveTab, true);
  tabPanels.forEach((panel) => {
    panel.setAttribute("hidden", true);
  });
  let finalActiveTabPanel = finalActiveTab.getAttribute("aria-controls");
  document.getElementById(finalActiveTabPanel).removeAttribute("hidden");
  animateBeforeElement(previousTab, finalActiveTab);
}

function animateBeforeElement(previousTab, finalActiveTab) {
  let leftPrevTab = previousTab.offsetLeft;
  let finalActiveTabWidth = finalActiveTab.offsetWidth;
  let previousTabWidth = previousTab.offsetWidth;
  let leftFinalTab = finalActiveTab.offsetLeft;
  let lenth_bw_both_tab_endPoint;
  tab_container.style.setProperty("--width", `${finalActiveTabWidth}px`);
  if (leftFinalTab - leftPrevTab > 0) {
    lenth_bw_both_tab_endPoint =
      leftFinalTab - leftPrevTab + finalActiveTabWidth;
  } else {
    tab_container.style.setProperty("--offset", `${leftFinalTab}px`);
    lenth_bw_both_tab_endPoint = leftPrevTab - leftFinalTab + previousTabWidth;
  }
  let ratio_lenth_bw_both_tab_endPoint_and_finalActiveTabWidth =
    lenth_bw_both_tab_endPoint / finalActiveTabWidth;
  tab_container.style.setProperty(
    "--resize",
    `${ratio_lenth_bw_both_tab_endPoint_and_finalActiveTabWidth}`
  );
  tab_container.addEventListener(
    "transitionend",
    () => {
      tab_container.style.setProperty("--offset", `${leftFinalTab}px`);
      tab_container.style.setProperty("--resize", "1");
    },
    { once: true }
  );
}
