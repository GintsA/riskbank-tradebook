import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { resetProfile } from '../services/profile';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function ResetProfileButton() {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await resetProfile(uid);
    navigate('/setup');
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-sm px-2">⟲</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content className="bg-white rounded-2xl p-6 shadow-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <AlertDialog.Title className="font-semibold mb-2">Reset profile?</AlertDialog.Title>
          <AlertDialog.Description className="mb-4 text-sm">
            This will remove your trader profile.
          </AlertDialog.Description>
          <div className="flex justify-end space-x-2">
            <AlertDialog.Cancel className="h-12 rounded-2xl font-semibold bg-gray-200 px-4">
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button className="h-12 rounded-2xl font-semibold bg-red-600 text-white px-4" onClick={handleConfirm}>
                Confirm
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}