import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Dispatch, useEffect, useState } from "react";
import { DeleteUser } from "../lib/user";
import { useAuth } from "../context/auth";
import UserGuard from "../guards/user-guard";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const WithdrawModal = ({ isOpen, setIsOpen }: Props) => {
  const user = useAuth();
  const [open, setOpen] = useState(isOpen);

  const Close = () => {
    setOpen(false);
    setIsOpen(false);
    setErrorMsg(undefined);
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  const Withdraw = async () => {
    const failInfo = await DeleteUser(user);
    if (failInfo && !failInfo.isSuccess) {
      setErrorMsg(failInfo.errorMessage);
    } else {
      Close;
    }
  };

  return (
    <UserGuard>
      <div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className="font-dot font-bold">
            {!errorMsg ? "アカウントを消しますか" : errorMsg}
          </DialogTitle>
          <DialogActions className="justify-center">
            <Button onClick={Close} className="font-dot">
              戻る
            </Button>
            <Button
              type="button"
              onClick={Withdraw}
              autoFocus
              className="font-dot"
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </UserGuard>
  );
};

export default WithdrawModal;