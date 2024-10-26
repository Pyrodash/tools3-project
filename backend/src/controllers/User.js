import user from '../models/User.js'
import bcrypt from 'bcrypt'

const saltRounds = 10

function correctEmail(email) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

function correctRegisterationData(data) {
    if (!data.name || !data.email || !data.password || !data.phone) {
        return false
    }
    if (data.name.length < 3 || data.name.length > 20) {
        return false
    }
    if (data.password.length < 6 || data.password.length > 20) {
        return false
    }
    if (
        data.name == '' ||
        data.email == '' ||
        data.password == '' ||
        data.phone == ''
    ) {
        return false
    }
    if (!correctEmail(data.email)) {
        return false
    }
    return true
}

async function saveData(data) {
    const newUser = new user(data)
    newUser.password = await hashPassword(newUser.password)
    await newUser.save()
}

function correctLoginData(data) {
    if (!data.email || !data.password) {
        return false
    }
    if (data.email == '' || data.password == '') {
        return false
    }
    if (!correctEmail(data.email)) {
        return false
    }
    return true
}

function checkPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
}

export default {
    correctLoginData,
    correctRegisterationData,
    saveData,
    checkPassword,
}
