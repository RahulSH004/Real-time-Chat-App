import { ReactNode } from "react";

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {children}
    </div>
  );
}

export default App;
