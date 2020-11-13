require('../commonLib/dbConnections/mongo'); // Required for connection
const mongoose = require('mongoose');

const pucSchema = new mongoose.Schema({
    FUEL: { type: String, required: true },
    CO: { type: Number, required: true },
    HO: { type: Number, required: true },
    CO2: { type: Number, required: true },
    O2: { type: Number, required: true },
    NOx: { type: Number, required: true },
    RPM: { type: Number, required: true },
    PEF: { type: Number, required: true },
    OIL_TEMP: { type: Number, required: true },
    CO_CRTD: { type: Number, required: true },
    LAMBDA: { type: Number, required: true },
    AFR: { type: Number, required: true }
}, {
    timestamps: { createdAt: true, updatedAt: true }
});

pucSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('orders', pucSchema);
