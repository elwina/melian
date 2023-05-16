import { Radio, RadioChangeEvent, Slider, Space } from 'antd';
import { useEffect, useState } from 'react';

interface propsType {
  onChange: (d: number) => void;
  options: number[];
  min: number;
  max: number;
  step: number;
  value: number;
  toFixedPoint: number;
  unit: string;
}

export default function CustomButton({
  onChange,
  options,
  min,
  max,
  step,
  toFixedPoint,
  value,
  unit,
}: propsType) {
  const [ifCustom, setIfCustom] = useState<boolean>(false);
  const [customD, setCustomD] = useState<number>(value);

  useEffect(() => {
    if (ifCustom) {
      onChange(customD);
    }
  }, [customD, ifCustom, onChange]);

  return (
    <Space.Compact>
      <Radio.Group
        onChange={(e: RadioChangeEvent) => {
          if (e.target.value === 'custom') {
            setIfCustom(true);
            onChange(customD);
          } else {
            setIfCustom(false);
            onChange(parseFloat(e.target.value));
          }
        }}
      >
        {options.map((d) => (
          <Radio.Button
            key={d}
            value={d.toString()}
            checked={!ifCustom && value === d}
          >
            {d.toFixed(toFixedPoint)}
            {unit}
          </Radio.Button>
        ))}
        {/* <Radio.Button value="0.2" checked={!ifCustom && value === 0.2}>
          0.20mm
        </Radio.Button>
        <Radio.Button value="0.25" checked={!ifCustom && value === 0.25}>
          0.25mm
        </Radio.Button> */}
        <Radio.Button value="custom" checked={ifCustom}>
          自定义
          {customD.toFixed(toFixedPoint)}
          {unit}
        </Radio.Button>
        <Slider
          step={step}
          min={min}
          max={max}
          value={customD}
          disabled={!ifCustom}
          tooltip={{ open: false }}
          onChange={(v) => {
            setCustomD(v);
          }}
        />
      </Radio.Group>
    </Space.Compact>
  );
}
