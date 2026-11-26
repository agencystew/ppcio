/******************************************************************************
 * DAILY ACCOUNT MONITOR (MCC)
 *
 * Purpose: Daily spend & budget monitoring across all accounts in a Manager
 *          Account. Alerts on spend anomalies, deactivated accounts, and
 *          budget pacing issues via email and Slack.
 * Author:  Agency MCC Template
 * Version: 1.2
 * Updated: 2026-05-06
 *
 * USE CASE: "Alert me when an account stops spending or is about to blow budget"
 *
 * SETUP INSTRUCTIONS:
 * 1. Install this script in your MCC (Manager Account), NOT a child account
 * 2. Add your email address(es) to EMAIL_RECIPIENTS below
 * 3. (Optional) Paste a Slack Incoming Webhook URL into SLACK_WEBHOOK_URL
 * 4. (Optional) Set SPREADSHEET_URL to 'CREATE_NEW' for a tracking dashboard
 * 5. (Optional) Add accounts to EXCLUDED_ACCOUNT_NAMES to skip them
 * 6. (Optional) Add hard monthly budgets to HARD_BUDGETS to override inference
 * 7. Run once in Preview to verify output, then schedule daily (8am recommended)
 *
 * WHAT YOU GET:
 * - Email every morning with alerts at top + full account summary table
 * - Slack message (if configured) with just the alerts
 * - Google Sheet (if configured) with daily snapshots and history
 *
 * ALERTS TRIGGERED:
 * - CRITICAL: Account spent $0 yesterday when it normally spends (deactivation)
 * - WARNING:  Spend dropped >50% vs 7-day average
 * - WARNING:  Budget pacing >110% of expected with 5+ days left in month
 * - WARNING:  Budget pacing <50% of expected after day 10
 *
 * BUDGET LOGIC:
 * Monthly budget is INFERRED by default as (sum of enabled campaign daily
 * budgets) x (days in month). For accounts with set-in-stone monthly budgets,
 * add an entry to CONFIG.HARD_BUDGETS keyed by account name. Hard budgets
 * render bold and unmarked in the email; inferred budgets render italic, gray,
 * and suffixed "(est.)".
 *
 * CHANGELOG:
 * v1.2 - 2026-05-06: Populated HARD_BUDGETS from Nick's Japan handoff doc:
 *        TelyRx ($2.27M Google), Carepod ($65K), Malbon ($138,688). All other
 *        accounts stay inferred per Nick: "fluid budgets based on performance,
 *        just track the average."
 * v1.1 - 2026-04-27: Added EXCLUDED_ACCOUNT_NAMES (drop Edwin Jewel + Digital
 *        Evidence Ventures), added HARD_BUDGETS override map, added Monthly
 *        Budget column to email with hard vs inferred visual distinction.
 * v1.0 - Initial release
 *
 ******************************************************************************/

// =============================================================================
// CONFIGURATION
// =============================================================================

