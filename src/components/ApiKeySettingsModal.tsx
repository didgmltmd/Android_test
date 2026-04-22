import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

type Props = {
  open: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

export function ApiKeySettingsModal({
  open,
  initialValue,
  onClose,
  onSave,
}: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, open]);

  return (
    <Modal
      open={open}
      title="OpenAI API Key 설정"
      description="입력한 키는 브라우저 localStorage에 저장되며 프론트엔드에서 직접 OpenAI API를 호출할 때만 사용됩니다."
      onClose={onClose}
    >
      <div className="space-y-4">
        <input
          type="password"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="sk-..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-blue-200 focus:ring-2 focus:ring-[#3182F6]"
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={() => {
              onSave(value.trim());
              onClose();
            }}
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
