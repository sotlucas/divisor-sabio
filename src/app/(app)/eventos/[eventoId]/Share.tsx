"use client";

import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Share = () => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Check if the code is running on the client side
    if (process) {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const url = `${currentUrl}/invite`;
  console.log("url", url);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <>
      <Modal open={open} setOpen={setOpen} title="Compartir evento">
        <div className="flex w-full items-center space-x-2">
          <Input value={url} contentEditable={false} />
          <Button variant="default" size="icon" onClick={copyLink}>
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Modal>
      <Button variant="default" size="icon" onClick={() => setOpen(true)}>
        <Share2 className="w-4 h-4" />
      </Button>
    </>
  );
};
