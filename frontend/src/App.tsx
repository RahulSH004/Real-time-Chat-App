import "./App.css";
import { LandingPage } from "./pages/LandingPage";

/**
 * App root — renders the coffee_chat landing page.
 *
 * NOTE: The original WebSocket chat UI is preserved below (commented out)
 * so it can be moved to its own route when routing is set up.
 *
 * Original chat state:
 *   const [socket, setSocket] = useState<WebSocket | null>(null);
 *   const [messages, setMessages] = useState<string[]>([]);
 *   const inputref = useRef(null);
 *   // ws = new WebSocket("ws://localhost:8080")
 */
function App() {
  return <LandingPage />;
}

export default App;