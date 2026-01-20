import bcrypt from 'bcrypt';

export const hashPassword = async (plain) => {
    const hashed = await bcrypt.hash(plain, 10);
    return hashed;
}

export const comparePasswords = async (plain, hashed) => {
    const result = await bcrypt.compare(plain, hashed);
    return result;
}