const Legacy = require('./../models/legacy')
const Companies = require('./../models/companies')

const cbs = async (payload, page = '') => {
  const { controlId } = payload;
  if (payload.cbs) {
    return {};
  } else {
    const result = []
    let children
    if (page == 'booking' || page == 'dispatch') {
      children = await Legacy
        .find({
          $or: [{
            parent: controlId
          }, {
            child: controlId
          }]
        })

      result.push(controlId)
      await children.forEach(child => {
        result.push(child.child)
        result.push(child.parent)
      })
    } else {
      children = await Legacy
        .find({
            parent: controlId
        })

      result.push(controlId)
      await children.forEach(child => {
        result.push(child.child)
      })
    }



    return {
      'controlId': {
        $in: result
      }
    }
  }
};

module.exports = { cbs };
