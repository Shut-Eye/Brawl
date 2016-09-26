module Brawl {
	'use strict';

	export interface Controller {
		id: string;
		index: number;
		mapping: string;
		connected: boolean;
		buttons: ControllerBtn[];
		axes: number[];
		timestamp: number;
	}

	export interface ControllerBtn {
		pressed: boolean;
		value: number;
	}

	export class Vec2 {
		x: number;
		y: number;

		constructor(X: number = 0, Y: number = 0) {
			this.x = X;
			this.y = Y;
		}

		Get(idx: number): number{
			switch (idx) {
				case 0:
					return this.x;
				case 1:
					return this.y;
			}
		}

		Max(): number{
			return Math.max(this.x, this.y);
		}

		Min(): number{
			return Math.min(this.x, this.y);
		}

		Count(): number{return 3;}

	}

	export class Vec3 {
		x: number;
		y: number;
		z: number;

		constructor(X: number = 0, Y: number = 0, Z: number = 0) {
			this.x = X;
			this.y = Y;
			this.z = Z;
		}

		Get(idx: number): number{
			switch (idx) {
				case 0:
					return this.x;
				case 1:
					return this.y;
				case 2:
					return this.z;
			}
		}

		Max(): number {
			return Math.max(this.x, this.y, this.z);
		}

		Min(): number {
			return Math.min(this.x, this.y, this.z);
		}

		Count(): number{return 3;}
	}

	// VEC 3 FUNCTIONS //

	export function Add3(lhs: Vec3, rhs: Vec3): Vec3{
		return new Vec3(
			lhs.x + rhs.x,
			lhs.y + rhs.y,
			lhs.z + rhs.z); 
	}

	export function Compare3(lhs: Vec3, rhs: Vec3, epsilon: number = 0.0001): boolean{
		var a: Vec3   = Sub3(rhs, lhs);
		var M: number = Mag3(a);

		return M < epsilon;
	}

	export function CP3(lhs: Vec3, rhs: Vec3): Vec3{
		return new Vec3(
			lhs.y * rhs.z - lhs.z * rhs.y,
			lhs.x * rhs.z - lhs.z * rhs.x,
			lhs.x * rhs.y - lhs.y * rhs.x);		
	}

	export function Div3(lhs: Vec3, scaler: number): Vec3{
		return new Vec3(
			lhs.x / scaler,
			lhs.y / scaler,
			lhs.z / scaler);
	}

	export function Dot3(lhs: Vec3, rhs: Vec3): number{
		return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
	}


	export function Mag3(vec: Vec3): number {
		return Math.sqrt(Sum3(Square3(vec)));
	}

	export function Mul3(lhs: Vec3, rhs: Vec3): Vec3{
		return new Vec3(
			lhs.x * rhs.x,
			lhs.y * rhs.y,
			lhs.z * rhs.z);
	}

	export function Normal3(vec: Vec3) {
		return Div3(vec, Mag3(vec));
	}

	export function Scale3(lhs: Vec3, scaler: number): Vec3{
		return new Vec3(
			lhs.x * scaler,
			lhs.y * scaler,
			lhs.z * scaler);
	}

	export function Sub3(lhs: Vec3, rhs: Vec3): Vec3{
		return new Vec3(
			lhs.x - lhs.x,
			lhs.y - lhs.y,
			lhs.z - rhs.z); 
	}

	export function Square3(vec: Vec3): Vec3{
		return new Vec3(vec.x * vec.x, vec.y * vec.y, vec.z * vec.z);
	}

	export function Sum3(vec: Vec3) {
		return vec.x + vec.y + vec.z;
	}

	// VEC 2 FUNCTIONS //



	// MATH FUNCTIONS //

	function Sum(...numbers: number[]) {
		var sum = 0;
		for (var i = 0; i < numbers.length; i++) {
			sum += numbers[i];
		}
		return sum;
	}
}