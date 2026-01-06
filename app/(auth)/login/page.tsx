import LoginCardClient from "@/components/custom/molecules/Auth/LoginCardClient";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <LoginCardClient />

      <div className="p-4 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
        <p className="font-bold mb-2 uppercase tracking-wider">Test Credentials</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Admin</p>
            <p>nick@example.com</p>
            <p>password123</p>
          </div>
          <div>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Manager</p>
            <p>manager@example.com</p>
            <p>password123</p>
          </div>
          <div>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">Member</p>
            <p>member@example.com</p>
            <p>password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
