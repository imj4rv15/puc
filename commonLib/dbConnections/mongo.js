'use strict';

const Mongoose = require('mongoose');
const config = require('../../config');


/** Class representing a database object */
class Mongo {
	/**
	 * @description Create a Database Object.
	 * @function constructor
	 */
	constructor() {
		this._createPoolConnection();
	}


	/**
	 * @description Create pool connection
	 * @return {void}
	 */
	_createPoolConnection() {
		try {
			const connectionDetails = config.database.mongo;
			const options = {
				useCreateIndex: true,
				useNewUrlParser: true,
				poolSize: connectionDetails.poolSize,
			};

			Mongoose.connect(
				`mongodb://${connectionDetails.host}:${connectionDetails.port}
			  /${connectionDetails.database}`,
				options,
			);
		} catch (error) {
			console.log(`Error[1] accured in mongo connection = ${error.message}`);
		}

		Mongoose.connection.on('error', error => {
			console.log(`Error[2] accured in mongo connection = ${error.message}`);
		});

		Mongoose.connection.on('disconnected', function () {
			console.log(`Mongoose default connection is disconnected`);
		});
		Mongoose.connection.once('open', () => {
			console.log('Connected to mongo');
		});

		process.on('SIGINT', function () {
			Mongoose.connection.close(function () {
				console.log(`Mongoose disconnected due to application termination`);
				process.exit(0);
			});
		});
	};
}

module.exports = (new Mongo);
