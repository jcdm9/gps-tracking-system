const Legacy = require('./../models/legacy')
const Companies = require("./../models/companies");

const mapCreatedCompany = async (createdCompany, creatorsControlId) => {
  const parentCompany = await Companies.findOne({ controlId: creatorsControlId })
  // create immediate family
  await createLegacy(parentCompany, createdCompany)
  const parents = await Legacy.find({ child: creatorsControlId })

  parents.forEach(async parent => {
    const parentCompany = await Companies.findOne({ controlId: parent.parent })
    await createLegacy(parentCompany, createdCompany)
  })
}

const createLegacy = async (parent, child) => {
  const immediateLegacy = new Legacy({
    parent: parent.controlId,
    child: child.controlId
  })

  await immediateLegacy.save()
}

module.exports = {
  mapCreatedCompany
}