var CONFIG = {
  // ---- Output ----
  // Japan-coverage roster. Sergio is the primary watcher during Nick's trip;
  // Replace with your team email addresses before scheduling:
  EMAIL_RECIPIENTS: [
    'ACCOUNT_MANAGER_EMAIL_HERE',     // <-- REPLACE THIS with Sergio's email
    'alerts@youragency.com',
    'lead@youragency.com'
  ],
  SLACK_WEBHOOK_URL: '',               // Slack Incoming Webhook URL (empty = skip)
  SPREADSHEET_URL: '',                 // '' = no sheet, 'CREATE_NEW' = create, or paste URL

  // ---- Alert Thresholds ----
  ZERO_SPEND_AVG_MIN: 10,             // Only flag $0 days if 7d avg is above this
  SPEND_DROP_PCT: 50,                  // % drop from 7d avg to trigger warning
  OVERPACE_PCT: 110,                   // Pacing index % to trigger overpace warning
  UNDERPACE_PCT: 50,                   // Pacing index % to trigger underpace warning
  OVERPACE_MIN_DAYS_LEFT: 5,          // Only warn overpacing if this many days remain
  UNDERPACE_MIN_DAY: 10,              // Only warn underpacing after this day of month

  // ---- Account Filtering ----
  ACCOUNT_LABEL: '',                   // Only monitor accounts with this label (empty = all)

  // Skip these accounts entirely. Match is case-insensitive substring on the
  // MCC account name. Keep entries short and unambiguous.
  EXCLUDED_ACCOUNT_NAMES: [
    'Edwin Jewel',                    // Nick: stop notifying me on this one
    'Digital Evidence Ventures'       // Nick: friend's account, not managed by us
  ],

  // ---- Monthly Budget Overrides ----
  // Keys are MCC account names exactly as they appear in Google Ads. Values
  // are the hard monthly budget in account currency. Anything not listed here
  // is INFERRED from sum-of-daily-budgets x days-in-month. Hard values render
  // bold in the email; inferred values render italic + gray + "(est.)".
  //
  // Source: Nick's Japan handoff doc (2026-05-06). Per Nick: "only three
  // accounts with hard budgets, the rest have fluid budgets based on
  // performance and we just need to track the average." TelyRx also runs
  // $171K/mo on Bing -- not tracked here, this script is Google-only.
  // If a name below doesn't match the MCC display name exactly, the override
  // silently falls back to inferred -- check spelling against the email's
  // first run.
  HARD_BUDGETS: {
    '{active} TelyRx': 2270000,   // MCC name has the "{active}" prefix; verified 2026-05-06
    'Carepod': 65000,
    'Malbon': 138688
  },

  // ---- Execution ----
  LOG_LEVEL: 'INFO',                   // DEBUG, INFO, WARN, ERROR
  TIME_LIMIT_MINUTES: 25,
  SEND_ALL_CLEAR: true                 // Send email even when no alerts (daily dashboard)
};


// =============================================================================
// ENTRY POINT
// =============================================================================

function main() {
  log('INFO', 'Daily Account Monitor started');

  var accounts = AdsManagerApp.accounts();

  if (CONFIG.ACCOUNT_LABEL) {
    accounts = accounts.withCondition("LabelNames CONTAINS '" + CONFIG.ACCOUNT_LABEL + "'");
  }

  // Apply name-based exclusions. Each withCondition is AND-ed, so listing
  // multiple excluded names just chains them.
  for (var i = 0; i < CONFIG.EXCLUDED_ACCOUNT_NAMES.length; i++) {
    var excludedName = CONFIG.EXCLUDED_ACCOUNT_NAMES[i];
    accounts = accounts.withCondition(
      'Name DOES_NOT_CONTAIN_IGNORE_CASE "' + excludedName + '"'
    );
    log('INFO', 'Excluding accounts matching: ' + excludedName);
  }

  accounts.executeInParallel('processAccount', 'buildReport');
}


// =============================================================================
// ACCOUNT PROCESSING (runs once per account, in parallel)
// =============================================================================

function processAccount() {
  var account = AdsApp.currentAccount();
  var result = {
    name: account.getName(),
    id: account.getCustomerId(),
    yesterdaySpend: 0,
    weekAvg: 0,
    mtdSpend: 0,
    dailyBudget: 0,
    error: null
  };

  try {
    result.yesterdaySpend = getAccountSpend('YESTERDAY');
    var weekTotal = getAccountSpend('LAST_7_DAYS');
    result.weekAvg = weekTotal / 7;
    result.mtdSpend = getAccountSpend('THIS_MONTH');
    result.dailyBudget = getTotalDailyBudget();
  } catch (e) {
    result.error = e.message;
    log('ERROR', account.getName() + ': ' + e.message);
  }

  return JSON.stringify(result);
}


/**
 * Sum total spend across all non-removed campaigns for a date range.
 * Uses GAQL with object-API fallback.
 */
function getAccountSpend(dateRange) {
  try {
    return getAccountSpendGAQL(dateRange);
  } catch (e) {
    log('WARN', 'GAQL failed for spend (' + dateRange + '), using fallback: ' + e.message);
    return getAccountSpendFallback(dateRange);
  }
}

function getAccountSpendGAQL(dateRange) {
  var query = 'SELECT metrics.cost_micros FROM campaign ' +
              'WHERE campaign.status != "REMOVED" ' +
              'AND segments.date DURING ' + dateRange;
  var rows = AdsApp.search(query);
  var total = 0;
  while (rows.hasNext()) {
    total += rows.next().metrics.costMicros / 1000000;
  }
  return total;
}

