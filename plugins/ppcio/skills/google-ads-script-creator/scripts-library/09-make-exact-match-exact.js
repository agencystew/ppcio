/******************************************************************************
 * MAKE EXACT MATCH EXACT AGAIN
 *
 * Restore the exact match control Google took away.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE PROBLEM                                                                  │
 * │ In 2018, Google quietly expanded "exact match" to include close variants -   │
 * │ synonyms, implied words, word reorders, and more. Your [blue widgets]        │
 * │ keyword now matches "azure gadgets" and you have no control over it.         │
 * │                                                                              │
 * │ THE SOLUTION                                                                 │
 * │ This script identifies every search query triggering your exact match        │
 * │ keywords that ISN'T actually exact - then automatically adds them as         │
 * │ negatives to restore true exact match behavior.                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ WHAT YOU'LL SEE                                                              │
 * │ • Exact Match Purity % - what % of spend is truly exact vs close variants   │
 * │ • Variant breakdown by type (synonyms, word reorder, implied words, etc.)   │
 * │ • Spend leaking to non-exact queries, sorted by impact                      │
 * │ • One-click negative keyword automation to plug the leaks                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ PPC.io | Free Google Ads Scripts                                             │
 * │ © 2025 PPC.io                                                                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * REPLACES (all now 404):
 * - Brainlabs "Make Exact Match Exact"
 * - Brainlabs "Make Phrase Match Exact"
 * - Klientboost "Convert close variants into negatives"
 *
 * SETUP:
 * 1. Copy this script into Google Ads > Tools > Scripts
 * 2. Run in Preview mode first (DRY_RUN: true by default)
 * 3. Review the output spreadsheet
 * 4. Set DRY_RUN: false and ADD_NEGATIVES: true to automate
 * 5. Schedule weekly to continuously maintain exact match purity
 *
 ******************************************************************************/

/******************************************************************************
 * CONFIGURATION - Adjust these values for your account
 ******************************************************************************/
var CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUT SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  SPREADSHEET_URL: 'CREATE_NEW',  // Or paste existing spreadsheet URL
  EMAIL_RECIPIENTS: [],           // ['email@example.com']
  SLACK_WEBHOOK_URL: '',          // Slack incoming webhook URL

  // ═══════════════════════════════════════════════════════════════════════════
  // DATE RANGE
  // ═══════════════════════════════════════════════════════════════════════════
  DATE_RANGE: 'LAST_30_DAYS',

  // ═══════════════════════════════════════════════════════════════════════════
  // FILTERS
  // ═══════════════════════════════════════════════════════════════════════════
  CAMPAIGN_NAME_CONTAINS: '',     // Filter to campaigns containing this
  CAMPAIGN_NAME_EXCLUDES: '',     // Exclude campaigns containing this
  INCLUDE_PAUSED: false,          // Include paused campaigns/entities
  MINIMUM_IMPRESSIONS: 10,        // Minimum impressions to analyze

  // ═══════════════════════════════════════════════════════════════════════════
  // VARIANT DETECTION SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  // Which match types to analyze for close variants
  ANALYZE_EXACT_MATCH: true,      // Analyze exact match keywords
  ANALYZE_PHRASE_MATCH: false,    // Analyze phrase match keywords

  // Misspelling detection (optional)
  INCLUDE_MISSPELLINGS: false,    // Set true to flag misspellings as variants
  MAX_TYPO_DISTANCE: 2,           // Levenshtein distance for misspelling detection

  // ═══════════════════════════════════════════════════════════════════════════
  // NEGATIVE KEYWORD THRESHOLDS
  // ═══════════════════════════════════════════════════════════════════════════
  MIN_SPEND_FOR_NEGATIVE: 10,     // Minimum spend ($) to recommend as negative
  MIN_CONVERSIONS_TO_KEEP: 1,     // Don't negative if conversions >= this
  MIN_CLICKS_FOR_ANALYSIS: 1,     // Minimum clicks to include in analysis

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTOMATION SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  DRY_RUN: true,                  // CRITICAL: Set false to actually add negatives
  ADD_NEGATIVES: false,           // Set true to auto-add negative keywords
  NEGATIVE_LEVEL: 'CAMPAIGN',     // 'CAMPAIGN' or 'AD_GROUP'
  MAX_NEGATIVES_PER_RUN: 100,     // Safety limit on negatives added per run

  // ═══════════════════════════════════════════════════════════════════════════
  // EXECUTION SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  LOG_LEVEL: 'INFO',              // DEBUG, INFO, WARN, ERROR
  TIME_LIMIT_MINUTES: 25,         // Exit gracefully before this (max 30)
  BATCH_SIZE: 500                 // Rows per spreadsheet write
};

/******************************************************************************
 * MAIN EXECUTION
 ******************************************************************************/
function main() {
  var startTime = new Date();
  log('INFO', 'Close Variant Controller started: ' + startTime.toISOString());

  try {
    var ss = initializeSpreadsheet();
    var results = analyzeCloseVariants(startTime);

    if (CONFIG.ADD_NEGATIVES && !CONFIG.DRY_RUN) {
      addNegativeKeywords(results);
    }

    writeAllSheets(ss, results);
    sendNotifications(results, ss.getUrl(), startTime);
    logSummary(results, startTime);

  } catch (error) {
    handleFatalError(error, startTime);
  }
}

/******************************************************************************
 * DATA COLLECTION & ANALYSIS
 ******************************************************************************/
