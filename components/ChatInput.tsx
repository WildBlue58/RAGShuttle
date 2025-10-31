"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

import type { ChangeEvent, FormEvent } from "react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
// const ChatInput: React.FC<ChatInputProps> = ({
export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
}: ChatInputProps) {
  const isDisabled = input.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3">
      <Input
        onChange={handleInputChange}
        value={input}
        placeholder="问我关于羽毛球的问题..."
        disabled={false}
        className="flex-1 h-11 md:h-12 text-base md:text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all hover:border-primary/30"
      />
      <Button 
        type="submit" 
        disabled={isDisabled} 
        size="icon"
        className="h-11 w-11 md:h-12 md:w-12 rounded-lg shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
        <span className="sr-only">提交</span>
      </Button>
    </form>
  );
}
