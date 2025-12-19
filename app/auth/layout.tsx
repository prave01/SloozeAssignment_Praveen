export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full bg-background flex items-center
        justify-center"
    >
      {children}
      <p className="absolute bottom-5 text-accent">
        © All rights not received .
      </p>
    </div>
  );
}
