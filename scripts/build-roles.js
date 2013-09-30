#!/usr/bin/env node

var Role = require('./_role-builder').Role;

Role.defineRoles({
	// Administrator
	administrator: {
		'*': {create: true, read: true, update: true, delete: true}
	},
	// Normal user
	user: {
		users: {read: true, update: 'ifSelf', delete: 'ifSelf'},
		lists: {create: true, read: 'ifOwns', update: 'ifOwns', delete: 'ifOwns'},
		items: {create: true, read: 'ifOwns', update: 'ifOwns', delete: 'ifOwns'}
	}
});
