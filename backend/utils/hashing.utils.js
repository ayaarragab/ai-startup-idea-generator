import bcrypt from 'bcrypt';

export const hashText = async (plain) => {
    const hashed = await bcrypt.hash(plain, 10);
    return hashed;
}

export const compareTexts = async (plain, hashed) => {
    const result = await bcrypt.compare(plain, hashed);
    return result;
}