const { secure, upload } = require('../_config/middleware')
const { v_inscription_user, v_update_user, v_connexion_user } = require('../_config/validation')
const { inscription, phone_checking, mise_a_jour, all_users, find_user, authentification, profile, connexion, forgot_phone_checking, verify_recovery_code, reset_password } = require('../_controllers/user.controller')

const router = require('express').Router()

router.post("/checking_phone", phone_checking)
router.post("/forgot_checking_phone", forgot_phone_checking)
router.post("/verify_recovery_code", verify_recovery_code)
router.post("/reset_password", reset_password)
router.post("/authentification", authentification)
router.get("/profil/me", secure, profile)
router.post("/inscription", v_inscription_user, inscription)
router.post("/connexion", v_connexion_user, connexion)
router.put("/mise_a_jour/:id", v_update_user, mise_a_jour)
router.get("/:id", find_user)
router.get("/", all_users)

router.post("/upload_file", upload.single("file"), (req, res) => res.status(200).send({ response: req.file.filename }))


module.exports = router