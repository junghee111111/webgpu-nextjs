import RenderByGpu from './Render';

export default function RootPage() {
  return (
    <>
      <main className="container relative min-h-screen">
        <h1 className="text-3xl font-black py-4">Welcome, WebGPU!</h1>
        <RenderByGpu />
      </main>
    </>
  );
}
