
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "react-hot-toast";
import { Download, Clipboard } from "lucide-react";

// Registrar el service worker para PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => {
        console.log("Service Worker registrado con éxito:", registration);
      })
      .catch(error => {
        console.error("Error al registrar el Service Worker:", error);
      });
  });
}

export default function PromptGeneratorApp() {
  const [role, setRole] = useState("");
  const [task, setTask] = useState("");
  const [format, setFormat] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");

  const generatePrompt = () => {
    console.log("Generando prompt con los siguientes valores:", { role, task, format, tone, audience, context });
    const prompt = `🔥 Actúa como ${role || '[rol específico]'}.
🎯 Tu tarea es ayudarme a ${task || '[tarea específica]'}.
📦 Estructura la respuesta así: ${format || '[formato deseado]'}.
✍️ Usa un lenguaje ${tone || '[simple, técnico, divertido]'}, como si hablaras con ${audience || '[tipo de persona]'}.
📌 Mi situación actual: ${context || '[tu contexto personal]'}.
🎁 Incluye ejemplos, plantillas o consejos si puedes.`;
    setOutput(prompt);
    console.log("Prompt generado:", prompt);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Prompt copiado al portapapeles");
      console.log("Prompt copiado exitosamente");
    } catch (err) {
      toast.error("Error al copiar");
      console.error("Error al copiar el prompt:", err);
    }
  };

  const downloadPrompt = () => {
    console.log("Descargando prompt...");
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "prompt.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Prompt descargado");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Toaster position="top-right" />
      <Card>
        <CardContent className="space-y-4 p-4">
          <Input placeholder="Rol o experto (ej: experto en negocios)" value={role} onChange={(e) => setRole(e.target.value)} />
          <Input placeholder="Tarea específica (ej: encontrar ideas rentables)" value={task} onChange={(e) => setTask(e.target.value)} />
          <Input placeholder="Formato (ej: lista, pasos, tabla)" value={format} onChange={(e) => setFormat(e.target.value)} />
          <Input placeholder="Tono (ej: simple, técnico, divertido)" value={tone} onChange={(e) => setTone(e.target.value)} />
          <Input placeholder="Tipo de público (ej: niño, emprendedor nuevo)" value={audience} onChange={(e) => setAudience(e.target.value)} />
          <Textarea placeholder="Tu contexto personal" value={context} onChange={(e) => setContext(e.target.value)} />
          <Button onClick={generatePrompt}>Generar Prompt</Button>
        </CardContent>
      </Card>
      {output && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-bold mb-2">🎯 Prompt Generado:</h2>
            <Textarea value={output} readOnly className="w-full" rows={10} />
            <div className="flex gap-4">
              <Button onClick={copyToClipboard} variant="outline">
                <Clipboard className="w-4 h-4 mr-2" /> Copiar
              </Button>
              <Button onClick={downloadPrompt} variant="outline">
                <Download className="w-4 h-4 mr-2" /> Descargar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
