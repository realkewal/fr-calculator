// const applicationHost = "https://get.stg.futurerent.com.au";
const applicationHost = "http://localhost:3000";

function calculate(
  weeklyRent,
  requestedWithdrawalAmount = 0,
  requestedRepaymentTerm = 36,
  double = false,
  sixMonth = false
) {
  // Repayment term calculations - Breakdown in weeks
  requestedRepaymentTerm = sixMonth ? 12 : requestedRepaymentTerm;
  const dailyRent = weeklyRent / 7;
  const annualRent = Math.min(100000, dailyRent * 365);
  const monthlyRent = annualRent / 12;
  const daysInMonth = 365 / 12;
  const weeksInYear = 365 / 7;
  const weeksInMonth = weeksInYear / 12;
  // Set defaults for withdrawal amounts
  const minWithdrawal = 0;
  const maxWithdrawal1 = sixMonth
    ? monthlyRent * 6
    : Math.min(100000, annualRent);
  const maxWithdrawal2 = sixMonth
    ? monthlyRent * 6
    : Math.min(100000, annualRent * 2);
  const tempMaxWithdrawal = sixMonth
    ? monthlyRent * 6
    : Math.min(100000, annualRent * 2); // min(annualRent * 2, 100000)
  const rentDurationValue =
    Math.round((tempMaxWithdrawal / annualRent) * 100) / 100;

  if (requestedWithdrawalAmount == 0) {
    requestedWithdrawalAmount = maxWithdrawal2;
  }

  // Calculations based on user input
  const costPerMonthOverRepaymentTermPercent = 0.089 / 12;
  const costPerMonthOverRepaymentTerm =
    requestedWithdrawalAmount * costPerMonthOverRepaymentTermPercent;
  //console.log(requestedWithdrawalAmount);
  //console.log("costPerMonthOverRepaymentTerm " + costPerMonthOverRepaymentTerm);
  const costPerWeekOverRepaymentTerm =
    (costPerMonthOverRepaymentTerm / daysInMonth) * 7;

  // ----
  const totalMargin = requestedRepaymentTerm * costPerMonthOverRepaymentTerm;
  const totalRentCollectible = requestedWithdrawalAmount + totalMargin;
  //console.log("totalRentCollectible " + totalRentCollectible);
  const repaymentsEachMonth = totalRentCollectible / requestedRepaymentTerm;
  const repaymentsPerWeek = (repaymentsEachMonth / daysInMonth) * 7;
  const remainingToYou = weeklyRent - repaymentsPerWeek;
  const paidBackEachWeek = repaymentsPerWeek - costPerWeekOverRepaymentTerm;
  const netRentCollectible = requestedWithdrawalAmount + totalMargin;

  console.log("monthly re " + monthlyRent);

  const futurerentSharePercent = repaymentsEachMonth / monthlyRent;
  const clientSharePercent = 1 - futurerentSharePercent;
  const remainingToYouMonthly = clientSharePercent * monthlyRent;

  const clientShareAmount = totalRentCollectible * clientSharePercent;
  const clientShareAmountWeekly = weeklyRent * clientSharePercent;
  const upfrontOfferPerMonth =
    requestedWithdrawalAmount / requestedRepaymentTerm;
  const grossRentCollectibleOverTerm = monthlyRent * requestedRepaymentTerm;
  const monthlyGrossRentCollectible =
    grossRentCollectibleOverTerm / requestedRepaymentTerm;

  const principalRepaid = repaymentsPerWeek - costPerWeekOverRepaymentTerm;
  const principalRepaidMonthly =
    repaymentsEachMonth - costPerMonthOverRepaymentTerm;

  const result = {
    weeklyRent,
    monthlyRent,
    maxWithdrawal1,
    maxWithdrawal2,
    tempMaxWithdrawal,
    annualRent,
    requestedWithdrawalAmount,
    requestedRepaymentTerm: parseInt(requestedRepaymentTerm),
    repaymentsPerWeek,
    repaymentsEachMonth,
    remainingToYou,
    remainingToYouMonthly,
    costPerWeekOverRepaymentTerm,
    costPerMonthOverRepaymentTerm,
    totalMargin,
    paidBackEachWeek,
    totalRentCollectible,
    netRentCollectible,
    futurerentSharePercent,
    clientSharePercent,
    clientShareAmount,
    clientShareAmountWeekly,
    upfrontOfferPerMonth,
    grossRentCollectibleOverTerm,
    monthlyGrossRentCollectible,
    principalRepaid,
    principalRepaidMonthly,
    rentDurationValue
  };
  console.log(result);
  return result;
}

