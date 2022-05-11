'use strict';

module.exports = class Subnet {
	//region private attributes
	#id;
	//endregion private attributes

	//region public methods

	constructor(id) {
		this.#id = id;
	}

	get id() {
		return this.#id;
	}
};
