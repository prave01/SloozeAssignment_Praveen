import NavMenu from "@/components/custom/molecules/NavMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen dark:bg-black bg-zinc-200">
      <div className="flex w-full h-auto">
        {" "}
        <NavMenu />
        <div className="p-2 h-screen w-full">
          {" "}
          <div
            className="border dark:border-neutral-800 border-neutral-400 h-full
              bg-transparent"
          >
            {" "}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
