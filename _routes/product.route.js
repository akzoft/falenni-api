const { secure, upload } = require('../_config/middleware')
const { v_store_product } = require('../_config/validation')
const { store_product, mise_a_jour, find_product, all_product, delete_product } = require('../_controllers/product.controller')

const router = require('express').Router()

router.post("/creer_un_produit", secure, v_store_product, store_product)
router.put("/mise_a_jour_produit", secure, mise_a_jour)
router.get("/:id", secure, find_product)
router.get("/", all_product)
router.delete("/delete_produit", secure, delete_product)

router.post("/upload_file", upload.array('file', 4), (req, res) => res.status(200).send({ response: req.files.map(file => file.filename) }))

module.exports = router