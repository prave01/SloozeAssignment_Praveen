import NavMenu from "@/components/custom/molecules/NavMenu";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    redirect("/login");
  }

  return (
    <div className="w-full min-h-screen dark:bg-black bg-zinc-200">
      <div className="flex w-full h-auto">
        {" "}
        <NavMenu />
        <div className="p-2 h-screen w-full">
          {" "}
          <div
            className="border relative dark:border-neutral-800
              border-neutral-400 h-full bg-transparent"
          >
            <div
              className="absolute blur-2xl inset-0 bg-myborder"
              style={{
                backgroundImage: `
      linear-gradient(to right, hsl(var(--color-neutral-500)) 1px, transparent 1px),
      linear-gradient(to bottom, hsl(var(--color-neutral-500)) 1px, transparent 1px)
    `,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 0",
                maskImage: `
      repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      radial-gradient(
        ellipse 80% 80% at 100% 100%,
        #000 50%,
        transparent 90%
      )
    `,
                WebkitMaskImage: `
      repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      radial-gradient(
        ellipse 80% 80% at 100% 100%,
        #000 50%,
        transparent 90%
      )
    `,
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />{" "}
            <div className="relative z-10 h-full w-full overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
