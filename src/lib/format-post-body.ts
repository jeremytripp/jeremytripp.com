/**
 * Fixes common formatting issues in imported LinkedIn/post text:
 * - Missing space after . ? ! before a capital letter (sentence boundary)
 * - Missing space before opening quote after sentence end
 * - Restores paragraph breaks before common sentence starters
 * - Normalizes excessive newlines
 */
export function formatPostBody(body: string): string {
  if (!body || typeof body !== 'string') return body;
  let text = body.trim();

  // 1. Add missing space after sentence-ending punctuation when followed by [A-Z]
  //    e.g. "sports.Somehow" -> "sports. Somehow"
  text = text.replace(/([.!?])([A-Z])/g, '$1 $2');

  // 2. Add missing space after . ? ! when followed by opening quote
  text = text.replace(/([.!?])(["'\u201C])/g, '$1 $2');

  // 3. Normalize 3+ newlines to double newline
  text = text.replace(/\n{3,}/g, '\n\n');

  // 4. Insert paragraph break before common paragraph-starting phrases
  //    (only when they appear after a period + space, so we don't break mid-sentence)
  const paragraphStarters = [
    'But ',
    'But the ',
    'So ',
    'So instead ',
    'And ',
    'And for ',
    'And no,',
    'And sadly,',
    'Instead,',
    'Instead of ',
    'This is ',
    'This study ',
    'This piece ',
    'This directly ',
    'This year ',
    'We ',
    'We saw ',
    'We have ',
    'We attacked ',
    'We always ',
    'We treat ',
    'We\'ve ',
    'We\'re ',
    'The real ',
    'The hard ',
    'The result',
    'The primary ',
    'The things ',
    'The endless ',
    'The fan ',
    'The clock ',
    'The foundation ',
    'The new year ',
    'The technology ',
    'Looking forward,',
    'Now on ',
    'Now comes ',
    'Now I ',
    'Here is ',
    'Here\'s to ',
    'If you ',
    'If you don\'t ',
    'If you have ',
    'If you share ',
    'If you want ',
    'What works ',
    'What we ',
    'When we ',
    'When you ',
    'I think ',
    'I try ',
    'I read',
    'I believe ',
    'I implore ',
    'I\'m curious ',
    'In stadiums,',
    'In soccer,',
    'In fact,',
    'In those ',
    'In any given ',
    'At CITY,',
    'At St. Louis',
    'At Energizer',
    'Or accessibility',
    'Whether it\'s ',
    'Proud to ',
    'Thanks to ',
    'As someone ',
    'Have you ',
    'Step by step,',
    'Key milestones:',
    'Our philosophy ',
    'That foundation ',
    'That\'s innovation ',
    'That\'s uncomfortable.',
    'Not the tech ',
    'The assistant ',
    'There\'s so much ',
    'Congrats ',
    'Yes, ',
    'All three ',
    'Each surprised ',
    'Better yet,',
    'Make a list ',
    'The pressure is ',
    'Short-term urgency ',
    'The feedback ',
    'Substance over ',
  ];
  for (const phrase of paragraphStarters) {
    const regex = new RegExp(`\\. (${escapeRegex(phrase.trim())})`, 'g');
    text = text.replace(regex, '.\n\n$1');
  }

  // 5. Collapse any single \n that might have been left mid-paragraph by accident
  //    (only collapse \n that are between two lowercase letters or comma - be conservative)
  //    Actually skip - we might have intentional single newlines. Just normalize \n\n\n to \n\n again
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply same spacing fixes to a title or short string (no paragraph logic).
 */
export function formatPostTitle(title: string): string {
  if (!title || typeof title !== 'string') return title;
  let text = title.trim();
  text = text.replace(/([.!?])([A-Z])/g, '$1 $2');
  text = text.replace(/([.!?])(["'\u201C])/g, '$1 $2');
  return text;
}
