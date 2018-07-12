export default message => (value) => {
  const digits = Array.from(value).filter(digit => /[0-9]/.test(digit))
  return !(digits.length === 11 || digits.length === 10) && message
}
