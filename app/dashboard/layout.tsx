import NavMenu from "@/components/custom/molecules/NavMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen dark:bg-black bg-zinc-200">
      <div className="flex w-full h-auto">
        {" "}
        <NavMenu />
        {children}
      </div>
    </div>
  );
}
