import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoute from '../routes/User.js'

dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected')
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

app.use('/api/user', userRoute)

app.listen(PORT, async () => {
    await connectDB()
    console.log(`Server running on http://localhost:${PORT}`)
})
