import { IconWave } from "../UI";

export function NoConversationSelected() {
  return (
    <div className="mt-40 text-center md:mt-36">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm">
        <IconWave className="h-12 w-12" />
      </div>
      <h1 className="mt-6 text-2xl md:text-xl">
        Your chats are lonely.
        <div className="text-slate-500">Pick one to keep them company.</div>
      </h1>
    </div>
  );
}

export function NoMessagesYet() {
  return (
    <div className="mt-28 text-center sm:mt-32 md:mt-40 lg:mt-48">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm">
        <IconWave className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-lg md:text-lg">
        Go on.
        <div className="text-slate-500">Say something before the awkward silence wins.</div>
      </h1>
    </div>
  );
}
