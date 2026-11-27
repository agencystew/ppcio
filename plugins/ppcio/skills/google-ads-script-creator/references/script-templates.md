# Google Ads Script Reference Templates (White-Label, GAQL-First)

Use these tested building blocks when writing or adapting a custom Google Ads Script (always check `scripts-library/README.md` first to see if one of the 21 built-in production scripts already solves the problem!).

Replace `[AGENCY_NAME]` with the user's own agency or company name (white-label by default).

## 1. Standard White-Label Header & CONFIG Block

```javascript
/******************************************************************************
 * [SCRIPT NAME IN CAPS]
 *
 * Purpose: [One-line description]
 * Author:  [AGENCY_NAME]
 * Version: 1.0
 * Updated: [YYYY-MM-DD]
 *
 * USE CASE: "[Example question, e.g., 'Which search terms wasted >$100 with 0 leads?']"
 *
 * SETUP:
 * 1. Paste into Google Ads > Tools > Bulk Actions > Scripts
 * 2. Update CONFIG values below (leave DRY_RUN: true for first Preview!)
 * 3. Preview, verify Logs, then schedule [Daily / Weekly]
 ******************************************************************************/

var CONFIG = {
  AGENCY_NAME: 'My Team',         // White-label header/subject prefix
  SPREADSHEET_URL: 'CREATE_NEW',  // Or paste an existing Google Sheet URL
  EMAIL_RECIPIENTS: [],
  SLACK_WEBHOOK_URL: '',
  DATE_RANGE: 'LAST_30_DAYS',
  CAMPAIGN_NAME_CONTAINS: '',
  CAMPAIGN_NAME_EXCLUDES: '',
  INCLUDE_PAUSED: false,
  MINIMUM_IMPRESSIONS: 100,
  DRY_RUN: true,                  // ALWAYS true by default for any mutation script
  LOG_LEVEL: 'INFO',
  TIME_LIMIT_MINUTES: 25,
  BATCH_SIZE: 500
};
```

## 2. GAQL-First Query + Standard Fallback Skeleton

```javascript
function main() {
  var startTime = new Date();
  log('INFO', 'Script started');

  try {
    var ss = initializeSpreadsheet();
    var data = fetchData(startTime);
    writeResults(ss, data);
    writeSummary(ss, data);
    sendNotifications(ss.getUrl(), data, startTime);
  } catch (e) {
    log('ERROR', 'Fatal: ' + e.message);
    sendErrorNotification(e);
  }
}

function fetchData(startTime) {
  try {
    return fetchDataGAQL(startTime);
  } catch (e) {
    log('WARN', 'GAQL failed, using fallback: ' + e.message);
    return fetchDataFallback(startTime);
  }
}

function fetchDataGAQL(startTime) {
  var data = [];
  var query =
    'SELECT campaign.name, metrics.impressions, metrics.clicks, ' +
    'metrics.cost_micros, metrics.conversions ' +
    'FROM campaign ' +
    'WHERE segments.date DURING ' + CONFIG.DATE_RANGE + ' ' +
    'AND metrics.impressions >= ' + CONFIG.MINIMUM_IMPRESSIONS;

  var rows = AdsApp.search(query);
  while (rows.hasNext()) {
    var row = rows.next();
    var name = row.campaign.name;
    if (!matchesCampaignFilter(name)) continue;
    data.push({
      campaign: name,
      impressions: Number(row.metrics.impressions || 0),
      clicks: Number(row.metrics.clicks || 0),
      cost: Number(row.metrics.costMicros || 0) / 1000000,
      conversions: Number(row.metrics.conversions || 0)
    });
    if (data.length % CONFIG.BATCH_SIZE === 0) checkTimeLimit(startTime);
  }
  return data;
}

function fetchDataFallback(startTime) {
  var data = [];
  var it = AdsApp.campaigns().forDateRange(CONFIG.DATE_RANGE).get();
  while (it.hasNext()) {
    var c = it.next();
    if (!matchesCampaignFilter(c.getName())) continue;
    var s = c.getStatsFor(CONFIG.DATE_RANGE);
    if (s.getImpressions() < CONFIG.MINIMUM_IMPRESSIONS) continue;
    data.push({
      campaign: c.getName(),
      impressions: s.getImpressions(),
      clicks: s.getClicks(),
      cost: s.getCost(),
      conversions: s.getConversions()
    });
    if (data.length % CONFIG.BATCH_SIZE === 0) checkTimeLimit(startTime);
  }
  return data;
}

function matchesCampaignFilter(name) {
  var lower = (name || '').toLowerCase();
  if (CONFIG.CAMPAIGN_NAME_CONTAINS && lower.indexOf(CONFIG.CAMPAIGN_NAME_CONTAINS.toLowerCase()) === -1) return false;
  if (CONFIG.CAMPAIGN_NAME_EXCLUDES && lower.indexOf(CONFIG.CAMPAIGN_NAME_EXCLUDES.toLowerCase()) !== -1) return false;
  return true;
}
```

## 3. Batched Spreadsheet Output & Utility Helpers