function formatCurrency(number) {
  const curr = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0
  }).format(Math.round(number));
  return curr;
}

function makeCalculatorActive() {
  // right side
  const calcRightPanel = document.querySelector(".calc_top-wrap-right");
  calcRightPanel.classList.remove("is-disabled");

  const advTitle = document.querySelector(".calc-advance_title");
  const adv = document.querySelector("#calc-advance");
  adv.classList.add("is-active");
  advTitle.classList.add("is-active");

  // left side
  const calcLeftPanel = document.querySelector(".calc_all_details-wrap");
  calcLeftPanel.classList.remove("is-disabled");
  const calcDetailsTitle = document.querySelector(".calc_details-title");
  calcDetailsTitle.classList.add("is-active");

  const calcInpAdvLbl = document.querySelector(".calc_input-advance");
  calcInpAdvLbl.classList.add("is-active");
  //const calcDet = document.querySelector(".calc_details-title-text");
  //calcDet.classList.add("is-active");

  const calcLabel = document.querySelector(".calc_repayment_label");
  calcLabel.classList.add("is-active");
  const calcRepayments = document.querySelector("#repayment-select");
  calcRepayments.classList.add("is-active");

  // do badges
  const calcBadges = document.querySelectorAll(".calc_badge");
  calcBadges.forEach((elem) => elem.classList.add("is-active"));

  // hide placeholder graphs and enable real graphs
  const calcGaugeLines = document.querySelectorAll(".calc-gauge_circle-line");
  calcGaugeLines.forEach((elem) => elem.classList.add("hide"));
  const calcGaugeBgs = document.querySelectorAll(".calc-gauge_circle-bg");
  calcGaugeBgs.forEach((elem) => elem.classList.add("hide"));

  const monthlyChartCanvas = document.getElementById("monthlyChart");
  monthlyChartCanvas.classList.remove("hide");
  monthlyChartCanvas.style.display = "block";
  const totalChartCanvas = document.getElementById("totalChart");
  totalChartCanvas.style.display = "block";
  totalChartCanvas.classList.remove("hide");

  // swap button groups
  const applyNowBtnGroup = document.getElementById("calc-buttons-apply-group");
  applyNowBtnGroup.style.display = "flex";
  const calcBtnGroup = document.getElementById("calc-buttons-calc-group");
  calcBtnGroup.style.display = "none";
}

