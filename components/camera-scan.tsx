"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, X, Upload, Loader2, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ParsedItem {
  name: string
  quantity: number
  unit: string
}

interface CameraScanProps {
  onImport: (items: ParsedItem[]) => void
}

export function CameraScan({ onImport }: CameraScanProps) {
  const [open, setOpen] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = async () => {
    try {
      setError(null)
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      setError("Unable to access camera. Please check permissions or use file upload instead.")
      setIsCapturing(false)
    }
  }

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }, [])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        stopCamera()
        // Simulate text extraction - in production, you'd use OCR API
        simulateTextExtraction()
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
        simulateTextExtraction()
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateTextExtraction = () => {
    setIsProcessing(true)
    // Simulate OCR processing delay
    setTimeout(() => {
      setIsProcessing(false)
      // For demo, show empty text area for user to manually enter what they see
      setExtractedText("")
    }, 1000)
  }

  const parseItems = (text: string): ParsedItem[] => {
    const lines = text.split("\n").filter(line => line.trim())
    const items: ParsedItem[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Try various patterns
      // Pattern: "item, quantity, unit" or "item - quantity unit"
      let match = trimmed.match(/^(.+?)[,\-]\s*(\d+)\s*[,\-]?\s*(.+)?$/i)
      if (match) {
        items.push({
          name: match[1].trim(),
          quantity: parseInt(match[2], 10),
          unit: match[3]?.trim() || "pieces"
        })
        continue
      }

      // Pattern: "quantity unit item" or "quantity item"
      match = trimmed.match(/^(\d+)\s*([a-zA-Z]+)?\s+(.+)$/i)
      if (match) {
        items.push({
          name: match[3].trim(),
          quantity: parseInt(match[1], 10),
          unit: match[2]?.trim() || "pieces"
        })
        continue
      }

      // Just item name
      items.push({
        name: trimmed,
        quantity: 1,
        unit: "pieces"
      })
    }

    return items
  }

  const handleTextChange = (text: string) => {
    setExtractedText(text)
    if (text.trim()) {
      const items = parseItems(text)
      setParsedItems(items)
    } else {
      setParsedItems([])
    }
  }

  const handleImport = () => {
    if (parsedItems.length > 0) {
      onImport(parsedItems)
      handleReset()
      setOpen(false)
    }
  }

  const handleReset = () => {
    stopCamera()
    setCapturedImage(null)
    setExtractedText("")
    setParsedItems([])
    setError(null)
    setIsProcessing(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleReset()
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Camera className="h-4 w-4" />
          <span className="sr-only">Scan items</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            Scan Items
          </DialogTitle>
          <DialogDescription>
            Take a photo of your shopping list or notepad to add items quickly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!capturedImage && !isCapturing && (
            <div className="flex flex-col gap-3">
              <Button onClick={startCamera} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Open Camera
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {isCapturing && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-muted"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={stopCamera}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  onClick={capturePhoto}
                  className="rounded-full h-14 w-14"
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-lg"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Processing image...
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="extracted-text">
                      Enter items from the image
                    </Label>
                    <Textarea
                      id="extracted-text"
                      placeholder="Type items from your photo here, one per line. Example:&#10;Rice, 5, kg&#10;Milk, 2, liters&#10;Bread"
                      value={extractedText}
                      onChange={(e) => handleTextChange(e.target.value)}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter items one per line. Format: name, quantity, unit (or just name)
                    </p>
                  </div>

                  {parsedItems.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <Label>Preview ({parsedItems.length} items)</Label>
                      <div className="max-h-32 overflow-y-auto rounded-md border p-2">
                        {parsedItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-1 text-sm"
                          >
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleImport}
                    disabled={parsedItems.length === 0}
                    className="w-full"
                  >
                    Add {parsedItems.length} Item{parsedItems.length !== 1 ? "s" : ""}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}