```javascript
function initializeSpreadsheet() {
  if (CONFIG.SPREADSHEET_URL === 'CREATE_NEW') {
    var ss = SpreadsheetApp.create(CONFIG.AGENCY_NAME + ' Report - ' + formatDate(new Date()));
    log('INFO', 'Created: ' + ss.getUrl());
    return ss;
  }
  return SpreadsheetApp.openByUrl(CONFIG.SPREADSHEET_URL);
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  else sheet.clear();
  return sheet;
}

function writeResults(ss, data) {
  var sheet = getOrCreateSheet(ss, '2. Data');
  if (data.length === 0) {
    sheet.getRange(1, 1).setValue('No rows matched the configured filters.');
    return;
  }
  var headers = Object.keys(data[0]);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');

  // Batch write in chunks to stay safely below 400K cell write limits
  var rows = data.map(function(r) { return headers.map(function(h) { return r[h]; }); });
  for (var i = 0; i < rows.length; i += CONFIG.BATCH_SIZE) {
    var chunk = rows.slice(i, i + CONFIG.BATCH_SIZE);
    sheet.getRange(2 + i, 1, chunk.length, headers.length).setValues(chunk);
  }
  sheet.setFrozenRows(1);
}

function writeSummary(ss, data) {
  var sheet = getOrCreateSheet(ss, '1. Summary');
  ss.setActiveSheet(sheet);
  ss.moveActiveSheet(1);
  var totalCost = data.reduce(function(s, r) { return s + (r.cost || 0); }, 0);
  var summary = [
    [CONFIG.AGENCY_NAME + ' Report Summary', ''],
    ['Generated', new Date().toISOString()],
    ['Account', AdsApp.currentAccount().getName()],
    ['Date Range', CONFIG.DATE_RANGE],
    ['Rows', data.length],
    ['Total Cost', totalCost.toFixed(2)]
  ];
  sheet.getRange(1, 1, summary.length, 2).setValues(summary);
  sheet.getRange(1, 1).setFontWeight('bold').setFontSize(14);
}

function checkTimeLimit(startTime) {
  if ((new Date() - startTime) / 60000 > CONFIG.TIME_LIMIT_MINUTES) {
    throw new Error('Time limit reached; partial data exported cleanly.');
  }
}

function log(level, msg) {
  var levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
  if (levels[level] >= levels[CONFIG.LOG_LEVEL]) Logger.log('[' + level + '] ' + msg);
}

function formatDate(d) {
  return Utilities.formatDate(d, AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
}

function sendNotifications(url, data, startTime) {
  var duration = ((new Date() - startTime) / 1000).toFixed(1);
  var msg = CONFIG.AGENCY_NAME + ' Report Complete\nRows: ' + data.length + '\nTime: ' + duration + 's\n' + url;
  if (CONFIG.EMAIL_RECIPIENTS.length > 0) {
    MailApp.sendEmail(CONFIG.EMAIL_RECIPIENTS.join(','), '[' + CONFIG.AGENCY_NAME + '] Report Ready', msg);
  }
  if (CONFIG.SLACK_WEBHOOK_URL) {
    UrlFetchApp.fetch(CONFIG.SLACK_WEBHOOK_URL, {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify({ text: msg })
    });
  }
}

function sendErrorNotification(error) {
  if (CONFIG.EMAIL_RECIPIENTS.length > 0) {
    MailApp.sendEmail(CONFIG.EMAIL_RECIPIENTS.join(','), '[' + CONFIG.AGENCY_NAME + ' ERROR]', error.message);
  }
}
```

## 4. MCC Scale Patterns (Resumable Sequential & Parallel 50-Account)

- **Resumable Sequential (1000+ accounts):** Store `LAST_ACCOUNT_ID` and `LAST_RUN_DATE` in `PropertiesService.getScriptProperties()`, wrap every `AdsManagerApp.select(account)` in `try/catch` for account-level error isolation, checkpoint every 10 accounts, and clear the checkpoint on completion.
- **Parallel (`executeInParallel`):** Batch up to 50 accounts via `AdsManagerApp.accounts().withLimit(50).executeInParallel('processAccountParallel', 'aggregateResults')`, returning `JSON.stringify({ accountId, accountName, data, error })`.

## 5. Quick GAQL Table & Unit Cheat Sheet

| Data | GAQL Table | Unit Note |
|---|---|---|
| Campaigns | `campaign` | `metrics.cost_micros / 1000000` |
| Keywords | `keyword_view` | `ad_group_criterion.keyword.text` |
| Search terms | `search_term_view` | `search_term_view.search_term` |
| Negatives | `campaign_criterion` / `ad_group_criterion` | `negative = TRUE` |
| RSAs | `ad_group_ad` | `ad_group_ad.ad.responsive_search_ad` |
| Date ranges | `LAST_7_DAYS`, `LAST_14_DAYS`, `LAST_30_DAYS`, `LAST_90_DAYS`, `THIS_MONTH`, `LAST_MONTH`, or `BETWEEN 'YYYY-MM-DD' AND 'YYYY-MM-DD'` | Use account timezone |