function setupFields(rent, amount) {
  makeCalculatorActive();
  //setupCharts();

  const repaymentSelect = document.querySelector("#repayment-select");
  const term = repaymentSelect.value;
  console.log(rent + " " + amount + " " + term);
  let calRes = calculate(rent, amount, term);

  // if we are on a 18m or 24m term then max is 1years of rent in advance
  if (term == 18 || term == 24) {
    if (calRes.requestedWithdrawalAmount > calRes.maxWithdrawal1) {
      calRes = calculate(rent, calRes.maxWithdrawal1, term);
    }
  }

  setupApplyNowButtonHomepage(rent, calRes.requestedWithdrawalAmount, term);

  const result = document.querySelector("#calc-advance-input");
  result.setAttribute(
    "value",
    formatCurrency(calRes.requestedWithdrawalAmount).substring(1)
  );
  result.value = formatCurrency(calRes.requestedWithdrawalAmount).substring(1);

  const totaladvtop = document.querySelector("#calc-advance");
  const monthlyRent = document.querySelector("#calc-monthly-rent");
  const monthlyRepayment = document.querySelector("#calc-monthly-repayment");
  const remToYou = document.querySelector("#calc-monthly-remaining");
  const totalAdvanced = document.querySelector("#calc-total-advanced");
  const totalCost = document.querySelector("#calc-total-cost");
  const totalRepayment = document.querySelector("#calc-total-repayment");
  const slider2year = document.querySelector("#calc-slider-2year");
  const slider1year = document.querySelector("#calc-slider-1year");
  const sliderElem = document.querySelector("#calc-slider");

  // if we are below 50% of max - we need to do some special handling
  // of slider due to it min at 10000
  if (calRes.requestedWithdrawalAmount < calRes.maxWithdrawal1) {
    sliderElem.value =
      ((calRes.requestedWithdrawalAmount - 10000) /
        (calRes.maxWithdrawal1 - 10000)) *
      50;
  } else {
    sliderElem.value =
      (calRes.requestedWithdrawalAmount / calRes.maxWithdrawal2) * 100;
  }
  // webkit only
  // https://codepen.io/saintwycliffe/pen/VBGYXN
  sliderElem.style.background =
    "linear-gradient(to right, #22abbf 0%, #22abbf " +
    sliderElem.value +
    "%, #eaecf0 " +
    sliderElem.value +
    "%, #eaecf0 100%)";

  const messageElem = document.querySelector("#calc-slider-message");
  if (term == 18 || term == 24) {
    messageElem.classList.remove("hide");
    messageElem.textContent = "Max on " + term + " month term";
  } else {
    messageElem.classList.add("hide");
    slider1year.textContent = formatCurrency(calRes.maxWithdrawal1);
  }

  slider2year.textContent = formatCurrency(calRes.maxWithdrawal2);
  totaladvtop.textContent = formatCurrency(calRes.requestedWithdrawalAmount);

  monthlyRent.textContent = formatCurrency(calRes.monthlyRent);
  monthlyRepayment.textContent = formatCurrency(calRes.repaymentsEachMonth);
  remToYou.textContent = formatCurrency(calRes.remainingToYouMonthly);

  totalAdvanced.textContent = formatCurrency(calRes.requestedWithdrawalAmount);
  totalCost.textContent = formatCurrency(calRes.totalMargin);
  totalRepayment.textContent = formatCurrency(calRes.netRentCollectible);

  updateCharts(
    calRes.repaymentsEachMonth,
    calRes.remainingToYouMonthly,
    calRes.requestedWithdrawalAmount,
    calRes.totalMargin
  );

  window.parent.postMessage(
    {
      rent: Number(rent),
      amount: calRes.requestedWithdrawalAmount,
      term: Number(term)
    },
    applicationHost
  );
}

//########### SETUP EVENT HANDLERS FOR INPUT FIELDS
function isNumeric(value) {
  return /^\d+$/.test(value);
}

