const BookingDetails = require('./../models/booking_details')

const getAll = async (req, res, next) => {
  try {
    res.json(await BookingDetails.find())
  } catch(e) {
    logger.error(`CTRL_BOOKING_DETAILS > getAll - ${e}`)
    next()
  }
}

const updateById = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) return res.status(401).json({ error: true, message: 'Invalid id.' })

    const booking = await BookingsDetails.findOne({ _id: id })
    if (!booking) return res.status(404).json({ error: false, message: 'No booking found.' })

    const payload = {}
    const fields = [
      'plateNo',
      'task',
      'status',
      'shippingLine',
      'containerNo',
    ]

    fields.each(field => {
      if (req.body[field]) {
        payload[field] = req.body[field]
      }
    })

    payload.updated_by = req.user._id
    payload.updated_date = Date.now()

    booking.set(payload)
    const updatedBooking = await booking.save()
    if (!updatedBooking) return res.status(500).json({ error: true, message: 'Server error.' })

    res.json(updatedBooking)
  } catch(e) {
    logger.error(`CTRL_BOOKING_DETAILS > updateById - ${e}`)
    next()
  }
}

module.exports = {
  getAll,
  updateById,
}
