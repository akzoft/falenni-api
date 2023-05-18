const { isValidObjectId } = require("mongoose");
const { dataSecure, removePhoneIndicatif, genRandomNums, addPhoneIndicatif, isEmpty } = require("../_config/functions");
const { send_sms } = require("../_config/modules");
const UserModel = require("../_models/user.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require("fs")

exports.phone_checking = async (req, res) => {
    try {
        if (!req.body.phone) throw "Un numéro de téléphone est requis."
        const user = await UserModel.findOne({ phone: removePhoneIndicatif(dataSecure(req.body.phone, "int")) })
        if (user) throw "Ce compte existe déjà."

        const code = genRandomNums(5)

        let message = `Votre code de vérification est: ${code}.\nUtilisez le pouvoir valider votre inscription.`
        send_sms(addPhoneIndicatif(req.body.phone), message)

        res.status(200).json({ response: code, message: "Code de vérification envoyé." })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.forgot_phone_checking = async (req, res) => {
    try {
        if (!req.body.phone) throw "Un numéro de téléphone est requis."
        const user = await UserModel.findOne({ phone: removePhoneIndicatif(dataSecure(req.body.phone, "int")) })
        if (!user || isEmpty(user)) throw "Ce compte n'existe pas."

        const code = genRandomNums(4)

        let message = `Votre code de réinitialisation de mot de passe est: ${code}.`
        send_sms(addPhoneIndicatif(req.body.phone), message)

        res.status(200).json({ response: code, message: "Code de réinitialisation envoyé." })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.verify_recovery_code = async (req, res) => {
    try {
        const { code, codeInputed } = req.body

        if (!codeInputed || codeInputed === "") throw "Le code de réinitialisation est requis."
        if (code !== codeInputed) throw "Votre code de réinitialisation est incorrect."

        res.send({ response: true, message: "Code correct." })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}

exports.reset_password = async (req, res) => {
    try {
        let { password, confirm, phone } = req.body

        if (!password || password === "") throw "Un mot de passe est requis."
        if (password && password.length < 6) throw "Taille mot de passe trop court. Min 6 caractères"
        if (password !== confirm) throw "Les mots de passe ne se correspondent pas."

        const user = await UserModel.findOne({ phone })
        if (isEmpty(user)) "Ce compte n'existe pas."

        if (password && password !== "") {
            const salt = await bcrypt.genSalt(10)
            password = await bcrypt.hash(password, salt)
        }

        await user.updateOne({ $set: { password } }, { new: true, upsert: true })

        res.send({ response: true, message: "Mot de passe réinitialisé." })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}

exports.authentification = async (req, res) => {
    try {
        let token = req.header("token")

        const data = jwt.verify(token, process.env.JWT_SECRET)
        if (isEmpty(data.id)) return res.status(200).send(false)

        const user = await UserModel.findById(data.id)
        if (isEmpty(user)) return res.status(200).send(false)

        res.status(200).send(true)
    } catch (error) {
        return res.status(500).send({ message: false })
    }
}

exports.profile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.id).select("-password")

        if (isEmpty(user)) throw "Erreur d'authentification"

        res.status(200).send({ response: user, message: "Profile utilisateur recupéré avec succès." })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}

exports.connexion = async (req, res) => {
    try {
        var { phone } = req.body;
        if (phone) phone = removePhoneIndicatif(dataSecure(phone, "int"));

        const user = await UserModel.findOne({ phone });

        if (isEmpty(user) || user === null) throw `Numero de téléphone ou mot de passe incorrect.`;

        const pass = await bcrypt.compare(req.body.password, user.password);
        if (!pass) throw `Numero de téléphone ou mot de passe incorrect.`;


        // Create token JWT who expired in 3hours
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })

        let { password, ...rest } = user._doc
        res.status(200).json({ token, response: rest, message: "Vous êtes connecté." })

    } catch (error) {
        res.status(500).send({ message: error })
    }
}

exports.inscription = async (req, res) => {
    try {

        req.body.email = dataSecure(req.body.email, "str");
        req.body.phone = removePhoneIndicatif(dataSecure(req.body.phone, "int"));

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)

        const toStore = new UserModel(req.body)
        const user = await toStore.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
        let { password, ...rest } = user._doc

        res.status(200).json({ token, response: rest, message: "Votre compte a été crée" })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.mise_a_jour = async (req, res) => {
    try {
        if (req.body.password) { const salt = await bcrypt.genSalt(10); req.body.password = await bcrypt.hash(req.body.password, salt) }

        const user = await UserModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, upsert: true }).select("-password")
        if (!user) throw "Erreur lors de la mise à jour"

        //maj image s'il y en a
        if (req.body.image !== req.body.old_img) {
            const typeFile = req.body.image?.split("-")[0]
            let pathFilename = ""

            if (!isEmpty(req.body.old_img) && req.body.old_img !== undefined) {
                if (typeFile === "image") {
                    pathFilename = `${__dirname}/../public/images/${req.body.old_img}`
                } else if (typeFile === "video") {
                    pathFilename = `${__dirname}/../public/videos/${req.body.old_img}`
                }



                if (typeof pathFilename === 'string' && fs.existsSync(pathFilename)) {
                    fs.unlink(pathFilename, (error) => {
                        if (error) throw error
                        console.log(`L'ancienne ${pathFilename} a été supprimée`)
                    })
                } else {
                    console.log(`Le fichier ${pathFilename} n'existe pas`);
                }
            }
        }


        res.status(200).json({ response: user, message: "Mise à jour reussie." })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.find_user = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) throw "Identifiant de l'utilisateur incorrect."
        const user = await UserModel.findById(req.params.id).select("-password")
        if (!user) throw "Impossible de recuperer l'utilisateur ."

        res.status(200).json({ response: user, message: "" })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.all_users = async (req, res) => {
    try {
        const user = await UserModel.find().select("-password")

        res.status(200).json({ response: user, message: "" })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}