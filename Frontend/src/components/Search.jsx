import SearchIcon from "@mui/icons-material/Search";
export default function Search() {
  return (
    <>
      <div className="flex justify-between items-center rounded px-2 bg-gray-100">
        <input
          type="text"
          className="outline-none p-2 text-sm w-full"
          placeholder="Search Contact"
        />
        <SearchIcon />
      </div>
    </>
  );
}
