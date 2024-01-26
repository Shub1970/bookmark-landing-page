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

// Questions

const questionList = document.querySelectorAll(".Questions li");

function handleInteraction(target) {
  if (
    target.tagName === "LI" &&
    target.getAttribute("aria-selected") === "false"
  ) {
    questionList.forEach((tab) => {
      tab.setAttribute("aria-selected", false);
      tab.setAttribute("aria-expanded", false);
    });

    target.setAttribute("aria-selected", true);
    target.setAttribute("aria-expanded", true);
  }
}

function handleMouseOver(event) {
  handleInteraction(event.target);
}

function handleKeyDown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleInteraction(event.target);
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();

    const currentIndex = Array.from(questionList).indexOf(event.target);
    const nextIndex =
      event.key === "ArrowDown"
        ? (currentIndex + 1) % questionList.length
        : (currentIndex - 1) % questionList.length;

    questionList[nextIndex].focus();
  }
}

questionList.forEach((question) => {
  question.addEventListener("mouseover", handleMouseOver);
  question.addEventListener("keydown", handleKeyDown);
});

const connection_form = document.querySelector(".connection-form");
const submit_btn = connection_form.querySelector("button[type='submit']");
const input_container = connection_form.querySelector(".input-container");

function isValidEmail(email) {
  // Regular expression for a basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function handleSubmit(event) {
  event.preventDefault();
  let input_value = connection_form.querySelector("input[type='email']").value;

  if (isValidEmail(input_value)) {
    input_container.setAttribute("error", false);
    const formData = new FormData(connection_form);
    const data = Object.fromEntries(formData);
    console.log(data);
    connection_form.requestSubmit();
  } else {
    input_container.setAttribute("error", true);
  }
}

submit_btn.addEventListener("click", handleSubmit);

const nav_button = document.querySelector(".nav-button");
const all_link = document.querySelector(".all-link");
const close_button = document.querySelector(".nav-button .close");
const hamburger_button = document.querySelector(".nav-button .hamburger");
const primary_company_logo = document.querySelector(".primary-company-logo");
nav_button.addEventListener("click", function () {
  let button_aria_expanded = nav_button.getAttribute("aria-expanded");
  nav_button.setAttribute(
    "aria-expanded",
    button_aria_expanded === "true" ? "false" : "true"
  );
  [close_button, hamburger_button].forEach((button) => {
    button.classList.remove("show");
  });
  if (nav_button.getAttribute("aria-expanded") === "true") {
    all_link.classList.add("show");
    close_button.classList.add("show");
    nav_button.setAttribute("position", "fixed");
    primary_company_logo.setAttribute("position", "fixed");
  } else {
    all_link.classList.remove("show");
    hamburger_button.classList.add("show");
    nav_button.setAttribute("position", "none");
    primary_company_logo.setAttribute("position", "none");
  }
});
