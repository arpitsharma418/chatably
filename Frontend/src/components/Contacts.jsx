import Search from "./Search";
import Users from "./Users";
import FormDialog from "./FormDialog";
import Logout from "./Logout";
import CloseIcon from '@mui/icons-material/Close';

export default function Contacts({ open = false, onClose = () => {} }) {

  return (
    <>
      {/* Desktop/large screens: static sidebar */}
      <div className="hidden sm:block bg-white h-dvh w-[25%] p-5 border-r-2 border-r-gray-100">
        <div className="flex justify-between items-center text-lg mb-3">
          <h1 className="font-semibold">Chatably</h1>

          <div className="space-x-8">
            <FormDialog />
            <Logout />
          </div>
        </div>
        <Search />
        <Users />
      </div>

      {/* Mobile drawer */}
      <div
        className={`sm:hidden fixed inset-0 z-40 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-4/5 max-w-xs h-screen bg-white p-4 shadow-lg scroll-auto">
          <div className="flex justify-between items-center mb-3">
            <h1 className="font-semibold">Chatably</h1>
            <div className="flex items-center space-x-2">
              <FormDialog />
              <Logout />
              <button onClick={onClose} aria-label="Close contacts" className="p-1">
                <CloseIcon />
              </button>
            </div>
          </div>
          <div className="mb-3">
            <Search />
          </div>
          <div className="flex-1 overflow-auto">
            <Users />
          </div>
        </div>
      </div>
    </>
  );
}
