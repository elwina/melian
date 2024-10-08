import { useBoolean } from "ahooks";
import { Button, Space, Switch, Tooltip } from "antd";
import { type ElementType, useEffect, useState } from "react";
import type { InstrumentConfig, StyleConfig } from "../typing/config.type";
import { parseRequireArray, parseSet } from "../utils/parseRequire";
import type { Updater } from "use-immer";
import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	MessageOutlined,
	TranslationOutlined,
} from "@ant-design/icons";
import ButtonSlider from "./ButtonSlider";
import EasyAction from "./EasyAction";
import StyleAdjust from "./StyleAdjust";
import TwoArrow from "./TwoArrow";
import CircleSlider from "./CircleSlider";
import FourSide from "./FourSide";
import ButtonSelect from "./ButtonSelect";

interface propsType {
	styleConfig: StyleConfig;
	instrumentConfig: InstrumentConfig;
	setInstrumentConfig: Updater<InstrumentConfig>;
	setStyleConfig: Updater<StyleConfig>;
	setExp: (exp: string) => void;
}

export type SettingType =
	| "ButtonSlider"
	| "FourSide"
	| "TwoArrow"
	| "CircleSlider"
	| "ButtonSelect";

const settingComponent: Record<SettingType, ElementType> = {
	ButtonSlider: ButtonSlider,
	TwoArrow: TwoArrow,
	FourSide: FourSide,
	CircleSlider: CircleSlider,
	ButtonSelect: ButtonSelect,
};

export default function LoadSetting({
	styleConfig,
	instrumentConfig,
	setInstrumentConfig,
	setStyleConfig,
	setExp,
}: propsType) {
	const settingConfig = instrumentConfig.setting;

	const RenderingSettings = settingConfig.map((s, i) => {
		const SettingComponent = settingComponent[s.type];

		const values = parseRequireArray(s.target, instrumentConfig, styleConfig);

		return (
			<Tooltip
				title={s.des}
				key={s.name + instrumentConfig.name}
				overlayStyle={{ display: styleConfig.global.showTooltip ? "" : "none" }}
			>
				<div
					style={{
						display: "inline-flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-around",
					}}
					id={`settings-${i}`}
				>
					<div>{s.name}</div>
					<SettingComponent
						values={values}
						options={s.options}
						onChange={(values: number[]) => {
							const newSetDict = s.target.map((t, i) => [t, values[i]]);
							parseSet(
								Object.fromEntries(newSetDict),
								setInstrumentConfig,
								setStyleConfig,
							);
						}}
					/>
				</div>
			</Tooltip>
		);
	});

	const ifNotStyle = styleConfig.global.ifNotStyle;
	const setIfNotStyle = () =>
		setStyleConfig((draft) => {
			draft.global.ifNotStyle = !draft.global.ifNotStyle;
		});
	const [settingWidth, setSettingWidth] = useState(
		document.body.clientWidth - 20,
	);

	useEffect(() => {
		window.addEventListener("resize", () =>
			setSettingWidth(document.body.clientWidth - 20),
		);
		return () => {
			window.removeEventListener("resize", () =>
				setSettingWidth(document.body.clientWidth - 20),
			);
		};
	}, []);

	return (
		<div
			style={{
				position: "fixed",
				bottom: 10,
				left: 0,
				width: settingWidth,
				height: styleConfig.setting.height,
				zIndex: 110,
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				marginLeft: 10,
				marginRight: 10,
			}}
			id="setting"
		>
			<Space direction="vertical" align="center">
				<Tooltip
					title={
						!styleConfig.global.english &&
						(ifNotStyle
							? "允许操作者改变实验参数，点击可切换至样式调节"
							: "允许操作者改变仪器布局、大小等以适应多屏幕，点击可切换至参数调节")
					}
					overlayStyle={{
						display: styleConfig.global.showTooltip ? "" : "none",
					}}
				>
					<Switch
						checkedChildren={
							styleConfig.global.english ? "Style Adjust" : "样式调节"
						}
						unCheckedChildren={
							styleConfig.global.english ? "Setting Adjust" : "参数调节"
						}
						checked={ifNotStyle}
						onChange={setIfNotStyle}
						id="switchSetting"
					/>
				</Tooltip>

				<Space.Compact>
					<Tooltip
						overlayStyle={{
							display: styleConfig.global.showTooltip ? "" : "none",
						}}
					>
						<Button
							icon={<ArrowUpOutlined />}
							onClick={() => {
								setStyleConfig((draft) => {
									draft.setting.height += 2;
								});
							}}
						/>
						<Button
							icon={<TranslationOutlined />}
							onClick={() => {
								setStyleConfig((draft) => {
									draft.global.english = !draft.global.english;
								});
							}}
						/>
						<Button
							icon={<ArrowDownOutlined />}
							onClick={() => {
								setStyleConfig((draft) => {
									draft.setting.height -= 2;
								});
							}}
						/>
					</Tooltip>
				</Space.Compact>
			</Space>
			{!ifNotStyle ? (
				<StyleAdjust
					styleConfig={styleConfig}
					instrumentConfig={instrumentConfig}
					setStyleConfig={setStyleConfig}
				/>
			) : (
				RenderingSettings
			)}
			<EasyAction
				styleConfig={styleConfig}
				setStyleConfig={setStyleConfig}
				instrumentConfig={instrumentConfig}
				onLoadStyle={(config) => {
					setStyleConfig(config.style);
					setInstrumentConfig(config.ins);
					setExp(config.ins.name);
				}}
			/>
		</div>
	);
}
