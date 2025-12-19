import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function LoginCard() {
  return (
    <Card className="p-0 bg-transparent z-10 overflow-hidden gap-0 relative">
      <div
        className="absolute brightness-75 -z-10 inset-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, rgba(0,0,0,0) 40%, #0d1a36 100%)",
        }}
      ></div>
      <CardTitle className="lg:text-lg relative w-100 text-md p-2">
        Login with credentials
      </CardTitle>
      <hr />
      <CardContent className="px-4 py-2 flex flex-col gap-3">
        <div className="w-full h-auto flex flex-col gap-2">
          {" "}
          <label htmlFor="username" className="text-sm">
            Username
          </label>
          <input
            id="username"
            className="placeholder:italic text-sm placeholder:text-sm max-w-100
              focus:outline-none py-2 px-3 rounded-md w-full bg-accent/50"
            placeholder="eg. Nick"
          />
        </div>
        <div className="w-full h-auto flex flex-col gap-2">
          {" "}
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="placeholder:italic text-sm placeholder:text-sm max-w-100
              focus:outline-none py-2 px-3 rounded-md w-full bg-accent/50"
            placeholder="*****"
          />
        </div>
        <Button className="w-fit mx-auto">Submit</Button>
      </CardContent>
    </Card>
  );
}
