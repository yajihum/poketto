import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Dispatch, useEffect, useState } from "react";
import { DeleteUser } from "../../../lib/module/user";
import { useAuth } from "../../../context/auth";
import UserGuard from "../../../guards/user-guard";
import fixedNames from "../../../lib/fixed-name";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const WithdrawModal = ({ isOpen, setIsOpen }: Props) => {
  const user = useAuth();
  const f = fixedNames;
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
    DeleteUser(user);
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
            {!errorMsg ? f.Q_USER_ACCOUNT_REMOVE : errorMsg}
          </DialogTitle>
          <DialogActions className="justify-center">
            <Button onClick={Close} className="font-dot">
              {f.BTN_BACK}
            </Button>
            <Button
              type="button"
              onClick={Withdraw}
              autoFocus
              className="font-dot"
            >
              {f.BTN_YES}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </UserGuard>
  );
};

export default WithdrawModal;