function getAccountSpendFallback(dateRange) {
  var total = 0;
  var campaigns = AdsApp.campaigns()
    .withCondition('Status != REMOVED')
    .get();
  while (campaigns.hasNext()) {
    total += campaigns.next().getStatsFor(dateRange).getCost();
  }
  return total;
}


/**
 * Sum unique daily budgets across all enabled campaigns.
 * De-duplicates shared budgets by resource name.
 */
function getTotalDailyBudget() {
  try {
    return getTotalDailyBudgetGAQL();
  } catch (e) {
    log('WARN', 'GAQL failed for budgets, using fallback: ' + e.message);
    return getTotalDailyBudgetFallback();
  }
}

function getTotalDailyBudgetGAQL() {
  var query = 'SELECT campaign_budget.resource_name, campaign_budget.amount_micros ' +
              'FROM campaign WHERE campaign.status = "ENABLED"';
  var rows = AdsApp.search(query);
  var seen = {};
  while (rows.hasNext()) {
    var row = rows.next();
    seen[row.campaignBudget.resourceName] = row.campaignBudget.amountMicros / 1000000;
  }
  var total = 0;
  for (var key in seen) { total += seen[key]; }
  return total;
}

function getTotalDailyBudgetFallback() {
  var seen = {};
  var campaigns = AdsApp.campaigns().withCondition('Status = ENABLED').get();
  while (campaigns.hasNext()) {
    var budget = campaigns.next().getBudget();
    if (budget) { seen[budget.getId()] = budget.getAmount(); }
  }
  var total = 0;
  for (var key in seen) { total += seen[key]; }
  return total;
}


// =============================================================================
// REPORT BUILDING (runs once after all accounts finish)
// =============================================================================

function buildReport(results) {
  // -- Parse results --
  var accounts = [];
  var errors = [];

  for (var i = 0; i < results.length; i++) {
    if (results[i].getStatus() === 'OK') {
      var parsed = JSON.parse(results[i].getReturnValue());
      if (parsed.error) {
        errors.push({ name: parsed.name, id: parsed.id, error: parsed.error });
      }
      accounts.push(parsed);
    } else {
      errors.push({
        name: 'Account ' + results[i].getCustomerId(),
        id: results[i].getCustomerId(),
        error: results[i].getError() || 'Unknown error'
      });
    }
  }

  if (accounts.length === 0) {
    log('WARN', 'No accounts processed. Check MCC access and labels.');
    return;
  }

  // -- Date info --
  var today = new Date();
  var dayOfMonth = today.getDate();
  var daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  var daysLeft = daysInMonth - dayOfMonth;
  var dateStr = formatDateHuman(today);

  var dateInfo = {
    dayOfMonth: dayOfMonth,
    daysInMonth: daysInMonth,
    daysLeft: daysLeft,
    dateStr: dateStr
  };

  // -- Derived metrics --
  for (var j = 0; j < accounts.length; j++) {
    var a = accounts[j];

    // Spend change vs 7-day average
    if (a.weekAvg > 0) {
      a.changePct = ((a.yesterdaySpend - a.weekAvg) / a.weekAvg) * 100;
    } else {
      a.changePct = 0;
    }

    // Monthly budget. Hard override wins; otherwise infer from daily budgets.
    var hard = CONFIG.HARD_BUDGETS[a.name];
    if (typeof hard === 'number' && hard > 0) {
      a.monthlyBudget = hard;
      a.budgetType = 'hard';
    } else {
      a.monthlyBudget = a.dailyBudget * daysInMonth;
      a.budgetType = 'inferred';
    }

    // Budget pacing
    if (a.monthlyBudget > 0 && dayOfMonth > 0) {
      a.pacingPct = (a.mtdSpend / a.monthlyBudget) * 100;
      var expectedPct = (dayOfMonth / daysInMonth) * 100;
      a.pacingIndex = (expectedPct > 0) ? (a.pacingPct / expectedPct) * 100 : 0;
    } else {
      a.pacingPct = 0;
      a.pacingIndex = 0;
    }

    a.alertLevel = 'ok';
  }

  // -- Classify alerts --
  var alerts = classifyAlerts(accounts, dateInfo);

  // -- Sort: critical first, then warning, then by yesterday spend desc --
  var levelOrder = { critical: 0, warning: 1, ok: 2 };
  accounts.sort(function(a, b) {
    var diff = levelOrder[a.alertLevel] - levelOrder[b.alertLevel];
    if (diff !== 0) return diff;
    return b.yesterdaySpend - a.yesterdaySpend;
  });

  // -- Build outputs --
  var totalAlerts = alerts.critical.length + alerts.warning.length;

  if (totalAlerts === 0 && !CONFIG.SEND_ALL_CLEAR) {
    log('INFO', 'No alerts. SEND_ALL_CLEAR is off. Skipping notifications.');
    return;
  }

  var emailHtml = buildEmailHtml(accounts, alerts, dateInfo, errors);
  var plainText = buildPlainText(accounts, alerts, dateInfo, errors);
  var sheetUrl = '';

  // -- Update sheet first so we can link from email --
  if (CONFIG.SPREADSHEET_URL) {
    sheetUrl = updateSheet(accounts, dateInfo);
  }

  // -- Send notifications --
  sendEmail(emailHtml, plainText, totalAlerts, dateStr, accounts.length, sheetUrl);
  sendSlack(accounts, alerts, dateInfo, sheetUrl);

  log('INFO', 'Report complete. ' + accounts.length + ' accounts, ' + totalAlerts + ' alerts.');
}


