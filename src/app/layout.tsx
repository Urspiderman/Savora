import type { ReactNode } from "react";
import "./globals.css";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
export default function RootLayout({children}:{children:ReactNode}) {return <html lang="id"><body>{children}<ChatbotWidget/></body></html>;}
