import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ScanText, Upload, Copy, Download, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ocr")({
  component: OCR,
  head: () => ({ meta: [{ title: "OCR — IntelliLearn AI" }] }),
});

const sampleText = `Chapter 3: Neural Network Training

Training a neural network involves finding the set of weights that
minimize a loss function on the training data. The most common
algorithm is stochastic gradient descent (SGD), which updates the
weights in the direction opposite to the gradient of the loss.

Key concepts:
1. Forward propagation
2. Loss computation
3. Backward propagation
4. Weight updates`;

function OCR() {
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState(sampleText);

  const onFile = (f: File) => {
    setPreview(URL.createObjectURL(f));
    toast.success("Extracting text…");
    setTimeout(() => setText(sampleText), 800);
  };

  return (
    <div>
      <PageHeader title="OCR — Image to Text" subtitle="Extract text from photos, scans, and screenshots." icon={ScanText} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass overflow-hidden p-0">
          <div className="border-b border-border/60 p-4">
            <h3 className="font-semibold">Image Preview</h3>
          </div>
          <div className="p-6">
            {preview ? (
              <div className="overflow-hidden rounded-xl border border-border/60">
                <img src={preview} alt="preview" className="max-h-96 w-full object-contain bg-black/20" />
              </div>
            ) : (
              <label className="flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border transition hover:border-brand">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Click to upload or drop an image</div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
                <div className="inline-flex items-center gap-2 rounded-md gradient-bg px-4 py-2 text-xs font-medium text-white"><Upload className="h-3.5 w-3.5" />Upload image</div>
              </label>
            )}
          </div>
        </Card>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border/60 p-4">
              <h3 className="font-semibold">Recognized Text</h3>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}><Copy className="mr-1 h-3.5 w-3.5" />Copy</Button>
                <Button size="sm" variant="outline"><Download className="mr-1 h-3.5 w-3.5" />Download</Button>
              </div>
            </div>
            <div className="p-6">
              <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} className="resize-none bg-card/30 font-mono text-sm" />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
