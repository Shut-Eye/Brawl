declare module Brawl {

	interface Controller {
		connected: boolean;
		buttons: ControllerBtn[];
		axes: number[];
	}

	interface ControllerBtn {
		pressed: boolean;
		value: number;
	}
}