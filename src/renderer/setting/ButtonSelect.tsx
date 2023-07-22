import { Radio, RadioChangeEvent, Slider, Space } from 'antd';
import { useEffect, useState } from 'react';

interface propsType {
  values: any[];
  onChange: (values: any[]) => void;
  options: {
    options: {
      name: string;
      values: any[];
    }[];
  };
}

export default function ButtonSelect({ values, onChange, options }: propsType) {
  function change(v: any[]) {
    onChange(v);
  }

  return (
    <>
      <Space.Compact>
        <Radio.Group
          onChange={(e: RadioChangeEvent) => {
            change(e.target.value);
          }}
        >
          {options.options.map((opt) => (
            <Radio.Button
              key={opt.name}
              value={opt.values}
              checked={values?.toString() === opt.values?.toString()}
            >
              {opt.name}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Space.Compact>
    </>
  );
}
