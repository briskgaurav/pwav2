import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

export default function AccordionItem({ title, isExpanded, onToggle, children }: AccordionItemProps) {
    return (
        <div className="bg-background2 rounded-xl border border-gray-200 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <span className="text-sm font-medium text-text-primary">{title}</span>
                <ChevronDown
                    className={`w-5 h-5 text-text-primary transition-transform duration-200 ease-out ${isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}
                />
            </button>
            <div
                className={`grid transition-all duration-200 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}