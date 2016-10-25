'use strict';

const Test = require('tape');
const Hapi = require('hapi');
const Swaggerize = require('swaggerize-hapi');
const Path = require('path');
const Mockgen = require('<%=mockgenPath.replace(/\\/g,'/')%>');
const Parser = require('swagger-parser');

/**
 * Test for <%=path%>
 */
Test('<%=path%>', (t) => {
	const apiPath = Path.resolve(__dirname, '<%=apiPathRel.replace(/\\/g,'/')%>');
	let server;

	Parser.validate(apiPath, (err, api) => {
		t.error(err, 'No parse error');
		t.ok(api, 'Valid swagger api');
		t.test('server', (t) => {
			t.plan(1);
			server = new Hapi.Server();
			server.connection({});
			server.register({
				register: Swaggerize,
				options: {
					api: apiPath,
					handlers: Path.join(__dirname, '<%=handlerDir.replace(/\\/g,'/')%>')
				}
			}, (err) => {
				t.error(err, 'No error.');
			});
		});
		<%operations.forEach((operation, i) => {
			const mt = operation.method.toLowerCase();
		%>/**
		 * summary: <%=operation.summary%>
		 * description: <%=operation.description%>
		 * parameters: <%=operation.parameters%>
		 * produces: <%=operation.produces%>
		 * responses: <%=operation.responses.join(', ')%>
		 */
		t.test('test <%=operation.name%> <%=operation.method%> operation', (t) => {
			Mockgen().requests({
				path: '<%=path%>',
				operation: '<%=operation.method%>'
			}, (err, mock) => {
				let options;
				t.error(err);
				t.ok(mock);
				t.ok(mock.request);
				// Get the resolved path from mock request
				// Mock request Path templates({}) are resolved using path parameters
				options = {
					method: '<%=mt%>',
					url: '<%=basePath%>' + mock.request.path
				};
				if (mock.request.body) {
					// Send the request body
					options.payload = mock.request.body;
				} else if (mock.request.formData) {
					// Send the request form data
					options.payload = mock.request.formData;
					// Set the Content-Type as application/x-www-form-urlencoded
					options.headers = options.headers || {};
					options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				}
				// If headers are present, set the headers.
				if (mock.request.headers && mock.request.headers.length > 0) {
					options.headers = mock.request.headers;
				}
				server.inject(options, (res) => {
					<% if (operation.response) {
					%>t.ok(res.statusCode === <%=(operation.response === 'default')?200:operation.response%>, 'Ok response status');<%}%>
					<% if (operation.validateResp) {
					%>const Validator = require('is-my-json-valid');
					const validate = Validator(api.paths['<%=path%>']['<%=operation.method%>']['responses']['<%=operation.response%>']['schema']);
					t.ok(validate(res.result || res.payload), 'Valid response');
					t.error(validate.errors, 'No validation errors');
					<%}%>t.end();
				});
			});
		});<%})%>
	});
});
