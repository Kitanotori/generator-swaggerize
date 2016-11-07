'use strict';

const dataProvider = require('<%=dataPath.replace(/\\/g,'/')%>');

/**
* Operations on <%=path%>
*/
module.exports = {
	<%operations.forEach((operation, i) =>
	{%>/**
	* summary: <%=operation.summary%>
	* description: <%=operation.description%>
	* parameters: <%=operation.parameters%>
	* produces: <%=operation.produces%>
	* responses: <%=operation.responses.join(', ')%>
	*/
	<%=operation.method%>: function <%=operation.name%>(request, reply) {
		<%if (operation.responses.length > 0) {
		const response = operation.responses[0];
		const status_str = (response === 'default') ? 200 : response;
		%>/**
		* Get the data for response <%=response%>
		* For response `default` status 200 is used.
		*/
		const status = <%=status_str%>;
		const provider = dataProvider['<%=operation.method%>']['<%=response%>'];
		provider(request, reply, (error, data) => {
			if (error) {
				console.error(error);
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
