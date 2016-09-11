window.addEventListener('load', function() {
	var ViewContainer = document.getElementById('ViewContainer');
	var Client = Brawl.InitClientEngine(ViewContainer.clientWidth, ViewContainer.clientHeight);

	ViewContainer.appendChild(Client.Renderer.domElement);

	var ResizeTimeout;
	window.addEventListener('resize', function() {
		// todo: exit if no longer 'running'
		if (ResizeTimeout) return;

		ResizeTimeout = setTimeout(function() {
			ResizeTimeout = 0;

			// todo: only update if dimensions have changed
			Client.Resize(ViewContainer.clientWidth, ViewContainer.clientHeight);
		}, 250);

	});

	Client.Run();
});