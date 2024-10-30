import { User } from '../../model/index.js'
import bcrypt from 'bcrypt';

export const createUser = async (data) => {
    const { name, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    const userData = { name, email, password: hashPassword };
    const user = await User.create(userData);
    return user;
}

export const findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

export const findUserById = async (id) => {
    const user = await User.findById(id);
    return user;
}
export const updateUser = async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data);
    return user;
}
export const updateToken = async (id, token) => {
    const user = await User.findByIdAndUpdate(id, { token });
    return user;
}
export const comparePassword = async (password, hashPassword) => {
    const compare = await bcrypt.compare(password, hashPassword);
    return compare;
}