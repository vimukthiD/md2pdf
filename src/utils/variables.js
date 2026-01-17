'use strict';

function substituteVariables(template, variables, filename) {
  if (!template) {
    return '';
  }

  const now = new Date();
  const yearValue = variables?.year;
  const year = yearValue === 'auto' || yearValue === undefined
    ? now.getFullYear().toString()
    : yearValue;

  const builtInVars = {
    year,
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
    filename: filename || '',
    page: '<span class="pageNumber"></span>',
    total: '<span class="totalPages"></span>'
  };

  const allVars = { ...builtInVars, ...variables };
  if (variables?.year === 'auto') {
    allVars.year = year;
  }

  let result = template;
  for (const [key, value] of Object.entries(allVars)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value || '');
  }

  return result;
}

module.exports = {
  substituteVariables
};
