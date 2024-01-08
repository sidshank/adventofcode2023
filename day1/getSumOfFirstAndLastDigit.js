export default line => {
    const digits = line.replace(/[a-zA-Z]/g, '');
    return Number(digits[0] + digits[digits.length - 1]);
}