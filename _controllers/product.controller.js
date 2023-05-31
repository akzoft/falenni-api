const { isValidObjectId } = require("mongoose");
const { isEmpty } = require("../_config/functions");
const ProductModel = require("../_models/product.model");
const fs = require("fs")

exports.store_product = async (req, res) => {
    try {
        const toStore = new ProductModel(req.body)
        const product = await toStore.save()
        if (isEmpty(product)) throw "Problème lors de création de produit."

        res.status(200).json({ response: product, message: "Votre produit a été créer." })
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
        res.status(500).json({ message: error });
    }
}

exports.mise_a_jour = async (req, res) => {
    try {
        const { old_img, new_img } = req.body

        if (!req.params.id || !isValidObjectId(req.params.id)) throw "Problème lors de la mise à jour de votre produit."

        const product = await ProductModel.findById(req.params.id)
        let images = product.images

        if (old_img) {
            images?.forEach(image => {
                if (!old_img?.includes(image)) {
                    const typeFile = image?.split("-")[0]
                    let pathFilename = ""

                    if (typeFile === "image")
                        pathFilename = `${__dirname}/../public/images/${image}`

                    if (typeof pathFilename === 'string' && fs.existsSync(pathFilename))
                        fs.unlink(pathFilename, (error) => { if (error) throw error })
                    else
                        console.log(`Le fichier ${pathFilename} n'existe pas`);

                }
            })
            req.body.images = new_img ? [...old_img, ...new_img] : [...old_img]
        }

        const update = await ProductModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, upsert: true })
        if (isEmpty(update)) throw "Problème lors de la mise à jour de votre produit."

        res.status(200).json({ response: update, message: "Votre produit a été mise à jour." })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.find_product = async (req, res) => {
    try {
        if (!req.params.id || !isValidObjectId(req.params.id)) throw "Problème lors de la recupération de produit."

        const product = await ProductModel.findById(req.params.id)
        if (!product || isEmpty(product)) throw "Produit non trouvé."

        res.status(200).json({ response: product, message: "Produit récupéré." })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.all_product = async (req, res) => {
    try {
        const products = await ProductModel.find().sort({ createdAt: -1 })
        res.status(200).json({ response: products, message: "Produits récupérés." })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.delete_product = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Problème lors de la suppression du produit." })

        const product = await ProductModel.findById(req.params.id)

        if (product) {
            const images = product?.images
            images?.forEach(image => {
                const typeFile = image?.split("-")[0]
                let pathFilename = ""

                if (typeFile === "image")
                    pathFilename = `${__dirname}/../public/images/${image}`

                if (typeof pathFilename === 'string' && fs.existsSync(pathFilename))
                    fs.unlink(pathFilename, (error) => { if (error) throw error })

                product.deleteOne()
            })
        }
        res.send({ response: product, message: "Suppression du produit reussie." })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.faire_une_offre = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) throw "Problème lors de l'envoi de l'offre."

        const product = await ProductModel.findByIdAndUpdate(req.params.id, { $push: { offres: req.body.offre } }, { new: true, upsert: true })
        res.status(200).json({ response: product })
    } catch (error) {
        if ((!isEmpty(error) && error)) {
            req.body.offre.images?.forEach(image => {
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
        res.status(500).json({ message: error });
    }
}


exports.likes = async (req, res) => {
    try {
        const { me } = req.body
        if (!isValidObjectId(req.params.id) || !me) throw "Problème lors du like.";

        const like = await ProductModel.findByIdAndUpdate(req.params.id, { $addToSet: { likes: me } }, { new: true, upsert: true })
        if (!like) throw "Problème lors du like.";
        res.status(200).json({ response: like, message: "Produit aimé." })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}

exports.dislikes = async (req, res) => {
    try {
        const { me } = req.body
        if (!isValidObjectId(req.params.id) || !me) throw "Problème lors du dislikes.";

        const dislike = await ProductModel.findByIdAndUpdate(req.params.id, { $pull: { likes: me } }, { new: true })
        if (!dislike) throw "Problème lors du dislikes.";
        res.status(200).json({ response: dislike, message: "Produit disliké" })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}