function analyzeCloseVariants(startTime) {
  var results = {
    searchTerms: [],           // All search term data
    variants: [],              // Identified close variants
    negativeCandidates: [],    // Variants recommended for negatives
    convertingVariants: [],    // Variants that are converting
    actionsTaken: [],          // Negatives added (if not DRY_RUN)
    keywordMap: {},            // Keyword text lookup
    summary: {
      totalSearchTerms: 0,
      totalSpend: 0,
      variantsFound: 0,
      variantSpend: 0,
      variantRate: 0,
      negativeCandidates: 0,
      convertingVariants: 0,
      negativesAdded: 0
    }
  };

  // First, build keyword map for lookups
  log('INFO', 'Building keyword map...');
  results.keywordMap = buildKeywordMap(startTime);
  log('INFO', 'Keyword map built: ' + Object.keys(results.keywordMap).length + ' keywords');

  // Fetch search terms and identify variants
  log('INFO', 'Fetching search term data...');
  fetchSearchTermData(results, startTime);

  // Categorize variants
  categorizeVariants(results);

  return results;
}

function buildKeywordMap(startTime) {
  var keywordMap = {};

  try {
    // Use GAQL to get all exact match keywords
    var matchTypes = [];
    if (CONFIG.ANALYZE_EXACT_MATCH) matchTypes.push('"EXACT"');
    if (CONFIG.ANALYZE_PHRASE_MATCH) matchTypes.push('"PHRASE"');

    if (matchTypes.length === 0) {
      log('WARN', 'No match types selected for analysis');
      return keywordMap;
    }

    var query = 'SELECT ' +
      'campaign.id, ' +
      'campaign.name, ' +
      'ad_group.id, ' +
      'ad_group.name, ' +
      'ad_group_criterion.keyword.text, ' +
      'ad_group_criterion.keyword.match_type ' +
      'FROM keyword_view ' +
      'WHERE ad_group_criterion.status = "ENABLED" ' +
      'AND ad_group_criterion.keyword.match_type IN (' + matchTypes.join(', ') + ')';

    if (!CONFIG.INCLUDE_PAUSED) {
      query += ' AND campaign.status = "ENABLED"';
      query += ' AND ad_group.status = "ENABLED"';
    }

    var rows = AdsApp.search(query);
    var count = 0;

    while (rows.hasNext()) {
      var row = rows.next();
      var campaignName = row['campaign.name'];

      // Apply campaign filters
      if (!passesCampaignFilter(campaignName)) continue;

      var keywordText = row['ad_group_criterion.keyword.text'] || '';
      var matchType = row['ad_group_criterion.keyword.match_type'] || '';
      var adGroupId = row['ad_group.id'];
      var campaignId = row['campaign.id'];

      // Normalize keyword for comparison
      var normalizedKeyword = normalizeText(keywordText);

      // Create composite key: campaignId|adGroupId|normalizedKeyword
      var key = campaignId + '|' + adGroupId + '|' + normalizedKeyword;

      keywordMap[key] = {
        original: keywordText,
        normalized: normalizedKeyword,
        matchType: matchType,
        campaignId: campaignId,
        campaignName: campaignName,
        adGroupId: adGroupId,
        adGroupName: row['ad_group.name']
      };

      // Also store by just normalized text for fuzzy matching
      if (!keywordMap['text:' + normalizedKeyword]) {
        keywordMap['text:' + normalizedKeyword] = [];
      }
      keywordMap['text:' + normalizedKeyword].push({
        original: keywordText,
        matchType: matchType,
        campaignName: campaignName,
        adGroupName: row['ad_group.name']
      });

      count++;
      if (count % 500 === 0) {
        checkTimeLimit(startTime);
      }
    }

    log('INFO', 'GAQL: Loaded ' + count + ' keywords');

  } catch (e) {
    log('WARN', 'GAQL keyword fetch failed, using fallback: ' + e.message);
    keywordMap = buildKeywordMapFallback(startTime);
  }

  return keywordMap;
}

function buildKeywordMapFallback(startTime) {
  var keywordMap = {};

  var campaigns = AdsApp.campaigns()
    .withCondition('AdvertisingChannelType = SEARCH');

  if (!CONFIG.INCLUDE_PAUSED) {
    campaigns = campaigns.withCondition('Status = ENABLED');
  }

  var campaignIterator = campaigns.get();

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var campaignName = campaign.getName();

    if (!passesCampaignFilter(campaignName)) continue;

    var keywordIterator = campaign.keywords()
      .withCondition('Status = ENABLED')
      .get();

    while (keywordIterator.hasNext()) {
      var keyword = keywordIterator.next();
      var matchType = keyword.getMatchType();

      if ((CONFIG.ANALYZE_EXACT_MATCH && matchType === 'EXACT') ||
          (CONFIG.ANALYZE_PHRASE_MATCH && matchType === 'PHRASE')) {

        var normalizedKeyword = normalizeText(keyword.getText());

        if (!keywordMap['text:' + normalizedKeyword]) {
          keywordMap['text:' + normalizedKeyword] = [];
        }
        keywordMap['text:' + normalizedKeyword].push({
          original: keyword.getText(),
          matchType: matchType,
          campaignName: campaignName,
          adGroupName: keyword.getAdGroup().getName()
        });
      }
    }

    checkTimeLimit(startTime);
  }

  return keywordMap;
}

