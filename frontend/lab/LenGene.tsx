import type { InstrumentConfig, StyleConfig } from "../typing/config.type";
import Len from "./Len";

interface propsType {
	styleConfig: StyleConfig;
	instrumentConfig: InstrumentConfig;
}
export default function LenGene({ styleConfig, instrumentConfig }: propsType) {
	const lens = instrumentConfig.lens;

	return (
		<div>
			{lens.map((len) => {
				return (
					<Len
						key={len.id + instrumentConfig.name + len.uname}
						lenConf={len}
						styleConfig={styleConfig}
					/>
				);
			})}
		</div>
	);
}
