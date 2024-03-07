// Opentype
export interface Opentype {
	parse(ArrayBuffer): object;
	load(string): Promise<object>;
}

// SABRE.js
export type CanvasDrawable = HTMLCanvasElement | OffscreenCanvas;
export type SABREOptions = {
	fonts?: Array<object>,
	subtitles?: ArrayBuffer,
	colorSpace?:number,
	resolution?:number[],
	nativeResolution?:number[]
}
export type ContextType = '2d' | 'bitmap';

export declare namespace sabre {
	declare namespace VideoColorSpaces {
		export const AUTOMATIC: number;
		export const AUTOMATIC_PC: number;
		export const RGB: number;
		export const BT601_TV: number;
		export const BT601_PC: number;
		export const BT709_TV: number;
		export const BT709_PC: number;
		export const BT2020_TV: number;
		export const BT2020_PC: number;
		export const BT2020_CL_TV: number;
		export const BT2020_CL_PC: number;
		export const BT2100_PQ: number;
		export const BT2100_HLG: number;
		export const SMPTE240M_TV: number;
		export const SMPTE240M_PC: number;
		export const FCC_TV: number;
		export const FCC_PC: number;
	}

	declare class SABRERenderer {
		constructor(options?: SABREOptions);

		loadSubtitles(subs: ArrayBuffer, fonts: Array<object>): void;

		setColorSpace(colorSpace: number, width?: number, height?: number): void;

		setViewport(width: number, height: number): void;

		checkReadyToRender(): boolean;

		getFrame(time: number): ImageBitmap;

		getFrameAsUri(time: number, callback: (objUri: string) => void): void;

		drawFrame(time: number, canvas: CanvasDrawable, contextType?: ContextType): void;
	}
}

export default sabre;