function setupEventHandlers() {
  // automatically update the numbers when use presses the button
  const rentInput = document.querySelector("#Weekly-Amount");
  rentInput.addEventListener("keyup", (event) => {
    const rent = event.target.value;
    const rentError = document.querySelector(".calc_input_error_text");

    if (!isNumeric(rent) || rent < 250) {
      rentError.classList.remove("hide");
      return;
    }

    rentError.classList.add("hide");

    // if we are on mobile - the first time they need to press calculate
    // we can check this by looking at if we are showing the other areas
    // otherwise thereafter it should be constant
    const calcLeftPanel = document.querySelector(".calc_all_details-wrap");
    if (
      calcLeftPanel.classList.contains("is-disabled") &&
      window.matchMedia("(max-width: 478px)").matches
    ) {
      return;
    }

    setupFields(rent);
  });
  // stop the default webflow form handling
  rentInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const result = document.querySelector("#calc-advance-input");
  result.addEventListener("keyup", (event) => {
    // remove the comma's
    const amountStr = event.target.value.replace(/,/g, "");
    if (!isNumeric(rentInput.value) || !isNumeric(amountStr)) {
      return;
    }

    const calRes = calculate(rentInput.value);
    const amount = Number(amountStr);
    if (amount < 10000 || amount > calRes.maxWithdrawal2) {
      return;
    }

    setupFields(rentInput.value, amount);
  });
  // disable enter
  result.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const sliderElem = document.querySelector("#calc-slider");
  sliderElem.addEventListener("input", (event) => {
    // chrome only
    sliderElem.style.background =
      "linear-gradient(to right, #22abbf 0%, #22abbf " +
      event.target.value +
      "%, #eaecf0 " +
      event.target.value +
      "%, #eaecf0 100%)";

    const calRes = calculate(rentInput.value);

    if (event.target.value < 50) {
      console.log("asdsad12 " + event.target.value);
      let val = event.target.value;
      // zero out so we get to min
      if (event.target.value == 1) {
        val = 0;
      }
      const newAmount =
        10000 + (calRes.maxWithdrawal1 - 10000) * ((val * 2) / 100);

      console.log("asdsad " + newAmount);
      setupFields(rentInput.value, newAmount);
      console.log(event.target.value);
    } else {
      const newAmount = calRes.maxWithdrawal2 * (event.target.value / 100);
      console.log("asdsad " + newAmount);
      setupFields(rentInput.value, newAmount);
      console.log(event.target.value);
    }
  });
  const advanceicon = document.querySelector("#calc-advance-icon");
  advanceicon.addEventListener("click", (event) => {
    result.focus();
    result.selectionStart = result.selectionEnd = result.value.length;
  });

  // setup default value on dropdown
  const repaymentSelect = document.querySelector("#repayment-select");
  repaymentSelect.value = "36";
  repaymentSelect.addEventListener("change", (event) => {
    console.log("res: " + result.value);
    setupFields(rentInput.value, Number(result.value.replace(/,/g, "")));
  });
}

setupEventHandlers();

//########### SETUP CHARTS
let monthlyChart;
let totalChart;

function setupCharts() {
  let rentBreakdown = [80, 20];
  const rentBreakdowncolors = ["#f2a876", "#f9d8c7"];
  const rentBreakdowncolors2 = ["#77cedf", "#c7e8ef"];

  // move the charts into parent of parent to account
  // for w-embed div which has 0 size
  const monthlyChartCanvas = document.getElementById("monthlyChart");
  const totalChartCanvas = document.getElementById("totalChart");
  monthlyChartCanvas.parentNode.parentNode.appendChild(monthlyChartCanvas);
  totalChartCanvas.parentNode.parentNode.appendChild(totalChartCanvas);
  monthlyChartCanvas.style.display = "none";
  totalChartCanvas.style.display = "none";

  monthlyChart = new Chart(monthlyChartCanvas, {
    type: "doughnut",
    options: {
      cutout: "86%",
      animation: {
        duration: 0
      },
      hover: { mode: null },
      layout: {
        padding: -10
      },
      plugins: {
        tooltip: {
          enabled: false
        }
      },
      elements: {
        arc: {
          borderWidth: 0,
          borderJoinStyle: "bevel"
        }
      }
    },
    data: {
      datasets: [
        {
          backgroundColor: rentBreakdowncolors,
          data: rentBreakdown,
          borderAlign: "inner",
          borderJoinStyle: "round",
          borderRadius: [5, 5],
          borderWidth: [0, 0]
        }
      ]
    }
  });

  totalChart = new Chart(totalChartCanvas, {
    type: "doughnut",
    options: {
      cutout: "86%",
      animation: {
        duration: 0
      },
      hover: { mode: null },
      layout: {
        padding: -10
      },
      plugins: {
        tooltip: {
          enabled: false
        }
      },
      elements: {
        arc: {
          borderWidth: 0,
          borderJoinStyle: "bevel"
        }
      }
    },
    data: {
      datasets: [
        {
          backgroundColor: rentBreakdowncolors2,
          data: rentBreakdown,
          borderAlign: "inner",
          borderJoinStyle: "round",
          borderRadius: [5, 5],
          borderWidth: [0, 0]
        }
      ]
    }
  });
}
setupCharts();

