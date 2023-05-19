const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    categories: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
    etat: { type: String, enum: ['Neuf', 'Très bon état', 'Bon état', 'Usé'], required: true },
    prix: { fixe: { type: Boolean }, negociation: { type: Boolean } },
    conditions: { troc: { type: Boolean }, vendre: { type: Boolean } },
    valeurMarchande: { type: Number },
    montantNegociation: { type: Number },
    proprietaire: { type: Schema.Types.ObjectId, ref: 'User' },
    available: { type: Boolean, default: true },
    offres: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        title: { type: String, trim: true },
        offre: { type: String, trim: true },
        montant: { type: Number },
        images: [{ type: String }],
        date: { type: Date },
        choice: { type: Schema.Types.ObjectId, ref: 'User' },
    }],
    negociations: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    gagnant: { type: Schema.Types.ObjectId, ref: 'User' },
    vues: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
