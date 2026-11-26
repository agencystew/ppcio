/**
 * Wasted Spend Forensics Report
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PURPOSE                                                                      │
 * │ Identifies and quantifies wasted ad spend across multiple dimensions:        │
 * │ search terms, hours, devices, demographics, and audiences. Consolidates      │
 * │ all waste into a single actionable report with prioritized fixes.            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ REPLACES: Manual multi-tab analysis, fragmented waste reporting              │
 * │ WHY BETTER: Single source of truth for all waste, prioritized action plan    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ PPC.io | Free Google Ads Scripts                                             │
 * │ © 2025 PPC.io - For personal and commercial use with attribution            │
 * │ Questions? support@ppc.io                                                    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * PRE-BUILD SPECIFICATION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * CORE REQUIREMENTS:
 * 1. Analyze search terms for zero/low conversion spend
 * 2. Identify wasteful hours and days of week
 * 3. Flag poor-performing device segments
 * 4. Assess demographic waste (age, gender, income, parental status)
 * 5. Evaluate audience segment performance
 * 6. Calculate total waste by category
 * 7. Generate prioritized action plan
 *
 * GAQL QUERIES NEEDED:
 * - search_term_view for search term performance
 * - ad_group_criterion (hourOfDay, dayOfWeek) for schedule analysis
 * - gender_view, age_range_view, parental_status_view for demographics
 * - campaign_audience_view for audience segments
 * - campaign_criterion (device) for device modifiers
 *
 * DATA PROCESSING:
 * - Waste = spend with zero conversions OR spend with CPA > threshold
 * - Waste Score = (Waste / Total Spend) * Impact Weight
 * - Priority = Waste Amount * Actionability Score
 *
 * OUTPUT STRUCTURE:
 * Sheet 1: "1. Summary" - Overall waste breakdown, total by category
 * Sheet 2: "2. Search Term Waste" - Zero-conversion search terms
 * Sheet 3: "3. Time Waste" - Hours/days with poor performance
 * Sheet 4: "4. Demographic Waste" - Age, gender, device analysis
 * Sheet 5: "5. Action Plan" - Prioritized recommendations
 *
 * AUTOMATION HOOKS:
 * - Email alerts when waste exceeds threshold
 * - CSV export of action items
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION - Customize These Settings
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Spreadsheet Configuration
  SPREADSHEET_URL: '',  // Leave empty to create new, or paste existing URL

  // Date Range
  DATE_RANGE: 'LAST_30_DAYS',  // LAST_7_DAYS, LAST_30_DAYS, LAST_90_DAYS, or custom
  CUSTOM_START_DATE: '',  // Format: 'YYYY-MM-DD' (only if DATE_RANGE is custom)
  CUSTOM_END_DATE: '',    // Format: 'YYYY-MM-DD' (only if DATE_RANGE is custom)

  // Waste Thresholds
  MIN_SPEND_FOR_ANALYSIS: 1,      // Minimum spend to be considered for waste analysis
  MIN_CLICKS_FOR_ANALYSIS: 5,     // Minimum clicks to be considered for waste analysis
  MAX_CPA_MULTIPLIER: 3.0,        // Consider wasteful if CPA > target * this multiplier
  TARGET_CPA: 0,                  // Set to 0 to use account average as baseline
  TARGET_ROAS: 0,                 // Set to 0 to use account average as baseline

  // Zero Conversion Thresholds
  SEARCH_TERM_WASTE_MIN_SPEND: 10,  // Min spend for search term to be flagged
  HOUR_WASTE_MIN_SPEND: 50,         // Min spend per hour slot to be flagged
  DEVICE_WASTE_MIN_SPEND: 100,      // Min spend per device to be flagged
  DEMO_WASTE_MIN_SPEND: 25,         // Min spend per demographic to be flagged
  AUDIENCE_WASTE_MIN_SPEND: 50,     // Min spend per audience to be flagged

  // Filtering Options
  CAMPAIGN_LABEL_FILTER: '',      // Only analyze campaigns with this label (empty = all)
  EXCLUDE_CAMPAIGN_LABEL: '',     // Exclude campaigns with this label
  CAMPAIGN_NAME_CONTAINS: '',     // Filter campaigns by name substring
  CAMPAIGN_TYPES: ['SEARCH', 'SHOPPING', 'PERFORMANCE_MAX'],  // Campaign types to analyze

  // Performance Baselines (calculated if set to 0)
  BASELINE_CTR: 0,      // Expected CTR (0 = calculate from data)
  BASELINE_CVR: 0,      // Expected CVR (0 = calculate from data)

  // Notifications
  SEND_EMAIL: false,
  EMAIL_ADDRESSES: ['your-email@example.com'],
  EMAIL_ONLY_IF_WASTE_EXCEEDS: 500,  // Only email if total waste > this amount

  // Processing Limits
  MAX_SEARCH_TERMS: 10000,        // Maximum search terms to analyze
  MAX_ROWS_PER_SHEET: 50000,      // Maximum rows per output sheet

  // Script Behavior
  INCLUDE_RECOMMENDATIONS: true,   // Generate action recommendations
  CALCULATE_IMPACT_SCORES: true,   // Calculate potential savings
  VERBOSE_LOGGING: true
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

function main() {
  const startTime = new Date();
  log('═══════════════════════════════════════════════════════════════════════');
  log('WASTED SPEND FORENSICS REPORT');
  log('Started: ' + startTime.toISOString());
  log('═══════════════════════════════════════════════════════════════════════');

  try {
    // Initialize spreadsheet
    const ss = initializeSpreadsheet();

    // Get date range
    const dateRange = getDateRange();
    log('Analyzing: ' + dateRange.start + ' to ' + dateRange.end);

    // Calculate baselines
    const baselines = calculateBaselines(dateRange);
    log('Baselines - Target CPA: $' + baselines.targetCPA.toFixed(2) +
        ', Target ROAS: ' + baselines.targetROAS.toFixed(2) +
        ', Total Spend: $' + baselines.totalSpend.toFixed(2));

    // Collect waste from all dimensions
    const wasteData = {
      searchTerms: [],
      hours: [],
      daysOfWeek: [],
      devices: [],
      demographics: [],
      audiences: [],
      summary: {
        totalSpend: baselines.totalSpend,
        totalConversions: baselines.totalConversions,
        totalConversionValue: baselines.totalConversionValue
      }
    };

    // Analyze each dimension
    log('\n--- Analyzing Search Term Waste ---');
    wasteData.searchTerms = analyzeSearchTermWaste(dateRange, baselines);

    log('\n--- Analyzing Time-Based Waste ---');
    const timeWaste = analyzeTimeWaste(dateRange, baselines);
    wasteData.hours = timeWaste.hours;
    wasteData.daysOfWeek = timeWaste.daysOfWeek;

    log('\n--- Analyzing Device Waste ---');
    wasteData.devices = analyzeDeviceWaste(dateRange, baselines);

    log('\n--- Analyzing Demographic Waste ---');
    wasteData.demographics = analyzeDemographicWaste(dateRange, baselines);

    log('\n--- Analyzing Audience Waste ---');
    wasteData.audiences = analyzeAudienceWaste(dateRange, baselines);

    // Calculate summary statistics
    const summary = calculateWasteSummary(wasteData, baselines);

    // Generate action plan
    const actionPlan = generateActionPlan(wasteData, summary);

    // Write all sheets
    log('\n--- Writing Report ---');
    writeSummarySheet(ss, summary, baselines, dateRange);
    writeSearchTermWasteSheet(ss, wasteData.searchTerms);
    writeTimeWasteSheet(ss, wasteData.hours, wasteData.daysOfWeek);
    writeDemographicWasteSheet(ss, wasteData.devices, wasteData.demographics, wasteData.audiences);
    writeActionPlanSheet(ss, actionPlan);

    // Send notification if needed
    if (CONFIG.SEND_EMAIL && summary.totalWaste >= CONFIG.EMAIL_ONLY_IF_WASTE_EXCEEDS) {
      sendEmailNotification(ss, summary, actionPlan);
    }

    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;

    log('\n═══════════════════════════════════════════════════════════════════════');
    log('FORENSICS REPORT COMPLETE');
    log('Duration: ' + duration.toFixed(1) + ' seconds');
    log('Total Waste Identified: $' + summary.totalWaste.toFixed(2));
    log('Waste %: ' + summary.wastePercent.toFixed(1) + '%');
    log('Action Items: ' + actionPlan.length);
    log('Report: ' + ss.getUrl());
    log('═══════════════════════════════════════════════════════════════════════');

  } catch (error) {
    log('ERROR: ' + error.message);
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
    const accountName = AdsApp.currentAccount().getName() || 'Google Ads';
    const timestamp = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
    ss = SpreadsheetApp.create('Wasted Spend Forensics - ' + accountName + ' - ' + timestamp);
    log('Created new spreadsheet: ' + ss.getName());
  }

  // Clear or create sheets
  const sheetNames = ['1. Summary', '2. Search Term Waste', '3. Time Waste', '4. Demographic Waste', '5. Action Plan'];

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

  // Remove any extra default sheets
  ss.getSheets().forEach(function(sheet) {
    if (sheetNames.indexOf(sheet.getName()) === -1 && sheet.getName() !== 'Sheet1') {
      try { ss.deleteSheet(sheet); } catch(e) { /* ignore */ }
    }
  });

  return ss;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATE RANGE HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

