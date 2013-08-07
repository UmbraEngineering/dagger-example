
module.exports = {

	// 
	// Message types to be logged. Should be an array of any of the following values.
	// 
	//   NONE      - Silent mode; no messages are logged at all (this has highest priority)
	//   ALL       - Logs all types of messages
	//   BUSIO     - Logs messages sent and recieved on the redis bus (this will be very verbose)
	//   SOCKETIO  - Logs messages sent and recieved via Socket.IO (this will be very verbose)
	//   EVENTS    - Logs messages for all calls to AppObject::emit (this will be very verbose)
	//   MESSAGE   - Logs messages about standard operation (eg. new instances created, new incoming
	//               connections, etc.)
	//   WARNING   - Logs messages about things that could potentially be problematic but that are
	//               not technically errors (could include things pertaining to memory leaks, security
	//               shortcomings, etc.)
	//   ERROR     - Logs messages about errors that are minor/one time/non-fatal but that still
	//               caused a loss of service or bad/incorrect output to the client
	//   CRITICAL  - Logs messages that are of critical importance, such as fatal errors or failure
	//               to connect to neccesary resources (like a database)
	// 
	logging: ['MESSAGE', 'WARNING', 'ERROR', 'CRITICAL'],

	// 
	// If strict mode is enabled, any time a message marked as CRITICAL is logged, the server will
	// be stopped. This can help prevent errors from building up unnoticed and causing even more
	// trouble then they normally would, but could result in downtime if the error is not corrected.
	// 
	strictMode: true,

// -------------------------------------------------------------
	
	// 
	// Multi-instance mode configuration (used for configuring multiple simultaneous
	// application instances).
	// 
	instances: {
		enabled: false,

		// 
		// Configuration for the multi-instance mode's redis bus
		// 
		redis: {
			url: 'redis://localhost:6379',
			pubSubChannel: 'dagger-multi-instance'
		}
	},

// -------------------------------------------------------------
	
	// 
	// Socket.IO configuration
	// 
	sockets: {
		enabled: true
	},

// -------------------------------------------------------------
	
	// 
	// REST API configuration
	// 
	restApi: {
		enabled: true
	},

// -------------------------------------------------------------
	
	// 
	// MongoDB configuration
	// 
	mongodb: {
		url: 'mongodb://localhost:27017/db'
	}

};
