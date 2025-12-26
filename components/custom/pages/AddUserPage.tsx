import { CreateUserClient } from "../molecules/CreateUserClient";

export const AddUserPage = () => {
  return (
    <div className="w-full h-full overflow-hidden relative bg-transparent">
      <div
        className="p-2 px-4 absolute top-0 left-0 border text-xl
          tracking-tighter border-t-0 border-l-0 w-fit text-primary
          dark:border-neutral-800 border-neutral-400"
      >
        Add New User
      </div>
      <div className="w-full h-full flex relative z-20 items-center justify-center">
        <CreateUserClient />
      </div>
    </div>
  );
};
