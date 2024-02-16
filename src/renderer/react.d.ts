import { AllHTMLAttributes as Attributes } from 'react';

export = React;
export as namespace React;

declare module 'react' {
  interface AllHTMLAttributes<T> extends Attributes<T> {
    rev?: string | undefined;
  }
}
