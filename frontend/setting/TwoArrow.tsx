import { Space, Button } from 'antd';
import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';

interface propsType {
  values: number[];
  onChange: (values: number[]) => void;
  options: {
    step: number;
    min: number;
    max: number;

    showValue?: boolean;
    unit?: string;
    toFixedPoint?: number;
  };
}

export default function TwoArrow({ values, onChange, options }: propsType) {
  const value = values[0];

  function change(v: number) {
    onChange(Array.from({ length: values.length }, () => v));
  }
  return (
    <>
      {options.showValue && (
        <div>
          {value.toFixed(options.toFixedPoint ?? 0)}
          {options.unit ?? ''}
        </div>
      )}
      <Space.Compact>
        <Button
          type="primary"
          icon={<CaretLeftFilled />}
          onClick={() => change(value - options.step)}
          size="large"
          disabled={value - options.step <= options.min}
        />{' '}
        <Button
          type="primary"
          icon={<CaretRightFilled />}
          onClick={() => change(value + options.step)}
          size="large"
          disabled={value + options.step >= options.max}
        />
      </Space.Compact>
    </>
  );
}
