exports.validatePhone = (phone) => {
    const phoneRegex = /^1?[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
    return phoneRegex.test(phone);
}

exports.validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
}

