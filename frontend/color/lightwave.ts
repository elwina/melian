import { normalization } from "../utils/array";
import { D65Specteum, HG } from "./spectrum";

export type LightType = "D65" | "HG";

export function getWaveInstense(lightType: LightType, filter: number) {
	let wave = [];
	let instense = [];
	if (filter < 0) {
		switch (lightType) {
			case "D65":
				wave = D65Specteum.wave;
				instense = normalization(D65Specteum.instense);
				break;
			case "HG":
				wave = HG.wave;
				instense = normalization(HG.instense);
				break;
		}
	} else {
		wave = [filter];
		instense = [1];
	}
	return { wave, instense };
}

const a = getWaveInstense("D65", -1);
console.log(a.wave[40], a.instense[40]);
console.log(a.wave[41], a.instense[41]);
console.log(a.wave[42], a.instense[42]);
console.log(a.wave[43], a.instense[43]);
console.log(a.wave[44], a.instense[44]);