function fetchSearchTermData(results, startTime) {
  try {
    // Build match type filter
    var matchTypes = [];
    if (CONFIG.ANALYZE_EXACT_MATCH) matchTypes.push('"EXACT"');
    if (CONFIG.ANALYZE_PHRASE_MATCH) matchTypes.push('"PHRASE"');

    if (matchTypes.length === 0) {
      log('WARN', 'No match types configured');
      return;
    }

    var query = 'SELECT ' +
      'campaign.id, ' +
      'campaign.name, ' +
      'ad_group.id, ' +
      'ad_group.name, ' +
      'search_term_view.search_term, ' +
      'segments.keyword.info.text, ' +
      'segments.keyword.info.match_type, ' +
      'metrics.impressions, ' +
      'metrics.clicks, ' +
      'metrics.cost_micros, ' +
      'metrics.conversions, ' +
      'metrics.conversions_value ' +
      'FROM search_term_view ' +
      'WHERE segments.date DURING ' + CONFIG.DATE_RANGE + ' ' +
      'AND metrics.impressions >= ' + CONFIG.MINIMUM_IMPRESSIONS + ' ' +
      'AND segments.keyword.info.match_type IN (' + matchTypes.join(', ') + ')';

    if (!CONFIG.INCLUDE_PAUSED) {
      query += ' AND campaign.status = "ENABLED"';
    }

    var rows = AdsApp.search(query);
    var count = 0;

    while (rows.hasNext()) {
      var row = rows.next();
      var campaignName = row['campaign.name'];

      // Apply campaign filters
      if (!passesCampaignFilter(campaignName)) continue;

      var searchTerm = row['search_term_view.search_term'] || '';
      var keywordText = row['segments.keyword.info.text'] || '';
      var matchType = row['segments.keyword.info.match_type'] || '';
      var cost = parseInt(row['metrics.cost_micros'] || 0, 10) / 1000000;
      var clicks = parseInt(row['metrics.clicks'] || 0, 10);
      var impressions = parseInt(row['metrics.impressions'] || 0, 10);
      var conversions = parseFloat(row['metrics.conversions'] || 0);
      var convValue = parseFloat(row['metrics.conversions_value'] || 0);

      // Skip if below click threshold
      if (clicks < CONFIG.MIN_CLICKS_FOR_ANALYSIS) continue;

      // Normalize for comparison
      var normalizedSearchTerm = normalizeText(searchTerm);
      var normalizedKeyword = normalizeText(keywordText);

      // Detect variant type
      var variantInfo = detectVariantType(normalizedSearchTerm, normalizedKeyword, searchTerm, keywordText);

      var termData = {
        searchTerm: searchTerm,
        keyword: keywordText,
        matchType: matchType,
        campaignId: row['campaign.id'],
        campaignName: campaignName,
        adGroupId: row['ad_group.id'],
        adGroupName: row['ad_group.name'],
        impressions: impressions,
        clicks: clicks,
        cost: cost,
        conversions: conversions,
        convValue: convValue,
        ctr: impressions > 0 ? (clicks / impressions * 100) : 0,
        convRate: clicks > 0 ? (conversions / clicks * 100) : 0,
        cpa: conversions > 0 ? cost / conversions : null,
        roas: cost > 0 ? convValue / cost : null,
        isVariant: variantInfo.isVariant,
        variantType: variantInfo.type,
        variantReason: variantInfo.reason
      };

      results.searchTerms.push(termData);
      results.summary.totalSearchTerms++;
      results.summary.totalSpend += cost;

      if (termData.isVariant) {
        results.variants.push(termData);
        results.summary.variantsFound++;
        results.summary.variantSpend += cost;
      }

      count++;
      if (count % 500 === 0) {
        log('DEBUG', 'Processed ' + count + ' search terms');
        checkTimeLimit(startTime);
      }
    }

    // Calculate variant rate
    if (results.summary.totalSpend > 0) {
      results.summary.variantRate = (results.summary.variantSpend / results.summary.totalSpend * 100);
    }

    log('INFO', 'Processed ' + count + ' search terms, found ' + results.summary.variantsFound + ' variants');

  } catch (e) {
    log('WARN', 'GAQL search term fetch failed, using fallback: ' + e.message);
    fetchSearchTermDataFallback(results, startTime);
  }
}

function fetchSearchTermDataFallback(results, startTime) {
  var campaigns = AdsApp.campaigns()
    .withCondition('AdvertisingChannelType = SEARCH');

  if (!CONFIG.INCLUDE_PAUSED) {
    campaigns = campaigns.withCondition('Status = ENABLED');
  }

  var campaignIterator = campaigns.get();

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var campaignName = campaign.getName();

    if (!passesCampaignFilter(campaignName)) continue;

    var searchTermIterator = campaign.searchTerms()
      .forDateRange(CONFIG.DATE_RANGE)
      .withCondition('Impressions >= ' + CONFIG.MINIMUM_IMPRESSIONS)
      .get();

    while (searchTermIterator.hasNext()) {
      var searchTerm = searchTermIterator.next();
      var stats = searchTerm.getStatsFor(CONFIG.DATE_RANGE);
      var clicks = stats.getClicks();

      if (clicks < CONFIG.MIN_CLICKS_FOR_ANALYSIS) continue;

      var searchTermText = searchTerm.getText();
      var keywordText = '';
      var matchType = '';

      try {
        var keyword = searchTerm.getKeyword();
        keywordText = keyword.getText();
        matchType = keyword.getMatchType();
      } catch (e) {
        // Keyword may not be available
        continue;
      }

      // Skip if not analyzing this match type
      if ((matchType === 'EXACT' && !CONFIG.ANALYZE_EXACT_MATCH) ||
          (matchType === 'PHRASE' && !CONFIG.ANALYZE_PHRASE_MATCH)) {
        continue;
      }

      var normalizedSearchTerm = normalizeText(searchTermText);
      var normalizedKeyword = normalizeText(keywordText);
      var variantInfo = detectVariantType(normalizedSearchTerm, normalizedKeyword, searchTermText, keywordText);

      var cost = stats.getCost();
      var impressions = stats.getImpressions();
      var conversions = stats.getConversions();
      var convValue = stats.getConversionValue();

      var termData = {
        searchTerm: searchTermText,
        keyword: keywordText,
        matchType: matchType,
        campaignName: campaignName,
        adGroupName: searchTerm.getAdGroup().getName(),
        impressions: impressions,
        clicks: clicks,
        cost: cost,
        conversions: conversions,
        convValue: convValue,
        ctr: impressions > 0 ? (clicks / impressions * 100) : 0,
        convRate: clicks > 0 ? (conversions / clicks * 100) : 0,
        cpa: conversions > 0 ? cost / conversions : null,
        roas: cost > 0 ? convValue / cost : null,
        isVariant: variantInfo.isVariant,
        variantType: variantInfo.type,
        variantReason: variantInfo.reason
      };

      results.searchTerms.push(termData);
      results.summary.totalSearchTerms++;
      results.summary.totalSpend += cost;

      if (termData.isVariant) {
        results.variants.push(termData);
        results.summary.variantsFound++;
        results.summary.variantSpend += cost;
      }
    }

    checkTimeLimit(startTime);
  }

  if (results.summary.totalSpend > 0) {
    results.summary.variantRate = (results.summary.variantSpend / results.summary.totalSpend * 100);
  }
}

