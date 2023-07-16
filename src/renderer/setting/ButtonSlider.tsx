import { Radio, RadioChangeEvent, Slider, Space } from 'antd';
import { useEffect, useState } from 'react';

interface propsType {
  value: number;
  onChange: (value: number) => void;
  options: {
    options: {
      name: string;
      value: number;
    }[];
    min: number;
    max: number;
    step: number;
    toFixedPoint: number;
    unit: string;
  };
}

export default function ButtonSlider({ value, onChange, options }: propsType) {
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
        {options.options.map((opt) => (
          <Radio.Button
            key={opt.name}
            value={opt.value}
            checked={!ifCustom && value === opt.value}
          >
            {opt.name}
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
          {customD.toFixed(options.toFixedPoint)}
          {options.unit}
        </Radio.Button>
        <Slider
          step={options.step}
          min={options.min}
          max={options.max}
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
