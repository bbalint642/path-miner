"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import styles from "./echo-form.module.css"

export default function EchoForm() {
  const [value, setValue] = React.useState("")
  const [output, setOutput] = React.useState("")

  return (
    <Card id="echoCard" className={`mx-auto w-full max-w-md ${styles.card}`}>
      <CardHeader>
        <CardTitle>Echo form</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="echoForm"
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setOutput(value)
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="echoInput">Type something</Label>
            <Input
              id="echoInput"
              name="echoInput"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Write text to echo..."
            />
          </div>

          <Button id="echoSubmitButton" type="submit" className={`w-full ${styles.submitButton}`}>
            Submit
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <div className={styles.outputBlock}>
          <Label htmlFor="echoOutput" className={styles.outputLabel}>
            Output
          </Label>
          <Textarea
            id="echoOutput"
            name="echoOutput"
            value={output}
            readOnly
            placeholder="Submitted text will appear here..."
          />
        </div>
      </CardFooter>
    </Card>
  )
}


