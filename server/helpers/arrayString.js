const arrayString = (array, options = {
  quotes: 'single'
}) => {
  const quote = options.quotes === 'double' ? '"'
    : options.quotes === 'single' ? "'"
    : '';
  return array.reduce((string, item, i) => {
    return `${string}${quote}${item}${quote}${i !== array.length - 1 ? ',' : ''}`;
  }, '')
}

module.exports = arrayString;