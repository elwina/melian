import { Radio, RadioChangeEvent, Slider, Space } from 'antd';
import { useEffect, useState } from 'react';

interface propsType {
  values: number[];
  onChange: (values: number[]) => void;
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

export default function ButtonSlider({ values, onChange, options }: propsType) {
  const value = values[0];
  const [ifCustom, setIfCustom] = useState<boolean>(false);
  const [customD, setCustomD] = useState<number>(value);

  function change(v: number) {
    onChange(Array.from({ length: values.length }, () => v));
  }

  useEffect(() => {
    if (ifCustom) {
      change(customD);
    }
  }, [customD, ifCustom, onChange]);

  return (
    <Space.Compact>
      <Radio.Group
        onChange={(e: RadioChangeEvent) => {
          if (e.target.value === 'custom') {
            setIfCustom(true);
            change(customD);
          } else {
            setIfCustom(false);
            change(parseFloat(e.target.value));
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
