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
  form.setIsQuiz(true);

  form.addSectionHeaderItem().setTitle(INFO_TITLE);
  form.addTextItem().setTitle('First Name').setRequired(true);
  form.addTextItem().setTitle('Last Name').setRequired(true);
  form.addTextItem().setTitle('Period').setHelpText('e.g., 1, 2, 3, 4').setRequired(true);

  form.addPageBreakItem().setTitle(PART1_TITLE).setHelpText(PART1_DESC);
  var essay = form.addParagraphTextItem()
    .setTitle('Formal Letter (1-2 paragraphs)')
    .setHelpText('Use formal written Vietnamese. Graded manually.').setRequired(true);

  form.addPageBreakItem().setTitle(PART2_TITLE).setHelpText(PART2_DESC);
  for (var i = 0; i < PART2_PROMPTS.length; i++) {
    var prompt = PART2_PROMPTS[i];
    var item = form.addTextItem()
      .setTitle('Part 2 Sentence #' + (i + 1))
      .setHelpText(prompt)
      .setRequired(true);
    item.setPoints(ONE_POINT);
  }

  form.addPageBreakItem().setTitle(PART3_TITLE).setHelpText(PART3_DESC);
  for (var j = 0; j < PART3_PROMPTS.length; j++) {
    var prompt3 = PART3_PROMPTS[j];
    var item3 = form.addTextItem()
      .setTitle('Part 3 Sentence #' + (j + 1))
      .setHelpText(prompt3)
      .setRequired(true);
    item3.setPoints(ONE_POINT);
  }

  var ss = SpreadsheetApp.create(FORM_TITLE + ' (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Utilities.sleep(1500);

  essay.setPoints(20);

  Logger.log('Edit URL: ' + form.getEditUrl());
  Logger.log('Live URL: ' + form.getPublishedUrl());
  Logger.log('Responses sheet: ' + ss.getUrl());
}
