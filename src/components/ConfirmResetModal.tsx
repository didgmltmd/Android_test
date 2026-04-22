import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmResetModal({ open, onClose, onConfirm }: Props) {
  return (
    <Modal
      open={open}
      title="전체 초기화"
      description="API Key, 답안, 피드백, PDF 위치, UI 상태가 모두 삭제됩니다."
      onClose={onClose}
    >
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          초기화 실행
        </Button>
      </div>
    </Modal>
  );
}