/******************************************************************************
 * VARIANT DETECTION LOGIC
 ******************************************************************************/
function detectVariantType(normalizedQuery, normalizedKeyword, originalQuery, originalKeyword) {
  var result = {
    isVariant: false,
    type: 'EXACT_MATCH',
    reason: 'Query matches keyword exactly'
  };

  // Exact match check (normalized)
  if (normalizedQuery === normalizedKeyword) {
    return result;
  }

  // At this point, we know it's some kind of variant
  result.isVariant = true;

  // Check for word reordering
  var queryWords = normalizedQuery.split(' ').sort();
  var keywordWords = normalizedKeyword.split(' ').sort();

  if (queryWords.join(' ') === keywordWords.join(' ')) {
    result.type = 'WORD_REORDER';
    result.reason = 'Same words in different order';
    return result;
  }

  // Check for implied/added words (query has more words than keyword)
  var queryWordSet = normalizedQuery.split(' ');
  var keywordWordSet = normalizedKeyword.split(' ');

  var allKeywordWordsInQuery = keywordWordSet.every(function(word) {
    return queryWordSet.indexOf(word) !== -1;
  });

  if (allKeywordWordsInQuery && queryWordSet.length > keywordWordSet.length) {
    result.type = 'IMPLIED_WORDS';
    result.reason = 'Query has additional words not in keyword';
    return result;
  }

  // Check for words missing from query (keyword has words query doesn't)
  var allQueryWordsInKeyword = queryWordSet.every(function(word) {
    return keywordWordSet.indexOf(word) !== -1;
  });

  if (allQueryWordsInKeyword && keywordWordSet.length > queryWordSet.length) {
    result.type = 'DROPPED_WORDS';
    result.reason = 'Query is missing words from keyword';
    return result;
  }

  // Check for misspelling (if enabled)
  if (CONFIG.INCLUDE_MISSPELLINGS) {
    var distance = levenshteinDistance(normalizedQuery, normalizedKeyword);
    if (distance <= CONFIG.MAX_TYPO_DISTANCE) {
      result.type = 'MISSPELLING';
      result.reason = 'Likely misspelling (edit distance: ' + distance + ')';
      return result;
    }
  }

  // Check for plural/singular variations
  if (isPluralVariation(normalizedQuery, normalizedKeyword)) {
    result.type = 'PLURAL_VARIATION';
    result.reason = 'Plural/singular variation';
    return result;
  }

  // If none of the above, it's a synonym or semantic match
  result.type = 'SYNONYM';
  result.reason = 'Google determined semantic similarity';
  return result;
}

function isPluralVariation(text1, text2) {
  // Simple plural detection
  var words1 = text1.split(' ');
  var words2 = text2.split(' ');

  if (words1.length !== words2.length) return false;

  var differences = 0;
  for (var i = 0; i < words1.length; i++) {
    if (words1[i] !== words2[i]) {
      // Check if one is plural of the other
      if (words1[i] + 's' === words2[i] || words2[i] + 's' === words1[i] ||
          words1[i] + 'es' === words2[i] || words2[i] + 'es' === words1[i] ||
          words1[i].replace(/ies$/, 'y') === words2[i] || words2[i].replace(/ies$/, 'y') === words1[i]) {
        differences++;
      } else {
        return false;
      }
    }
  }

  return differences > 0;
}

