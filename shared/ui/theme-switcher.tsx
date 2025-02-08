'use client';

import { useEffect, useId, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import Image from 'next/image';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

type Theme = 'light' | 'dark' | 'system';

const items = [
  { value: 'light', label: 'Light', image: '/ui-light.png' },
  { value: 'dark', label: 'Dark', image: '/ui-dark.png' },
  { value: 'system', label: 'System', image: '/ui-system.png' },
];

export function ThemeSwitcher() {
  const id = useId();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  function onValueChange(theme: Theme) {
    setTheme(theme);
  }

  if (!mounted) return null;

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium leading-none text-foreground">Choose a theme</legend>
      <RadioGroup className="flex gap-3" defaultValue={theme} onValueChange={onValueChange}>
        {items.map((item) => (
          <label key={`${id}-${item.value}`}>
            <RadioGroupItem
              id={`${id}-${item.value}`}
              value={item.value}
              className="peer sr-only after:absolute after:inset-0"
            />
            <Image
              src={item.image}
              alt={item.label}
              width={88}
              height={70}
              priority
              className="relative cursor-pointer overflow-hidden rounded-lg border border-input shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-data-[disabled]:cursor-not-allowed peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent peer-data-[disabled]:opacity-50"
            />
            <span className="group mt-2 flex items-center gap-1 peer-data-[state=unchecked]:text-muted-foreground/70">
              <CheckIcon
                size={16}
                strokeWidth={2}
                className="peer-data-[state=unchecked]:group-[]:hidden"
                aria-hidden="true"
              />
              <MinusIcon
                size={16}
                strokeWidth={2}
                className="peer-data-[state=checked]:group-[]:hidden"
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{item.label}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
