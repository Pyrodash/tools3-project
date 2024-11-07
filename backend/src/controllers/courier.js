// import { Router } from 'express'
// import authenticationMiddleware from '../middleware/authentication.js'
// import { updateOrderStatus } from './orderUtils.js'
// import Order from '../models/Order.js'
// import { DetailedOrderDTO } from '../dto/order.js'

// const router = new Router()

// router.use(authenticationMiddleware)

// //displayAssignedOrders.
// router.get('/assigned', async (req, res) => {
//     try {
//         const orders = await Order.find({ driverId: req.user._id })
//         res.status(200).json(orders.map((order) => new DetailedOrderDTO(order)))
//     } catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })
// //update Status of Order
// router.put('/orders/:id/status', async (req, res) => {
//     try {
//         const order = await Order.findOne({
//             _id: req.params.id,
//             driverId: req.user._id,
//         })

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' })
//         }

//         const { status } = req.body
//         if (!status) {
//             return res.status(400).json({ message: 'Status is required' })
//         }

//         await updateOrderStatus(order, status)

//         const updatedOrder = await Order.findById(order._id)
//         res.status(200).json(new DetailedOrderDTO(updatedOrder))
//     } catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })

// export default router
import { Router } from 'express'
import authenticationMiddleware from '../middleware/authentication.js'
import roleMiddleware from '../middleware/roleMiddleware.js' // Import role middleware
import { updateOrderStatus } from './orderUtils.js'
import Order from '../models/Order.js'
import { DetailedOrderDTO } from '../dto/order.js'

const router = new Router()

router.use(authenticationMiddleware)

// Display assigned orders (Driver only)
router.get('/assigned', roleMiddleware('driver'), async (req, res) => {
    try {
        const orders = await Order.find({ driverId: req.user._id })
        res.status(200).json(orders.map((order) => new DetailedOrderDTO(order)))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Update status of an order (Driver only)
router.put('/orders/:id/status', roleMiddleware('driver'), async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            driverId: req.user._id,
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

export default router
