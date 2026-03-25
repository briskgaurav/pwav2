'use client';

import React from 'react';

type Props = {
  recipientName: string;
  recipientEmail: string;
  recipientMessage: string;
  onRecipientNameChange: (value: string) => void;
  onRecipientEmailChange: (value: string) => void;
  onRecipientMessageChange: (value: string) => void;
  errors?: {
    recipientName?: string;
    recipientEmail?: string;
  };
};

export function GiftRecipientDetails({
  recipientName,
  recipientEmail,
  recipientMessage,
  onRecipientNameChange,
  onRecipientEmailChange,
  onRecipientMessageChange,
  errors,
}: Props) {
  return (
    <div className="">
      <p className="text-text-primary w-[90%] text-sm mb-4">
        Details of the Person you are Gifting this Virtual Instacard to
      </p>
      <div className="space-y-4">
        <div className="relative">
          <label className="text-xs text-text-secondary pl-1 mb-1 block">Recipient Name</label>
          <input
            autoComplete="one-time-code"
            type="text"
            placeholder="Enter recipient's name"
            className={`w-full bg-background-secondary border rounded-xl px-4 py-4 text-text-primary text-sm placeholder:text-text-primary/40 outline-border! focus:border-none! focus:ring-0! ${
              errors?.recipientName ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-border'
            }`}
            value={recipientName}
            onChange={(e) => onRecipientNameChange(e.target.value)}
          />
          {errors?.recipientName && (
            <p className="text-red-500 text-xs mt-1 pl-1">{errors.recipientName}</p>
          )}
        </div>
        <div className="relative">
          <label className="text-xs text-text-secondary pl-1 mb-1 block">Recipient Email</label>
          <input
            autoComplete="one-time-code"
            type="email"
            placeholder="Enter recipient's email"
            className={`w-full bg-background-secondary border rounded-xl px-4 py-4 text-text-primary text-sm placeholder:text-text-primary/40 outline-border! focus:border-none! focus:ring-0! ${
              errors?.recipientEmail ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-border'
            }`}
            value={recipientEmail}
            onChange={(e) => onRecipientEmailChange(e.target.value)}
          />
          {errors?.recipientEmail && (
            <p className="text-red-500 text-xs mt-1 pl-1">{errors.recipientEmail}</p>
          )}
        </div>
        <div className="relative">
          <label className="text-xs text-text-secondary pl-1 mb-1 block">Gift Message (Optional)</label>
          <textarea
            placeholder="Write a personal message for the recipient..."
            className="w-full bg-background-secondary border border-border rounded-xl px-4 py-4 text-text-primary text-sm placeholder:text-text-primary/40 outline-border! focus:border-none! focus:ring-0! focus:border-border! resize-none"
            rows={3}
            value={recipientMessage}
            onChange={(e) => onRecipientMessageChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