function updateCharts(
  monthlyRepayment,
  monthlyRemainingToYou,
  totalAdvanced,
  totalMargin
) {
  console.log("updating chart");
  let monthlyTotal = monthlyRepayment + monthlyRemainingToYou;
  let total = totalAdvanced + totalMargin;

  let monthlyBreakdown = [
    (monthlyRepayment / monthlyTotal) * 100,
    (monthlyRemainingToYou / monthlyTotal) * 100
  ];
  let totalBreakdown = [
    (totalAdvanced / total) * 100,
    (totalMargin / total) * 100
  ];

  monthlyChart.data.datasets[0].data.pop();
  monthlyChart.data.datasets[0].data = monthlyBreakdown;
  totalChart.data.datasets[0].data.pop();
  totalChart.data.datasets[0].data = totalBreakdown;
  monthlyChart.update();
  totalChart.update();
}

function setupApplyNowButtonHomepage(weeklyRent, amount, term) {
  console.log("setting up apply now");
  // if we are on the homepage and we need to setup apply button with correct parameters
  if (window.location.href.indexOf("internal-calculator") == -1) {
    const applyNowBtn = document.getElementById("calc-apply-now");
    applyNowBtn.href =
      "https://get.stg.futurerent.com.au/your-details?weeklyRent=" +
      weeklyRent +
      "&amount=" +
      amount +
      "&term=" +
      term;
  }
}

function setupCalculatorButtonsInternalCalculator() {
  // Also do setup on calculate button
  const calculateBtn = document.querySelector("#calc_calculate");
  calculateBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const rentInput = document.querySelector("#Weekly-Amount");
    const rent = rentInput.value;
    const rentError = document.querySelector(".calc_input_error_text");

    if (!isNumeric(rent) || rent < 250) {
      rentError.classList.remove("hide");
      return;
    }
    rentError.classList.add("hide");
    setupFields(rent);
  });

  // SETUP APPLICATION HANDLING
  if (window.location.href.indexOf("internal-calculator") != -1) {
    const applyNowBtn = document.getElementById("calc-apply-now");
    const talkToSomeoneBtn = document.getElementById("calc-talk-to-someone");

    applyNowBtn.innerHTML = "Next";
    applyNowBtn.addEventListener("click", (event) => {
      window.parent.postMessage("next", applicationHost);
      event.preventDefault();
    });

    talkToSomeoneBtn.addEventListener("click", (event) => {
      window.parent.postMessage("talk", applicationHost);
      event.preventDefault();
    });

    const rentInput = document.querySelector("#Weekly-Amount");
    const repaymentSelect = document.querySelector("#repayment-select");

    const applicationHandler = (event) => {
      if (event.origin !== applicationHost) {
        return;
      }
      rentInput.value = event.data.rent;
      repaymentSelect.value = event.data.term;
      setupFields(event.data.rent, event.data.amount);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", applicationHandler, false);
      window.parent.postMessage("loaded", applicationHost);
    }

    // NOTE - this only works if the iframe is not hidden
    // will be 0
    // remove sections for mobile
    if (window.matchMedia("(max-width: 478px)").matches) {
      console.log("mobile viewport");

      const calcRentWrap = document.getElementById("calc-rent-wrap");
      const calcTitleWrap = document.getElementById("calc-title");

      calcRentWrap.style.display = "none";
      calcTitleWrap.style.display = "none";

      const calcTopLeftWrap = document.querySelector(".calc_top-wrap-left");
      calcTopLeftWrap.style.paddingTop = 0;
    }
  }
}
setupCalculatorButtonsInternalCalculator();
