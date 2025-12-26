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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
