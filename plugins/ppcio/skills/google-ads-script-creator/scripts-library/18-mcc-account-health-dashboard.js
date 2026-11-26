/**
 * MCC Account Health Dashboard
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PURPOSE                                                                      │
 * │ Monitors health across all accounts in an MCC, calculates health scores,     │
 * │ identifies accounts needing attention, and tracks month-over-month changes.  │
 * │ Perfect for agencies managing 10+ Google Ads accounts.                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ REPLACES: Manual account-by-account reviews, scattered health checks         │
 * │ WHY BETTER: Single dashboard view of all accounts with automated alerts      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ PPC.io | Free Google Ads Scripts                                             │
 * │ © 2025 PPC.io - For personal and commercial use with attribution            │
 * │ Questions? support@ppc.io                                                    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * IMPORTANT: This script must be run from an MCC (Manager) account, not a
 * standard Google Ads account. It uses AdsManagerApp to iterate through
 * all child accounts.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * PRE-BUILD SPECIFICATION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * CORE REQUIREMENTS:
 * 1. Iterate through all accounts in MCC (or filtered subset)
 * 2. Calculate health score (0-100) for each account
 * 3. Detect red flags: conversion drops, CTR drops, CPA spikes
 * 4. Track month-over-month performance changes
 * 5. Identify budget pacing issues
 * 6. Calculate impression share loss
 * 7. Generate prioritized alert list
 *
 * HEALTH SCORE COMPONENTS:
 * - Conversion trend (30% weight)
 * - CPA/ROAS performance vs target (25% weight)
 * - CTR trend (15% weight)
 * - Budget pacing (15% weight)
 * - Impression share (15% weight)
 *
 * MCC API PATTERN:
 * - Use AdsManagerApp.accounts() to get account iterator
 * - Use AdsManagerApp.select() to switch context
 * - Process each account individually
 *
 * OUTPUT STRUCTURE:
 * Sheet 1: "1. Summary" - MCC overview with alerts
 * Sheet 2: "2. Account Health" - All accounts with health scores
 * Sheet 3: "3. Red Flags" - Accounts needing immediate attention
 * Sheet 4: "4. Trends" - Month-over-month comparison
 * Sheet 5: "5. Historical" - Running health score history
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION - Customize These Settings
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Spreadsheet Configuration
  SPREADSHEET_URL: '',  // Leave empty to create new, or paste existing URL

  // Account Filtering
  ACCOUNT_LABEL_FILTER: '',       // Only process accounts with this label (empty = all)
  EXCLUDE_ACCOUNT_LABEL: '',      // Exclude accounts with this label
  ACCOUNT_IDS_FILTER: [],         // Specific account IDs to include (empty = all)
  MIN_SPEND_FOR_INCLUSION: 0,     // Minimum spend in period to be included

  // Date Ranges
  CURRENT_PERIOD: 'LAST_30_DAYS',     // Current analysis period
  COMPARISON_PERIOD: 'LAST_30_DAYS',  // Comparison period (previous)
  // Note: Comparison is automatically the previous equivalent period

  // Health Score Thresholds
  CRITICAL_HEALTH_THRESHOLD: 50,   // Health score below this = critical
  WARNING_HEALTH_THRESHOLD: 70,    // Health score below this = warning
  GOOD_HEALTH_THRESHOLD: 85,       // Health score above this = good

  // Red Flag Triggers
  CONVERSION_DROP_THRESHOLD: 20,   // % drop triggers alert
  CPA_INCREASE_THRESHOLD: 30,      // % increase triggers alert
  CTR_DROP_THRESHOLD: 25,          // % drop triggers alert
  BUDGET_UNDERSPEND_THRESHOLD: 20, // % underspend triggers alert
  BUDGET_OVERSPEND_THRESHOLD: 10,  // % overspend triggers alert
  IMPRESSION_SHARE_LOSS_THRESHOLD: 30, // % IS loss triggers alert

  // Score Weights (must total 100)
  WEIGHT_CONVERSIONS: 30,
  WEIGHT_EFFICIENCY: 25,
  WEIGHT_CTR: 15,
  WEIGHT_BUDGET: 15,
  WEIGHT_IMPRESSION_SHARE: 15,

  // Target Performance (optional - set to 0 to use account's own baseline)
  TARGET_CPA: 0,              // Global CPA target (0 = use account avg)
  TARGET_ROAS: 0,             // Global ROAS target (0 = use account avg)

  // Notifications
  SEND_EMAIL: false,
  EMAIL_ADDRESSES: ['your-email@example.com'],
  EMAIL_ONLY_IF_CRITICAL: true,   // Only email if critical accounts found

  // Slack Integration (optional)
  SLACK_WEBHOOK_URL: '',
  SEND_SLACK_ALERTS: false,

  // Processing
  MAX_ACCOUNTS: 500,              // Maximum accounts to process
  ACCOUNT_PROCESSING_LIMIT: 45,   // Minutes before stopping (safety margin)
  VERBOSE_LOGGING: true,

  // Historical Tracking
  TRACK_HISTORY: true,            // Append historical data each run
  HISTORY_SHEET_NAME: '5. Historical'
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION - MCC LEVEL
// ═══════════════════════════════════════════════════════════════════════════════

function main() {
  const startTime = new Date();
  log('═══════════════════════════════════════════════════════════════════════');
  log('MCC ACCOUNT HEALTH DASHBOARD');
  log('Started: ' + startTime.toISOString());
  log('═══════════════════════════════════════════════════════════════════════');

  try {
    // Verify MCC context
    if (typeof AdsManagerApp === 'undefined') {
      throw new Error('This script must be run from an MCC (Manager) account. ' +
                      'AdsManagerApp is not available in standard accounts.');
    }

    // Initialize spreadsheet
    const ss = initializeSpreadsheet();

    // Get all accounts to process
    const accounts = getAccountsToProcess();
    log('Found ' + accounts.length + ' accounts to analyze');

    if (accounts.length === 0) {
      log('No accounts found matching filter criteria');
      return;
    }

    // Process each account
    const results = {
      accountHealth: [],
      redFlags: [],
      trends: [],
      summary: {
        totalAccounts: accounts.length,
        healthyAccounts: 0,
        warningAccounts: 0,
        criticalAccounts: 0,
        totalSpend: 0,
        totalConversions: 0,
        avgHealthScore: 0
      }
    };

    let processedCount = 0;
    const maxRuntime = CONFIG.ACCOUNT_PROCESSING_LIMIT * 60 * 1000;

    for (let i = 0; i < accounts.length && i < CONFIG.MAX_ACCOUNTS; i++) {
      // Check time limit
      if ((new Date() - startTime) > maxRuntime) {
        log('WARNING: Approaching time limit, stopping at ' + processedCount + ' accounts');
        break;
      }

      const accountInfo = accounts[i];
      log('\n--- Processing: ' + accountInfo.name + ' (' + accountInfo.id + ') ---');

      try {
        // Switch to account context
        AdsManagerApp.select(accountInfo.account);

        // Analyze account health
        const health = analyzeAccountHealth(accountInfo);
        results.accountHealth.push(health);

        // Track summary stats
        results.summary.totalSpend += health.currentSpend;
        results.summary.totalConversions += health.currentConversions;

        if (health.healthScore >= CONFIG.GOOD_HEALTH_THRESHOLD) {
          results.summary.healthyAccounts++;
        } else if (health.healthScore >= CONFIG.WARNING_HEALTH_THRESHOLD) {
          results.summary.warningAccounts++;
        } else {
          results.summary.criticalAccounts++;
        }

        // Collect red flags
        if (health.redFlags.length > 0) {
          health.redFlags.forEach(function(flag) {
            results.redFlags.push({
              accountName: accountInfo.name,
              accountId: accountInfo.id,
              flag: flag.type,
              severity: flag.severity,
              message: flag.message,
              value: flag.value
            });
          });
        }

        // Add to trends
        results.trends.push({
          accountName: accountInfo.name,
          accountId: accountInfo.id,
          currentSpend: health.currentSpend,
          previousSpend: health.previousSpend,
          spendChange: health.spendChange,
          currentConversions: health.currentConversions,
          previousConversions: health.previousConversions,
          conversionChange: health.conversionChange,
          currentCPA: health.currentCPA,
          previousCPA: health.previousCPA,
          cpaChange: health.cpaChange,
          currentCTR: health.currentCTR,
          previousCTR: health.previousCTR,
          ctrChange: health.ctrChange
        });

        processedCount++;

      } catch (accountError) {
        log('ERROR processing account ' + accountInfo.name + ': ' + accountError.message);
        results.accountHealth.push({
          accountName: accountInfo.name,
          accountId: accountInfo.id,
          healthScore: 0,
          status: 'ERROR',
          error: accountError.message,
          redFlags: [{
            type: 'PROCESSING_ERROR',
            severity: 'Critical',
            message: accountError.message
          }]
        });
      }
    }

    // Calculate average health score
    const validScores = results.accountHealth.filter(function(a) { return a.healthScore > 0; });
    if (validScores.length > 0) {
      results.summary.avgHealthScore = validScores.reduce(function(sum, a) {
        return sum + a.healthScore;
      }, 0) / validScores.length;
    }

    // Sort results
    results.accountHealth.sort(function(a, b) { return a.healthScore - b.healthScore; });
    results.redFlags.sort(function(a, b) {
      const severityOrder = { 'Critical': 0, 'Warning': 1, 'Info': 2 };
      return (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3);
    });

    // Write output sheets
    log('\n--- Writing Dashboard ---');
    writeSummarySheet(ss, results);
    writeAccountHealthSheet(ss, results.accountHealth);
    writeRedFlagsSheet(ss, results.redFlags);
    writeTrendsSheet(ss, results.trends);

    if (CONFIG.TRACK_HISTORY) {
      writeHistoricalData(ss, results);
    }

    // Send notifications
    if (CONFIG.SEND_EMAIL) {
      const shouldEmail = !CONFIG.EMAIL_ONLY_IF_CRITICAL ||
                          results.summary.criticalAccounts > 0;
      if (shouldEmail) {
        sendEmailNotification(ss, results);
      }
    }

    if (CONFIG.SEND_SLACK_ALERTS && CONFIG.SLACK_WEBHOOK_URL) {
      sendSlackAlert(results);
    }

    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;

    log('\n═══════════════════════════════════════════════════════════════════════');
    log('MCC HEALTH DASHBOARD COMPLETE');
    log('Duration: ' + duration.toFixed(1) + ' seconds');
    log('Accounts Processed: ' + processedCount);
    log('Healthy: ' + results.summary.healthyAccounts +
        ', Warning: ' + results.summary.warningAccounts +
        ', Critical: ' + results.summary.criticalAccounts);
    log('Average Health Score: ' + results.summary.avgHealthScore.toFixed(1));
    log('Red Flags: ' + results.redFlags.length);
    log('Report: ' + ss.getUrl());
    log('═══════════════════════════════════════════════════════════════════════');

  } catch (error) {
    log('FATAL ERROR: ' + error.message);
    log('Stack: ' + error.stack);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPREADSHEET INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

function initializeSpreadsheet() {
  let ss;

  if (CONFIG.SPREADSHEET_URL) {
    ss = SpreadsheetApp.openByUrl(CONFIG.SPREADSHEET_URL);
    log('Using existing spreadsheet: ' + ss.getName());
  } else {
    const mccName = AdsManagerApp.currentAccount().getName() || 'MCC';
    const timestamp = Utilities.formatDate(new Date(),
      AdsManagerApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
    ss = SpreadsheetApp.create('MCC Health Dashboard - ' + mccName + ' - ' + timestamp);
    log('Created new spreadsheet: ' + ss.getName());
  }

  // Create/clear sheets (except Historical which we append to)
  const sheetNames = ['1. Summary', '2. Account Health', '3. Red Flags', '4. Trends'];

  sheetNames.forEach(function(name, index) {
    let sheet = ss.getSheetByName(name);
    if (sheet) {
      sheet.clear();
    } else {
      if (index === 0) {
        sheet = ss.getSheets()[0];
        sheet.setName(name);
      } else {
        sheet = ss.insertSheet(name);
      }
    }
  });

  // Ensure Historical sheet exists (don't clear it)
  if (CONFIG.TRACK_HISTORY) {
    let histSheet = ss.getSheetByName(CONFIG.HISTORY_SHEET_NAME);
    if (!histSheet) {
      histSheet = ss.insertSheet(CONFIG.HISTORY_SHEET_NAME);
      // Add headers
      histSheet.getRange(1, 1, 1, 8).setValues([[
        'Date', 'Account Name', 'Account ID', 'Health Score',
        'Spend', 'Conversions', 'CPA', 'Red Flags Count'
      ]]);
      histSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    }
  }

  return ss;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNT RETRIEVAL
// ═══════════════════════════════════════════════════════════════════════════════

function getAccountsToProcess() {
  const accounts = [];

  let accountIterator;

  // Build selector
  let selector = AdsManagerApp.accounts();

  // Apply label filter
  if (CONFIG.ACCOUNT_LABEL_FILTER) {
    selector = selector.withCondition("LabelNames CONTAINS '" + CONFIG.ACCOUNT_LABEL_FILTER + "'");
  }

  // Apply exclude label
  if (CONFIG.EXCLUDE_ACCOUNT_LABEL) {
    selector = selector.withCondition("LabelNames DOES_NOT_CONTAIN '" + CONFIG.EXCLUDE_ACCOUNT_LABEL + "'");
  }

  // Apply specific account IDs
  if (CONFIG.ACCOUNT_IDS_FILTER && CONFIG.ACCOUNT_IDS_FILTER.length > 0) {
    selector = selector.withIds(CONFIG.ACCOUNT_IDS_FILTER);
  }

  // Get accounts
  accountIterator = selector.get();

  while (accountIterator.hasNext()) {
    const account = accountIterator.next();

    accounts.push({
      account: account,
      id: account.getCustomerId(),
      name: account.getName() || 'Unnamed Account',
      currencyCode: account.getCurrencyCode(),
      timeZone: account.getTimeZone()
    });
  }

  // Sort by name for consistent ordering
  accounts.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  return accounts;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNT HEALTH ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeAccountHealth(accountInfo) {
  const health = {
    accountName: accountInfo.name,
    accountId: accountInfo.id,
    currencyCode: accountInfo.currencyCode,
    healthScore: 0,
    status: 'Unknown',
    redFlags: [],

    // Current period metrics
    currentSpend: 0,
    currentClicks: 0,
    currentImpressions: 0,
    currentConversions: 0,
    currentConversionValue: 0,
    currentCPA: 0,
    currentROAS: 0,
    currentCTR: 0,
    currentImpressionShare: 0,

    // Previous period metrics
    previousSpend: 0,
    previousClicks: 0,
    previousImpressions: 0,
    previousConversions: 0,
    previousCPA: 0,
    previousCTR: 0,

    // Changes
    spendChange: 0,
    conversionChange: 0,
    cpaChange: 0,
    ctrChange: 0,

    // Budget info
    totalBudget: 0,
    budgetUtilization: 0,
    impressionShareLost: 0,

    // Component scores
    conversionScore: 0,
    efficiencyScore: 0,
    ctrScore: 0,
    budgetScore: 0,
    impressionShareScore: 0
  };

  // Get current period data
  const currentData = getAccountMetrics(CONFIG.CURRENT_PERIOD);
  health.currentSpend = currentData.spend;
  health.currentClicks = currentData.clicks;
  health.currentImpressions = currentData.impressions;
  health.currentConversions = currentData.conversions;
  health.currentConversionValue = currentData.conversionValue;
  health.currentImpressionShare = currentData.impressionShare;
  health.impressionShareLost = currentData.impressionShareLost;
  health.totalBudget = currentData.budget;

  // Calculate current derived metrics
  if (health.currentConversions > 0) {
    health.currentCPA = health.currentSpend / health.currentConversions;
  }
  if (health.currentSpend > 0) {
    health.currentROAS = health.currentConversionValue / health.currentSpend;
  }
  if (health.currentImpressions > 0) {
    health.currentCTR = (health.currentClicks / health.currentImpressions) * 100;
  }
  if (health.totalBudget > 0) {
    health.budgetUtilization = (health.currentSpend / health.totalBudget) * 100;
  }

  // Get previous period data for comparison
  const previousData = getPreviousPeriodMetrics();
  health.previousSpend = previousData.spend;
  health.previousClicks = previousData.clicks;
  health.previousImpressions = previousData.impressions;
  health.previousConversions = previousData.conversions;

  if (health.previousConversions > 0) {
    health.previousCPA = health.previousSpend / health.previousConversions;
  }
  if (health.previousImpressions > 0) {
    health.previousCTR = (health.previousClicks / health.previousImpressions) * 100;
  }

  // Calculate changes
  if (health.previousSpend > 0) {
    health.spendChange = ((health.currentSpend - health.previousSpend) / health.previousSpend) * 100;
  }
  if (health.previousConversions > 0) {
    health.conversionChange = ((health.currentConversions - health.previousConversions) /
                               health.previousConversions) * 100;
  }
  if (health.previousCPA > 0) {
    health.cpaChange = ((health.currentCPA - health.previousCPA) / health.previousCPA) * 100;
  }
  if (health.previousCTR > 0) {
    health.ctrChange = ((health.currentCTR - health.previousCTR) / health.previousCTR) * 100;
  }

  // Skip scoring for accounts with minimal activity
  if (health.currentSpend < CONFIG.MIN_SPEND_FOR_INCLUSION) {
    health.healthScore = 0;
    health.status = 'Inactive';
    return health;
  }

  // Calculate component scores
  health.conversionScore = calculateConversionScore(health);
  health.efficiencyScore = calculateEfficiencyScore(health);
  health.ctrScore = calculateCTRScore(health);
  health.budgetScore = calculateBudgetScore(health);
  health.impressionShareScore = calculateImpressionShareScore(health);

  // Calculate weighted health score
  health.healthScore =
    (health.conversionScore * CONFIG.WEIGHT_CONVERSIONS / 100) +
    (health.efficiencyScore * CONFIG.WEIGHT_EFFICIENCY / 100) +
    (health.ctrScore * CONFIG.WEIGHT_CTR / 100) +
    (health.budgetScore * CONFIG.WEIGHT_BUDGET / 100) +
    (health.impressionShareScore * CONFIG.WEIGHT_IMPRESSION_SHARE / 100);

  // Round to 1 decimal
  health.healthScore = Math.round(health.healthScore * 10) / 10;

  // Determine status
  if (health.healthScore >= CONFIG.GOOD_HEALTH_THRESHOLD) {
    health.status = 'Healthy';
  } else if (health.healthScore >= CONFIG.WARNING_HEALTH_THRESHOLD) {
    health.status = 'Warning';
  } else if (health.healthScore >= CONFIG.CRITICAL_HEALTH_THRESHOLD) {
    health.status = 'At Risk';
  } else {
    health.status = 'Critical';
  }

  // Detect red flags
  health.redFlags = detectRedFlags(health);

  log('  Health Score: ' + health.healthScore + ' (' + health.status + ')' +
      ' | Red Flags: ' + health.redFlags.length);

  return health;
}

// ═══════════════════════════════════════════════════════════════════════════════
// METRICS RETRIEVAL
// ═══════════════════════════════════════════════════════════════════════════════

function getAccountMetrics(dateRange) {
  const metrics = {
    spend: 0,
    clicks: 0,
    impressions: 0,
    conversions: 0,
    conversionValue: 0,
    impressionShare: 0,
    impressionShareLost: 0,
    budget: 0
  };

  // Try GAQL first
  try {
    const query = "SELECT " +
      "metrics.cost_micros, " +
      "metrics.clicks, " +
      "metrics.impressions, " +
      "metrics.conversions, " +
      "metrics.conversions_value, " +
      "metrics.search_impression_share " +
      "FROM campaign " +
      "WHERE campaign.status = 'ENABLED' " +
      "AND segments.date DURING " + dateRange;

    const results = AdsApp.search(query);

    while (results.hasNext()) {
      const row = results.next();
      metrics.spend += (row.metrics.costMicros || 0) / 1000000;
      metrics.clicks += row.metrics.clicks || 0;
      metrics.impressions += row.metrics.impressions || 0;
      metrics.conversions += row.metrics.conversions || 0;
      metrics.conversionValue += row.metrics.conversionsValue || 0;

      // Impression share is a fraction
      if (row.metrics.searchImpressionShare) {
        metrics.impressionShare = row.metrics.searchImpressionShare * 100;
      }
    }

  } catch (e) {
    // Fallback to standard API
    log('  Using fallback API for metrics');
    const campaigns = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .forDateRange(dateRange)
      .get();

    while (campaigns.hasNext()) {
      const campaign = campaigns.next();
      const stats = campaign.getStatsFor(dateRange);

      metrics.spend += stats.getCost();
      metrics.clicks += stats.getClicks();
      metrics.impressions += stats.getImpressions();
      metrics.conversions += stats.getConversions();
    }
  }

  // Get total budget
  try {
    const budgetQuery = "SELECT " +
      "campaign_budget.amount_micros " +
      "FROM campaign " +
      "WHERE campaign.status = 'ENABLED'";

    const budgetResults = AdsApp.search(budgetQuery);

    while (budgetResults.hasNext()) {
      const row = budgetResults.next();
      // Daily budget * 30 for monthly approximation
      metrics.budget += ((row.campaignBudget.amountMicros || 0) / 1000000) * 30;
    }
  } catch (e) {
    // Fallback
    const campaigns = AdsApp.campaigns().withCondition('Status = ENABLED').get();
    while (campaigns.hasNext()) {
      const campaign = campaigns.next();
      const budget = campaign.getBudget();
      if (budget) {
        metrics.budget += budget.getAmount() * 30;
      }
    }
  }

  // Calculate impression share lost
  if (metrics.impressionShare > 0) {
    metrics.impressionShareLost = 100 - metrics.impressionShare;
  }

  return metrics;
}

function getPreviousPeriodMetrics() {
  // Calculate the previous equivalent period
  const periodDays = {
    'LAST_7_DAYS': 7,
    'LAST_14_DAYS': 14,
    'LAST_30_DAYS': 30,
    'LAST_90_DAYS': 90
  };

  const days = periodDays[CONFIG.CURRENT_PERIOD] || 30;
  const tz = AdsApp.currentAccount().getTimeZone();
  const today = new Date();

  // Previous period ends where current period starts
  const prevEndDate = new Date(today.getTime() - (days * 86400000));
  const prevStartDate = new Date(prevEndDate.getTime() - (days * 86400000));

  const startStr = Utilities.formatDate(prevStartDate, tz, 'yyyyMMdd');
  const endStr = Utilities.formatDate(prevEndDate, tz, 'yyyyMMdd');

  const metrics = {
    spend: 0,
    clicks: 0,
    impressions: 0,
    conversions: 0
  };

  try {
    const campaigns = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .forDateRange(startStr, endStr)
      .get();

    while (campaigns.hasNext()) {
      const campaign = campaigns.next();
      const stats = campaign.getStatsFor(startStr, endStr);

      metrics.spend += stats.getCost();
      metrics.clicks += stats.getClicks();
      metrics.impressions += stats.getImpressions();
      metrics.conversions += stats.getConversions();
    }
  } catch (e) {
    log('  Warning: Could not get previous period data: ' + e.message);
  }

  return metrics;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function calculateConversionScore(health) {
  // Score based on conversion trend
  // Positive or stable = good, negative = bad

  if (health.previousConversions === 0) {
    // No previous data - neutral score based on whether we have conversions
    return health.currentConversions > 0 ? 75 : 50;
  }

  const change = health.conversionChange;

  if (change >= 10) return 100;       // Growing 10%+ = excellent
  if (change >= 0) return 85;          // Stable or slightly up = good
  if (change >= -10) return 70;        // Small decline = warning
  if (change >= -20) return 50;        // Moderate decline = concerning
  if (change >= -30) return 30;        // Significant decline = at risk
  return 10;                            // Severe decline = critical
}

function calculateEfficiencyScore(health) {
  // Score based on CPA/ROAS vs target or baseline

  const targetCPA = CONFIG.TARGET_CPA > 0 ? CONFIG.TARGET_CPA : health.previousCPA;

  if (targetCPA === 0 || health.currentCPA === 0) {
    // No baseline - check if we have conversions
    return health.currentConversions > 0 ? 75 : 50;
  }

  const cpaRatio = health.currentCPA / targetCPA;

  if (cpaRatio <= 0.8) return 100;     // 20%+ below target = excellent
  if (cpaRatio <= 1.0) return 90;      // At or below target = great
  if (cpaRatio <= 1.2) return 75;      // Up to 20% above = acceptable
  if (cpaRatio <= 1.5) return 55;      // 20-50% above = warning
  if (cpaRatio <= 2.0) return 35;      // 50-100% above = at risk
  return 15;                            // 100%+ above = critical
}

function calculateCTRScore(health) {
  // Score based on CTR trend and absolute level

  if (health.currentCTR === 0) return 30;

  let trendScore = 75; // Base score

  if (health.previousCTR > 0) {
    const change = health.ctrChange;
    if (change >= 10) trendScore = 100;
    else if (change >= 0) trendScore = 85;
    else if (change >= -15) trendScore = 70;
    else if (change >= -25) trendScore = 50;
    else trendScore = 30;
  }

  // Adjust for absolute CTR (assuming search campaigns)
  let absoluteScore = 75;
  if (health.currentCTR >= 5) absoluteScore = 100;
  else if (health.currentCTR >= 3) absoluteScore = 85;
  else if (health.currentCTR >= 2) absoluteScore = 70;
  else if (health.currentCTR >= 1) absoluteScore = 50;
  else absoluteScore = 30;

  // Weighted average of trend and absolute
  return (trendScore * 0.6) + (absoluteScore * 0.4);
}

function calculateBudgetScore(health) {
  // Score based on budget utilization

  if (health.totalBudget === 0) return 75; // No budget data

  const utilization = health.budgetUtilization;

  // Ideal is 85-100% utilization
  if (utilization >= 85 && utilization <= 100) return 100;
  if (utilization >= 70 && utilization < 85) return 85;
  if (utilization >= 100 && utilization <= 105) return 90;
  if (utilization >= 50 && utilization < 70) return 65;
  if (utilization >= 105 && utilization <= 115) return 70;
  if (utilization < 50) return 40;  // Significant underspend
  return 50;  // Overspend > 115%
}

function calculateImpressionShareScore(health) {
  // Score based on impression share

  if (health.currentImpressionShare === 0) return 60; // No data

  const is = health.currentImpressionShare;

  if (is >= 90) return 100;
  if (is >= 75) return 85;
  if (is >= 60) return 70;
  if (is >= 45) return 55;
  if (is >= 30) return 40;
  return 25;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RED FLAG DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

function detectRedFlags(health) {
  const flags = [];

  // Conversion drop
  if (health.conversionChange < -CONFIG.CONVERSION_DROP_THRESHOLD) {
    flags.push({
      type: 'CONVERSION_DROP',
      severity: health.conversionChange < -40 ? 'Critical' : 'Warning',
      message: 'Conversions dropped ' + Math.abs(health.conversionChange).toFixed(1) + '% vs previous period',
      value: health.conversionChange
    });
  }

  // CPA increase
  if (health.cpaChange > CONFIG.CPA_INCREASE_THRESHOLD) {
    flags.push({
      type: 'CPA_INCREASE',
      severity: health.cpaChange > 50 ? 'Critical' : 'Warning',
      message: 'CPA increased ' + health.cpaChange.toFixed(1) + '% vs previous period',
      value: health.cpaChange
    });
  }

  // CTR drop
  if (health.ctrChange < -CONFIG.CTR_DROP_THRESHOLD) {
    flags.push({
      type: 'CTR_DROP',
      severity: health.ctrChange < -40 ? 'Critical' : 'Warning',
      message: 'CTR dropped ' + Math.abs(health.ctrChange).toFixed(1) + '% vs previous period',
      value: health.ctrChange
    });
  }

  // Budget underspend
  if (health.budgetUtilization > 0 && health.budgetUtilization < (100 - CONFIG.BUDGET_UNDERSPEND_THRESHOLD)) {
    flags.push({
      type: 'BUDGET_UNDERSPEND',
      severity: health.budgetUtilization < 50 ? 'Warning' : 'Info',
      message: 'Budget utilization at ' + health.budgetUtilization.toFixed(1) + '%',
      value: health.budgetUtilization
    });
  }

  // Budget overspend
  if (health.budgetUtilization > (100 + CONFIG.BUDGET_OVERSPEND_THRESHOLD)) {
    flags.push({
      type: 'BUDGET_OVERSPEND',
      severity: health.budgetUtilization > 120 ? 'Warning' : 'Info',
      message: 'Budget overspend at ' + health.budgetUtilization.toFixed(1) + '%',
      value: health.budgetUtilization
    });
  }

  // Impression share loss
  if (health.impressionShareLost > CONFIG.IMPRESSION_SHARE_LOSS_THRESHOLD) {
    flags.push({
      type: 'IMPRESSION_SHARE_LOSS',
      severity: health.impressionShareLost > 50 ? 'Warning' : 'Info',
      message: 'Losing ' + health.impressionShareLost.toFixed(1) + '% impression share',
      value: health.impressionShareLost
    });
  }

  // Zero conversions with spend
  if (health.currentConversions === 0 && health.currentSpend > 100) {
    flags.push({
      type: 'ZERO_CONVERSIONS',
      severity: 'Critical',
      message: 'No conversions with $' + health.currentSpend.toFixed(2) + ' spend',
      value: health.currentSpend
    });
  }

  // Very low CTR
  if (health.currentCTR < 1 && health.currentImpressions > 1000) {
    flags.push({
      type: 'LOW_CTR',
      severity: 'Warning',
      message: 'CTR below 1% (' + health.currentCTR.toFixed(2) + '%)',
      value: health.currentCTR
    });
  }

  return flags;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT SHEET WRITERS
// ═══════════════════════════════════════════════════════════════════════════════

function writeSummarySheet(ss, results) {
  const sheet = ss.getSheetByName('1. Summary');
  const data = [];

  const mccName = AdsManagerApp.currentAccount().getName() || 'MCC';

  // Header
  data.push(['MCC ACCOUNT HEALTH DASHBOARD']);
  data.push(['MCC: ' + mccName]);
  data.push(['Generated: ' + new Date().toISOString()]);
  data.push(['Period: ' + CONFIG.CURRENT_PERIOD]);
  data.push(['']);

  // Overview stats
  data.push(['PORTFOLIO OVERVIEW', '']);
  data.push(['Total Accounts', results.summary.totalAccounts]);
  data.push(['Healthy Accounts', results.summary.healthyAccounts]);
  data.push(['Warning Accounts', results.summary.warningAccounts]);
  data.push(['Critical Accounts', results.summary.criticalAccounts]);
  data.push(['Average Health Score', results.summary.avgHealthScore.toFixed(1)]);
  data.push(['']);
  data.push(['Total Spend', '$' + results.summary.totalSpend.toFixed(2)]);
  data.push(['Total Conversions', results.summary.totalConversions.toFixed(1)]);
  data.push(['']);

  // Health distribution
  data.push(['HEALTH DISTRIBUTION', '']);
  const healthyPct = results.summary.totalAccounts > 0 ?
    ((results.summary.healthyAccounts / results.summary.totalAccounts) * 100).toFixed(1) + '%' : '0%';
  const warningPct = results.summary.totalAccounts > 0 ?
    ((results.summary.warningAccounts / results.summary.totalAccounts) * 100).toFixed(1) + '%' : '0%';
  const criticalPct = results.summary.totalAccounts > 0 ?
    ((results.summary.criticalAccounts / results.summary.totalAccounts) * 100).toFixed(1) + '%' : '0%';

  data.push(['Healthy (85+)', healthyPct]);
  data.push(['Warning (70-84)', warningPct]);
  data.push(['Critical (<70)', criticalPct]);
  data.push(['']);

  // Top alerts
  data.push(['TOP ALERTS REQUIRING ATTENTION', '']);
  const topAlerts = results.redFlags.filter(function(f) { return f.severity === 'Critical'; }).slice(0, 5);
  if (topAlerts.length === 0) {
    data.push(['No critical alerts! All accounts performing within acceptable ranges.']);
  } else {
    topAlerts.forEach(function(alert) {
      data.push([alert.accountName + ': ' + alert.message]);
    });
  }
  data.push(['']);

  // AI Prompt
  data.push(['AI ANALYSIS PROMPT']);
  data.push(['Copy this prompt into ChatGPT/Claude along with Account Health sheet for strategic guidance:']);
  data.push(['']);

  const aiPrompt = 'I manage ' + results.summary.totalAccounts + ' Google Ads accounts in an MCC. ' +
    'Current health breakdown: ' + results.summary.healthyAccounts + ' healthy, ' +
    results.summary.warningAccounts + ' warning, ' + results.summary.criticalAccounts + ' critical. ' +
    'Average health score: ' + results.summary.avgHealthScore.toFixed(1) + '/100. ' +
    'Total active red flags: ' + results.redFlags.length + '. ' +
    'Please analyze the detailed account health data and provide: ' +
    '1) Priority ranking of which accounts need immediate attention, ' +
    '2) Common patterns across underperforming accounts, ' +
    '3) Recommended actions for each critical account, ' +
    '4) Portfolio-level optimization opportunities.';

  data.push([aiPrompt]);

  // Pad and write
  const paddedData = data.map(function(row) {
    while (row.length < 2) row.push('');
    return row;
  });

  sheet.getRange(1, 1, paddedData.length, 2).setValues(paddedData);

  // Formatting
  sheet.getRange('A1').setFontSize(14).setFontWeight('bold');
  sheet.getRange('A6').setFontWeight('bold');
  sheet.getRange('A16').setFontWeight('bold');
  sheet.getRange('A21').setFontWeight('bold');
  sheet.setColumnWidth(1, 400);
  sheet.setColumnWidth(2, 150);

  log('Summary sheet written');
}

function writeAccountHealthSheet(ss, accountHealth) {
  const sheet = ss.getSheetByName('2. Account Health');

  const headers = [
    'Account Name', 'Account ID', 'Health Score', 'Status',
    'Spend', 'Conversions', 'CPA', 'ROAS', 'CTR %',
    'Conv Change %', 'CPA Change %', 'Budget Util %', 'IS Lost %',
    'Red Flags', 'Conv Score', 'Eff Score', 'CTR Score', 'Budget Score', 'IS Score'
  ];

  const data = accountHealth.map(function(a) {
    return [
      a.accountName,
      a.accountId,
      a.healthScore,
      a.status,
      a.currentSpend,
      a.currentConversions,
      a.currentCPA,
      a.currentROAS,
      a.currentCTR,
      a.conversionChange,
      a.cpaChange,
      a.budgetUtilization,
      a.impressionShareLost,
      a.redFlags ? a.redFlags.length : 0,
      a.conversionScore || 0,
      a.efficiencyScore || 0,
      a.ctrScore || 0,
      a.budgetScore || 0,
      a.impressionShareScore || 0
    ];
  });

  data.unshift(headers);
  sheet.getRange(1, 1, data.length, headers.length).setValues(data);

  // Formatting
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  sheet.getRange(2, 5, data.length - 1, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 6, data.length - 1, 1).setNumberFormat('#,##0.0');
  sheet.getRange(2, 7, data.length - 1, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 8, data.length - 1, 1).setNumberFormat('0.00');
  sheet.getRange(2, 9, data.length - 1, 1).setNumberFormat('0.00%');
  sheet.getRange(2, 10, data.length - 1, 4).setNumberFormat('0.0');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  // Conditional formatting for status
  for (let i = 2; i <= data.length; i++) {
    const statusCell = sheet.getRange(i, 4);
    const status = accountHealth[i - 2].status;

    if (status === 'Healthy') {
      statusCell.setBackground('#34a853').setFontColor('white');
    } else if (status === 'Warning') {
      statusCell.setBackground('#fbbc04');
    } else if (status === 'At Risk') {
      statusCell.setBackground('#ea4335').setFontColor('white');
    } else if (status === 'Critical') {
      statusCell.setBackground('#880000').setFontColor('white');
    }

    // Color health score
    const scoreCell = sheet.getRange(i, 3);
    const score = accountHealth[i - 2].healthScore;
    if (score >= 85) {
      scoreCell.setBackground('#e6f4ea');
    } else if (score >= 70) {
      scoreCell.setBackground('#fef7e0');
    } else if (score >= 50) {
      scoreCell.setBackground('#fce8e6');
    } else {
      scoreCell.setBackground('#f4c7c3');
    }
  }

  log('Account health sheet written: ' + (data.length - 1) + ' accounts');
}

function writeRedFlagsSheet(ss, redFlags) {
  const sheet = ss.getSheetByName('3. Red Flags');

  if (redFlags.length === 0) {
    sheet.getRange('A1').setValue('No red flags detected! All accounts performing within acceptable ranges.');
    return;
  }

  const headers = ['Account Name', 'Account ID', 'Flag Type', 'Severity', 'Message', 'Value'];

  const data = redFlags.map(function(f) {
    return [
      f.accountName,
      f.accountId,
      f.flag,
      f.severity,
      f.message,
      f.value
    ];
  });

  data.unshift(headers);
  sheet.getRange(1, 1, data.length, headers.length).setValues(data);

  // Formatting
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#ea4335').setFontColor('white');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  // Color severity
  for (let i = 2; i <= data.length; i++) {
    const severityCell = sheet.getRange(i, 4);
    const severity = redFlags[i - 2].severity;

    if (severity === 'Critical') {
      severityCell.setBackground('#ea4335').setFontColor('white');
    } else if (severity === 'Warning') {
      severityCell.setBackground('#fbbc04');
    } else {
      severityCell.setBackground('#e8eaed');
    }
  }

  log('Red flags sheet written: ' + (data.length - 1) + ' flags');
}

function writeTrendsSheet(ss, trends) {
  const sheet = ss.getSheetByName('4. Trends');

  const headers = [
    'Account Name', 'Account ID',
    'Current Spend', 'Previous Spend', 'Spend Change %',
    'Current Conv', 'Previous Conv', 'Conv Change %',
    'Current CPA', 'Previous CPA', 'CPA Change %',
    'Current CTR', 'Previous CTR', 'CTR Change %'
  ];

  const data = trends.map(function(t) {
    return [
      t.accountName,
      t.accountId,
      t.currentSpend,
      t.previousSpend,
      t.spendChange,
      t.currentConversions,
      t.previousConversions,
      t.conversionChange,
      t.currentCPA,
      t.previousCPA,
      t.cpaChange,
      t.currentCTR,
      t.previousCTR,
      t.ctrChange
    ];
  });

  data.unshift(headers);
  sheet.getRange(1, 1, data.length, headers.length).setValues(data);

  // Formatting
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  sheet.getRange(2, 3, data.length - 1, 2).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 6, data.length - 1, 2).setNumberFormat('#,##0.0');
  sheet.getRange(2, 9, data.length - 1, 2).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 12, data.length - 1, 2).setNumberFormat('0.00%');
  sheet.getRange(2, 5, data.length - 1, 1).setNumberFormat('0.0%');
  sheet.getRange(2, 8, data.length - 1, 1).setNumberFormat('0.0%');
  sheet.getRange(2, 11, data.length - 1, 1).setNumberFormat('0.0%');
  sheet.getRange(2, 14, data.length - 1, 1).setNumberFormat('0.0%');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  log('Trends sheet written: ' + (data.length - 1) + ' accounts');
}

function writeHistoricalData(ss, results) {
  const sheet = ss.getSheetByName(CONFIG.HISTORY_SHEET_NAME);
  const today = Utilities.formatDate(new Date(),
    AdsManagerApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');

  // Append row for each account
  const historicalRows = results.accountHealth.map(function(a) {
    return [
      today,
      a.accountName,
      a.accountId,
      a.healthScore,
      a.currentSpend,
      a.currentConversions,
      a.currentCPA,
      a.redFlags ? a.redFlags.length : 0
    ];
  });

  if (historicalRows.length > 0) {
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, historicalRows.length, 8).setValues(historicalRows);
    log('Historical data appended: ' + historicalRows.length + ' rows');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function sendEmailNotification(ss, results) {
  const mccName = AdsManagerApp.currentAccount().getName() || 'MCC';

  const subject = 'MCC Health Alert: ' + results.summary.criticalAccounts + ' critical accounts - ' + mccName;

  let body = 'MCC ACCOUNT HEALTH DASHBOARD\n';
  body += '================================\n\n';
  body += 'MCC: ' + mccName + '\n';
  body += 'Generated: ' + new Date().toISOString() + '\n\n';

  body += 'PORTFOLIO OVERVIEW:\n';
  body += '  Total Accounts: ' + results.summary.totalAccounts + '\n';
  body += '  Healthy: ' + results.summary.healthyAccounts + '\n';
  body += '  Warning: ' + results.summary.warningAccounts + '\n';
  body += '  Critical: ' + results.summary.criticalAccounts + '\n';
  body += '  Average Health Score: ' + results.summary.avgHealthScore.toFixed(1) + '\n\n';

  body += 'CRITICAL ACCOUNTS:\n';
  const criticalAccounts = results.accountHealth.filter(function(a) {
    return a.healthScore < CONFIG.WARNING_HEALTH_THRESHOLD;
  });

  if (criticalAccounts.length === 0) {
    body += '  No critical accounts!\n';
  } else {
    criticalAccounts.forEach(function(a) {
      body += '  • ' + a.accountName + ' (' + a.accountId + '): Score ' + a.healthScore + '\n';
      if (a.redFlags && a.redFlags.length > 0) {
        a.redFlags.slice(0, 2).forEach(function(flag) {
          body += '    - ' + flag.message + '\n';
        });
      }
    });
  }

  body += '\nFull Report: ' + ss.getUrl() + '\n';

  CONFIG.EMAIL_ADDRESSES.forEach(function(email) {
    try {
      MailApp.sendEmail({
        to: email.trim(),
        subject: subject,
        body: body
      });
      log('Email sent to: ' + email);
    } catch (e) {
      log('Warning: Could not send email to ' + email + ': ' + e.message);
    }
  });
}

function sendSlackAlert(results) {
  if (!CONFIG.SLACK_WEBHOOK_URL) return;

  const criticalCount = results.summary.criticalAccounts;
  const warningCount = results.summary.warningAccounts;

  const color = criticalCount > 0 ? '#ea4335' : (warningCount > 0 ? '#fbbc04' : '#34a853');
  const emoji = criticalCount > 0 ? ':rotating_light:' : (warningCount > 0 ? ':warning:' : ':white_check_mark:');

  const payload = {
    text: emoji + ' MCC Health Dashboard Update',
    attachments: [{
      color: color,
      fields: [
        { title: 'Total Accounts', value: results.summary.totalAccounts.toString(), short: true },
        { title: 'Avg Health Score', value: results.summary.avgHealthScore.toFixed(1), short: true },
        { title: 'Healthy', value: results.summary.healthyAccounts.toString(), short: true },
        { title: 'Warning', value: results.summary.warningAccounts.toString(), short: true },
        { title: 'Critical', value: results.summary.criticalAccounts.toString(), short: true },
        { title: 'Red Flags', value: results.redFlags.length.toString(), short: true }
      ],
      footer: 'PPC.io MCC Health Dashboard',
      ts: Math.floor(Date.now() / 1000)
    }]
  };

  try {
    UrlFetchApp.fetch(CONFIG.SLACK_WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    });
    log('Slack notification sent');
  } catch (e) {
    log('Warning: Could not send Slack notification: ' + e.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function log(message) {
  if (CONFIG.VERBOSE_LOGGING) {
    Logger.log(message);
  }
}
