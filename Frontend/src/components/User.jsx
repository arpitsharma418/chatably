import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import { useSocket } from "../context/SocketContext";

export default function User(props) {
  const { socket, onlineUsers } = useSocket();
  const isOnline = onlineUsers.includes(props.id);
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        className="flex items-center p-3 mt-2 text-sm cursor-pointer hover:bg-gray-100"
      >
        <Badge
          color={`${isOnline ? "success" : ""}`}
          overlap="circular"
          variant="dot"
        >
          <Avatar sx={{ backgroundColor: "gray"}}>
            {props.name.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>
        <div className="text-sm">
          <h1 className="font-semibold">{props.name}</h1>
          <p>{props.email}</p>
        </div>
      </Stack>
    </>
  );
}
