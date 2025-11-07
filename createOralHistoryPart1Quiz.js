function createOralHistoryPart1Quiz() {
  // ====== QUIZ METADATA ======================================================
  var FORM_TITLE = 'Oral History: Part 1 Quiz';
  var FORM_DESC = 'All questions required. Write answers directly in Vietnamese.';
  var ONE_POINT = 1;

  // ====== SECTION 1 (Student Info) ===========================================
  var INFO_TITLE = 'Section 1: Student Information (0 pts)';

  // ====== PART 1 (Writing) ====================================================
  var PART1_TITLE = 'Part 1: Formal Letter (Writing)';
  var PART1_DESC =
    'Write 1-2 paragraphs in formal written Vietnamese. Submit a formal letter to a teacher and/or principal at Warner Middle School requesting a change you would like to see. ' +
    'Include: greeting and opening, statement of purpose, background and reasons, specific request, meeting details, attachments, and closing thanks.';

  // ====== PART 2 (Simultaneous Actions & Conjunctions) =======================
  var PART2_TITLE = 'Part 2: Simultaneous Actions & Conjunctions (10 pts)';
  var PART2_DESC =
    'Translate each prompt into Vietnamese using only “…vừa…vừa…” or “đồng thời” exactly as indicated. Write full sentences; apply notes in brackets.';
  var PART2_PROMPTS = [
    '“I’m both cold and sleepy right now!” [spoken]',
    '“She is both a teacher and a photographer.”',
    '“They’re cooking dinner while chatting.” [spoken]',
    '“The café is both comfortable and quiet.”',
    '“The class is hard; at the same time, it is a lot of work.”',
    '[spoken] “He paid the bill; at the same time, he apologized.”',
    '“During the meeting, we discussed the problem and at the same time thought of solutions.”',
    '“She is exercising and listening to podcasts.” [spoken]',
    '“The school added a new Vietnamese program; at the same time it opened new Spanish classes.”',
    '“He is both excited and nervous about the interview.”'
  ];

  // ====== PART 3 (Negative Markers) ==========================================
  var PART3_TITLE = 'Part 3: Ngữ pháp — Negative Markers (10 pts)';
  var PART3_DESC =
    'Translate each prompt into Vietnamese using the specified negative markers. Follow the tone and regional guidance in parentheses.';
  var PART3_PROMPTS = [
    'I didn’t tell anyone about this (B) — [NEUTRAL]',
    'She doesn’t know anything about the schedule (N) — [STRONG]',
    'We aren’t going anywhere this weekend (B) — [STRONGEST]',
    'He didn’t meet anyone this morning (N) — [NEUTRAL]',
    'There isn’t anything interesting here (B) — [STRONG]',
    'They didn’t hear anything about the event (N) — [STRONGEST]',
    'The bread is all gone. (Indicate North = “hết sạch” or South = “hết trơn.”)',
    'There’s no more rice left in the pot.',
    'My phone battery is totally dead.',
    'After the meeting, the coffee ran out.'
  ];

  // --- Build form with FormApp ----------------------------------------------
  var form = FormApp.create(FORM_TITLE);
  form.setDescription(FORM_DESC);
  form.setIsQuiz(true); // points set via REST below

  form.addSectionHeaderItem().setTitle(INFO_TITLE);
  form.addTextItem().setTitle('First Name').setRequired(true);
  form.addTextItem().setTitle('Last Name').setRequired(true);
  form.addTextItem().setTitle('Period').setHelpText('e.g., 1, 2, 3, 4').setRequired(true);

  form.addPageBreakItem().setTitle(PART1_TITLE).setHelpText(PART1_DESC);
  var essay = form.addParagraphTextItem()
    .setTitle('Formal Letter (1-2 paragraphs)')
    .setHelpText('Use formal written Vietnamese. Graded manually.').setRequired(true);

  form.addPageBreakItem().setTitle(PART2_TITLE).setHelpText(PART2_DESC);
  var part2ItemsMeta = [];
  for (var i = 0; i < PART2_PROMPTS.length; i++) {
    var prompt = PART2_PROMPTS[i];
    var item = form.addTextItem()
      .setTitle('Part 2 Sentence #' + (i + 1))
      .setHelpText(prompt)
      .setRequired(true);
    part2ItemsMeta.push({ title: 'Part 2 Sentence #' + (i + 1) });
  }

  form.addPageBreakItem().setTitle(PART3_TITLE).setHelpText(PART3_DESC);
  var part3ItemsMeta = [];
  for (var j = 0; j < PART3_PROMPTS.length; j++) {
    var prompt3 = PART3_PROMPTS[j];
    var item3 = form.addTextItem()
      .setTitle('Part 3 Sentence #' + (j + 1))
      .setHelpText(prompt3)
      .setRequired(true);
    part3ItemsMeta.push({ title: 'Part 3 Sentence #' + (j + 1) });
  }

  var ss = SpreadsheetApp.create(FORM_TITLE + ' (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Utilities.sleep(1500);

  var expectedTitles = [];
  for (var p2 = 0; p2 < part2ItemsMeta.length; p2++) {
    expectedTitles.push(part2ItemsMeta[p2].title);
  }
  for (var p3 = 0; p3 < part3ItemsMeta.length; p3++) {
    expectedTitles.push(part3ItemsMeta[p3].title);
  }
  expectedTitles.push('Formal Letter (1-2 paragraphs)');

  var apiItems = waitForFormItems_(form.getId(), expectedTitles);
  var indexMap = buildItemLocationMap_(apiItems);
  var questionLookup = buildQuestionLookup_(apiItems);

  var updates = [];

  updates.push({
    updateSettings: {
      settings: { quizSettings: { isQuiz: true } },
      updateMask: 'quizSettings.isQuiz'
    }
  });

  for (var a = 0; a < part2ItemsMeta.length; a++) {
    var questionItem2 = takeQuestionItem_(questionLookup, part2ItemsMeta[a].title);
    if (!questionItem2) {
      throw new Error('Could not find Part 2 item "' + part2ItemsMeta[a].title + '" via API lookup.');
    }
    var qId2 = questionItem2.itemId;
    var loc2 = indexMap[qId2];
    if (!loc2) {
      throw new Error('Could not find location for Part 2 item ' + qId2);
    }
    updates.push(updateItemTextGradingWithLocation_(qId2, { index: loc2.index }, ONE_POINT, [], 'Graded manually.'));
  }

  for (var b = 0; b < part3ItemsMeta.length; b++) {
    var questionItem3 = takeQuestionItem_(questionLookup, part3ItemsMeta[b].title);
    if (!questionItem3) {
      throw new Error('Could not find Part 3 item "' + part3ItemsMeta[b].title + '" via API lookup.');
    }
    var qId3 = questionItem3.itemId;
    var loc3 = indexMap[qId3];
    if (!loc3) {
      throw new Error('Could not find location for Part 3 item ' + qId3);
    }
    updates.push(updateItemTextGradingWithLocation_(qId3, { index: loc3.index }, ONE_POINT, [], 'Graded manually.'));
  }

  var essayItem = takeQuestionItem_(questionLookup, 'Formal Letter (1-2 paragraphs)');
  if (!essayItem) {
    throw new Error('Could not find Part 1 essay item via API lookup.');
  }
  var essayId = essayItem.itemId;
  var essayLoc = indexMap[essayId];
  if (!essayLoc) {
    throw new Error('Could not find location for essay item ' + essayId + '.');
  }
  updates.push({
    updateItem: {
      location: { index: essayLoc.index },
      item: {
        itemId: essayId,
        questionItem: {
          question: {
            grading: { pointValue: 20, generalFeedback: { text: 'Graded with rubric offline.' } }
          }
        }
      },
      updateMask: 'questionItem.question.grading'
    }
  });

  batchUpdateFormRaw_(form.getId(), updates);

  Logger.log('Edit URL: ' + form.getEditUrl());
  Logger.log('Live URL: ' + form.getPublishedUrl());
  Logger.log('Responses sheet: ' + ss.getUrl());
}

// Helper functions -----------------------------------------------------------

function waitForFormItems_(formId, expectedTitles) {
  var attempts = 0;
  var maxAttempts = 6;
  expectedTitles = expectedTitles || [];

  while (attempts < maxAttempts) {
    var items = fetchFormItems_(formId);
    var missing = findMissingTitles_(items, expectedTitles);
    if (missing.length === 0) {
      return items;
    }
    Utilities.sleep(500 * (attempts + 1));
    attempts++;
  }

  throw new Error('Could not find expected items after waiting: ' + expectedTitles.join(', '));
}

function fetchFormItems_(formId) {
  var url = 'https://forms.googleapis.com/v1/forms/' + formId + '?fields=items(itemId,title,questionItem,pageBreakItem)';
  var token = ScriptApp.getOAuthToken();
  var res = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code >= 300) {
    throw new Error('Failed to fetch form structure (' + code + '): ' + res.getContentText());
  }
  var data = JSON.parse(res.getContentText());
  return data.items || [];
}

