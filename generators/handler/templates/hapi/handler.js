'use strict';

const dataProvider = require('<%=dataPath.replace(/\\/g,'/')%>');

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
	*/
	<%=operation.method%>: function <%=operation.name%>(req, reply) {
		<%if (operation.responses.length > 0) {
		const resp = operation.responses[0];
		const statusStr = (resp === 'default') ? 200 : resp;
		%>/**
		 * Get the data for response <%=resp%>
		 * For response `default` status 200 is used.
		 */
		const status = <%=statusStr%>;
		const provider = dataProvider['<%=operation.method%>']['<%=resp%>'];
		provider(req, reply, (err, data) => {
			if (err) {
				console.error(err);
				return reply().code(500);
			}
			reply(data && data.responses).code(status);
		});<%} else {%>
		const status = 501;
		const data = {};
		reply(data).code(status);
		<%}%>
	}<%if (i < operations.length - 1) {%>,
	<%}%><%});%>
};
