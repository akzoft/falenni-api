const { isValidObjectId } = require("mongoose")
const UserModel = require("../_models/user.model")
const { regex } = require("./constants")
const { removePhoneIndicatif, dataSecure, isEmpty } = require("./functions")
const fs = require("fs")

//user
exports.v_inscription_user = async (req, res, next) => {
    try {

        const user = await UserModel.findOne({ phone: removePhoneIndicatif(dataSecure(req.body.phone, "int")) })
        if (user) throw "Ce compte existe déjà."

        if (!req.body.inputedCode) throw "Le code de vérification est requis."

        if (!req.body.name) throw "Un nom est requis."
        if (req.body.name && req.body.name.includes("@")) throw "Format du nom incorrect."

        if (!req.body.phone) throw "Un numéro de téléphone est requis."
        if (req.body.phone && !regex.phone.test(req.body.phone)) throw "Format du numéro de telephone incorrect."

        if (!req.body.password) throw "Un mot de passe est requis."
        if (req.body.password.length < 6) throw "Taille mot de passe trop court. min: 6 caractères"

        if (req.body.code !== req.body.inputedCode) throw "Code de vérification incorrect."


        next()
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

exports.v_connexion_user = async (req, res, next) => {
    try {
        if (!req.body.phone) throw "Un numéro de téléphone est requis."
        if (req.body.phone && !regex.phone.test(req.body.phone)) throw "Format du numéro de telephone incorrect."

        if (!req.body.password) throw "Un mot de passe est requis."
        if (req.body.password.length < 6) throw "Taille mot de passe trop court. min: 6 caractères"

        next()
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

exports.v_update_user = (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) throw "Erreur lors de la mise à jour."

        if (req.body.name && req.body.name === "") throw "Un nom requis."
        next()
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

//product
exports.v_store_product = (req, res, next) => {
    try {
        const { images, title, categories, etat, description } = req.body
        if (images.length <= 0) throw "Chosissez moins une image pour votre produit."
        // if (images && images.length > 4) throw "Le nombre maximal d'image requis est: 4 images."
        if (!title || title === "") throw "Un titre est requis pour la creaction de votre produit."
        if (!categories || categories.length <= 0) throw "Choisissez au moins une categorie pour votre produit."
        if (categories && categories.length > 3) throw "Choisissez au maximum 3 catégories pour votre produit."
        if (!etat || etat === "") throw "Specifiez l'état de votre produit."
        if (!description || description === "") throw "Decrivez votre produit."
        next()
    } catch (error) {

        if ((!isEmpty(error) && error)) {
            req.body.images?.forEach(image => {
                const typeFile = image?.split("-")[0]
                let pathFilename = ""

                if (typeFile === "image")
                    pathFilename = `${__dirname}/../public/images/${image}`

                if (typeof pathFilename === 'string' && fs.existsSync(pathFilename))
                    fs.unlink(pathFilename, (error) => { if (error) throw error })
                else
                    console.log(`Le fichier ${pathFilename} n'existe pas`);
            })
        }
        res.status(500).json({ message: error })
    }
}