import { Space, Button, Upload, message, Tooltip, ColorPicker } from "antd";
import { DateTime } from "luxon";
import type { ElectronHandler } from "../preload";
import { useEffect, useRef, useState } from "react";
import {
	VscChromeMaximize,
	VscChromeRestore,
	VscChromeClose,
} from "react-icons/vsc";
import { FaRegLightbulb } from "react-icons/fa";
import {
	DownloadOutlined,
	UploadOutlined,
	ExpandOutlined,
	FileTextOutlined,
	SkinOutlined,
	MessageOutlined,
} from "@ant-design/icons";
import type { InstrumentConfig, StyleConfig } from "../typing/config.type";
import type { Updater } from "use-immer";
import { autoResize } from "../utils/autoResize";
import { sleep } from "../utils/common";

interface AllConfig {
	style: StyleConfig;
	ins: InstrumentConfig;
}
interface propsType {
	styleConfig: StyleConfig;
	setStyleConfig: Updater<StyleConfig>;
	instrumentConfig: InstrumentConfig;
	onLoadStyle: (config: AllConfig) => void;
}

export default function EasyAction({
	styleConfig,
	setStyleConfig,
	instrumentConfig,
	onLoadStyle,
}: propsType) {
	let ipcRenderer: ElectronHandler["ipcRenderer"] | null;
	try {
		ipcRenderer = window.electron.ipcRenderer
			? window.electron.ipcRenderer
			: null;
	} catch {
		ipcRenderer = null;
	}
	const web = !ipcRenderer;

	const [messageApi, contextHolder] = message.useMessage();
	// const [messageApi, contextHolder2] = message.useMessage();

	const dPathRef = useRef("");
	const download = async () => {
		const allConfig: AllConfig = {
			style: styleConfig,
			ins: instrumentConfig,
		};
		if (web) {
			const a = document.createElement("a");
			a.href = URL.createObjectURL(
				new Blob([JSON.stringify(allConfig, null, 2)]),
			);
			a.download = `${DateTime.now().toFormat("yyyyLLdd-HH:mm:ss")}.me.json`;
			a.click();
			messageApi.success("下载成功");
		}

		if (!web) {
			if (!ipcRenderer) return;
			const path = await ipcRenderer.invoke("saveConf", [
				dPathRef.current,
				allConfig,
			]);
			if (path !== "") {
				dPathRef.current = path;
			}
		}
	};

	const load = async () => {
		if (!ipcRenderer) return;
		const { status, config, path } = await ipcRenderer.invoke("loadConf", [
			dPathRef.current,
		]);
		if (!status) {
			// 加载失败
			messageApi.error("加载失败");
			// throw new Error('加载失败');
		} else {
			// 加载成功
			messageApi.success("加载成功");
			dPathRef.current = path;
			onLoadStyle(config);
		}
	};

	const darkChange = () => {
		setStyleConfig((draft) => {
			draft.global.dark = !draft.global.dark;
		});
	};

	const [resizeNum, setResizeNum] = useState(0);
	const [onResize, setOnResize] = useState(false);
	// const cilckResize = () => {
	//   setIfFirstResize(!ifFirstResize);
	//   document.getElementById('autoResize')?.click();
	// };
	useEffect(() => {
		if (resizeNum % 3 !== 0) {
			document.getElementById("autoResize")?.click();
		} else {
			setOnResize(false);
		}
	}, [resizeNum]);

	useEffect(() => {
		if (onResize) {
			messageApi.loading("自动调整中", 0);
		} else {
			messageApi.destroy();
		}
	}, [onResize]);

	return (
		<>
			{contextHolder}
			{/* {contextHolder2} */}
			<Space.Compact id="easyaction">
				<Tooltip
					title={styleConfig.global.english ? "Light" : "开/关灯"}
					overlayStyle={{
						display: styleConfig.global.showTooltip ? "" : "none",
					}}
				>
					<Button
						icon={<FaRegLightbulb />}
						type={styleConfig.global.dark ? "primary" : "default"}
						onClick={darkChange}
						id="turnoff"
					/>
				</Tooltip>
				<ColorPicker
					value={styleConfig.global.primaryColor}
					presets={[
						{
							label: "Recommended",
							colors: [
								"#1677ff",
								"#722ed1",
								"#7cb305",
								"#cf1322",
								"#fa541c",
								"#eb2f96",
							],
						},
					]}
					disabledAlpha
					placement="topRight"
					onChange={(color) => {
						setStyleConfig((draft) => {
							draft.global.primaryColor = color.toHexString();
						});
					}}
				>
					<Tooltip
						title={styleConfig.global.english ? "Color" : "换肤"}
						overlayStyle={{
							display: styleConfig.global.showTooltip ? "" : "none",
						}}
					>
						<Button icon={<SkinOutlined />} />
					</Tooltip>
				</ColorPicker>
				<Tooltip
					title={styleConfig.global.english ? "Auto Resize" : "自动定位"}
					overlayStyle={{
						display: styleConfig.global.showTooltip ? "" : "none",
					}}
				>
					<Button
						icon={<ExpandOutlined />}
						onClick={async () => {
							setOnResize(true);
							autoResize(styleConfig, instrumentConfig, setStyleConfig);
							await sleep(1500);
							setResizeNum(resizeNum + 1);
							// cilckResize();
						}}
						type={onResize ? "primary" : "default"}
						id="autoResize"
					/>
				</Tooltip>
				{!styleConfig.global.english && (
					<Tooltip
						title="查看讲义"
						overlayStyle={{
							display: styleConfig.global.showTooltip ? "" : "none",
						}}
					>
						<Button
							icon={<FileTextOutlined />}
							onClick={() => {
								setStyleConfig((draft) => {
									draft.global.front = true;
								});
							}}
						/>
					</Tooltip>
				)}
				<Tooltip
					title={styleConfig.global.english ? "Show Tips" : "显示提示"}
					overlayStyle={{
						display: styleConfig.global.showTooltip ? "" : "none",
					}}
				>
					<Button
						icon={<MessageOutlined />}
						type={styleConfig.global.showTooltip ? "primary" : "default"}
						onClick={() => {
							setStyleConfig((draft) => {
								draft.global.showTooltip = !draft.global.showTooltip;
							});
						}}
					/>
				</Tooltip>

				<div id="iostyle">
					<Tooltip
						title={styleConfig.global.english ? "Save" : "保存样式"}
						overlayStyle={{
							display: styleConfig.global.showTooltip ? "" : "none",
						}}
					>
						<Button icon={<DownloadOutlined />} onClick={download} />
					</Tooltip>
					<Tooltip
						title={styleConfig.global.english ? "Load" : "加载样式"}
						overlayStyle={{
							display: styleConfig.global.showTooltip ? "" : "none",
						}}
					>
						{web ? (
							<Upload
								beforeUpload={(file) => {
									if (file.type !== "application/json") {
										message.error("请上传json文件");
									}
									const reader = new FileReader();
									reader.readAsText(file);
									reader.onload = (e) => {
										if (e.target) {
											try {
												const newStyleConfig = JSON.parse(
													e.target.result as string,
												);
												onLoadStyle(newStyleConfig);
												message.success("加载成功");
											} catch {
												message.error("文件格式错误");
											}
										} else {
											message.error("加载失败");
										}
									};
									return false;
								}}
								accept=".me.json"
								showUploadList={false}
							>
								<Button icon={<UploadOutlined />} />
							</Upload>
						) : (
							<Button icon={<UploadOutlined />} onClick={load} />
						)}
					</Tooltip>
				</div>
				<Tooltip
					title={styleConfig.global.english ? "Maximize" : "最大化"}
					overlayStyle={{
						display: styleConfig.global.showTooltip ? "" : "none",
					}}
				>
					<Button
						icon={<VscChromeMaximize />}
						onClick={() => {
							if (ipcRenderer) ipcRenderer.maximize();
						}}
					/>
				</Tooltip>
				<Tooltip
					title={styleConfig.global.english ? "Restore" : "还原"}
					overlayStyle={{
						display: styleConfig.global.showTooltip ? "" : "none",
					}}
				>
					<Button
						icon={<VscChromeRestore />}
						onClick={() => {
							if (ipcRenderer) ipcRenderer.unmaximize();
						}}
					/>
				</Tooltip>
				<Tooltip
					title={styleConfig.global.english ? "Close" : "关闭"}
					overlayStyle={{
						display: styleConfig.global.showTooltip ? "" : "none",
					}}
				>
					<Button
						icon={<VscChromeClose />}
						onClick={() => {
							if (ipcRenderer) ipcRenderer.close();
						}}
					/>
				</Tooltip>
			</Space.Compact>
		</>
	);
}
