import Test from "@/ui/test";
import Test2 from "@/app/components/test2";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-24 text-center">
      <Test />
      <Test2 />
    </main>
  );
}
