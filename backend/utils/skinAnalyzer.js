function analyzeSkinType(answers) {
  let scores = { dry: 0, normal: 0, combo: 0, oily: 0 };

  Object.entries(answers).forEach(([key, value]) => {
    const val = Array.isArray(value) ? value.join(' ') : value;
    const str = val.toLowerCase();

    if (str.includes('tight') || str.includes('dry')) scores.dry++;
    else if (str.includes('normal')) scores.normal++;
    else if (str.includes('middle') || str.includes('slightly')) scores.combo++;
    else if (str.includes('oily') || str.includes('greasy') || str.includes('shiny')) scores.oily++;
  });

  const skinType = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  return skinType;
}

module.exports = analyzeSkinType;
