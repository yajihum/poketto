import { ReactNode } from "react";

type Props = {
  id: string; // id属性に使用
  label: string; // ラベル
  children: ReactNode; // 入力フィールド
  error?: string; // エラーテキスト
  currentLength?: number; // 現在の文字数
  action?: ReactNode; // アクションをつける場合
  maxLength?: number; // 最大文字数
  required?: boolean; // 必須入力か否か
};

const FieldGroup = ({
  error,
  label,
  currentLength,
  action,
  required,
  maxLength,
  children,
  id,
}: Props) => {
  return (
    <div className="mt-6">
      <div>
        <label htmlFor={id} className="text-xl">
          {label}
          {required && <sup className="text-red-500">*</sup>}
        </label>
      </div>
      <div className="flex space-x-2">
        {children}
        {action}
      </div>
      <div className="flex space-x-4 text-sm">
        {error && <p className="flex-1 font-semibold text-sky-600">{error}</p>}
        {maxLength && (
          <p className="ml-auto text-gray-500">
            {currentLength || 0} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default FieldGroup;
