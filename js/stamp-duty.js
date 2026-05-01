export function calcStampDuty(price, state, isFHB, propertyType, waRegion = 'metro') {
  let duty = 0;
  let fhbSaving = 0;
  let grantText = '';

  const fmt = n => '$' + Math.round(n).toLocaleString('en-AU');

  if (state === 'WA') {
    if (price <= 120000) duty = price * 0.019;
    else if (price <= 150000) duty = 2280 + (price - 120000) * 0.0285;
    else if (price <= 360000) duty = 3135 + (price - 150000) * 0.038;
    else if (price <= 725000) duty = 11115 + (price - 360000) * 0.0475;
    else duty = 28453 + (price - 725000) * 0.0515;

    if (isFHB) {
      const isRegional = waRegion === 'regional';
      const concessionCap = isRegional ? 750000 : 700000;
      const locationLabel = isRegional ? 'Regional WA' : 'Metro/Peel Perth';

      if (price <= 500000) {
        fhbSaving = duty; duty = 0;
        grantText = 'Full stamp duty exemption (' + locationLabel + ') — you save ' + fmt(fhbSaving) + '. Also eligible for the $10,000 First Home Owner Grant on new builds under $750k.';
      } else if (price <= concessionCap) {
        const concession = duty * ((concessionCap - price) / (concessionCap - 500000));
        fhbSaving = concession;
        duty -= concession;
        grantText = 'Partial stamp duty concession applied (' + locationLabel + ', effective March 2025) — you save ' + fmt(fhbSaving) + '. Eligible for $10,000 FHOG on new builds under $750k.';
      } else {
        grantText = 'Above the ' + locationLabel + ' concession threshold (' + fmt(concessionCap) + '). Full duty applies. Eligible for $10,000 FHOG on new builds under $750k.';
      }
    }
  }

  else if (state === 'NSW') {
    if (price <= 14000) duty = price * 0.0125;
    else if (price <= 32000) duty = 175 + (price - 14000) * 0.015;
    else if (price <= 85000) duty = 445 + (price - 32000) * 0.0175;
    else if (price <= 319000) duty = 1372.50 + (price - 85000) * 0.035;
    else if (price <= 1064000) duty = 9556.50 + (price - 319000) * 0.045;
    else if (price <= 3101000) duty = 43050 + (price - 1064000) * 0.055;
    else duty = 155170 + (price - 3101000) * 0.07;

    if (isFHB) {
      if (price <= 800000) {
        fhbSaving = duty; duty = 0;
        grantText = 'Full stamp duty exemption — you save ' + fmt(fhbSaving) + '. Eligible for $10,000 FHOG on new homes under $750k.';
      } else if (price <= 1000000) {
        const concession = duty * ((1000000 - price) / 200000);
        fhbSaving = concession;
        duty -= concession;
        grantText = 'Partial concession applied — saving ' + fmt(fhbSaving) + '. Eligible for $10,000 FHOG on new homes.';
      } else {
        grantText = 'Above concession threshold ($1M). Full duty applies.';
      }
    }
  }

  else if (state === 'VIC') {
    if (price <= 25000) duty = price * 0.014;
    else if (price <= 130000) duty = 350 + (price - 25000) * 0.024;
    else if (price <= 960000) duty = 2870 + (price - 130000) * 0.06;
    else if (price <= 2000000) duty = 52670 + (price - 960000) * 0.065;
    else duty = 120270 + (price - 2000000) * 0.065;

    if (isFHB) {
      if (price <= 600000) {
        fhbSaving = duty; duty = 0;
        grantText = 'Full stamp duty exemption — you save ' + fmt(fhbSaving) + '. Eligible for $10,000 FHOG on new homes.';
      } else if (price <= 750000) {
        const concession = duty * ((750000 - price) / 150000);
        fhbSaving = concession;
        duty -= concession;
        grantText = 'Partial concession applied — saving ' + fmt(fhbSaving) + '.';
      } else {
        grantText = 'Above concession threshold ($750k). Full duty applies.';
      }
    }
  }

  else if (state === 'QLD') {
    if (price <= 5000) duty = 0;
    else if (price <= 75000) duty = (price - 5000) * 0.015;
    else if (price <= 540000) duty = 1050 + (price - 75000) * 0.035;
    else if (price <= 1000000) duty = 17325 + (price - 540000) * 0.045;
    else duty = 38025 + (price - 1000000) * 0.0575;

    if (isFHB) {
      if (propertyType !== 'house' || price <= 700000) {
        const rebate = Math.min(duty, 8750);
        fhbSaving = rebate;
        duty = Math.max(0, duty - rebate);
        grantText = 'First Home Concession applied — saving up to ' + fmt(fhbSaving) + '. Also eligible for $30,000 FHOG on new builds (until June 2026).';
      } else {
        grantText = 'Eligible for $30,000 FHOG on new builds (until June 2026).';
      }
    }
  }

  else if (state === 'SA') {
    if (price <= 12000) duty = price * 0.01;
    else if (price <= 30000) duty = 120 + (price - 12000) * 0.02;
    else if (price <= 50000) duty = 480 + (price - 30000) * 0.03;
    else if (price <= 100000) duty = 1080 + (price - 50000) * 0.035;
    else if (price <= 200000) duty = 2830 + (price - 100000) * 0.04;
    else if (price <= 250000) duty = 6830 + (price - 200000) * 0.0425;
    else if (price <= 300000) duty = 8955 + (price - 250000) * 0.0475;
    else if (price <= 500000) duty = 11330 + (price - 300000) * 0.05;
    else duty = 21330 + (price - 500000) * 0.055;

    if (isFHB && (propertyType === 'house' || propertyType === 'townhouse' || propertyType === 'apartment')) {
      fhbSaving = duty; duty = 0;
      grantText = 'Full stamp duty exemption on new homes — unlimited price cap in SA! You save ' + fmt(fhbSaving) + '. Plus eligible for $15,000 FHOG.';
    }
  }

  else if (state === 'TAS') {
    if (price <= 3000) duty = price * 0.015;
    else if (price <= 25000) duty = 45 + (price - 3000) * 0.02;
    else if (price <= 75000) duty = 485 + (price - 25000) * 0.025;
    else if (price <= 200000) duty = 1735 + (price - 75000) * 0.03;
    else if (price <= 375000) duty = 5485 + (price - 200000) * 0.035;
    else if (price <= 725000) duty = 11610 + (price - 375000) * 0.04;
    else duty = 25610 + (price - 725000) * 0.045;

    if (isFHB && price <= 750000) {
      fhbSaving = duty; duty = 0;
      grantText = 'Full stamp duty exemption until June 2026 — you save ' + fmt(fhbSaving) + '. Plus $10,000 FHOG on new homes.';
    }
  }

  else if (state === 'ACT') {
    if (price <= 260000) duty = price * 0.0049;
    else if (price <= 300000) duty = 1274 + (price - 260000) * 0.037;
    else if (price <= 500000) duty = 2754 + (price - 300000) * 0.0475;
    else if (price <= 750000) duty = 12254 + (price - 500000) * 0.055;
    else if (price <= 1000000) duty = 26004 + (price - 750000) * 0.059;
    else if (price <= 1455000) duty = 40754 + (price - 1000000) * 0.063;
    else duty = price * 0.0454;

    if (isFHB && price <= 1020000) {
      fhbSaving = duty; duty = 0;
      grantText = 'Full duty exemption via Home Buyer Concession Scheme — you save ' + fmt(fhbSaving) + '. Income tested: under $160k (single) or $227k (couple).';
    }
  }

  else if (state === 'NT') {
    const v = price;
    duty = ((0.06571441 * v / 1000 + 15) * v / 1000);
    if (price <= 525000) duty = Math.max(duty, price * 0.015);

    if (isFHB) {
      const discount = Math.min(duty, 18601);
      fhbSaving = discount;
      duty -= discount;
      grantText = 'First Home Owner Discount applied — saving ' + fmt(fhbSaving) + '. Plus $10,000 FHOG and $2,000 household goods grant on new builds.';
    }
  }

  return { duty: Math.max(0, duty), grantText, fhbSaving };
}