function getDateRange() {
  const tz = AdsApp.currentAccount().getTimeZone();
  const today = new Date();
  let startDate, endDate;

  if (CONFIG.DATE_RANGE === 'custom' && CONFIG.CUSTOM_START_DATE && CONFIG.CUSTOM_END_DATE) {
    startDate = CONFIG.CUSTOM_START_DATE;
    endDate = CONFIG.CUSTOM_END_DATE;
  } else {
    endDate = Utilities.formatDate(new Date(today.getTime() - 86400000), tz, 'yyyy-MM-dd');

    const days = {
      'LAST_7_DAYS': 7,
      'LAST_14_DAYS': 14,
      'LAST_30_DAYS': 30,
      'LAST_90_DAYS': 90
    };

    const daysBack = days[CONFIG.DATE_RANGE] || 30;
    startDate = Utilities.formatDate(new Date(today.getTime() - (daysBack * 86400000)), tz, 'yyyy-MM-dd');
  }

  return {
    start: startDate,
    end: endDate,
    gaql: "segments.date BETWEEN '" + startDate + "' AND '" + endDate + "'"
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BASELINE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function calculateBaselines(dateRange) {
  const baselines = {
    totalSpend: 0,
    totalClicks: 0,
    totalImpressions: 0,
    totalConversions: 0,
    totalConversionValue: 0,
    targetCPA: CONFIG.TARGET_CPA,
    targetROAS: CONFIG.TARGET_ROAS,
    avgCTR: CONFIG.BASELINE_CTR,
    avgCVR: CONFIG.BASELINE_CVR
  };

  // Build campaign type filter
  const typeFilter = CONFIG.CAMPAIGN_TYPES.map(function(t) {
    return "campaign.advertising_channel_type = '" + t + "'";
  }).join(' OR ');

  const query = "SELECT " +
    "metrics.cost_micros, " +
    "metrics.clicks, " +
    "metrics.impressions, " +
    "metrics.conversions, " +
    "metrics.conversions_value " +
    "FROM campaign " +
    "WHERE " + dateRange.gaql + " " +
    "AND campaign.status = 'ENABLED' " +
    "AND (" + typeFilter + ")";

  try {
    const results = AdsApp.search(query);

    while (results.hasNext()) {
      const row = results.next();
      baselines.totalSpend += (row.metrics.costMicros || 0) / 1000000;
      baselines.totalClicks += row.metrics.clicks || 0;
      baselines.totalImpressions += row.metrics.impressions || 0;
      baselines.totalConversions += row.metrics.conversions || 0;
      baselines.totalConversionValue += row.metrics.conversionsValue || 0;
    }

    // Calculate derived metrics
    if (baselines.totalConversions > 0 && baselines.targetCPA === 0) {
      baselines.targetCPA = baselines.totalSpend / baselines.totalConversions;
    }

    if (baselines.totalSpend > 0 && baselines.targetROAS === 0) {
      baselines.targetROAS = baselines.totalConversionValue / baselines.totalSpend;
    }

    if (baselines.totalImpressions > 0 && baselines.avgCTR === 0) {
      baselines.avgCTR = (baselines.totalClicks / baselines.totalImpressions) * 100;
    }

    if (baselines.totalClicks > 0 && baselines.avgCVR === 0) {
      baselines.avgCVR = (baselines.totalConversions / baselines.totalClicks) * 100;
    }

  } catch (e) {
    log('Warning: Could not calculate baselines via GAQL: ' + e.message);
    // Fallback - use iterators
    const campaigns = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .forDateRange(CONFIG.DATE_RANGE)
      .get();

    while (campaigns.hasNext()) {
      const campaign = campaigns.next();
      const stats = campaign.getStatsFor(CONFIG.DATE_RANGE);
      baselines.totalSpend += stats.getCost();
      baselines.totalClicks += stats.getClicks();
      baselines.totalImpressions += stats.getImpressions();
      baselines.totalConversions += stats.getConversions();
    }

    if (baselines.totalConversions > 0 && baselines.targetCPA === 0) {
      baselines.targetCPA = baselines.totalSpend / baselines.totalConversions;
    }
  }

  return baselines;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH TERM WASTE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeSearchTermWaste(dateRange, baselines) {
  const wasteTerms = [];
  let processedCount = 0;
  const maxCPA = baselines.targetCPA * CONFIG.MAX_CPA_MULTIPLIER;

  const query = "SELECT " +
    "search_term_view.search_term, " +
    "campaign.name, " +
    "ad_group.name, " +
    "search_term_view.status, " +
    "metrics.cost_micros, " +
    "metrics.clicks, " +
    "metrics.impressions, " +
    "metrics.conversions, " +
    "metrics.conversions_value, " +
    "metrics.ctr, " +
    "metrics.average_cpc " +
    "FROM search_term_view " +
    "WHERE " + dateRange.gaql + " " +
    "AND metrics.cost_micros > " + (CONFIG.SEARCH_TERM_WASTE_MIN_SPEND * 1000000) + " " +
    "ORDER BY metrics.cost_micros DESC " +
    "LIMIT " + CONFIG.MAX_SEARCH_TERMS;

  try {
    const results = AdsApp.search(query);

    while (results.hasNext() && processedCount < CONFIG.MAX_SEARCH_TERMS) {
      const row = results.next();
      processedCount++;

      if (processedCount % 1000 === 0) {
        log('Processed ' + processedCount + ' search terms...');
        if (!checkTimeLimit()) return wasteTerms;
      }

      const spend = (row.metrics.costMicros || 0) / 1000000;
      const conversions = row.metrics.conversions || 0;
      const clicks = row.metrics.clicks || 0;
      const convValue = row.metrics.conversionsValue || 0;

      // Determine if wasteful
      let isWasteful = false;
      let wasteReason = '';
      let wasteAmount = 0;

      if (conversions === 0 && spend >= CONFIG.SEARCH_TERM_WASTE_MIN_SPEND) {
        isWasteful = true;
        wasteReason = 'Zero conversions';
        wasteAmount = spend;
      } else if (conversions > 0 && baselines.targetCPA > 0) {
        const termCPA = spend / conversions;
        if (termCPA > maxCPA) {
          isWasteful = true;
          wasteReason = 'CPA $' + termCPA.toFixed(2) + ' exceeds threshold $' + maxCPA.toFixed(2);
          wasteAmount = spend - (conversions * baselines.targetCPA);
        }
      }

      if (isWasteful && wasteAmount > 0) {
        wasteTerms.push({
          searchTerm: row.searchTermView.searchTerm || '',
          campaign: row.campaign.name || '',
          adGroup: row.adGroup.name || '',
          status: row.searchTermView.status || 'NONE',
          spend: spend,
          clicks: clicks,
          impressions: row.metrics.impressions || 0,
          conversions: conversions,
          conversionValue: convValue,
          ctr: (row.metrics.ctr || 0) * 100,
          cpa: conversions > 0 ? spend / conversions : 0,
          roas: spend > 0 ? convValue / spend : 0,
          wasteAmount: wasteAmount,
          wasteReason: wasteReason
        });
      }
    }

  } catch (e) {
    log('Warning: Could not analyze search terms via GAQL: ' + e.message);
    // Fallback to standard API
    const report = AdsApp.report(
      'SELECT Query, CampaignName, AdGroupName, Cost, Clicks, Impressions, Conversions, ConversionValue ' +
      'FROM SEARCH_QUERY_PERFORMANCE_REPORT ' +
      'WHERE Cost > ' + CONFIG.SEARCH_TERM_WASTE_MIN_SPEND + ' ' +
      'DURING ' + CONFIG.DATE_RANGE
    );

    const rows = report.rows();
    while (rows.hasNext() && processedCount < CONFIG.MAX_SEARCH_TERMS) {
      const row = rows.next();
      processedCount++;

      const spend = parseFloat(row['Cost'].replace(/,/g, '')) || 0;
      const conversions = parseFloat(row['Conversions'].replace(/,/g, '')) || 0;

      if (conversions === 0 && spend >= CONFIG.SEARCH_TERM_WASTE_MIN_SPEND) {
        wasteTerms.push({
          searchTerm: row['Query'],
          campaign: row['CampaignName'],
          adGroup: row['AdGroupName'],
          status: 'NONE',
          spend: spend,
          clicks: parseInt(row['Clicks'].replace(/,/g, '')) || 0,
          impressions: parseInt(row['Impressions'].replace(/,/g, '')) || 0,
          conversions: 0,
          conversionValue: 0,
          ctr: 0,
          cpa: 0,
          roas: 0,
          wasteAmount: spend,
          wasteReason: 'Zero conversions'
        });
      }
    }
  }

  // Sort by waste amount
  wasteTerms.sort(function(a, b) { return b.wasteAmount - a.wasteAmount; });

  const totalSearchTermWaste = wasteTerms.reduce(function(sum, t) { return sum + t.wasteAmount; }, 0);
  log('Found ' + wasteTerms.length + ' wasteful search terms, total waste: $' + totalSearchTermWaste.toFixed(2));

  return wasteTerms;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIME-BASED WASTE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeTimeWaste(dateRange, baselines) {
  const hourlyData = {};
  const dayData = {};

  // Initialize all hours and days
  for (let h = 0; h < 24; h++) {
    hourlyData[h] = { hour: h, spend: 0, clicks: 0, impressions: 0, conversions: 0, conversionValue: 0 };
  }
  const dayNames = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  dayNames.forEach(function(d) {
    dayData[d] = { day: d, spend: 0, clicks: 0, impressions: 0, conversions: 0, conversionValue: 0 };
  });

  // Query hourly data
  const hourQuery = "SELECT " +
    "segments.hour, " +
    "metrics.cost_micros, " +
    "metrics.clicks, " +
    "metrics.impressions, " +
    "metrics.conversions, " +
    "metrics.conversions_value " +
    "FROM campaign " +
    "WHERE " + dateRange.gaql + " " +
    "AND campaign.status = 'ENABLED'";

  try {
    const hourResults = AdsApp.search(hourQuery);

    while (hourResults.hasNext()) {
      const row = hourResults.next();
      const hour = row.segments.hour;

      if (hourlyData[hour]) {
        hourlyData[hour].spend += (row.metrics.costMicros || 0) / 1000000;
        hourlyData[hour].clicks += row.metrics.clicks || 0;
        hourlyData[hour].impressions += row.metrics.impressions || 0;
        hourlyData[hour].conversions += row.metrics.conversions || 0;
        hourlyData[hour].conversionValue += row.metrics.conversionsValue || 0;
      }
    }
  } catch (e) {
    log('Warning: Hourly GAQL failed: ' + e.message);
  }

  // Query day of week data
  const dayQuery = "SELECT " +
    "segments.day_of_week, " +
    "metrics.cost_micros, " +
    "metrics.clicks, " +
    "metrics.impressions, " +
    "metrics.conversions, " +
    "metrics.conversions_value " +
    "FROM campaign " +
    "WHERE " + dateRange.gaql + " " +
    "AND campaign.status = 'ENABLED'";

  try {
    const dayResults = AdsApp.search(dayQuery);

    while (dayResults.hasNext()) {
      const row = dayResults.next();
      const day = row.segments.dayOfWeek;

      if (dayData[day]) {
        dayData[day].spend += (row.metrics.costMicros || 0) / 1000000;
        dayData[day].clicks += row.metrics.clicks || 0;
        dayData[day].impressions += row.metrics.impressions || 0;
        dayData[day].conversions += row.metrics.conversions || 0;
        dayData[day].conversionValue += row.metrics.conversionsValue || 0;
      }
    }
  } catch (e) {
    log('Warning: Day of week GAQL failed: ' + e.message);
  }

  // Calculate waste for hours
  const hourlyWaste = [];
  const avgHourlyCPA = baselines.totalConversions > 0 ? baselines.totalSpend / baselines.totalConversions : 0;
  const maxHourlyCPA = avgHourlyCPA * CONFIG.MAX_CPA_MULTIPLIER;

  Object.keys(hourlyData).forEach(function(h) {
    const data = hourlyData[h];
    if (data.spend < CONFIG.HOUR_WASTE_MIN_SPEND) return;

    let wasteAmount = 0;
    let wasteReason = '';

    if (data.conversions === 0) {
      wasteAmount = data.spend;
      wasteReason = 'Zero conversions';
    } else if (avgHourlyCPA > 0) {
      const hourCPA = data.spend / data.conversions;
      if (hourCPA > maxHourlyCPA) {
        wasteAmount = data.spend - (data.conversions * avgHourlyCPA);
        wasteReason = 'CPA $' + hourCPA.toFixed(2) + ' exceeds threshold';
      }
    }

    if (wasteAmount > 0) {
      data.cpa = data.conversions > 0 ? data.spend / data.conversions : 0;
      data.roas = data.spend > 0 ? data.conversionValue / data.spend : 0;
      data.cvr = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;
      data.wasteAmount = wasteAmount;
      data.wasteReason = wasteReason;
      data.hourFormatted = formatHour(parseInt(h));
      hourlyWaste.push(data);
    }
  });

  // Calculate waste for days
  const dayWaste = [];

  Object.keys(dayData).forEach(function(d) {
    const data = dayData[d];
    if (data.spend < CONFIG.HOUR_WASTE_MIN_SPEND) return;

    let wasteAmount = 0;
    let wasteReason = '';

    if (data.conversions === 0) {
      wasteAmount = data.spend;
      wasteReason = 'Zero conversions';
    } else if (avgHourlyCPA > 0) {
      const dayCPA = data.spend / data.conversions;
      if (dayCPA > maxHourlyCPA) {
        wasteAmount = data.spend - (data.conversions * avgHourlyCPA);
        wasteReason = 'CPA $' + dayCPA.toFixed(2) + ' exceeds threshold';
      }
    }

    if (wasteAmount > 0) {
      data.cpa = data.conversions > 0 ? data.spend / data.conversions : 0;
      data.roas = data.spend > 0 ? data.conversionValue / data.spend : 0;
      data.cvr = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;
      data.wasteAmount = wasteAmount;
      data.wasteReason = wasteReason;
      dayWaste.push(data);
    }
  });

  // Sort by waste
  hourlyWaste.sort(function(a, b) { return b.wasteAmount - a.wasteAmount; });
  dayWaste.sort(function(a, b) { return b.wasteAmount - a.wasteAmount; });

  const totalHourlyWaste = hourlyWaste.reduce(function(sum, h) { return sum + h.wasteAmount; }, 0);
  const totalDayWaste = dayWaste.reduce(function(sum, d) { return sum + d.wasteAmount; }, 0);
  log('Hourly waste: $' + totalHourlyWaste.toFixed(2) + ' across ' + hourlyWaste.length + ' hours');
  log('Day of week waste: $' + totalDayWaste.toFixed(2) + ' across ' + dayWaste.length + ' days');

  return {
    hours: hourlyWaste,
    daysOfWeek: dayWaste,
    allHours: hourlyData,
    allDays: dayData
  };
}

function formatHour(hour) {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return hour + ':00 AM';
  return (hour - 12) + ':00 PM';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE WASTE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeDeviceWaste(dateRange, baselines) {
  const deviceData = {};

  const query = "SELECT " +
    "segments.device, " +
    "metrics.cost_micros, " +
    "metrics.clicks, " +
    "metrics.impressions, " +
    "metrics.conversions, " +
    "metrics.conversions_value " +
    "FROM campaign " +
    "WHERE " + dateRange.gaql + " " +
    "AND campaign.status = 'ENABLED'";

  try {
    const results = AdsApp.search(query);

    while (results.hasNext()) {
      const row = results.next();
      const device = row.segments.device || 'UNKNOWN';

      if (!deviceData[device]) {
        deviceData[device] = {
          device: device,
          spend: 0,
          clicks: 0,
          impressions: 0,
          conversions: 0,
          conversionValue: 0
        };
      }

      deviceData[device].spend += (row.metrics.costMicros || 0) / 1000000;
      deviceData[device].clicks += row.metrics.clicks || 0;
      deviceData[device].impressions += row.metrics.impressions || 0;
      deviceData[device].conversions += row.metrics.conversions || 0;
      deviceData[device].conversionValue += row.metrics.conversionsValue || 0;
    }
  } catch (e) {
    log('Warning: Device GAQL failed: ' + e.message);
    return [];
  }

  // Calculate waste
  const deviceWaste = [];
  const avgCPA = baselines.totalConversions > 0 ? baselines.totalSpend / baselines.totalConversions : 0;
  const maxCPA = avgCPA * CONFIG.MAX_CPA_MULTIPLIER;

  Object.keys(deviceData).forEach(function(d) {
    const data = deviceData[d];
    if (data.spend < CONFIG.DEVICE_WASTE_MIN_SPEND) return;

    let wasteAmount = 0;
    let wasteReason = '';

    if (data.conversions === 0) {
      wasteAmount = data.spend;
      wasteReason = 'Zero conversions';
    } else if (avgCPA > 0) {
      const deviceCPA = data.spend / data.conversions;
      if (deviceCPA > maxCPA) {
        wasteAmount = data.spend - (data.conversions * avgCPA);
        wasteReason = 'CPA $' + deviceCPA.toFixed(2) + ' exceeds threshold';
      }
    }

    if (wasteAmount > 0) {
      data.cpa = data.conversions > 0 ? data.spend / data.conversions : 0;
      data.roas = data.spend > 0 ? data.conversionValue / data.spend : 0;
      data.cvr = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;
      data.wasteAmount = wasteAmount;
      data.wasteReason = wasteReason;
      data.deviceName = formatDeviceName(d);
      deviceWaste.push(data);
    }
  });

  deviceWaste.sort(function(a, b) { return b.wasteAmount - a.wasteAmount; });

  const totalDeviceWaste = deviceWaste.reduce(function(sum, d) { return sum + d.wasteAmount; }, 0);
  log('Device waste: $' + totalDeviceWaste.toFixed(2) + ' across ' + deviceWaste.length + ' devices');

  return deviceWaste;
}

function formatDeviceName(device) {
  const names = {
    'MOBILE': 'Mobile',
    'DESKTOP': 'Desktop',
    'TABLET': 'Tablet',
    'CONNECTED_TV': 'Connected TV',
    'OTHER': 'Other'
  };
  return names[device] || device;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMOGRAPHIC WASTE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeDemographicWaste(dateRange, baselines) {
  const demoWaste = [];
  const avgCPA = baselines.totalConversions > 0 ? baselines.totalSpend / baselines.totalConversions : 0;
  const maxCPA = avgCPA * CONFIG.MAX_CPA_MULTIPLIER;

  // Analyze Age Ranges
  try {
    const ageQuery = "SELECT " +
      "ad_group_criterion.age_range.type, " +
      "metrics.cost_micros, " +
      "metrics.clicks, " +
      "metrics.impressions, " +
      "metrics.conversions, " +
      "metrics.conversions_value " +
      "FROM age_range_view " +
      "WHERE " + dateRange.gaql;

    const ageData = {};
    const ageResults = AdsApp.search(ageQuery);

    while (ageResults.hasNext()) {
      const row = ageResults.next();
      const ageRange = row.adGroupCriterion.ageRange.type || 'UNKNOWN';

      if (!ageData[ageRange]) {
        ageData[ageRange] = {
          segment: ageRange,
          type: 'Age',
          spend: 0,
          clicks: 0,
          impressions: 0,
          conversions: 0,
          conversionValue: 0
        };
      }

      ageData[ageRange].spend += (row.metrics.costMicros || 0) / 1000000;
      ageData[ageRange].clicks += row.metrics.clicks || 0;
      ageData[ageRange].impressions += row.metrics.impressions || 0;
      ageData[ageRange].conversions += row.metrics.conversions || 0;
      ageData[ageRange].conversionValue += row.metrics.conversionsValue || 0;
    }

    Object.values(ageData).forEach(function(data) {
      if (data.spend < CONFIG.DEMO_WASTE_MIN_SPEND) return;

      let wasteAmount = 0;
      if (data.conversions === 0) {
        wasteAmount = data.spend;
      } else if (avgCPA > 0 && (data.spend / data.conversions) > maxCPA) {
        wasteAmount = data.spend - (data.conversions * avgCPA);
      }

      if (wasteAmount > 0) {
        data.cpa = data.conversions > 0 ? data.spend / data.conversions : 0;
        data.roas = data.spend > 0 ? data.conversionValue / data.spend : 0;
        data.wasteAmount = wasteAmount;
        data.segmentFormatted = formatAgeRange(data.segment);
        demoWaste.push(data);
      }
    });

  } catch (e) {
    log('Warning: Age range GAQL failed: ' + e.message);
  }

  // Analyze Gender
  try {
    const genderQuery = "SELECT " +
      "ad_group_criterion.gender.type, " +
      "metrics.cost_micros, " +
      "metrics.clicks, " +
      "metrics.impressions, " +
      "metrics.conversions, " +
      "metrics.conversions_value " +
      "FROM gender_view " +
      "WHERE " + dateRange.gaql;

    const genderData = {};
    const genderResults = AdsApp.search(genderQuery);

    while (genderResults.hasNext()) {
      const row = genderResults.next();
      const gender = row.adGroupCriterion.gender.type || 'UNKNOWN';

      if (!genderData[gender]) {
        genderData[gender] = {
          segment: gender,
          type: 'Gender',
          spend: 0,
          clicks: 0,
          impressions: 0,
          conversions: 0,
          conversionValue: 0
        };
      }

      genderData[gender].spend += (row.metrics.costMicros || 0) / 1000000;
      genderData[gender].clicks += row.metrics.clicks || 0;
      genderData[gender].impressions += row.metrics.impressions || 0;
      genderData[gender].conversions += row.metrics.conversions || 0;
      genderData[gender].conversionValue += row.metrics.conversionsValue || 0;
    }

    Object.values(genderData).forEach(function(data) {
      if (data.spend < CONFIG.DEMO_WASTE_MIN_SPEND) return;

      let wasteAmount = 0;
      if (data.conversions === 0) {
        wasteAmount = data.spend;
      } else if (avgCPA > 0 && (data.spend / data.conversions) > maxCPA) {
        wasteAmount = data.spend - (data.conversions * avgCPA);
      }

      if (wasteAmount > 0) {
        data.cpa = data.conversions > 0 ? data.spend / data.conversions : 0;
        data.roas = data.spend > 0 ? data.conversionValue / data.spend : 0;
        data.wasteAmount = wasteAmount;
        data.segmentFormatted = formatGender(data.segment);
        demoWaste.push(data);
      }
    });

  } catch (e) {
    log('Warning: Gender GAQL failed: ' + e.message);
  }

  demoWaste.sort(function(a, b) { return b.wasteAmount - a.wasteAmount; });

  const totalDemoWaste = demoWaste.reduce(function(sum, d) { return sum + d.wasteAmount; }, 0);
  log('Demographic waste: $' + totalDemoWaste.toFixed(2) + ' across ' + demoWaste.length + ' segments');

  return demoWaste;
}

function formatAgeRange(ageRange) {
  const names = {
    'AGE_RANGE_18_24': '18-24',
    'AGE_RANGE_25_34': '25-34',
    'AGE_RANGE_35_44': '35-44',
    'AGE_RANGE_45_54': '45-54',
    'AGE_RANGE_55_64': '55-64',
    'AGE_RANGE_65_UP': '65+',
    'AGE_RANGE_UNDETERMINED': 'Undetermined'
  };
  return names[ageRange] || ageRange;
}

function formatGender(gender) {
  const names = {
    'MALE': 'Male',
    'FEMALE': 'Female',
    'UNDETERMINED': 'Undetermined'
  };
  return names[gender] || gender;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIENCE WASTE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

function analyzeAudienceWaste(dateRange, baselines) {
  const audienceWaste = [];
  const avgCPA = baselines.totalConversions > 0 ? baselines.totalSpend / baselines.totalConversions : 0;
  const maxCPA = avgCPA * CONFIG.MAX_CPA_MULTIPLIER;

  const query = "SELECT " +
    "campaign_audience_view.resource_name, " +
    "campaign.name, " +
    "metrics.cost_micros, " +
    "metrics.clicks, " +
    "metrics.impressions, " +
    "metrics.conversions, " +
    "metrics.conversions_value " +
    "FROM campaign_audience_view " +
    "WHERE " + dateRange.gaql + " " +
    "AND metrics.cost_micros > " + (CONFIG.AUDIENCE_WASTE_MIN_SPEND * 1000000);

  try {
    const results = AdsApp.search(query);

    while (results.hasNext()) {
      const row = results.next();

      const spend = (row.metrics.costMicros || 0) / 1000000;
      const conversions = row.metrics.conversions || 0;
      const clicks = row.metrics.clicks || 0;
      const convValue = row.metrics.conversionsValue || 0;

      let wasteAmount = 0;
      let wasteReason = '';

      if (conversions === 0) {
        wasteAmount = spend;
        wasteReason = 'Zero conversions';
      } else if (avgCPA > 0) {
        const audienceCPA = spend / conversions;
        if (audienceCPA > maxCPA) {
          wasteAmount = spend - (conversions * avgCPA);
          wasteReason = 'CPA $' + audienceCPA.toFixed(2) + ' exceeds threshold';
        }
      }

      if (wasteAmount > 0) {
        // Extract audience name from resource name
        const resourceParts = (row.campaignAudienceView.resourceName || '').split('/');
        const audienceId = resourceParts[resourceParts.length - 1] || 'Unknown';

        audienceWaste.push({
          audienceId: audienceId,
          campaign: row.campaign.name || '',
          spend: spend,
          clicks: clicks,
          impressions: row.metrics.impressions || 0,
          conversions: conversions,
          conversionValue: convValue,
          cpa: conversions > 0 ? spend / conversions : 0,
          roas: spend > 0 ? convValue / spend : 0,
          wasteAmount: wasteAmount,
          wasteReason: wasteReason
        });
      }
    }

  } catch (e) {
    log('Warning: Audience GAQL failed: ' + e.message);
  }

  audienceWaste.sort(function(a, b) { return b.wasteAmount - a.wasteAmount; });

  const totalAudienceWaste = audienceWaste.reduce(function(sum, a) { return sum + a.wasteAmount; }, 0);
  log('Audience waste: $' + totalAudienceWaste.toFixed(2) + ' across ' + audienceWaste.length + ' audiences');

  return audienceWaste;
}

// ═══════════════════════════════════════════════════════════════════════════════
// WASTE SUMMARY CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function calculateWasteSummary(wasteData, baselines) {
  const summary = {
    totalSpend: baselines.totalSpend,
    totalConversions: baselines.totalConversions,
    totalConversionValue: baselines.totalConversionValue,

    searchTermWaste: wasteData.searchTerms.reduce(function(sum, t) { return sum + t.wasteAmount; }, 0),
    searchTermWasteCount: wasteData.searchTerms.length,

    hourlyWaste: wasteData.hours.reduce(function(sum, h) { return sum + h.wasteAmount; }, 0),
    hourlyWasteCount: wasteData.hours.length,

    dayWaste: wasteData.daysOfWeek.reduce(function(sum, d) { return sum + d.wasteAmount; }, 0),
    dayWasteCount: wasteData.daysOfWeek.length,

    deviceWaste: wasteData.devices.reduce(function(sum, d) { return sum + d.wasteAmount; }, 0),
    deviceWasteCount: wasteData.devices.length,

    demographicWaste: wasteData.demographics.reduce(function(sum, d) { return sum + d.wasteAmount; }, 0),
    demographicWasteCount: wasteData.demographics.length,

    audienceWaste: wasteData.audiences.reduce(function(sum, a) { return sum + a.wasteAmount; }, 0),
    audienceWasteCount: wasteData.audiences.length,

    totalWaste: 0,
    wastePercent: 0,

    // Breakdown for pie chart
    wasteBreakdown: []
  };

  // Note: Don't double-count time-based waste (it's a subset of overall spend)
  // Primary actionable waste = search terms + devices + demographics + audiences
  summary.totalWaste = summary.searchTermWaste + summary.deviceWaste +
                       summary.demographicWaste + summary.audienceWaste;

  // Add time waste as separate category for awareness (but may overlap)
  summary.timeWaste = summary.hourlyWaste + summary.dayWaste;

  if (baselines.totalSpend > 0) {
    summary.wastePercent = (summary.totalWaste / baselines.totalSpend) * 100;
  }

  // Build breakdown
  if (summary.searchTermWaste > 0) {
    summary.wasteBreakdown.push({
      category: 'Search Terms',
      waste: summary.searchTermWaste,
      count: summary.searchTermWasteCount,
      percent: baselines.totalSpend > 0 ? (summary.searchTermWaste / baselines.totalSpend) * 100 : 0
    });
  }

  if (summary.deviceWaste > 0) {
    summary.wasteBreakdown.push({
      category: 'Devices',
      waste: summary.deviceWaste,
      count: summary.deviceWasteCount,
      percent: baselines.totalSpend > 0 ? (summary.deviceWaste / baselines.totalSpend) * 100 : 0
    });
  }

  if (summary.demographicWaste > 0) {
    summary.wasteBreakdown.push({
      category: 'Demographics',
      waste: summary.demographicWaste,
      count: summary.demographicWasteCount,
      percent: baselines.totalSpend > 0 ? (summary.demographicWaste / baselines.totalSpend) * 100 : 0
    });
  }

  if (summary.audienceWaste > 0) {
    summary.wasteBreakdown.push({
      category: 'Audiences',
      waste: summary.audienceWaste,
      count: summary.audienceWasteCount,
      percent: baselines.totalSpend > 0 ? (summary.audienceWaste / baselines.totalSpend) * 100 : 0
    });
  }

  // Sort breakdown by waste amount
  summary.wasteBreakdown.sort(function(a, b) { return b.waste - a.waste; });

  return summary;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTION PLAN GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

function generateActionPlan(wasteData, summary) {
  const actions = [];
  let priority = 1;

  // Search term actions (highest impact usually)
  const topSearchTerms = wasteData.searchTerms.slice(0, 20);
  topSearchTerms.forEach(function(term) {
    actions.push({
      priority: priority++,
      category: 'Search Term',
      action: term.status === 'NONE' ? 'Add as negative keyword' : 'Review match type',
      target: term.searchTerm,
      campaign: term.campaign,
      potentialSavings: term.wasteAmount,
      details: term.wasteReason + ' | Spend: $' + term.spend.toFixed(2) + ' | Clicks: ' + term.clicks,
      effort: 'Low',
      impact: term.wasteAmount > 100 ? 'High' : term.wasteAmount > 25 ? 'Medium' : 'Low'
    });
  });

  // Device actions
  wasteData.devices.forEach(function(device) {
    let action = 'Apply negative bid modifier';
    if (device.conversions === 0) {
      action = 'Consider excluding or -90% bid modifier';
    }

    actions.push({
      priority: priority++,
      category: 'Device',
      action: action,
      target: device.deviceName,
      campaign: 'All applicable campaigns',
      potentialSavings: device.wasteAmount,
      details: device.wasteReason + ' | CPA: $' + device.cpa.toFixed(2),
      effort: 'Low',
      impact: device.wasteAmount > 200 ? 'High' : device.wasteAmount > 50 ? 'Medium' : 'Low'
    });
  });

  // Hourly actions
  const topHours = wasteData.hours.slice(0, 5);
  if (topHours.length > 0) {
    const worstHours = topHours.map(function(h) { return h.hourFormatted; }).join(', ');
    const hourlyPotential = topHours.reduce(function(sum, h) { return sum + h.wasteAmount; }, 0);

    actions.push({
      priority: priority++,
      category: 'Ad Schedule',
      action: 'Apply negative bid modifiers or exclude hours',
      target: worstHours,
      campaign: 'All campaigns',
      potentialSavings: hourlyPotential,
      details: 'Worst performing hours - consider ad scheduling adjustments',
      effort: 'Medium',
      impact: hourlyPotential > 300 ? 'High' : hourlyPotential > 100 ? 'Medium' : 'Low'
    });
  }

  // Day of week actions
  const topDays = wasteData.daysOfWeek.slice(0, 3);
  if (topDays.length > 0) {
    const worstDays = topDays.map(function(d) { return d.day; }).join(', ');
    const dayPotential = topDays.reduce(function(sum, d) { return sum + d.wasteAmount; }, 0);

    actions.push({
      priority: priority++,
      category: 'Ad Schedule',
      action: 'Apply day-of-week bid modifiers',
      target: worstDays,
      campaign: 'All campaigns',
      potentialSavings: dayPotential,
      details: 'Poor performing days - consider reducing bids',
      effort: 'Medium',
      impact: dayPotential > 300 ? 'High' : dayPotential > 100 ? 'Medium' : 'Low'
    });
  }

  // Demographic actions
  wasteData.demographics.forEach(function(demo) {
    let action = 'Apply negative bid modifier';
    if (demo.conversions === 0) {
      action = 'Exclude demographic segment';
    }

    actions.push({
      priority: priority++,
      category: 'Demographics',
      action: action,
      target: demo.type + ': ' + demo.segmentFormatted,
      campaign: 'All applicable campaigns',
      potentialSavings: demo.wasteAmount,
      details: 'Spend: $' + demo.spend.toFixed(2) + ' | Conv: ' + demo.conversions.toFixed(1),
      effort: 'Low',
      impact: demo.wasteAmount > 100 ? 'High' : demo.wasteAmount > 25 ? 'Medium' : 'Low'
    });
  });

  // Audience actions
  const topAudiences = wasteData.audiences.slice(0, 10);
  topAudiences.forEach(function(aud) {
    let action = 'Reduce bid modifier or exclude';
    if (aud.conversions === 0) {
      action = 'Exclude audience segment';
    }

    actions.push({
      priority: priority++,
      category: 'Audience',
      action: action,
      target: 'Audience: ' + aud.audienceId,
      campaign: aud.campaign,
      potentialSavings: aud.wasteAmount,
      details: aud.wasteReason + ' | Spend: $' + aud.spend.toFixed(2),
      effort: 'Medium',
      impact: aud.wasteAmount > 100 ? 'High' : aud.wasteAmount > 25 ? 'Medium' : 'Low'
    });
  });

  // Re-sort by potential savings
  actions.sort(function(a, b) { return b.potentialSavings - a.potentialSavings; });

  // Re-number priorities
  actions.forEach(function(a, i) { a.priority = i + 1; });

  return actions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT SHEET WRITERS
// ═══════════════════════════════════════════════════════════════════════════════

function writeSummarySheet(ss, summary, baselines, dateRange) {
  const sheet = ss.getSheetByName('1. Summary');
  const data = [];

  // Header and overview
  data.push(['WASTED SPEND FORENSICS REPORT']);
  data.push(['Generated: ' + new Date().toISOString()]);
  data.push(['Date Range: ' + dateRange.start + ' to ' + dateRange.end]);
  data.push(['']);

  // Key metrics
  data.push(['KEY METRICS', '']);
  data.push(['Total Spend', '$' + summary.totalSpend.toFixed(2)]);
  data.push(['Total Conversions', summary.totalConversions.toFixed(1)]);
  data.push(['Total Conversion Value', '$' + summary.totalConversionValue.toFixed(2)]);
  data.push(['Account CPA', '$' + baselines.targetCPA.toFixed(2)]);
  data.push(['Account ROAS', baselines.targetROAS.toFixed(2) + 'x']);
  data.push(['']);

  // Waste summary
  data.push(['WASTE SUMMARY', '']);
  data.push(['Total Identified Waste', '$' + summary.totalWaste.toFixed(2)]);
  data.push(['Waste % of Total Spend', summary.wastePercent.toFixed(1) + '%']);
  data.push(['']);

  // Breakdown by category
  data.push(['WASTE BY CATEGORY', 'Amount', 'Items', '% of Spend']);
  summary.wasteBreakdown.forEach(function(cat) {
    data.push([cat.category, '$' + cat.waste.toFixed(2), cat.count, cat.percent.toFixed(1) + '%']);
  });
  data.push(['']);

  // Time-based waste (informational)
  data.push(['TIME-BASED INSIGHTS (May overlap with above)', '']);
  data.push(['Hourly Performance Waste', '$' + summary.hourlyWaste.toFixed(2), summary.hourlyWasteCount + ' hours']);
  data.push(['Day of Week Waste', '$' + summary.dayWaste.toFixed(2), summary.dayWasteCount + ' days']);
  data.push(['']);

  // AI Prompt
  data.push(['AI ANALYSIS PROMPT']);
  data.push(['Copy this prompt into ChatGPT/Claude along with the data tabs for strategic recommendations:']);
  data.push(['']);

  const aiPrompt = 'I have a Google Ads Wasted Spend Forensics Report showing $' + summary.totalWaste.toFixed(2) +
    ' in identified waste (' + summary.wastePercent.toFixed(1) + '% of total spend). ' +
    'The breakdown is: ' + summary.wasteBreakdown.map(function(c) {
      return c.category + ': $' + c.waste.toFixed(2);
    }).join(', ') + '. ' +
    'Please analyze the detailed waste data in the attached tabs and provide: ' +
    '1) Priority ranking of which waste categories to address first based on effort vs impact, ' +
    '2) Specific tactical recommendations for each waste source, ' +
    '3) A 30-day action plan to reduce waste by at least 50%, ' +
    '4) Any patterns that suggest structural account issues vs normal optimization opportunities.';

  data.push([aiPrompt]);

  sheet.getRange(1, 1, data.length, 4).setValues(data.map(function(row) {
    while (row.length < 4) row.push('');
    return row;
  }));

  // Formatting
  sheet.getRange('A1').setFontSize(14).setFontWeight('bold');
  sheet.getRange('A5').setFontWeight('bold');
  sheet.getRange('A12').setFontWeight('bold');
  sheet.getRange('A16').setFontWeight('bold').setBackground('#f3f3f3');
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 150);

  log('Summary sheet written');
}

function writeSearchTermWasteSheet(ss, searchTerms) {
  const sheet = ss.getSheetByName('2. Search Term Waste');

  if (searchTerms.length === 0) {
    sheet.getRange('A1').setValue('No wasteful search terms found meeting threshold criteria.');
    return;
  }

  const headers = [
    'Search Term', 'Campaign', 'Ad Group', 'Status', 'Spend', 'Waste Amount',
    'Clicks', 'Impressions', 'Conversions', 'CPA', 'ROAS', 'Waste Reason'
  ];

  const data = searchTerms.slice(0, CONFIG.MAX_ROWS_PER_SHEET).map(function(t) {
    return [
      t.searchTerm,
      t.campaign,
      t.adGroup,
      t.status,
      t.spend,
      t.wasteAmount,
      t.clicks,
      t.impressions,
      t.conversions,
      t.cpa,
      t.roas,
      t.wasteReason
    ];
  });

  data.unshift(headers);
  sheet.getRange(1, 1, data.length, headers.length).setValues(data);

  // Formatting
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  sheet.getRange(2, 5, data.length - 1, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 6, data.length - 1, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 10, data.length - 1, 1).setNumberFormat('$#,##0.00');
  sheet.getRange(2, 11, data.length - 1, 1).setNumberFormat('0.00');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  log('Search term waste sheet written: ' + (data.length - 1) + ' rows');
}

function writeTimeWasteSheet(ss, hours, days) {
  const sheet = ss.getSheetByName('3. Time Waste');
  const data = [];

  // Hourly waste section
  data.push(['HOURLY PERFORMANCE WASTE']);
  data.push(['Hour', 'Spend', 'Waste Amount', 'Clicks', 'Conversions', 'CPA', 'CVR %', 'Waste Reason']);

  hours.forEach(function(h) {
    data.push([
      h.hourFormatted,
      h.spend,
      h.wasteAmount,
      h.clicks,
      h.conversions,
      h.cpa,
      h.cvr,
      h.wasteReason
    ]);
  });

  if (hours.length === 0) {
    data.push(['No wasteful hours found meeting threshold criteria.']);
  }

  data.push(['']);
  data.push(['']);

  // Day of week section
  data.push(['DAY OF WEEK PERFORMANCE WASTE']);
  data.push(['Day', 'Spend', 'Waste Amount', 'Clicks', 'Conversions', 'CPA', 'CVR %', 'Waste Reason']);

  days.forEach(function(d) {
    data.push([
      d.day,
      d.spend,
      d.wasteAmount,
      d.clicks,
      d.conversions,
      d.cpa,
      d.cvr,
      d.wasteReason
    ]);
  });

  if (days.length === 0) {
    data.push(['No wasteful days found meeting threshold criteria.']);
  }

  // Pad rows to 8 columns
  const paddedData = data.map(function(row) {
    while (row.length < 8) row.push('');
    return row;
  });

  sheet.getRange(1, 1, paddedData.length, 8).setValues(paddedData);

  // Formatting
  sheet.getRange('A1').setFontWeight('bold').setFontSize(12);
  sheet.getRange(2, 1, 1, 8).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');

  const dayStartRow = hours.length + 5;
  sheet.getRange(dayStartRow, 1).setFontWeight('bold').setFontSize(12);
  sheet.getRange(dayStartRow + 1, 1, 1, 8).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');

  sheet.autoResizeColumns(1, 8);

  log('Time waste sheet written');
}

function writeDemographicWasteSheet(ss, devices, demographics, audiences) {
  const sheet = ss.getSheetByName('4. Demographic Waste');
  const data = [];

  // Device section
  data.push(['DEVICE PERFORMANCE WASTE']);
  data.push(['Device', 'Spend', 'Waste Amount', 'Clicks', 'Conversions', 'CPA', 'ROAS', 'Waste Reason']);

  devices.forEach(function(d) {
    data.push([
      d.deviceName,
      d.spend,
      d.wasteAmount,
      d.clicks,
      d.conversions,
      d.cpa,
      d.roas,
      d.wasteReason
    ]);
  });

  if (devices.length === 0) {
    data.push(['No wasteful devices found meeting threshold criteria.']);
  }

  data.push(['']);
  data.push(['']);

  // Demographics section
  data.push(['DEMOGRAPHIC WASTE (Age/Gender)']);
  data.push(['Type', 'Segment', 'Spend', 'Waste Amount', 'Conversions', 'CPA', 'ROAS', '']);

  demographics.forEach(function(d) {
    data.push([
      d.type,
      d.segmentFormatted,
      d.spend,
      d.wasteAmount,
      d.conversions,
      d.cpa,
      d.roas,
      ''
    ]);
  });

  if (demographics.length === 0) {
    data.push(['No wasteful demographics found meeting threshold criteria.']);
  }

  data.push(['']);
  data.push(['']);

  // Audience section
  data.push(['AUDIENCE SEGMENT WASTE']);
  data.push(['Audience ID', 'Campaign', 'Spend', 'Waste Amount', 'Conversions', 'CPA', 'ROAS', 'Waste Reason']);

  audiences.forEach(function(a) {
    data.push([
      a.audienceId,
      a.campaign,
      a.spend,
      a.wasteAmount,
      a.conversions,
      a.cpa,
      a.roas,
      a.wasteReason
    ]);
  });

  if (audiences.length === 0) {
    data.push(['No wasteful audiences found meeting threshold criteria.']);
  }

  // Pad rows
  const paddedData = data.map(function(row) {
    while (row.length < 8) row.push('');
    return row;
  });

  sheet.getRange(1, 1, paddedData.length, 8).setValues(paddedData);

  // Formatting
  let currentRow = 1;
  sheet.getRange(currentRow, 1).setFontWeight('bold').setFontSize(12);
  sheet.getRange(currentRow + 1, 1, 1, 8).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');

  currentRow = devices.length + 5;
  sheet.getRange(currentRow, 1).setFontWeight('bold').setFontSize(12);
  sheet.getRange(currentRow + 1, 1, 1, 8).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');

  currentRow = devices.length + demographics.length + 9;
  sheet.getRange(currentRow, 1).setFontWeight('bold').setFontSize(12);
  sheet.getRange(currentRow + 1, 1, 1, 8).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');

  sheet.autoResizeColumns(1, 8);

  log('Demographic waste sheet written');
}

function writeActionPlanSheet(ss, actions) {
  const sheet = ss.getSheetByName('5. Action Plan');

  if (actions.length === 0) {
    sheet.getRange('A1').setValue('No action items generated - waste levels below thresholds.');
    return;
  }

  const headers = [
    'Priority', 'Category', 'Action', 'Target', 'Campaign',
    'Potential Savings', 'Effort', 'Impact', 'Details'
  ];

  const data = actions.map(function(a) {
    return [
      a.priority,
      a.category,
      a.action,
      a.target,
      a.campaign,
      a.potentialSavings,
      a.effort,
      a.impact,
      a.details
    ];
  });

  data.unshift(headers);
  sheet.getRange(1, 1, data.length, headers.length).setValues(data);

  // Formatting
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
  sheet.getRange(2, 6, data.length - 1, 1).setNumberFormat('$#,##0.00');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  // Conditional formatting for impact
  for (let i = 2; i <= data.length; i++) {
    const impactCell = sheet.getRange(i, 8);
    const impact = actions[i - 2].impact;
    if (impact === 'High') {
      impactCell.setBackground('#ea4335').setFontColor('white');
    } else if (impact === 'Medium') {
      impactCell.setBackground('#fbbc04');
    } else {
      impactCell.setBackground('#34a853').setFontColor('white');
    }
  }

  log('Action plan sheet written: ' + (data.length - 1) + ' action items');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL NOTIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

function sendEmailNotification(ss, summary, actionPlan) {
  const accountName = AdsApp.currentAccount().getName() || 'Google Ads Account';

  const subject = 'Wasted Spend Alert: $' + summary.totalWaste.toFixed(2) +
                  ' identified (' + summary.wastePercent.toFixed(1) + '%) - ' + accountName;

  let body = 'WASTED SPEND FORENSICS REPORT\n';
  body += '================================\n\n';
  body += 'Account: ' + accountName + '\n';
  body += 'Total Spend: $' + summary.totalSpend.toFixed(2) + '\n';
  body += 'Total Waste Identified: $' + summary.totalWaste.toFixed(2) + '\n';
  body += 'Waste Percentage: ' + summary.wastePercent.toFixed(1) + '%\n\n';

  body += 'WASTE BREAKDOWN:\n';
  summary.wasteBreakdown.forEach(function(cat) {
    body += '  • ' + cat.category + ': $' + cat.waste.toFixed(2) + ' (' + cat.count + ' items)\n';
  });

  body += '\nTOP 5 ACTION ITEMS:\n';
  actionPlan.slice(0, 5).forEach(function(action) {
    body += '  ' + action.priority + '. [' + action.category + '] ' + action.action + '\n';
    body += '     Target: ' + action.target + '\n';
    body += '     Potential Savings: $' + action.potentialSavings.toFixed(2) + '\n\n';
  });

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

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function log(message) {
  if (CONFIG.VERBOSE_LOGGING) {
    Logger.log(message);
  }
}

function checkTimeLimit() {
  const MAX_RUNTIME_MS = 25 * 60 * 1000; // 25 minutes
  const elapsed = new Date() - scriptStartTime;
  if (elapsed > MAX_RUNTIME_MS) {
    log('WARNING: Approaching time limit, stopping analysis');
    return false;
  }
  return true;
}

var scriptStartTime = new Date();
