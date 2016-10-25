'use strict';

const Swagmock = require('swagmock');
const Path = require('path');
const apiPath = Path.resolve(__dirname, '<%=apiConfigPath.replace(/\\/g,'/')%>');
let mockgen;

module.exports = () => {
	/**
	* Cached mock generator
	*/
	mockgen = mockgen || Swagmock(apiPath);
	return mockgen;
};
