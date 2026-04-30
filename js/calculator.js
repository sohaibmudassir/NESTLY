import { calcStampDuty } from './stamp-duty.js';

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-AU');
}

function calcLMI(price, deposit) {
  const lvr = (price - deposit) / price;
  if (lvr <= 0.8) return { lmi: 0, applies: false };

  let rate;
  if (lvr <= 0.85) rate = 0.0072;
  else if (lvr <= 0.90) rate = 0.0144;
  else if (lvr <= 0.95) rate = 0.0234;
  else rate = 0.0360;

  const loanAmount = price - deposit;
  return { lmi: loanAmount * rate, applies: true, lvr: Math.round(lvr * 100) };
}

function toggleFHB() {
  const cb = document.getElementById('fhb');
  cb.checked = !cb.checked;
}

function toggleStrata() {
  const cb = document.getElementById('strata');
  cb.checked = !cb.checked;
}

function calculate() {
  const price = parseFloat(document.getElementById('price').value);
  const deposit = parseFloat(document.getElementById('deposit').value) || price * 0.2;
  const state = document.getElementById('state').value;
  const isFHB = document.getElementById('fhb').checked;
  const propertyType = document.getElementById('property-type').value;
  const includeStrata = document.getElementById('strata').checked;

  if (!price || price < 10000) {
    alert('Please enter a valid property price.');
    return;
  }
  if (!state) {
    alert('Please select your state or territory.');
    return;
  }

  const { duty, grantText, fhbSaving } = calcStampDuty(price, state, isFHB, propertyType);
  const { lmi, applies: lmiApplies, lvr } = calcLMI(price, deposit);

  const conveyancing = 2200;
  const pestInspection = propertyType !== 'land' ? 550 : 0;
  const councilRates = Math.round(price * 0.003);
  const strataLevy = includeStrata ? Math.round(price * 0.008) : 0;

  const extraCosts = duty + lmi + conveyancing + pestInspection + councilRates + strataLevy;
  const totalCost = price + extraCosts;

  document.getElementById('total-display').textContent = fmt(totalCost);
  document.getElementById('extra-display').innerHTML =
    'Asking price ' + fmt(price) + ' + <span>' + fmt(extraCosts) + ' in additional costs</span>';

  const grantEl = document.getElementById('grant-alert');
  if (grantText) {
    document.getElementById('grant-text').textContent = grantText;
    grantEl.classList.add('visible');
  } else {
    grantEl.classList.remove('visible');
  }

  const lmiEl = document.getElementById('lmi-alert');
  if (lmiApplies) {
    document.getElementById('lmi-text').textContent =
      'Your LVR is ' + lvr + '% — above the 80% threshold. LMI of ' + fmt(lmi) +
      ' applies. Consider the First Home Guarantee Scheme (5% deposit, no LMI) if eligible.';
    lmiEl.classList.add('visible');
  } else {
    lmiEl.classList.remove('visible');
  }

  const items = [
    { name: 'Property price', amount: price, dot: '#1C1C1A' },
    { name: 'Stamp duty' + (isFHB && fhbSaving > 0 ? ' (concession applied)' : ''), amount: duty, dot: '#D85A30', zero: duty === 0 },
    { name: "Lender's Mortgage Insurance (LMI)", amount: lmi, dot: '#BA7517', zero: lmi === 0, hide: lmi === 0 },
    { name: 'Conveyancing & legal fees (est.)', amount: conveyancing, dot: '#378ADD' },
  ];

  if (propertyType !== 'land') {
    items.push({ name: 'Building & pest inspection (est.)', amount: pestInspection, dot: '#7F77DD' });
  }

  items.push({ name: 'Council rates — first year (est.)', amount: councilRates, dot: '#639922' });

  if (includeStrata) {
    items.push({ name: 'Strata / body corporate levy — year 1 (est.)', amount: strataLevy, dot: '#1D9E75' });
  }

  const list = document.getElementById('breakdown-list');
  list.innerHTML = '';

  items.forEach((item, i) => {
    if (item.hide) return;
    const div = document.createElement('div');
    div.className = 'breakdown-item result-row-animate';
    div.style.animationDelay = (i * 0.04) + 's';
    div.innerHTML = `
      <span class="name">
        <span class="dot" style="background:${item.dot}"></span>
        ${item.name}
      </span>
      <span class="amount ${item.zero ? 'zero' : ''}">${item.zero ? '$0 ✓' : fmt(item.amount)}</span>
    `;
    list.appendChild(div);
  });

  document.getElementById('breakdown-total-display').textContent = fmt(totalCost);

  const resultsEl = document.getElementById('results');
  resultsEl.classList.add('visible');
  setTimeout(() => {
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Expose functions needed by inline HTML onclick handlers
window.toggleFHB = toggleFHB;
window.toggleStrata = toggleStrata;
window.calculate = calculate;

// Show/hide strata row based on property type
document.getElementById('property-type').addEventListener('change', function () {
  const strataRow = document.getElementById('strata-row');
  if (this.value === 'apartment' || this.value === 'townhouse') {
    strataRow.style.display = 'flex';
    document.getElementById('strata').checked = true;
  } else {
    strataRow.style.display = 'none';
    document.getElementById('strata').checked = false;
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') calculate();
});