// =============================================================================
// ALERT CLASSIFICATION
// =============================================================================

function classifyAlerts(accounts, dateInfo) {
  var alerts = { critical: [], warning: [] };

  for (var i = 0; i < accounts.length; i++) {
    var a = accounts[i];
    if (a.error) continue;

    // CRITICAL: Zero spend when account normally spends
    if (a.yesterdaySpend === 0 && a.weekAvg >= CONFIG.ZERO_SPEND_AVG_MIN) {
      alerts.critical.push({
        name: a.name,
        message: a.name + ': $0 spend yesterday (normally ' + formatCurrency(a.weekAvg) + '/day)'
      });
      a.alertLevel = 'critical';
      continue;
    }

    // WARNING: Big spend drop
    if (a.changePct <= -CONFIG.SPEND_DROP_PCT && a.weekAvg >= CONFIG.ZERO_SPEND_AVG_MIN) {
      alerts.warning.push({
        name: a.name,
        message: a.name + ': Spend down ' + Math.abs(a.changePct).toFixed(0) + '% (' +
                 formatCurrency(a.yesterdaySpend) + ' vs ' + formatCurrency(a.weekAvg) + ' avg)'
      });
      a.alertLevel = 'warning';
    }

    // WARNING: Overpacing
    if (a.pacingIndex > CONFIG.OVERPACE_PCT && dateInfo.daysLeft >= CONFIG.OVERPACE_MIN_DAYS_LEFT) {
      alerts.warning.push({
        name: a.name,
        message: a.name + ': ' + a.pacingPct.toFixed(0) + '% of budget used with ' +
                 dateInfo.daysLeft + ' days left'
      });
      if (a.alertLevel !== 'critical') a.alertLevel = 'warning';
    }

    // WARNING: Underpacing
    if (a.pacingIndex > 0 && a.pacingIndex < CONFIG.UNDERPACE_PCT &&
        dateInfo.dayOfMonth >= CONFIG.UNDERPACE_MIN_DAY && a.monthlyBudget > 0) {
      alerts.warning.push({
        name: a.name,
        message: a.name + ': Only ' + a.pacingPct.toFixed(0) + '% of budget used at day ' +
                 dateInfo.dayOfMonth
      });
      if (a.alertLevel !== 'critical') a.alertLevel = 'warning';
    }
  }

  return alerts;
}


// =============================================================================
// HTML EMAIL
// =============================================================================

