'use strict';

const Swagmock = require('swagmock');
const Path = require('path');
const api_path = Path.resolve(__dirname, '<%=apiConfigPath.replace(/\\/g,'/')%>');
let mockgen;

module.exports = () => {
	/**
	* Cached mock generator
	*/
	mockgen = mockgen || Swagmock(api_path);
	return mockgen;
};
