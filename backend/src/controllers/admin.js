import { Router } from 'express'
import authenticationMiddleware from '../middleware/authentication.js'
import { updateOrderStatus } from '../services/orderService.js'
import Order from '../models/Order.js'
import { DetailedOrderDTO } from '../dto/order.js'

const router = new Router()

router.use(authenticationMiddleware)

router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders.map((order) => new DetailedOrderDTO(order)))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/orders/:id/status', async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            sellerId: req.user._id,
        })

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        const { status } = req.body
        if (!status) {
            return res.status(400).json({ message: 'Status is required' })
        }

        await updateOrderStatus(order, status)

        const updatedOrder = await Order.findById(order._id)
        res.status(200).json(new DetailedOrderDTO(updatedOrder))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/orders/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.status(200).json({ message: 'Order deleted successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/orders/:id/assign', async (req, res) => {
    try {
        const { driverId } = req.body
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { driverId, status: 'pending' },
            { new: true },
        )
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.status(200).json(new DetailedOrderDTO(updatedOrder))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default router