function buildEmailHtml(accounts, alerts, dateInfo, errors) {
  var totalAlerts = alerts.critical.length + alerts.warning.length;
  var html = [];

  html.push('<div style="font-family:Arial,Helvetica,sans-serif;max-width:720px;margin:0 auto;background:#ffffff;">');

  // -- Header --
  html.push('<div style="background:#1e293b;padding:24px 28px;">');
  html.push('<h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;">Daily Ads Monitor</h1>');
  html.push('<p style="color:#94a3b8;margin:4px 0 0;font-size:14px;">' + dateInfo.dateStr +
            ' &nbsp;|&nbsp; ' + accounts.length + ' accounts</p>');
  html.push('</div>');

  // -- Alert cards --
  if (totalAlerts > 0) {
    html.push('<div style="padding:20px 28px 4px;">');

    for (var c = 0; c < alerts.critical.length; c++) {
      html.push('<div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px 16px;margin-bottom:10px;border-radius:0 4px 4px 0;">');
      html.push('<span style="color:#dc2626;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Critical</span>');
      html.push('<p style="margin:4px 0 0;color:#1e293b;font-size:14px;">' + escapeHtml(alerts.critical[c].message) + '</p>');
      html.push('</div>');
    }

    for (var w = 0; w < alerts.warning.length; w++) {
      html.push('<div style="background:#fffbeb;border-left:4px solid #d97706;padding:12px 16px;margin-bottom:10px;border-radius:0 4px 4px 0;">');
      html.push('<span style="color:#d97706;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Warning</span>');
      html.push('<p style="margin:4px 0 0;color:#1e293b;font-size:14px;">' + escapeHtml(alerts.warning[w].message) + '</p>');
      html.push('</div>');
    }

    html.push('</div>');
  } else {
    html.push('<div style="padding:20px 28px 4px;">');
    html.push('<div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:12px 16px;border-radius:0 4px 4px 0;">');
    html.push('<span style="color:#16a34a;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">All Clear</span>');
    html.push('<p style="margin:4px 0 0;color:#1e293b;font-size:14px;">All ' + accounts.length + ' accounts spending normally.</p>');
    html.push('</div>');
    html.push('</div>');
  }

  // -- Error cards (if any accounts failed) --
  if (errors.length > 0) {
    html.push('<div style="padding:0 28px 4px;">');
    html.push('<div style="background:#f8fafc;border-left:4px solid #64748b;padding:12px 16px;margin-bottom:10px;border-radius:0 4px 4px 0;">');
    html.push('<span style="color:#64748b;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">' +
              errors.length + ' Account Error' + (errors.length > 1 ? 's' : '') + '</span>');
    for (var e = 0; e < errors.length; e++) {
      html.push('<p style="margin:4px 0 0;color:#64748b;font-size:13px;">' +
                escapeHtml(errors[e].name) + ': ' + escapeHtml(errors[e].error) + '</p>');
    }
    html.push('</div></div>');
  }

  // -- Accounts table --
  html.push('<div style="padding:8px 28px 28px;">');
  html.push('<table style="width:100%;border-collapse:collapse;font-size:13px;">');

  // Table header
  var thStyle = 'padding:10px 6px;text-align:right;border-bottom:2px solid #e2e8f0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;';
  html.push('<thead><tr>');
  html.push('<th style="' + thStyle + 'text-align:left;">Account</th>');
  html.push('<th style="' + thStyle + '">Yesterday</th>');
  html.push('<th style="' + thStyle + '">7d Avg</th>');
  html.push('<th style="' + thStyle + '">vs Avg</th>');
  html.push('<th style="' + thStyle + '">MTD</th>');
  html.push('<th style="' + thStyle + '">Monthly Budget</th>');
  html.push('<th style="' + thStyle + '">Pacing</th>');
  html.push('</tr></thead>');

  // Table rows
  html.push('<tbody>');
  for (var r = 0; r < accounts.length; r++) {
    var acct = accounts[r];
    var rowBg = '#ffffff';
    if (acct.alertLevel === 'critical') rowBg = '#fef2f2';
    else if (acct.alertLevel === 'warning') rowBg = '#fffbeb';
    else if (r % 2 === 1) rowBg = '#f8fafc';

    var tdStyle = 'padding:9px 6px;text-align:right;border-bottom:1px solid #f1f5f9;';

    // vs Avg color
    var changeColor = '#64748b';
    if (acct.changePct <= -50) changeColor = '#dc2626';
    else if (acct.changePct < -10) changeColor = '#d97706';
    else if (acct.changePct > 10) changeColor = '#16a34a';

    // Pacing color
    var pacingColor = '#1e293b';
    if (acct.pacingIndex > 115 && dateInfo.daysLeft >= 5) pacingColor = '#dc2626';
    else if (acct.pacingIndex < 50 && dateInfo.dayOfMonth >= 10 && acct.monthlyBudget > 0) pacingColor = '#d97706';
    else if (acct.pacingIndex >= 85 && acct.pacingIndex <= 115) pacingColor = '#16a34a';

    // Change display
    var changeStr = '';
    if (acct.weekAvg === 0) {
      changeStr = '-';
      changeColor = '#94a3b8';
    } else {
      var sign = acct.changePct > 0 ? '+' : '';
      changeStr = sign + acct.changePct.toFixed(0) + '%';
    }

    // Pacing display
    var pacingStr = '-';
    if (acct.monthlyBudget > 0) {
      pacingStr = acct.pacingPct.toFixed(0) + '%';
    }

    // Monthly budget display. Hard = bold black, inferred = italic gray + (est.).
    var budgetCellStyle = tdStyle;
    var budgetStr = '-';
    if (acct.monthlyBudget > 0) {
      if (acct.budgetType === 'hard') {
        budgetCellStyle = tdStyle + 'color:#1e293b;font-weight:600;';
        budgetStr = formatCurrency(acct.monthlyBudget);
      } else {
        budgetCellStyle = tdStyle + 'color:#94a3b8;font-style:italic;';
        budgetStr = formatCurrency(acct.monthlyBudget) + ' (est.)';
      }
    }

    html.push('<tr style="background:' + rowBg + ';">');
    html.push('<td style="' + tdStyle + 'text-align:left;font-weight:500;color:#1e293b;">' + escapeHtml(acct.name) + '</td>');
    html.push('<td style="' + tdStyle + 'color:#1e293b;">' + formatCurrency(acct.yesterdaySpend) + '</td>');
    html.push('<td style="' + tdStyle + 'color:#64748b;">' + formatCurrency(acct.weekAvg) + '</td>');
    html.push('<td style="' + tdStyle + 'color:' + changeColor + ';font-weight:600;">' + changeStr + '</td>');
    html.push('<td style="' + tdStyle + 'color:#1e293b;">' + formatCurrency(acct.mtdSpend) + '</td>');
    html.push('<td style="' + budgetCellStyle + '">' + budgetStr + '</td>');
    html.push('<td style="' + tdStyle + 'color:' + pacingColor + ';font-weight:600;">' + pacingStr + '</td>');
    html.push('</tr>');
  }
  html.push('</tbody></table>');
  html.push('</div>');

  // -- Footer --
  html.push('<div style="padding:16px 28px;background:#f8fafc;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;">');
  html.push('Alerts: spend drop >' + CONFIG.SPEND_DROP_PCT + '% from 7d avg, budget pacing >' +
            CONFIG.OVERPACE_PCT + '% of expected with ' + CONFIG.OVERPACE_MIN_DAYS_LEFT + '+ days left');
  html.push('<br>Pacing = % of monthly budget used. Green = on track, red = overpacing, amber = underpacing.');
  html.push('<br>Monthly Budget: <span style="color:#1e293b;font-weight:600;">bold</span> = hard budget set with client. ' +
            '<span style="color:#94a3b8;font-style:italic;">italic (est.)</span> = inferred from daily budgets x days in month.');
  html.push('</div>');

  html.push('</div>');
  return html.join('\n');
}