function findMissingTitles_(items, expectedTitles) {
  if (!expectedTitles || expectedTitles.length === 0) {
    return [];
  }
  var titlesFound = {};
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (!item || !item.questionItem) {
      continue;
    }
    var title = item.title || (item.questionItem.question && item.questionItem.question.title);
    if (title) {
      titlesFound[title] = true;
    }
  }
  var missing = [];
  for (var j = 0; j < expectedTitles.length; j++) {
    var expected = expectedTitles[j];
    if (!titlesFound[expected]) {
      missing.push(expected);
    }
  }
  return missing;
}

function buildItemLocationMap_(items) {
  var map = {};
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item && item.itemId) {
      map[item.itemId] = { index: i };
    }
  }
  return map;
}

function buildQuestionLookup_(items) {
  var lookup = {};
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (!item || !item.itemId || !item.questionItem) {
      continue;
    }
    var title = item.title || (item.questionItem.question && item.questionItem.question.title);
    if (!title) {
      continue;
    }
    if (!lookup[title]) {
      lookup[title] = [];
    }
    lookup[title].push(item);
  }
  return lookup;
}

function takeQuestionItem_(lookup, title) {
  if (!lookup || !lookup[title] || lookup[title].length === 0) {
    return null;
  }
  return lookup[title].shift();
}

function updateItemTextGradingWithLocation_(itemId, locationObj, points, correctAnswersArrayOrNull, feedbackText) {
  var grading = { pointValue: points };
  if (correctAnswersArrayOrNull && correctAnswersArrayOrNull.length > 0) {
    grading.correctAnswers = { answers: correctAnswersArrayOrNull };
  }
  if (feedbackText) {
    grading.generalFeedback = { text: feedbackText };
  }
  return {
    updateItem: {
      location: locationObj,
      item: {
        itemId: itemId,
        questionItem: {
          question: {
            grading: grading
          }
        }
      },
      updateMask: 'questionItem.question.grading'
    }
  };
}

function batchUpdateFormRaw_(formId, requests) {
  var url = 'https://forms.googleapis.com/v1/forms/' + formId + ':batchUpdate';
  var token = ScriptApp.getOAuthToken();
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ includeFormInResponse: false, requests: requests }),
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code >= 300) {
    throw new Error('Forms API error ' + code + ': ' + res.getContentText());
  }
}
