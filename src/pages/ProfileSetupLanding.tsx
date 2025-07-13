import { useNavigate } from 'react-router-dom';

export default function ProfileSetupLanding() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-8">
      <div className="col-span-12 flex justify-center">
        <button
          className="h-12 rounded-2xl font-semibold bg-blue-600 text-white px-8"
          onClick={() => navigate('/setup/form')}
        >
          Set Up Trader's Profile
        </button>
      </div>
    </div>
  );
}