// =============================================================================
// PLAIN TEXT EMAIL (fallback for email clients without HTML)
// =============================================================================

function buildPlainText(accounts, alerts, dateInfo, errors) {
  var lines = [];
  var totalAlerts = alerts.critical.length + alerts.warning.length;

  lines.push('DAILY ADS MONITOR - ' + dateInfo.dateStr);
  lines.push(accounts.length + ' accounts' + (totalAlerts > 0 ? ' | ' + totalAlerts + ' ALERTS' : ' | ALL CLEAR'));
  lines.push('');

  if (alerts.critical.length > 0) {
    lines.push('CRITICAL');
    for (var c = 0; c < alerts.critical.length; c++) {
      lines.push('  * ' + alerts.critical[c].message);
    }
    lines.push('');
  }

  if (alerts.warning.length > 0) {
    lines.push('WARNING');
    for (var w = 0; w < alerts.warning.length; w++) {
      lines.push('  * ' + alerts.warning[w].message);
    }
    lines.push('');
  }

  if (errors.length > 0) {
    lines.push('ERRORS');
    for (var e = 0; e < errors.length; e++) {
      lines.push('  * ' + errors[e].name + ': ' + errors[e].error);
    }
    lines.push('');
  }

  // Plain text table
  lines.push(padRight('Account', 28) + padLeft('Yest', 10) + padLeft('7d Avg', 10) +
             padLeft('vs Avg', 9) + padLeft('MTD', 12) + padLeft('Budget', 14) + padLeft('Pacing', 8));
  lines.push(repeat('-', 91));

  for (var r = 0; r < accounts.length; r++) {
    var a = accounts[r];
    var name = a.name.length > 27 ? a.name.substring(0, 24) + '...' : a.name;
    var change = a.weekAvg === 0 ? '-' : (a.changePct > 0 ? '+' : '') + a.changePct.toFixed(0) + '%';
    var pacing = a.monthlyBudget > 0 ? a.pacingPct.toFixed(0) + '%' : '-';
    var budgetText = '-';
    if (a.monthlyBudget > 0) {
      budgetText = formatCurrency(a.monthlyBudget) + (a.budgetType === 'hard' ? '' : '*');
    }

    lines.push(padRight(name, 28) +
               padLeft(formatCurrency(a.yesterdaySpend), 10) +
               padLeft(formatCurrency(a.weekAvg), 10) +
               padLeft(change, 9) +
               padLeft(formatCurrency(a.mtdSpend), 12) +
               padLeft(budgetText, 14) +
               padLeft(pacing, 8));
  }

  lines.push('');
  lines.push('* = inferred budget (daily budgets x days in month). Unmarked = hard budget.');

  return lines.join('\n');
}


