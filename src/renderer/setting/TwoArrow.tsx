import { Space, Button } from 'antd';
import {
  CaretLeftFilled,
  CaretRightFilled,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';

interface propsType {
  values: number[];
  onChange: (values: number[]) => void;
  options: {
    step: number;
    min: number;
    max: number;
  };
}

export default function TwoArrow({ values, onChange, options }: propsType) {
  const value = values[0];

  function change(v: number) {
    onChange(Array.from({ length: values.length }, () => v));
  }
  return (
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
  );
}
