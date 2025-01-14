self.onmessage = function (e) { 
	if (e.data !== undefined) { 
		let total = e.data + 'worker'; 
		self.postMessage(total) 
	} 
}