// =============================================================================
// SLACK
// =============================================================================

function sendSlack(accounts, alerts, dateInfo, sheetUrl) {
  if (!CONFIG.SLACK_WEBHOOK_URL) return;

  var totalAlerts = alerts.critical.length + alerts.warning.length;
  var payload = {
    text: '*Daily Ads Monitor* -- ' + dateInfo.dateStr,
    attachments: []
  };

  if (alerts.critical.length > 0) {
    payload.attachments.push({
      color: 'danger',
      text: '*CRITICAL*\n' + alerts.critical.map(function(a) { return '* ' + a.message; }).join('\n')
    });
  }

  if (alerts.warning.length > 0) {
    payload.attachments.push({
      color: 'warning',
      text: '*WARNING*\n' + alerts.warning.map(function(a) { return '* ' + a.message; }).join('\n')
    });
  }

  // Summary line
  var alertAccountIds = {};
  alerts.critical.forEach(function(a) { alertAccountIds[a.name] = true; });
  alerts.warning.forEach(function(a) { alertAccountIds[a.name] = true; });
  var healthyCount = accounts.length - Object.keys(alertAccountIds).length;

  var summaryText = healthyCount + '/' + accounts.length + ' accounts healthy';
  if (sheetUrl) summaryText += ' | <' + sheetUrl + '|Full Report>';

  payload.attachments.push({
    color: totalAlerts === 0 ? 'good' : '#94a3b8',
    text: summaryText
  });

  try {
    UrlFetchApp.fetch(CONFIG.SLACK_WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    });
    log('INFO', 'Slack notification sent');
  } catch (e) {
    log('ERROR', 'Slack failed: ' + e.message);
  }
}


// =============================================================================
// EMAIL
// =============================================================================

function sendEmail(htmlBody, plainBody, alertCount, dateStr, accountCount, sheetUrl) {
  if (CONFIG.EMAIL_RECIPIENTS.length === 0) return;

  var subject = alertCount > 0
    ? '[' + alertCount + ' ALERT' + (alertCount > 1 ? 'S' : '') + '] Daily Ads Monitor - ' + dateStr
    : '[ALL CLEAR] Daily Ads Monitor - ' + dateStr;

  var body = plainBody;
  if (sheetUrl) {
    body += '\n\nDashboard: ' + sheetUrl;
  }

  try {
    MailApp.sendEmail({
      to: CONFIG.EMAIL_RECIPIENTS.join(','),
      subject: subject,
      body: body,
      htmlBody: htmlBody
    });
    log('INFO', 'Email sent to ' + CONFIG.EMAIL_RECIPIENTS.length + ' recipient(s)');
  } catch (e) {
    log('ERROR', 'Email failed: ' + e.message);
  }
}


