"use client"

import { useState, useRef } from "react"
import { Upload, FileSpreadsheet, FileText, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import * as XLSX from "xlsx"

interface ParsedItem {
  name: string
  quantity: number
  unit: string
}

interface ImportItemsProps {
  onImport: (items: ParsedItem[]) => void
}

const DEFAULT_UNIT = "pieces"

export function ImportItems({ onImport }: ImportItemsProps) {
  const [textInput, setTextInput] = useState("")
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseTextInput = (text: string): ParsedItem[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    const items: ParsedItem[] = []

    for (const line of lines) {
      // Try to parse formats like:
      // "Rice, 5, kg" or "Rice 5 kg" or "Rice - 5 kg" or just "Rice"
      const cleanLine = line.trim()
      
      // Pattern: name, quantity, unit (CSV style)
      const csvMatch = cleanLine.match(/^([^,]+),\s*(\d+)\s*,\s*(\w+)$/i)
      if (csvMatch) {
        items.push({
          name: csvMatch[1].trim(),
          quantity: parseInt(csvMatch[2], 10),
          unit: csvMatch[3].toLowerCase(),
        })
        continue
      }

      // Pattern: name - quantity unit or name quantity unit
      const spaceMatch = cleanLine.match(/^(.+?)[\s\-]+(\d+)\s*(\w+)?$/i)
      if (spaceMatch) {
        items.push({
          name: spaceMatch[1].trim(),
          quantity: parseInt(spaceMatch[2], 10),
          unit: spaceMatch[3]?.toLowerCase() || DEFAULT_UNIT,
        })
        continue
      }

      // Pattern: just name (default quantity 1)
      if (cleanLine.length > 0) {
        items.push({
          name: cleanLine,
          quantity: 1,
          unit: DEFAULT_UNIT,
        })
      }
    }

    return items
  }

  const handleTextChange = (value: string) => {
    setTextInput(value)
    setError(null)
    if (value.trim()) {
      const items = parseTextInput(value)
      setParsedItems(items)
    } else {
      setParsedItems([])
    }
  }

  const handleFileUpload = async (file: File) => {
    setError(null)
    setParsedItems([])

    try {
      const extension = file.name.split(".").pop()?.toLowerCase()

      if (extension === "xlsx" || extension === "xls") {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { header: 1 })

        const items: ParsedItem[] = []
        
        // Skip header row if it looks like headers
        const startRow = data.length > 0 && 
          typeof data[0] === "object" && 
          Array.isArray(data[0]) &&
          data[0].some((cell: unknown) => 
            typeof cell === "string" && 
            ["name", "item", "product", "quantity", "unit"].includes(cell.toLowerCase())
          ) ? 1 : 0

        for (let i = startRow; i < data.length; i++) {
          const row = data[i] as unknown[]
          if (row && row.length > 0) {
            const name = String(row[0] || "").trim()
            if (name) {
              items.push({
                name,
                quantity: parseInt(String(row[1] || "1"), 10) || 1,
                unit: String(row[2] || DEFAULT_UNIT).toLowerCase() || DEFAULT_UNIT,
              })
            }
          }
        }

        setParsedItems(items)
        if (items.length === 0) {
          setError("No items found in the file. Make sure your Excel has columns: Name, Quantity, Unit")
        }
      } else if (extension === "txt" || extension === "csv") {
        const text = await file.text()
        const items = parseTextInput(text)
        setParsedItems(items)
        setTextInput(text)
        if (items.length === 0) {
          setError("No items found in the file.")
        }
      } else {
        setError("Unsupported file format. Please use .xlsx, .xls, .csv, or .txt files.")
      }
    } catch (err) {
      setError("Failed to read file. Please check the file format and try again.")
      console.error(err)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleImport = () => {
    if (parsedItems.length > 0) {
      onImport(parsedItems)
      setParsedItems([])
      setTextInput("")
      setError(null)
    }
  }

  const handleClear = () => {
    setParsedItems([])
    setTextInput("")
    setError(null)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Excel/CSV
          </TabsTrigger>
          <TabsTrigger value="text" className="gap-2">
            <FileText className="h-4 w-4" />
            Text/Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              "hover:border-primary/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
            />
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your file here, or
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Supports .xlsx, .xls, .csv, .txt files
            </p>
            <p className="text-xs text-muted-foreground">
              Excel format: Name | Quantity | Unit (columns A, B, C)
            </p>
          </div>
        </TabsContent>

        <TabsContent value="text" className="mt-4">
          <Textarea
            placeholder={`Paste your items here, one per line:

Rice, 5, kg
Milk - 2 liters
Eggs 12 pieces
Bread

Supported formats:
• Item, Quantity, Unit
• Item - Quantity Unit
• Item Quantity Unit
• Item (defaults to 1 piece)`}
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {parsedItems.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">
                Preview ({parsedItems.length} items)
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {parsedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm py-1.5 px-2 rounded bg-muted/50"
                >
                  <span className="truncate flex-1">{item.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {item.quantity} {item.unit}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              type="button"
              className="w-full mt-4"
              onClick={handleImport}
            >
              <Check className="h-4 w-4 mr-2" />
              Import {parsedItems.length} Items
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
