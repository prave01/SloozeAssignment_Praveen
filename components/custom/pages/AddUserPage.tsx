import { CreateUserClient } from "../molecules/CreateUserClient";

export const AddUserPage = () => {
  return (
    <div className="w-full h-full overflow-hidden relative bg-transparent">
      <div>
        <div
          className="p-2 border text-xl tracking-tighter border-t-0 border-l-0
            w-fit text-primary dark:border-neutral-800 border-neutral-400"
        >
          Add New User
        </div>
      </div>
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
      />
      <div className="w-full h-full flex relative z-20 items-center justify-center">
        <CreateUserClient />
      </div>
    </div>
  );
};