// =============================================================================
// GOOGLE SHEET DASHBOARD (optional)
// =============================================================================

function updateSheet(accounts, dateInfo) {
  var ss;

  try {
    if (CONFIG.SPREADSHEET_URL === 'CREATE_NEW') {
      ss = SpreadsheetApp.create('Daily Ads Monitor - ' + dateInfo.dateStr);
      log('INFO', 'Created sheet: ' + ss.getUrl());
    } else {
      ss = SpreadsheetApp.openByUrl(CONFIG.SPREADSHEET_URL);
    }
  } catch (e) {
    log('ERROR', 'Sheet error: ' + e.message);
    return '';
  }

  // -- Tab 1: Today (overwritten daily) --
  var todaySheet = ss.getSheetByName('Today');
  if (!todaySheet) todaySheet = ss.insertSheet('Today');
  else todaySheet.clear();

  var headers = ['Account', 'Yesterday', '7d Avg', 'vs Avg', 'MTD', 'Monthly Budget', 'Pacing', 'Status'];
  todaySheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  todaySheet.setFrozenRows(1);

  var rows = accounts.map(function(a) {
    var change = a.weekAvg === 0 ? 0 : a.changePct / 100;
    var pacing = a.monthlyBudget > 0 ? a.pacingPct / 100 : 0;
    return [
      a.name,
      a.yesterdaySpend,
      a.weekAvg,
      change,
      a.mtdSpend,
      a.monthlyBudget,
      pacing,
      a.alertLevel.toUpperCase()
    ];
  });

  if (rows.length > 0) {
    todaySheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

    // Format currency columns
    todaySheet.getRange(2, 2, rows.length, 1).setNumberFormat('$#,##0');
    todaySheet.getRange(2, 3, rows.length, 1).setNumberFormat('$#,##0');
    todaySheet.getRange(2, 4, rows.length, 1).setNumberFormat('+0%;-0%');
    todaySheet.getRange(2, 5, rows.length, 1).setNumberFormat('$#,##0');
    todaySheet.getRange(2, 6, rows.length, 1).setNumberFormat('$#,##0');
    todaySheet.getRange(2, 7, rows.length, 1).setNumberFormat('0%');

    todaySheet.autoResizeColumns(1, headers.length);
  }

  // -- Tab 2: History (append daily) --
  var historySheet = ss.getSheetByName('History');
  if (!historySheet) {
    historySheet = ss.insertSheet('History');
    var histHeaders = ['Date', 'Account', 'Spend', '7d Avg', 'MTD', 'Monthly Budget', 'Pacing'];
    historySheet.getRange(1, 1, 1, histHeaders.length).setValues([histHeaders]).setFontWeight('bold');
    historySheet.setFrozenRows(1);
  }

  var histRows = accounts.map(function(a) {
    return [
      dateInfo.dateStr,
      a.name,
      a.yesterdaySpend,
      a.weekAvg,
      a.mtdSpend,
      a.monthlyBudget,
      a.monthlyBudget > 0 ? a.pacingPct / 100 : 0
    ];
  });

  if (histRows.length > 0) {
    var lastRow = Math.max(historySheet.getLastRow(), 1);
    historySheet.getRange(lastRow + 1, 1, histRows.length, histRows[0].length).setValues(histRows);
  }

  // Make sure Today is the first tab
  ss.setActiveSheet(todaySheet);
  ss.moveActiveSheet(1);

  // Remove default Sheet1 if it exists
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  return ss.getUrl();
}


// =============================================================================
// UTILITIES
// =============================================================================

function formatCurrency(amount) {
  if (amount === 0) return '$0';
  if (amount < 10) return '$' + amount.toFixed(2);
  return '$' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDateHuman(date) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function padRight(str, len) {
  while (str.length < len) str += ' ';
  return str;
}

function padLeft(str, len) {
  while (str.length < len) str = ' ' + str;
  return str;
}

function repeat(ch, n) {
  var s = '';
  for (var i = 0; i < n; i++) s += ch;
  return s;
}

function log(level, msg) {
  var levels = { 'DEBUG': 0, 'INFO': 1, 'WARN': 2, 'ERROR': 3 };
  if (levels[level] >= levels[CONFIG.LOG_LEVEL]) {
    Logger.log('[' + level + '] ' + msg);
  }
}