function levenshteinDistance(str1, str2) {
  var m = str1.length;
  var n = str2.length;

  // Create distance matrix
  var d = [];
  for (var i = 0; i <= m; i++) {
    d[i] = [i];
  }
  for (var j = 0; j <= n; j++) {
    d[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      var cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // Deletion
        d[i][j - 1] + 1,      // Insertion
        d[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return d[m][n];
}

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  // Remove punctuation
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();
}

/******************************************************************************
 * CATEGORIZATION & RECOMMENDATIONS
 ******************************************************************************/
function categorizeVariants(results) {
  // Sort variants by cost descending
  results.variants.sort(function(a, b) { return b.cost - a.cost; });

  for (var i = 0; i < results.variants.length; i++) {
    var variant = results.variants[i];

    // Check if it's converting
    if (variant.conversions >= CONFIG.MIN_CONVERSIONS_TO_KEEP) {
      results.convertingVariants.push(variant);
      results.summary.convertingVariants++;
      continue;
    }

    // Check if it meets threshold for negative recommendation
    if (variant.cost >= CONFIG.MIN_SPEND_FOR_NEGATIVE) {
      results.negativeCandidates.push(variant);
      results.summary.negativeCandidates++;
    }
  }

  // Sort negative candidates by cost descending
  results.negativeCandidates.sort(function(a, b) { return b.cost - a.cost; });

  // Sort converting variants by conversions descending
  results.convertingVariants.sort(function(a, b) { return b.conversions - a.conversions; });

  log('INFO', 'Categorized: ' + results.summary.negativeCandidates + ' negative candidates, ' +
      results.summary.convertingVariants + ' converting variants');
}

/******************************************************************************
 * NEGATIVE KEYWORD ADDITION
 ******************************************************************************/
function addNegativeKeywords(results) {
  if (CONFIG.DRY_RUN) {
    log('INFO', '[DRY RUN] Would add ' + Math.min(results.negativeCandidates.length, CONFIG.MAX_NEGATIVES_PER_RUN) + ' negatives');
    return;
  }

  var added = 0;
  var errors = 0;

  for (var i = 0; i < results.negativeCandidates.length && added < CONFIG.MAX_NEGATIVES_PER_RUN; i++) {
    var candidate = results.negativeCandidates[i];

    try {
      if (CONFIG.NEGATIVE_LEVEL === 'CAMPAIGN') {
        // Add at campaign level
        var campaigns = AdsApp.campaigns()
          .withCondition('Name = "' + candidate.campaignName.replace(/"/g, '\\"') + '"')
          .get();

        if (campaigns.hasNext()) {
          var campaign = campaigns.next();
          campaign.createNegativeKeyword('[' + candidate.searchTerm + ']');

          results.actionsTaken.push({
            searchTerm: candidate.searchTerm,
            level: 'Campaign',
            campaign: candidate.campaignName,
            adGroup: '-',
            cost: candidate.cost,
            status: 'ADDED'
          });

          added++;
          log('INFO', 'Added campaign negative: [' + candidate.searchTerm + '] to ' + candidate.campaignName);
        }
      } else {
        // Add at ad group level
        var adGroups = AdsApp.adGroups()
          .withCondition('CampaignName = "' + candidate.campaignName.replace(/"/g, '\\"') + '"')
          .withCondition('Name = "' + candidate.adGroupName.replace(/"/g, '\\"') + '"')
          .get();

        if (adGroups.hasNext()) {
          var adGroup = adGroups.next();
          adGroup.createNegativeKeyword('[' + candidate.searchTerm + ']');

          results.actionsTaken.push({
            searchTerm: candidate.searchTerm,
            level: 'Ad Group',
            campaign: candidate.campaignName,
            adGroup: candidate.adGroupName,
            cost: candidate.cost,
            status: 'ADDED'
          });

          added++;
          log('INFO', 'Added ad group negative: [' + candidate.searchTerm + '] to ' + candidate.adGroupName);
        }
      }

    } catch (e) {
      errors++;
      results.actionsTaken.push({
        searchTerm: candidate.searchTerm,
        level: CONFIG.NEGATIVE_LEVEL,
        campaign: candidate.campaignName,
        adGroup: candidate.adGroupName || '-',
        cost: candidate.cost,
        status: 'ERROR: ' + e.message
      });
      log('ERROR', 'Failed to add negative [' + candidate.searchTerm + ']: ' + e.message);
    }
  }

  results.summary.negativesAdded = added;
  log('INFO', 'Added ' + added + ' negatives (' + errors + ' errors)');
}

/******************************************************************************
 * OUTPUT FUNCTIONS
 ******************************************************************************/
function initializeSpreadsheet() {
  var ss;

  if (!CONFIG.SPREADSHEET_URL || CONFIG.SPREADSHEET_URL === 'YOUR_SPREADSHEET_URL_HERE' || CONFIG.SPREADSHEET_URL === 'CREATE_NEW') {
    ss = SpreadsheetApp.create('PPC.io Close Variant Controller - ' +
                               AdsApp.currentAccount().getName() + ' - ' +
                               formatDate(new Date()));
    log('INFO', 'Created spreadsheet: ' + ss.getUrl());
  } else {
    ss = SpreadsheetApp.openByUrl(CONFIG.SPREADSHEET_URL);
  }

  return ss;
}

function writeAllSheets(ss, results) {
  // 1. Summary sheet first
  writeSummarySheet(ss, results);

  // 2. Variant Analysis (all variants sorted by cost)
  if (results.variants.length > 0) {
    var variantData = results.variants.map(function(v) {
      return {
        'Search Term': v.searchTerm,
        'Matched Keyword': v.keyword,
        'Match Type': v.matchType,
        'Variant Type': v.variantType,
        'Reason': v.variantReason,
        'Campaign': v.campaignName,
        'Ad Group': v.adGroupName,
        'Impressions': v.impressions,
        'Clicks': v.clicks,
        'Cost': v.cost,
        'CTR': v.ctr.toFixed(2) + '%',
        'Conversions': v.conversions.toFixed(2),
        'Conv Rate': v.convRate.toFixed(2) + '%',
        'CPA': v.cpa !== null ? '$' + v.cpa.toFixed(2) : '-',
        'ROAS': v.roas !== null ? v.roas.toFixed(2) + 'x' : '-'
      };
    });
    writeSheet(ss, '2. Variant Analysis', variantData,
      ['Search Term', 'Matched Keyword', 'Match Type', 'Variant Type', 'Reason',
       'Campaign', 'Ad Group', 'Cost', 'Clicks', 'Conversions', 'CTR', 'Conv Rate', 'CPA']);
  }

  // 3. Negative Candidates (high spend, no conversions)
  if (results.negativeCandidates.length > 0) {
    var negativeData = results.negativeCandidates.map(function(v) {
      return {
        'Search Term': v.searchTerm,
        'Matched Keyword': v.keyword,
        'Variant Type': v.variantType,
        'Campaign': v.campaignName,
        'Ad Group': v.adGroupName,
        'Cost': '$' + v.cost.toFixed(2),
        'Clicks': v.clicks,
        'Conversions': v.conversions.toFixed(2),
        'Recommendation': 'Add as exact match negative',
        'Negative Format': '[' + v.searchTerm + ']'
      };
    });
    writeSheet(ss, '3. Negative Candidates', negativeData,
      ['Search Term', 'Matched Keyword', 'Variant Type', 'Campaign', 'Ad Group',
       'Cost', 'Clicks', 'Conversions', 'Recommendation', 'Negative Format']);
  }

  // 4. Actions Taken (if any negatives were added)
  if (results.actionsTaken.length > 0) {
    var actionData = results.actionsTaken.map(function(a) {
      return {
        'Search Term': a.searchTerm,
        'Level': a.level,
        'Campaign': a.campaign,
        'Ad Group': a.adGroup,
        'Cost Saved': '$' + a.cost.toFixed(2),
        'Status': a.status
      };
    });
    writeSheet(ss, '4. Actions Taken', actionData,
      ['Search Term', 'Level', 'Campaign', 'Ad Group', 'Cost Saved', 'Status']);
  } else if (!CONFIG.DRY_RUN && CONFIG.ADD_NEGATIVES) {
    // Write empty actions sheet with message
    var sheet = ss.getSheetByName('4. Actions Taken');
    if (!sheet) sheet = ss.insertSheet('4. Actions Taken');
    sheet.clear();
    sheet.getRange(1, 1).setValue('No negatives were added this run');
  }

  // 5. Converting Variants (don't negative these!)
  if (results.convertingVariants.length > 0) {
    var convertingData = results.convertingVariants.map(function(v) {
      return {
        'Search Term': v.searchTerm,
        'Matched Keyword': v.keyword,
        'Variant Type': v.variantType,
        'Campaign': v.campaignName,
        'Ad Group': v.adGroupName,
        'Cost': '$' + v.cost.toFixed(2),
        'Conversions': v.conversions.toFixed(2),
        'Conv Value': '$' + v.convValue.toFixed(2),
        'CPA': v.cpa !== null ? '$' + v.cpa.toFixed(2) : '-',
        'ROAS': v.roas !== null ? v.roas.toFixed(2) + 'x' : '-',
        'Recommendation': 'KEEP - Converting well'
      };
    });
    writeSheet(ss, '5. Converting Variants', convertingData,
      ['Search Term', 'Matched Keyword', 'Variant Type', 'Campaign', 'Ad Group',
       'Cost', 'Conversions', 'Conv Value', 'CPA', 'ROAS', 'Recommendation']);
  }

  // 6. Variant Type Breakdown
  var typeBreakdown = getVariantTypeBreakdown(results);
  if (typeBreakdown.length > 0) {
    writeSheet(ss, '6. Variant Types', typeBreakdown,
      ['Variant Type', 'Count', 'Total Cost', 'Avg Cost', 'Total Conversions', 'Pct of Variants']);
  }
}

function getVariantTypeBreakdown(results) {
  var typeCounts = {};

  for (var i = 0; i < results.variants.length; i++) {
    var v = results.variants[i];
    if (!typeCounts[v.variantType]) {
      typeCounts[v.variantType] = {
        count: 0,
        cost: 0,
        conversions: 0
      };
    }
    typeCounts[v.variantType].count++;
    typeCounts[v.variantType].cost += v.cost;
    typeCounts[v.variantType].conversions += v.conversions;
  }

  var breakdown = [];
  var totalVariants = results.variants.length;

  for (var type in typeCounts) {
    var data = typeCounts[type];
    breakdown.push({
      'Variant Type': type,
      'Count': data.count,
      'Total Cost': '$' + data.cost.toFixed(2),
      'Avg Cost': '$' + (data.cost / data.count).toFixed(2),
      'Total Conversions': data.conversions.toFixed(2),
      'Pct of Variants': (data.count / totalVariants * 100).toFixed(1) + '%'
    });
  }

  // Sort by count descending
  breakdown.sort(function(a, b) { return b.Count - a.Count; });

  return breakdown;
}

function writeSummarySheet(ss, results) {
  var sheet = ss.getSheetByName('1. Summary');
  if (!sheet) {
    sheet = ss.insertSheet('1. Summary', 0);
  } else {
    sheet.clear();
  }

  var modeText = CONFIG.DRY_RUN ? 'DRY RUN (Preview Only)' :
                 (CONFIG.ADD_NEGATIVES ? 'LIVE - Adding Negatives' : 'Analysis Only');

  var data = [
    ['CLOSE VARIANT CONTROLLER', ''],
    ['Generated by PPC.io Script Engine', ''],
    ['https://ppc.io', ''],
    ['', ''],
    ['Account: ' + AdsApp.currentAccount().getName(), ''],
    ['Date Range: ' + CONFIG.DATE_RANGE, ''],
    ['Export Date: ' + new Date().toISOString(), ''],
    ['Mode: ' + modeText, ''],
    ['', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['VARIANT OVERVIEW', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['Total Search Terms Analyzed', results.summary.totalSearchTerms],
    ['Total Search Term Spend', '$' + results.summary.totalSpend.toFixed(2)],
    ['', ''],
    ['Close Variants Found', results.summary.variantsFound],
    ['Variant Spend', '$' + results.summary.variantSpend.toFixed(2)],
    ['Variant Rate', results.summary.variantRate.toFixed(1) + '% of spend'],
    ['', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['RECOMMENDATIONS', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['Negative Candidates (zero conversions, $' + CONFIG.MIN_SPEND_FOR_NEGATIVE + '+ spend)', results.summary.negativeCandidates],
    ['Converting Variants (keep these!)', results.summary.convertingVariants],
    ['', '']
  ];

  // Add action summary if applicable
  if (CONFIG.ADD_NEGATIVES && !CONFIG.DRY_RUN) {
    data.push(['Negatives Added This Run', results.summary.negativesAdded]);
    data.push(['', '']);
  }

  // Add potential savings calculation
  var potentialSavings = 0;
  for (var i = 0; i < results.negativeCandidates.length; i++) {
    potentialSavings += results.negativeCandidates[i].cost;
  }
  data.push(['Potential Monthly Savings (if all negatives added)', '$' + potentialSavings.toFixed(2)]);
  data.push(['', '']);

  data = data.concat([
    ['═══════════════════════════════════════════════════════════════', ''],
    ['SETTINGS USED', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['Analyze Exact Match', CONFIG.ANALYZE_EXACT_MATCH ? 'Yes' : 'No'],
    ['Analyze Phrase Match', CONFIG.ANALYZE_PHRASE_MATCH ? 'Yes' : 'No'],
    ['Min Spend for Negative', '$' + CONFIG.MIN_SPEND_FOR_NEGATIVE],
    ['Min Conversions to Keep', CONFIG.MIN_CONVERSIONS_TO_KEEP],
    ['Include Misspellings', CONFIG.INCLUDE_MISSPELLINGS ? 'Yes' : 'No'],
    ['', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['HOW TO USE THIS REPORT', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['1. Review "Variant Analysis" for all close variants found', ''],
    ['2. Check "Negative Candidates" - these are costing you money', ''],
    ['3. Review "Converting Variants" - DO NOT negative these', ''],
    ['4. Use "Variant Types" to see which types are most costly', ''],
    ['', ''],
    ['To auto-add negatives:', ''],
    ['  1. Set ADD_NEGATIVES = true', ''],
    ['  2. Set DRY_RUN = false', ''],
    ['  3. Review results in "Actions Taken" sheet', ''],
    ['', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['AI ANALYSIS PROMPTS', ''],
    ['═══════════════════════════════════════════════════════════════', ''],
    ['Copy the Variant Analysis data into Claude with these prompts:', ''],
    ['', ''],
    ['Prompt 1', '"How much am I spending on queries that aren\'t my exact keywords?"'],
    ['Prompt 2', '"Which close variants are actually converting and should be kept?"'],
    ['Prompt 3', '"What negative keywords should I add to enforce exact matching?"'],
    ['Prompt 4', '"Are there patterns in the types of variants Google is matching?"'],
    ['Prompt 5', '"Create a prioritized list of negatives to add, ranked by cost saved"']
  ]);

  sheet.getRange(1, 1, data.length, 2).setValues(data);
  sheet.getRange(1, 1).setFontWeight('bold').setFontSize(14);
  sheet.setColumnWidth(1, 450);
  sheet.setColumnWidth(2, 300);

  // Highlight key metrics
  formatSummaryHighlights(sheet, results);
}

function formatSummaryHighlights(sheet, results) {
  // Find and highlight variant rate row
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === 'Variant Rate') {
      var rate = results.summary.variantRate;
      var color = rate > 30 ? '#f8d7da' : rate > 15 ? '#fff3cd' : '#d4edda';
      sheet.getRange(i + 1, 2).setBackground(color);
    }
    if (data[i][0] === 'Negative Candidates (zero conversions, $' + CONFIG.MIN_SPEND_FOR_NEGATIVE + '+ spend)') {
      if (results.summary.negativeCandidates > 0) {
        sheet.getRange(i + 1, 2).setBackground('#f8d7da');
      }
    }
  }
}

function writeSheet(ss, sheetName, data, columns) {
  if (!data || data.length === 0) {
    log('DEBUG', 'No data for sheet: ' + sheetName);
    return;
  }

  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  // Headers
  sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight('bold');
  sheet.setFrozenRows(1);

  // Data rows
  var rows = data.map(function(row) {
    return columns.map(function(col) {
      var val = row[col];
      return val !== null && val !== undefined ? val : '';
    });
  });

  // Batch write
  for (var i = 0; i < rows.length; i += CONFIG.BATCH_SIZE) {
    var batch = rows.slice(i, Math.min(i + CONFIG.BATCH_SIZE, rows.length));
    sheet.getRange(2 + i, 1, batch.length, columns.length).setValues(batch);
  }

  // Color code variant type column if present
  var typeCol = columns.indexOf('Variant Type') + 1;
  if (typeCol > 0 && rows.length > 0) {
    applyVariantTypeColors(sheet, typeCol, rows.length);
  }

  // Auto-resize columns
  for (var col = 1; col <= Math.min(columns.length, 10); col++) {
    sheet.autoResizeColumn(col);
  }

  log('DEBUG', 'Wrote ' + rows.length + ' rows to ' + sheetName);
}

function applyVariantTypeColors(sheet, columnIndex, numRows) {
  var colors = {
    'WORD_REORDER': '#fff3cd',     // Yellow - common issue
    'IMPLIED_WORDS': '#f8d7da',    // Red - often wasteful
    'DROPPED_WORDS': '#f8d7da',    // Red - often wasteful
    'SYNONYM': '#f8d7da',          // Red - most problematic
    'PLURAL_VARIATION': '#d4edda', // Green - usually OK
    'MISSPELLING': '#cce5ff',      // Blue - might want these
    'EXACT_MATCH': '#d4edda'       // Green - not a variant
  };

  var range = sheet.getRange(2, columnIndex, numRows, 1);
  var values = range.getValues();

  var bgColors = values.map(function(row) {
    return [colors[row[0]] || '#ffffff'];
  });

  range.setBackgrounds(bgColors);
}

/******************************************************************************
 * NOTIFICATION FUNCTIONS
 ******************************************************************************/
function sendNotifications(results, spreadsheetUrl, startTime) {
  var duration = ((new Date() - startTime) / 1000).toFixed(1);

  var message = [
    'Close Variant Controller Complete',
    '',
    'Account: ' + AdsApp.currentAccount().getName(),
    'Date Range: ' + CONFIG.DATE_RANGE,
    'Duration: ' + duration + 's',
    '',
    'Summary:',
    '- Search Terms Analyzed: ' + results.summary.totalSearchTerms,
    '- Close Variants Found: ' + results.summary.variantsFound,
    '- Variant Spend: $' + results.summary.variantSpend.toFixed(2) +
      ' (' + results.summary.variantRate.toFixed(1) + '% of total)',
    '- Negative Candidates: ' + results.summary.negativeCandidates,
    '- Converting Variants: ' + results.summary.convertingVariants
  ];

  if (CONFIG.ADD_NEGATIVES && !CONFIG.DRY_RUN) {
    message.push('- Negatives Added: ' + results.summary.negativesAdded);
  }

  message = message.concat([
    '',
    'Report: ' + spreadsheetUrl,
    '',
    '--',
    'Generated by PPC.io Script Engine'
  ]);

  var messageText = message.join('\n');

  if (CONFIG.EMAIL_RECIPIENTS && CONFIG.EMAIL_RECIPIENTS.length > 0) {
    try {
      var urgency = results.summary.variantRate > 30 ? '🔴 HIGH' :
                    results.summary.variantRate > 15 ? '🟡 MEDIUM' : '🟢 LOW';
      MailApp.sendEmail({
        to: CONFIG.EMAIL_RECIPIENTS.join(','),
        subject: '[PPC.io] Close Variants: ' + urgency + ' - $' +
                 results.summary.variantSpend.toFixed(0) + ' variant spend found',
        body: messageText
      });
      log('INFO', 'Email sent');
    } catch (e) {
      log('ERROR', 'Failed to send email: ' + e.message);
    }
  }

  if (CONFIG.SLACK_WEBHOOK_URL) {
    var emoji = results.summary.variantRate > 30 ? ':rotating_light:' :
                results.summary.variantRate > 15 ? ':warning:' : ':white_check_mark:';
    try {
      UrlFetchApp.fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          text: emoji + ' *PPC.io Close Variant Controller*\n```' + messageText + '```'
        })
      });
      log('INFO', 'Slack sent');
    } catch (e) {
      log('ERROR', 'Failed to send Slack: ' + e.message);
    }
  }
}

/******************************************************************************
 * UTILITY FUNCTIONS
 ******************************************************************************/
function passesCampaignFilter(campaignName) {
  if (CONFIG.CAMPAIGN_NAME_CONTAINS &&
      campaignName.toLowerCase().indexOf(CONFIG.CAMPAIGN_NAME_CONTAINS.toLowerCase()) === -1) {
    return false;
  }
  if (CONFIG.CAMPAIGN_NAME_EXCLUDES &&
      campaignName.toLowerCase().indexOf(CONFIG.CAMPAIGN_NAME_EXCLUDES.toLowerCase()) !== -1) {
    return false;
  }
  return true;
}

function checkTimeLimit(startTime) {
  var elapsed = (new Date() - startTime) / 1000 / 60;
  if (elapsed > CONFIG.TIME_LIMIT_MINUTES) {
    throw new Error('TIME_LIMIT: Analysis stopped after ' + elapsed.toFixed(1) + ' minutes. Partial data exported.');
  }
}

function log(level, message) {
  var levels = { 'DEBUG': 0, 'INFO': 1, 'WARN': 2, 'ERROR': 3 };
  if (levels[level] >= levels[CONFIG.LOG_LEVEL]) {
    Logger.log('[' + level + '] ' + message);
  }
}

function logSummary(results, startTime) {
  var duration = ((new Date() - startTime) / 1000).toFixed(1);
  log('INFO', '════════════════════════════════════════');
  log('INFO', 'CLOSE VARIANT CONTROLLER COMPLETE');
  log('INFO', 'Duration: ' + duration + ' seconds');
  log('INFO', 'Search Terms: ' + results.summary.totalSearchTerms);
  log('INFO', 'Variants Found: ' + results.summary.variantsFound);
  log('INFO', 'Variant Spend: $' + results.summary.variantSpend.toFixed(2));
  log('INFO', 'Variant Rate: ' + results.summary.variantRate.toFixed(1) + '%');
  log('INFO', 'Negative Candidates: ' + results.summary.negativeCandidates);
  if (CONFIG.ADD_NEGATIVES && !CONFIG.DRY_RUN) {
    log('INFO', 'Negatives Added: ' + results.summary.negativesAdded);
  }
  log('INFO', '════════════════════════════════════════');
}

function handleFatalError(error, startTime) {
  log('ERROR', '════════════════════════════════════════');
  log('ERROR', 'FATAL ERROR: ' + error.message);
  log('ERROR', 'Stack: ' + error.stack);
  log('ERROR', '════════════════════════════════════════');

  if (CONFIG.EMAIL_RECIPIENTS && CONFIG.EMAIL_RECIPIENTS.length > 0) {
    try {
      MailApp.sendEmail({
        to: CONFIG.EMAIL_RECIPIENTS.join(','),
        subject: '[PPC.io ERROR] Close Variant Controller Failed - ' + AdsApp.currentAccount().getName(),
        body: 'Script failed after ' + ((new Date() - startTime) / 1000).toFixed(1) +
              ' seconds.\n\nError: ' + error.message + '\n\nStack:\n' + error.stack
      });
    } catch (e) {
      log('ERROR', 'Could not send error email: ' + e.message);
    }
  }
}

function formatDate(date) {
  return Utilities.formatDate(date, AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
}
