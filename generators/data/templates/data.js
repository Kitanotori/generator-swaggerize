'use strict';

const Mockgen = require('<%=mockgenPath.replace(/\\/g,'/')%>');

/**
* Operations on <%=path%>
*/
module.exports = {
	<%operations.forEach(function (operation, i)
	{%>/**
	* summary: <%=operation.summary%>
	* description: <%=operation.description%>
	* parameters: <%=operation.parameters%>
	* produces: <%=operation.produces%>
	* responses: <%=operation.responses.join(', ')%>
	* operationId: <%=operation.name%>
	*/
	<%=operation.method%>: {
		<%operation.responses && operation.responses.forEach((resp, i) =>
			{%><%=resp%>: (request, response, callback) => {
			/**
			* Using mock data generator module.
			* Replace this by actual data for the api.
			*/
			Mockgen().responses({
				path: '<%=path%>',
				operation: '<%=operation.method%>',
				response: '<%=resp%>'
			}, callback);
		}<%if (i < operation.responses.length - 1) {%>,
		<%}%><%})%>
	}<%if (i < operations.length - 1) {%>,

	<%}%><%});%>
};
